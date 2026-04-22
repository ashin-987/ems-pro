import { Plus, TrendingUp, Users } from 'lucide-react';
import { Button } from './ui';

/**
 * Enhanced Empty State Component
 * 
 * Improvements over original:
 * - Visual illustrations with animated icons
 * - Contextual messaging
 * - Clear call-to-action
 * - Better spacing and typography
 * - Accessibility improvements
 */

const EmptyState = ({ 
  icon: Icon = Users, 
  title, 
  message, 
  action,
  variant = 'default' // 'default', 'chart', 'error'
}) => {
  const variants = {
    default: {
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-400',
      iconBg: 'bg-gray-100'
    },
    chart: {
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-100'
    },
    error: {
      bgColor: 'bg-red-50',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-100'
    }
  };

  const style = variants[variant];

  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 ${style.bgColor} rounded-lg`}
      role="status"
      aria-label={title}
    >
      {/* Animated Icon */}
      <div className={`${style.iconBg} rounded-full p-6 mb-4 animate-pulse`}>
        <Icon 
          className={`h-12 w-12 ${style.iconColor}`} 
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
        {message}
      </p>

      {/* Action */}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Specialized Empty States for Common Scenarios
 */

export const NoEmployeesState = ({ onAdd, canAdd }) => (
  <EmptyState
    icon={Users}
    title="No employees yet"
    message="Get started by adding your first employee to the system. You can import from CSV or add them individually."
    action={
      canAdd && (
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add First Employee
        </Button>
      )
    }
  />
);

export const NoDataChartState = ({ type = 'data' }) => (
  <EmptyState
    icon={TrendingUp}
    variant="chart"
    title={`No ${type} available`}
    message={`There's no ${type} to display yet. ${type === 'department' ? 'Add employees to different departments to see the distribution.' : 'Data will appear here as employees join.'}`}
  />
);

export const SearchEmptyState = ({ query, onClear }) => (
  <EmptyState
    icon={Users}
    title="No results found"
    message={`We couldn't find any employees matching "${query}". Try adjusting your search or filters.`}
    action={
      <Button variant="outline" onClick={onClear}>
        Clear Search
      </Button>
    }
  />
);

export const ErrorState = ({ error, onRetry }) => (
  <EmptyState
    variant="error"
    icon={Users}
    title="Something went wrong"
    message={error || "We couldn't load the data. Please try again."}
    action={
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    }
  />
);

export default EmptyState;
