import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProfileFormData {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  avatar_url: string | null;
}

interface UserProfilePanelProps {
  initialData?: ProfileFormData | null;
}

export function UserProfilePanel({ initialData }: UserProfilePanelProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setAvatarUrl(initialData.avatar_url);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao atualizar o perfil. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${(await supabase.auth.getUser()).data.user?.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      setAvatarUrl(publicUrl);

      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao fazer upload do avatar. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar" className="cursor-pointer">
            <div className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Alterar Avatar
            </div>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isLoading}
            />
          </Label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input
            id="full_name"
            {...register("full_name")}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...register("phone")}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            {...register("location")}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
}