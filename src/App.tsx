import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Documents from "./pages/Documents";
import Processes from "./pages/Processes";
import NonConformities from "./pages/NonConformities";
import Audits from "./pages/Audits";
import KPIs from "./pages/KPIs";
import Risks from "./pages/Risks";
import Training from "./pages/Training";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/processus" element={<Processes />} />
          <Route path="/non-conformites" element={<NonConformities />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/indicateurs" element={<KPIs />} />
          <Route path="/risques" element={<Risks />} />
          <Route path="/formation" element={<Training />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
