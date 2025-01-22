import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function LanguageSettings() {
  const [language, setLanguage] = useState("pt-BR");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "pt-BR";
    setLanguage(savedLanguage);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Idioma</h3>
      <div className="space-y-2">
        <Label htmlFor="language-select">Selecione o idioma</Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger id="language-select">
            <SelectValue placeholder="Selecione o idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}