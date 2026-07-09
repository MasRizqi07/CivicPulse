"use client";

import { useState, useEffect } from "react";
import { Users, Building2, FileText, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSession } from "@/context/SessionContext";

interface AdminStats {
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalAgencies: number;
}

interface RecentReport {
  id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  citizenName: string;
}

export default function AdminPage() {
  const { user } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "agencies" | "reports">("dashboard");

  useEffect(() => {
    if (!user || (user.role !== "OFFICER" && user.role !== "SUPER_ADMIN")) {
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          fetch("/api/v1/admin/stats"),
          fetch("/api/v1/admin/reports/recent")
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setRecentReports(reportsData.reports || []);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!user || (user.role !== "OFFICER" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-status-submitted/10 text-status-submitted";
      case "ASSIGNED":
        return "bg-status-assigned/10 text-status-assigned";
      case "IN_PROGRESS":
        return "bg-status-in-progress/10 text-status-in-progress";
      case "RESOLVED":
        return "bg-status-resolved/10 text-status-resolved";
      case "REJECTED":
        return "bg-status-rejected/10 text-status-rejected";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Clock className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <AlertTriangle className="h-4 w-4" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin Panel
        </h1>
        <Badge variant="success">
          {user.role === "SUPER_ADMIN" ? "Super Admin" : "Officer"}
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-4">
        <Button
          variant={activeTab === "dashboard" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant={activeTab === "users" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("users")}
        >
          Users
        </Button>
        <Button
          variant={activeTab === "agencies" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("agencies")}
        >
          Agencies
        </Button>
        <Button
          variant={activeTab === "reports" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </Button>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Reports</span>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats?.totalReports || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Pending</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats?.pendingReports || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Resolved</span>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats?.resolvedReports || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent reports
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{report.title}</h3>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.category} • by {report.citizenName}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">User Management</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <p>User management functionality coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "agencies" && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Agency Management</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4" />
              <p>Agency management functionality coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Reports Management</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>Reports management functionality coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
