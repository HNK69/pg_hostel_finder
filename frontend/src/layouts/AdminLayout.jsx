import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#020817] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] border-r border-slate-800 p-6 flex flex-col">
        
        <h1 className="text-2xl font-bold mb-8">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-4">
          <Link
            to="/admin"
            className="hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="hover:text-blue-400"
          >
            Users
          </Link>

          <Link
            to="/admin/hostels"
            className="hover:text-blue-400"
          >
            Hostels
          </Link>

          <Link
            to="/admin/reviews"
            className="hover:text-blue-400"
          >
            Reviews
          </Link>
        </nav>

        {/* Bottom Button */}
        <div className="mt-auto">
          <Link
            to="/"
            className="block text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
          >
            ← Back to Website
          </Link>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>

    </div>
  );
}