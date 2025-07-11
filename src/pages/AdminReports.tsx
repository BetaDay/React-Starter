
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const AdminReports = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="bg-white border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your Pata House platform</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-600">Reports functionality has been removed</p>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Reports Not Available</h3>
                <p className="text-sm">The reports functionality has been removed from the system</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
