import { useLanguage } from "@/contexts/LanguageContext";

export function ConfigPanel() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("settings")}</h2>
      {/* Config content will be implemented later */}
      <p>Em desenvolvimento...</p>
    </div>
  );
}