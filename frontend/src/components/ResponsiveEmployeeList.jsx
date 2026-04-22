import { Eye, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { StatusBadge } from '../ui';

/**
 * Responsive Employee Table/Card Component
 * 
 * Key Improvements:
 * - Automatic switch between table (desktop) and cards (mobile)
 * - Touch-friendly buttons on mobile
 * - All data visible on mobile (no hidden columns)
 * - Better visual hierarchy
 * - Swipe actions on mobile (future enhancement)
 */

const ResponsiveEmployeeList = ({ 
  employees, 
  onView, 
  onEdit, 
  onDelete,
  canEdit,
  canDelete 
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr 
                key={employee.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.employeeCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.email}</div>
                  <div className="text-sm text-gray-500">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(employee.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View employee"
                      aria-label={`View ${employee.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onEdit(employee.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit employee"
                        aria-label={`Edit ${employee.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(employee.id, employee.name)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete employee"
                        aria-label={`Delete ${employee.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header with avatar and status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-semibold">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {employee.employeeCode}
                  </p>
                </div>
              </div>
              <StatusBadge status={employee.status} />
            </div>

            {/* Employee Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`mailto:${employee.email}`}
                  className="hover:text-primary-600 truncate"
                >
                  {employee.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`tel:${employee.phone}`}
                  className="hover:text-primary-600"
                >
                  {employee.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{employee.address}</span>
              </div>
            </div>

            {/* Professional Info */}
            <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm font-medium text-gray-900">
                  {employee.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Position</p>
                <p className="text-sm font-medium text-gray-900">
                  {employee.position}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onView(employee.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                aria-label={`View ${employee.name}`}
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              {canEdit && (
                <button
                  onClick={() => onEdit(employee.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  aria-label={`Edit ${employee.name}`}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(employee.id, employee.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={`Delete ${employee.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveEmployeeList;
