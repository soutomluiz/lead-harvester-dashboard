import { ptBR } from "@/utils/i18n/pt-BR";
import { en } from "@/utils/i18n/en";
import { es } from "@/utils/i18n/es";

export type Language = "pt-BR" | "en" | "es";
export type TranslationKey = keyof typeof ptBR;

export const translations = {
  "pt-BR": ptBR,
  "en": en,
  "es": es
};