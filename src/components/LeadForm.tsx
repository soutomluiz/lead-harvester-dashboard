import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Lead } from "@/types/lead";
import { BasicInfoFields } from "./leads/form/BasicInfoFields";
import { ContactFields } from "./leads/form/ContactFields";
import { BusinessFields } from "./leads/form/BusinessFields";
import { AdditionalFields } from "./leads/form/AdditionalFields";

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
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        <BusinessFields form={form} />
        <AdditionalFields form={form} />
        
        <Button type="submit" className="w-full">
          Salvar Lead
        </Button>
      </form>
    </Form>
  );
};