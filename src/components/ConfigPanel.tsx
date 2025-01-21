import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

export const ConfigPanel = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    industry: "",
    bio: "",
    fullName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Erro",
            description: "Você precisa estar logado para ver suas configurações.",
            variant: "destructive",
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData({
            companyName: profile.company_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            website: profile.website || "",
            industry: profile.industry || "",
            bio: profile.bio || "",
            fullName: profile.full_name || ""
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas configurações.",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [toast]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para salvar as configurações.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          website: formData.website,
          industry: formData.industry,
          bio: formData.bio,
          full_name: formData.fullName
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Configurações da Empresa</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome Completo
          </label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Nome da Empresa
          </label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            placeholder="Nome da sua empresa"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Indústria/Setor
          </label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={handleChange('industry')}
            placeholder="Ex: Tecnologia, Varejo, Serviços"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email de Contato
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Email para contato"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefone
          </label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            placeholder="Seu telefone de contato"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Localização
          </label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleChange('location')}
            placeholder="Cidade, Estado"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </label>
          <Input
            id="website"
            value={formData.website}
            onChange={handleChange('website')}
            placeholder="https://www.seusite.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Sobre a Empresa
          </label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange('bio')}
            placeholder="Breve descrição sobre sua empresa"
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </Card>
  );
};