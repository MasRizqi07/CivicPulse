"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import logger from "@/lib/logger";

interface Report {
  id: string;
  reportNumber: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/v1/reports");
      const data = await response.json();
      setReports(data.data || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = statusFilter === "ALL" 
    ? reports 
    : reports.filter((r) => r.status === statusFilter);

  const stats = {
    total: reports.length,
    open: reports.filter((r) => ["SUBMITTED", "ASSIGNED", "IN_PROGRESS"].includes(r.status)).length,
    resolved: reports.filter((r) => ["RESOLVED", "CLOSED"].includes(r.status)).length,
    thisMonth: reports.filter((r) => {
      const reportDate = new Date(r.createdAt);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview.
          </p>
        </div>
        <Link href="/reports/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<FileText className="h-6 w-6" />}
          color="primary"
          loading={loading}
        />
        <StatCard
          title="Open"
          value={stats.open}
          icon={<Clock className="h-6 w-6" />}
          color="accent"
          loading={loading}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="h-6 w-6" />}
          color="status-resolved"
          loading={loading}
        />
        <StatCard
          title="This Month"
          value={stats.thisMonth}
          icon={<TrendingUp className="h-6 w-6" />}
          color="foreground"
          loading={loading}
        />
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Recent Reports
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                No reports found
              </h3>
              <p className="text-muted-foreground mb-6">
                {statusFilter === "ALL" 
                  ? "You haven't submitted any reports yet" 
                  : `No reports with status "${statusFilter.replace("_", " ")}"`
                }
              </p>
              {statusFilter === "ALL" && (
                <Link href="/reports/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first report
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      <StatusBadge status={report.status as any} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {report.reportNumber} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/reports/${report.id}`}
                    className="text-primary hover:text-primary-dark font-medium text-sm"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  loading 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string; 
  loading: boolean;
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    "status-resolved": "bg-status-resolved/10 text-status-resolved",
    foreground: "bg-foreground/10 text-foreground",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{value}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

