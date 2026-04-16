// ─── FormField ──────────────────────────────────────────────────────────────
export function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── Input ──────────────────────────────────────────────────────────────────
export function Input({ error, ...props }) {
  return (
    <input
      className={`input-field ${error ? 'input-error' : ''}`}
      {...props}
    />
  );
}

// ─── Select ─────────────────────────────────────────────────────────────────
export function Select({ error, children, ...props }) {
  return (
    <select
      className={`input-field ${error ? 'input-error' : ''}`}
      {...props}
    >
      {children}
    </select>
  );
}

// ─── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg
      className="animate-spin text-primary-600"
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── StatusBadge ────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    ACTIVE:   { cls: 'badge-active',   label: 'Active'   },
    INACTIVE: { cls: 'badge-inactive', label: 'Inactive' },
    ON_LEAVE: { cls: 'badge-leave',    label: 'On Leave' },
  };
  const { cls, label } = map[status] || { cls: 'badge-inactive', label: status };
  return <span className={cls}>{label}</span>;
}

// ─── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ─── PageHeader ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
