import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { TagInput } from "@/components/TagInput";
import { Lead } from "@/types/lead";

const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  contact_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  location: z.string().optional(),
  deal_value: z.number().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

interface LeadFormProps {
  onSubmit: (data: Partial<Lead>) => void;
  initialData?: Partial<Lead>;
}

export const LeadForm = ({ onSubmit, initialData }: LeadFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: initialData?.company_name || "",
      contact_name: initialData?.contact_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      industry: initialData?.industry || "",
      location: initialData?.location || "",
      deal_value: initialData?.deal_value || 0,
      notes: initialData?.notes || "",
      status: initialData?.status || "novo",
      tags: initialData?.tags || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da empresa" {...field} />
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
                <Input placeholder="Digite o nome do contato" {...field} />
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
                <Input placeholder="Digite o email" type="email" {...field} />
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
                <Input placeholder="Digite o telefone" {...field} />
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
                <Input placeholder="Digite o website" {...field} />
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
                <Input placeholder="Digite a indústria" {...field} />
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
                <Input placeholder="Digite a localização" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deal_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Negócio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o valor do negócio"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Input placeholder="Digite as notas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Digite o status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  tags={field.value || []}
                  onChange={(newTags) => field.onChange(newTags)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar Lead
        </Button>
      </form>
    </Form>
  );
};