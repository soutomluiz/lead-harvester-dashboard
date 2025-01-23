import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export function ExportSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("exportSettings")}</h3>
      <div className="space-y-2">
        <Label htmlFor="export-format">{t("defaultExportFormat")}</Label>
        <Select defaultValue="csv">
          <SelectTrigger id="export-format">
            <SelectValue placeholder={t("selectFormat")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}