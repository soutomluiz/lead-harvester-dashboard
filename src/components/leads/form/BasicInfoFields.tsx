import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Lead } from "@/types/lead";

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
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
    </>
  );
}