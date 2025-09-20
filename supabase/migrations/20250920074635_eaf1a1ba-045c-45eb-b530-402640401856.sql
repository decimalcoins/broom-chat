-- Create chat room memberships table
CREATE TABLE public.chat_room_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Enable RLS on chat_room_memberships
ALTER TABLE public.chat_room_memberships ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is member of a room
CREATE OR REPLACE FUNCTION public.is_room_member(user_id UUID, room_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_room_memberships 
    WHERE chat_room_memberships.user_id = is_room_member.user_id 
    AND chat_room_memberships.room_id = is_room_member.room_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop the insecure "Anyone can view messages" policy
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;

-- Create secure policy for viewing messages - only room members can see messages
CREATE POLICY "Room members can view messages" 
ON public.messages 
FOR SELECT 
USING (public.is_room_member(auth.uid(), room_id));

-- Update the insert policy to auto-add user as room member
DROP POLICY IF EXISTS "Authenticated users can create messages" ON public.messages;

CREATE POLICY "Room members can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  public.is_room_member(auth.uid(), room_id)
);

-- Policies for chat_room_memberships
CREATE POLICY "Users can view their own memberships" 
ON public.chat_room_memberships 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join rooms" 
ON public.chat_room_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" 
ON public.chat_room_memberships 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_room_memberships_updated_at
BEFORE UPDATE ON public.chat_room_memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();