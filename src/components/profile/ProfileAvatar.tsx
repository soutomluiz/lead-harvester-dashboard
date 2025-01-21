import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileAvatarProps {
  avatarUrl: string;
  onAvatarUpdate: (url: string) => void;
}

export function ProfileAvatar({ avatarUrl, onAvatarUpdate }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarUpdate(publicUrl);
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível atualizar sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <UserRound className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Avatar"}
        </Button>
      </div>
    </div>
  );
}