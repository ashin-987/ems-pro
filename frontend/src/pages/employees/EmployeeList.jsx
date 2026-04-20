import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Pencil, Trash2, ChevronLeft,
  ChevronRight, SlidersHorizontal, RefreshCw, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { StatusBadge, Modal, Spinner, PageHeader } from '../../components/ui/index.jsx';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering','HR','Finance','Marketing','Operations','Sales','Legal'];

export default function EmployeeList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage]             = useState(0);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees', {
        params: { search, status, department, page, size: 10, sortBy: 'createdAt', sortDir: 'desc' },
      });
      const pg = data.data;
      setEmployees(pg.content);
      setTotalPages(pg.totalPages);
      setTotalElements(pg.totalElements);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [search, status, department, page]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, status, department]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget.id}`);
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const canEdit   = ['ADMIN','HR'].includes(user?.role);
  const canDelete = user?.role === 'ADMIN';

  return (
    <div className="p-8">
      <PageHeader
        title="Employees"
        subtitle={`${totalElements} total records`}
        actions={
          canEdit && (
            <button className="btn-primary" onClick={() => navigate('/employees/new')}>
              <Plus size={16} /> Add Employee
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, ID…"
            className="input-field pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-slate-400" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-field text-sm w-36">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="input-field text-sm w-40">
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button
            onClick={() => { setSearch(''); setStatus(''); setDepartment(''); }}
            className="btn-secondary text-sm py-1.5"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No employees found</p>
            <p className="text-sm mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Emp Code','Name','Designation','Department','Phone','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{emp.empCode}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.department || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.phone || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary py-1 px-2 text-xs disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === i
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary py-1 px-2 text-xs disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        title="Delete Employee"
        onClose={() => setDeleteTarget(null)}
      >
        <p className="text-slate-600 text-sm mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-slate-800">{deleteTarget?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <><Spinner size={14} /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}
