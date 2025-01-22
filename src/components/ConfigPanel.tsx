import { CRMIntegration } from "./integrations/CRMIntegration";

export function ConfigPanel() {
  return (
    <div className="space-y-6">
      <CRMIntegration />
      <h2 className="text-2xl font-bold">Configurações Gerais</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Configuração de Notificações</label>
          <input type="checkbox" className="mr-2" />
          <span>Ativar notificações por e-mail</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tema</label>
          <select className="border rounded p-2">
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
      </div>
    </div>
  );
}
