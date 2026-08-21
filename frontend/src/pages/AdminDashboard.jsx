import React, { useState, useEffect } from 'react';
import { adminAPI, planAPI, trainerAPI } from '../services/api';
import { useToast } from '../components/Toast';

const tabs = ['Overview', 'Users', 'Plans', 'Trainers'];

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 24px', cursor: 'pointer', background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      borderLeft: active ? '3px solid var(--yellow-primary)' : '3px solid transparent',
      color: active ? 'var(--yellow-primary)' : 'var(--text-secondary)',
      fontWeight: active ? 600 : 500, fontSize: '15px', display: 'block', width: '100%',
      textAlign: 'left', transition: 'all 0.2s', borderTop: 'none', borderRight: 'none', borderBottom: 'none'
    }}>
      {children}
    </button>
  );
}

function OverviewTab({ stats }) {
  if (!stats) return <div style={{ padding: '20px' }}>Loading stats...</div>;
  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '24px' }}>Dashboard Overview</h2>
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Total Users', val: stats.totalUsers || 0, icon: '👥' },
          { label: 'Active Users', val: stats.activeUsers || 0, icon: '✅' },
          { label: 'Inactive Users', val: stats.inactiveUsers || 0, icon: '⏸️' },
          { label: 'Admin Accounts', val: stats.adminUsers || 0, icon: '🛡️' },
          { label: 'New This Month', val: stats.newUsersThisMonth || 0, icon: '📈' },
          { label: 'New This Week', val: stats.newUsersThisWeek || 0, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--yellow-primary)' }}>{s.val}</div>
              </div>
              <div style={{ fontSize: '24px', opacity: 0.8 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllUsers({ limit: 50 });
      setUsers(data.users || []);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      addToast('User status updated', 'success');
      loadUsers();
    } catch (err) { addToast(err.response?.data?.message || 'Update failed', 'error'); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, role);
      addToast('User role updated', 'success');
      loadUsers();
    } catch (err) { addToast(err.response?.data?.message || 'Role update failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      addToast('User deleted', 'success');
      loadUsers();
    } catch (err) { addToast(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '24px' }}>Manage Users</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px' }}
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(u._id)}
                    className={`badge badge-${u.isActive ? 'green' : 'red'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlansTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    try {
      const { data } = await planAPI.getAll();
      setPlans(data.plans || []);
    } catch { addToast('Failed to load plans', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await planAPI.delete(id);
      addToast('Plan deleted', 'success');
      loadPlans();
    } catch { addToast('Delete failed', 'error'); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px' }}>Manage Plans</h2>
        <button className="btn btn-primary btn-sm" onClick={() => addToast('Plan creation form coming soon', 'info')}>+ Add Plan</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Plan Name</th><th>Price</th><th>Duration</th><th>Popular</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>Rs.{p.price}</td>
                <td>{p.duration} mo</td>
                <td>{p.isPopular ? 'Yes' : 'No'}</td>
                <td><button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainersTab() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => { loadTrainers(); }, []);

  const loadTrainers = async () => {
    try {
      const { data } = await trainerAPI.getAll();
      setTrainers(data.trainers || []);
    } catch { addToast('Failed to load trainers', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      await trainerAPI.delete(id);
      addToast('Trainer deleted', 'success');
      loadTrainers();
    } catch { addToast('Delete failed', 'error'); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px' }}>Manage Trainers</h2>
        <button className="btn btn-primary btn-sm" onClick={() => addToast('Trainer creation form coming soon', 'info')}>+ Add Trainer</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Name</th><th>Specialty</th><th>Exp</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {trainers.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.specialization}</td>
                <td>{t.experience} yrs</td>
                <td>{t.rating}</td>
                <td><button onClick={() => handleDelete(t._id)} className="btn btn-danger btn-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getDashboardStats().then(r => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div style={{ padding: '0 24px', marginBottom: '24px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Admin Panel
        </div>
        {tabs.map(t => <TabBtn key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>{t}</TabBtn>)}
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {activeTab === 'Overview' && <OverviewTab stats={stats} />}
        {activeTab === 'Users' && <UsersTab />}
        {activeTab === 'Plans' && <PlansTab />}
        {activeTab === 'Trainers' && <TrainersTab />}
      </div>
    </div>
  );
}
