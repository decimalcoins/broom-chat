import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Video, Upload, X, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  onClose: () => void;
  onSendVideo: (videoUrl: string) => void;
}

export const VideoPlayer = ({ onClose, onSendVideo }: VideoPlayerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Perekaman dimulai",
        description: "Video sedang direkam...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengakses kamera",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Perekaman selesai",
        description: "Video berhasil direkam!",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleSendVideo = () => {
    if (videoUrl) {
      onSendVideo(videoUrl);
    }
  };

  const resetVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl("");
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video size={20} />
              Video Sharing
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Video preview */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {(stream || videoUrl) ? (
              <video
                ref={videoRef}
                autoPlay={!!stream}
                controls={!!videoUrl}
                muted={!!stream}
                className="w-full h-full object-cover"
                src={videoUrl || undefined}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Belum ada video</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            {!isRecording && !videoUrl && (
              <>
                <Button onClick={startRecording} className="flex items-center gap-2">
                  <Play size={16} />
                  Mulai Rekam
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Video
                </Button>
              </>
            )}

            {isRecording && (
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square size={16} />
                Stop Rekam
              </Button>
            )}

            {videoUrl && !isRecording && (
              <>
                <Button 
                  onClick={handleSendVideo}
                  className="flex items-center gap-2"
                >
                  Kirim Video
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={resetVideo}
                >
                  Reset
                </Button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="text-center text-sm text-muted-foreground">
            <p>Rekam video singkat atau upload video untuk dibagikan</p>
            <p>Format yang didukung: MP4, WebM, AVI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};