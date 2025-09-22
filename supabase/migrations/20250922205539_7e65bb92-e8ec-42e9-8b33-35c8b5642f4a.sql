-- Fix critical security issues by updating RLS policies

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view chat rooms" ON public.chat_rooms;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view chat rooms" 
ON public.chat_rooms 
FOR SELECT 
USING (auth.uid() IS NOT NULL);