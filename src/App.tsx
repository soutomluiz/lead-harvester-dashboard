import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Index />
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;