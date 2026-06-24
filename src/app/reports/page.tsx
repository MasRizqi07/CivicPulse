"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Report {
  id: string;
  reportNumber: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  citizen?: { fullName: string };
  agency?: { name: string };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Clock className="text-blue-500" size={20} />;
      case "ASSIGNED":
      case "IN_PROGRESS":
        return <AlertCircle className="text-yellow-500" size={20} />;
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
      case "CLOSED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Reports</h1>
          <p className="text-gray-600 mt-2">View and manage all public service reports.</p>
        </div>
        <Link
          href="/reports/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Report
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No reports yet</p>
            <Link
              href="/reports/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create your first report
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(report.status)}
                    <div>
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {report.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        <span>{report.reportNumber}</span>
                        <span>•</span>
                        <span>{report.category.toLowerCase()}</span>
                        {report.agency && (
                          <>
                            <span>•</span>
                            <span>{report.agency.name}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace("_", " ")}
                    </span>
                    <Link
                      href={`/reports/${report.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
