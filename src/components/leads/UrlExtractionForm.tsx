import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  url: z.string().url("Por favor insira uma URL válida"),
});

export const UrlExtractionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('website-crawler', {
        body: { url: values.url }
      });

      if (error) {
        throw error;
      }

      if (response.error === 'Free plan limit reached') {
        toast({
          title: "Limite atingido",
          description: "Você atingiu o limite máximo de 50 leads no plano gratuito. Para continuar utilizando as funcionalidades, assine um dos nossos planos pagos.",
          variant: "destructive",
        });
        navigate("/subscription");
        return;
      }

      if (response.success) {
        toast({
          title: "Sucesso!",
          description: `${response.leadsExtracted} leads extraídos com sucesso!`,
        });
        form.reset();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error extracting leads:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o link. Verifique se ele é válido.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Website</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://exemplo.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extraindo Leads...
            </>
          ) : (
            'Extrair Leads'
          )}
        </Button>
      </form>
    </Form>
  );
};