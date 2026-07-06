"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, User, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  reportNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  citizen: { fullName: string; email: string };
  agency: { name: string };
  location: { address: string; district: string; city: string; province: string; latitude: number; longitude: number };
  assignedOfficer?: { fullName: string };
  histories?: Array<{
    id: string;
    oldStatus?: string;
    newStatus: string;
    note?: string;
    createdAt: string;
    actor: { fullName: string };
  }>;
  comments?: Array<{
    id: string;
    message: string;
    user: { fullName: string };
    createdAt: string;
  }>;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/v1/reports/${params.id}`);
      const data = await response.json();
      setReport(data.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: params.id,
          userId: "demo-user-id",
          message: comment,
        }),
      });

      if (response.ok) {
        setComment("");
        fetchReport();
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Clock className="text-blue-500" size={24} />;
      case "ASSIGNED":
      case "IN_PROGRESS":
        return <AlertCircle className="text-yellow-500" size={24} />;
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle className="text-green-500" size={24} />;
      default:
        return <AlertCircle className="text-gray-500" size={24} />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report not found</h2>
        <Link href="/reports" className="text-blue-600 hover:text-blue-700">
          Back to all reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/reports" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} />
        Back to Reports
      </Link>

      {/* Report Header */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {getStatusIcon(report.status)}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
              <p className="text-gray-500 mt-1">{report.reportNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
              {report.status.replace("_", " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}>
              {report.priority}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{report.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Reported by</p>
              <p className="font-medium text-gray-900">{report.citizen.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="font-medium text-gray-900">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">
                {report.location.address}, {report.location.district}, {report.location.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <span className="text-blue-600 font-medium">🏛️</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Agency</p>
              <p className="font-medium text-gray-900">{report.agency.name}</p>
            </div>
          </div>
          {report.assignedOfficer && (
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium text-gray-900">{report.assignedOfficer.fullName}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Timeline */}
      {report.histories && report.histories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Status History</h2>
          <div className="space-y-6">
            {report.histories.map((history) => (
              <div key={history.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(history.createdAt).toLocaleString()}
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {history.actor.fullName} updated status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {history.oldStatus && (
                      <>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(history.oldStatus)}`}>
                          {history.oldStatus.replace("_", " ")}
                        </span>
                        <span className="text-gray-400">→</span>
                      </>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(history.newStatus)}`}>
                      {history.newStatus.replace("_", " ")}
                    </span>
                  </div>
                  {history.note && (
                    <p className="text-gray-600 mt-2">{history.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>

        {/* Add Comment */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submittingComment || !comment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {report.comments && report.comments.length > 0 ? (
          <div className="space-y-6">
            {report.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium">
                    {comment.user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{comment.user.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
