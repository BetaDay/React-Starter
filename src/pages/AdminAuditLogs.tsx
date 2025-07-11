
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";

const AdminAuditLogs = () => {
  const auditLogs = [
    {
      id: 1,
      logId: "1",
      adminId: "admin1",
      postedTime: "6/25/2024 1:30:00 PM",
      status: "Active",
      action: "Suspended User"
    },
    {
      id: 2,
      logId: "2", 
      adminId: "admin1",
      postedTime: "6/22/2024 5:15:00 PM",
      status: "Pending",
      action: "Resolved Report"
    }
  ];

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white rounded-full p-2">
                  <span className="font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Admin User</p>
                  <p className="text-xs text-gray-500">admin@patahouse.com</p>
                </div>
                <Button variant="ghost" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Audit Logs</h2>
            <p className="text-gray-600">Track all administrative actions and maintain accountability</p>
          </div>

          <div className="mb-6">
            <select className="px-4 py-2 border border-gray-300 rounded-md">
              <option>All Types</option>
              <option>User Actions</option>
              <option>Property Actions</option>
              <option>System Actions</option>
            </select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>Admin ID</TableHead>
                    <TableHead>Posted Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.logId}</TableCell>
                      <TableCell className="text-blue-600">{log.adminId}</TableCell>
                      <TableCell>{log.postedTime}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'Active' ? 'default' : 'secondary'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
