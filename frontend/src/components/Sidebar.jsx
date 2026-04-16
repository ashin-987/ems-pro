import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, LogOut,
  Building2, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',    end: true  },
  { to: '/employees',     icon: Users,            label: 'Employees',   end: true  },
  { to: '/employees/new', icon: UserPlus,         label: 'Add Employee', end: false },
];

const roleColors = {
  ADMIN:   'bg-purple-100 text-purple-700',
  HR:      'bg-blue-100   text-blue-700',
  MANAGER: 'bg-green-100  text-green-700',
  VIEWER:  'bg-slate-100  text-slate-600',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">EMS Pro</p>
            <p className="text-slate-400 text-xs">Employee Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="px-4 pb-5 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-xs truncate">@{user?.username}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user?.role] || 'bg-slate-100 text-slate-600'}`}>
            <ShieldCheck size={11} />
            {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
