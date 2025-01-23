import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

export function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  // Update selected language when the context language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageChange = (value: Language) => {
    setSelectedLanguage(value);
  };

  // Expose the selected language to the parent component
  useEffect(() => {
    const configPanel = document.querySelector('form[data-config-panel]');
    if (configPanel) {
      const handleSubmit = () => {
        setLanguage(selectedLanguage);
      };
      configPanel.addEventListener('submit', handleSubmit);
      return () => {
        configPanel.removeEventListener('submit', handleSubmit);
      };
    }
  }, [selectedLanguage, setLanguage]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("language")}</h3>
      <div className="space-y-2">
        <Label htmlFor="language-select">{t("selectLanguage")}</Label>
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger id="language-select">
            <SelectValue placeholder={t("selectLanguage")} />
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