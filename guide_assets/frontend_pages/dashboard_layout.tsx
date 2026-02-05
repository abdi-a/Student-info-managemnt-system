// src/app/dashboard/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">SIMS</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/dashboard/students" className="block p-2 rounded hover:bg-gray-200">
            Students
          </Link>
          <Link href="/dashboard/courses" className="block p-2 rounded hover:bg-gray-200">
            Courses
          </Link>
          <Link href="/dashboard/profile" className="block p-2 rounded hover:bg-gray-200">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
