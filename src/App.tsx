import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Index />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;