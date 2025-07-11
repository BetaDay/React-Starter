import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Home,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AdminSidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const AdminSidebar = ({ collapsed, setCollapsed }: AdminSidebarProps) => {
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
    <div
      className={`fixed top-0 left-0 h-screen z-50 bg-white border-r shadow-md transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-blue-600 text-white rounded-lg p-2 text-xl font-bold">PH</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pata House</h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-blue-600 ml-auto"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
              isActive(item.path)
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 w-full px-2">
        <button className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full rounded-md">
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
