
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Eye,
  Plus,
  Settings,
  Home,
  Users,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/agent-dashboard" },
    { title: "View Properties", icon: Eye, path: "/agent/view-properties" },
    { title: "Add Property", icon: Plus, path: "/agent/add-property" },
    { title: "Manage Properties", icon: Settings, path: "/agent/manage-properties" },
    { title: "Manage Occupants", icon: Users, path: "/agent/manage-occupants" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('agentSession');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/agent-login');
  };

  // Get current agent info
  const agentSession = localStorage.getItem('agentSession');
  const currentAgent = agentSession ? JSON.parse(agentSession) : null;

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white rounded-lg p-2 text-xl font-bold">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pata House</h2>
            <p className="text-sm text-gray-600">Agent Dashboard</p>
          </div>
        </div>
        {currentAgent && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{currentAgent.name}</p>
            <p className="text-xs text-gray-600">{currentAgent.email}</p>
          </div>
        )}
      </div>

      <nav className="mt-6">
        <div className="px-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-4">
            Navigation
          </div>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-4 right-4">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AgentSidebar;
