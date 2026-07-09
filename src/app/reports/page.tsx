"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, FileText, MapPin, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface Report {
  id: string;
  reportNumber: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  citizen?: { fullName: string };
  agency?: { name: string };
  location?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  INFRASTRUCTURE: <MapPin className="h-4 w-4" />,
  PUBLIC_SAFETY: <FileText className="h-4 w-4" />,
  ENVIRONMENT: <FileText className="h-4 w-4" />,
  TRANSPORTATION: <FileText className="h-4 w-4" />,
  HEALTH: <FileText className="h-4 w-4" />,
  EDUCATION: <FileText className="h-4 w-4" />,
  OTHER: <FileText className="h-4 w-4" />,
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            All Reports
          </h1>
          <p className="text-muted-foreground">
            View and manage all public service reports.
          </p>
        </div>
        <Link href="/reports/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or report number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <label htmlFor="category-filter" className="sr-only">Filter by category</label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Categories</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="PUBLIC_SAFETY">Public Safety</option>
                <option value="ENVIRONMENT">Environment</option>
                <option value="TRANSPORTATION">Transportation</option>
                <option value="HEALTH">Health</option>
                <option value="EDUCATION">Education</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
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
                {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "No reports have been submitted yet"
                }
              </p>
              {!searchQuery && statusFilter === "ALL" && categoryFilter === "ALL" && (
                <Link href="/reports/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first report
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {paginatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          <StatusBadge status={report.status as any} />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/reports/${report.id}`}
                            className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {report.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {report.reportNumber}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {categoryIcons[report.category] || <FileText className="h-3 w-3" />}
                              {report.category.replace("_", " ")}
                            </span>
                            {report.agency && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {report.agency.name}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {report.location && (
                            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-primary hover:text-primary-dark font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === i + 1
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface text-foreground hover:bg-surface/80"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

