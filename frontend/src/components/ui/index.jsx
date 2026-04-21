import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

// ============================================================================
// CARD COMPONENTS
// ============================================================================

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export const FormField = ({ label, error, required, children, className = '' }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export const Input = ({ error, ...props }) => {
  return (
    <input
      className={`block w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
        error
          ? 'border-red-300 focus:ring-red-500'
          : 'border-gray-300 focus:ring-primary-500'
      } disabled:bg-gray-50 disabled:cursor-not-allowed`}
      {...props}
    />
  );
};

export const Select = ({ error, children, ...props }) => {
  return (
    <select
      className={`block w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
        error
          ? 'border-red-300 focus:ring-red-500'
          : 'border-gray-300 focus:ring-primary-500'
      } disabled:bg-gray-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </select>
  );
};

export const Textarea = ({ error, ...props }) => {
  return (
    <textarea
      className={`block w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
        error
          ? 'border-red-300 focus:ring-red-500'
          : 'border-gray-300 focus:ring-primary-500'
      } disabled:bg-gray-50 disabled:cursor-not-allowed`}
      {...props}
    />
  );
};

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary-100 text-primary-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    Active: { variant: 'success', label: 'Active' },
    Inactive: { variant: 'danger', label: 'Inactive' },
    'On Leave': { variant: 'warning', label: 'On Leave' },
    Suspended: { variant: 'danger', label: 'Suspended' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalContent = ({ children }) => {
  return <div className="px-6 py-4">{children}</div>;
};

export const ModalFooter = ({ children }) => {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      {children}
    </div>
  );
};

// ============================================================================
// ALERT COMPONENTS
// ============================================================================

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
    },
  };

  const config = types[type];

  return (
    <div className={`rounded-lg border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1">
          {title && <h3 className={`text-sm font-semibold ${config.titleColor}`}>{title}</h3>}
          {message && <p className={`text-sm mt-1 ${config.textColor}`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-0.5 rounded hover:bg-opacity-20 ${config.textColor}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-primary-500 border-t-transparent ${sizes[size]} ${className}`} />
  );
};

export const LoadingSkeleton = ({ className = '', rows = 1 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />
      ))}
    </div>
  );
};

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENTS
// ============================================================================

export const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400">
          <Icon className="h-full w-full" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

export const Table = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
};

export const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>{children}</td>;
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
