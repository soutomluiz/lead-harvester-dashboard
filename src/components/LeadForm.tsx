import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const LeadForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    location: "",
    contact_name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para adicionar leads.");
        return;
      }

      const newLead = {
        ...formData,
        type: 'manual',
        user_id: user.id
      };

      const { error } = await supabase
        .from('leads')
        .insert([newLead]);

      if (error) throw error;

      onSubmit(newLead);
      setFormData({
        company_name: "",
        industry: "",
        location: "",
        contact_name: "",
        email: "",
        phone: "",
      });
      toast.success("Lead adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar lead:", error);
      toast.error("Erro ao adicionar lead. Tente novamente.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Nome da Empresa</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Indústria/Nicho</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_name">Nome do Contato</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) =>
              setFormData({ ...formData, contact_name: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">
          Adicionar Lead
        </Button>
      </form>
    </Card>
  );
};