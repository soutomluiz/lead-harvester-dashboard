import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileForm } from "./profile/ProfileForm";
import { Profile, ProfileFormData } from "@/types/profile";

export function ConfigPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar suas informações.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  const handleProfileUpdate = async (formData: ProfileFormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível atualizar sua foto de perfil.",
        variant: "destructive",
      });
    }
  };

  if (!profile) return null;

  const formData: ProfileFormData = {
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    location: profile.location || "",
    bio: profile.bio || "",
    company_name: profile.company_name || "",
    email: profile.email || "",
    website: profile.website || "",
    industry: profile.industry || "",
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-center">Configurações do Perfil</h2>
      <ProfileAvatar 
        avatarUrl={profile.avatar_url} 
        onAvatarUpdate={handleAvatarUpdate} 
      />
      <ProfileForm 
        initialData={formData}
        onSubmit={handleProfileUpdate}
        isLoading={isLoading}
      />
    </Card>
  );
}