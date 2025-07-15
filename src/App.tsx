
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RainBackground from "@/components/animations/RainBackground";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import Systems from "@/pages/Systems";
import Tasks from "@/pages/Tasks";
import Incidents from "@/pages/Incidents";
import Reports from "@/pages/Reports";
import Tools from "@/pages/Tools";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <RainBackground />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="companies" element={<Companies />} />
                <Route path="systems" element={<Systems />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="incidents" element={<Incidents />} />
                <Route path="reports" element={<Reports />} />
                <Route path="tools" element={<Tools />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
