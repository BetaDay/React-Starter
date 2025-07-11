
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Home,
  Shield,
  LogOut
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
    { title: "Users", icon: Users, path: "/admin-dashboard/users" },
    { title: "Agent Management", icon: UserCheck, path: "/admin-dashboard/agents" },
    { title: "Properties", icon: Home, path: "/admin-dashboard/properties" },
    { title: "Audit Logs", icon: Shield, path: "/admin-dashboard/audit-logs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white rounded-lg p-2 text-xl font-bold">
            PH
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pata House</h2>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-6 left-4 right-4">
          <button className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
