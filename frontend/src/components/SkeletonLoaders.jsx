/**
 * Skeleton Loading Components
 * 
 * Use these instead of generic spinners for better UX.
 * They show the structure of content while loading,
 * reducing perceived wait time.
 */

// Base Skeleton Component
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

// Stat Card Skeleton
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 6 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className={`h-4 ${i === 0 ? 'w-24' : 'w-full'}`} />
      </td>
    ))}
  </tr>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-3">
              <Skeleton className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Card Skeleton (for mobile view)
export const EmployeeCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>

    {/* Details */}
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Professional Info */}
    <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
      <div className="flex-1">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 flex-1" />
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="h-[300px] flex items-end justify-around gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-full"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-5 w-64" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
    <Skeleton className="h-8 w-48 mb-6" />
    
    {/* Section 1 */}
    <div>
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Section 2 */}
    <div>
      <Skeleton className="h-6 w-52 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 pt-6 border-t">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-5 w-64" />
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Avatar and info */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>

    {/* Password change section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="mt-6">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  </div>
);

/**
 * USAGE EXAMPLES:
 * 
 * // In Dashboard.jsx
 * if (loading) {
 *   return <DashboardSkeleton />;
 * }
 * 
 * // In EmployeeList.jsx
 * if (loading && employees.length === 0) {
 *   return (
 *     <div className="space-y-4">
 *       <EmployeeCardSkeleton />
 *       <EmployeeCardSkeleton />
 *       <EmployeeCardSkeleton />
 *     </div>
 *   );
 * }
 * 
 * // In Profile.jsx
 * if (loading) {
 *   return <ProfileSkeleton />;
 * }
 */

export default {
  Skeleton,
  StatCardSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  EmployeeCardSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
  FormSkeleton,
  ProfileSkeleton
};
