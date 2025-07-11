
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Houses from "./pages/Houses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminAgents from "./pages/AdminAgents";
import AdminProperties from "./pages/AdminProperties";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AgentPanel from "./pages/AgentPanel";
import AgentProperties from "./pages/AgentProperties";
import AgentOccupants from "./pages/AgentOccupants";
import AgentViewProperties from "./pages/AgentViewProperties";
import AgentManageProperties from "./pages/AgentManageProperties";
import AgentAddProperty from "./pages/AgentAddProperty";
import AdminLogin from "./pages/AdminLogin";
import AgentLogin from "./pages/AgentLogin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Routes with navbar */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Index />
                </>
              } />
              <Route path="/properties" element={
                <>
                  <Navbar />
                  <Properties />
                </>
              } />
              <Route path="/houses" element={
                <>
                  <Navbar />
                  <Houses />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <About />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <Contact />
                </>
              } />
              <Route path="/faqs" element={
                <>
                  <Navbar />
                  <FAQs />
                </>
              } />
              <Route path="/property/:id" element={
                <>
                  <Navbar />
                  <PropertyDetail />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navbar />
                  <Login />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Navbar />
                  <Register />
                </>
              } />
              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminPanel />} />
              <Route path="/admin-dashboard/users" element={<AdminUsers />} />
              <Route path="/admin-dashboard/agents" element={<AdminAgents />} />
              <Route path="/admin-dashboard/properties" element={<AdminProperties />} />
              <Route path="/admin-dashboard/audit-logs" element={<AdminAuditLogs />} />
              
              {/* Agent routes */}
              <Route path="/agent" element={<AgentLogin />} />
              <Route path="/agent-dashboard" element={<AgentPanel />} />
              <Route path="/agent/properties" element={<AgentProperties />} />
              <Route path="/agent/view-properties" element={<AgentViewProperties />} />
              <Route path="/agent/manage-properties" element={<AgentManageProperties />} />
              <Route path="/agent/manage-occupants" element={<AgentOccupants />} />
              <Route path="/agent/add-property" element={<AgentAddProperty />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
