// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Students</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Active Courses</h2>
          <p className="text-3xl font-bold">42</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Instructors</h2>
          <p className="text-3xl font-bold">18</p>
        </div>
      </div>
    </div>
  );
}
