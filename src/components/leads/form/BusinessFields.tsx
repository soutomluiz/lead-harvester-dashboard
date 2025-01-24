import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BusinessFieldsProps {
  form: UseFormReturn<any>;
}

export function BusinessFields({ form }: BusinessFieldsProps) {
  return (
    <>
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
    </>
  );
}