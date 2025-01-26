import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrialStatusBanner } from "./shared/TrialStatusBanner";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const formSchema = z.object({
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  industry: z.string().optional(),
  location: z.string().optional(),
  contact_name: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  address: z.string().optional(),
});

interface LeadFormProps {
  onSubmit: (data: any) => void;
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { isTrialValid, checkLeadLimit } = useTrialStatus(userProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      location: "",
      contact_name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!checkLeadLimit()) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 10 leads no plano gratuito. Faça upgrade para continuar.",
        variant: "destructive",
      });
      return;
    }

    const leadData = {
      ...values,
      type: "manual",
      created_at: new Date().toISOString(),
      status: "new",
    };

    onSubmit(leadData);

    if (userProfile) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          extracted_leads_count: (userProfile.extracted_leads_count || 0) + 1
        })
        .eq('id', userProfile.id);

      if (error) {
        console.error('Error updating extracted_leads_count:', error);
      }
    }

    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TrialStatusBanner userProfile={userProfile} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indústria</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Adicionar Lead
          </Button>
        </form>
      </Form>
    </div>
  );
}