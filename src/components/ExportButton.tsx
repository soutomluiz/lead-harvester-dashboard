import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExportButtonProps {
  leadIds: string[];
  onExportComplete?: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  leadIds,
  onExportComplete 
}) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      // Fetch leads data
      const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .in("id", leadIds);

      if (error) throw error;

      // Convert to CSV
      const headers = [
        "Company Name",
        "Industry",
        "Location",
        "Contact Name",
        "Email",
        "Phone",
        "Status",
        "Deal Value",
        "Tags",
      ];

      const csvContent = [
        headers.join(","),
        ...leads.map((lead) => [
          lead.company_name,
          lead.industry || "",
          lead.location || "",
          lead.contact_name || "",
          lead.email || "",
          lead.phone || "",
          lead.status || "",
          lead.deal_value || "0",
          (lead.tags || []).join(";"),
        ].join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `leads_export_${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update last_exported_at
      const { error: updateError } = await supabase
        .from("leads")
        .update({ last_exported_at: new Date().toISOString() })
        .in("id", leadIds);

      if (updateError) throw updateError;

      toast({
        title: "Exportação concluída",
        description: `${leads.length} leads foram exportados com sucesso.`,
      });

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os leads. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Exportar
    </Button>
  );
};