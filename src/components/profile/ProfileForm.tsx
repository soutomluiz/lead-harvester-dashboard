import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFormData } from "@/types/profile";

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  isLoading: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder="Seu nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Seu telefone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Sua cidade/estado"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da Empresa</Label>
            <Input
              id="company_name"
              {...register("company_name")}
              placeholder="Nome da sua empresa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="www.seusite.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Indústria/Setor</Label>
            <Input
              id="industry"
              {...register("industry")}
              placeholder="Seu setor de atuação"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Conte um pouco sobre você"
            className="min-h-[100px]"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}