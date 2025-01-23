import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export function DisplaySettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("displaySettings")}</h3>
      <div className="space-y-2">
        <Label htmlFor="items-per-page">{t("itemsPerPage")}</Label>
        <Select defaultValue="20">
          <SelectTrigger id="items-per-page">
            <SelectValue placeholder={t("selectItemsPerPage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}