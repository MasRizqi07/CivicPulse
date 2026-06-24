import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">CivicPulse</h1>
          <p className="mt-2 text-lg text-gray-600">Public Service Workflow Platform</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Citizens</h2>
            <p className="text-gray-600 mb-6">Report public infrastructure issues and track their progress.</p>
            <Link href="/reports/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Submit a Report
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Officers</h2>
            <p className="text-gray-600 mb-6">Manage and resolve public service requests efficiently.</p>
            <Link href="/dashboard" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Officer Dashboard
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Agencies</h2>
            <p className="text-gray-600 mb-6">Analyze reports and optimize public service delivery.</p>
            <Link href="/admin" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
