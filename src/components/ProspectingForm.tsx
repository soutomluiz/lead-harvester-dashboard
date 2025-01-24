import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { UrlExtractionForm } from "@/components/leads/UrlExtractionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export const ProspectingForm = () => {
  const [activeTab, setActiveTab] = useState<string>("manual");

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Entrada Manual</TabsTrigger>
            <TabsTrigger value="url">Extrair de URL</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <LeadForm onSubmit={() => {}} />
          </TabsContent>
          <TabsContent value="url">
            <UrlExtractionForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};