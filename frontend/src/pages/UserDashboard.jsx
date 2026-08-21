import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { userAPI, bookingAPI, planAPI } from '../services/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const tabs = ['Overview', 'My Bookings', 'Profile', 'Security'];

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 20px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
      background: active ? 'var(--yellow-glow)' : 'transparent',
      color: active ? 'var(--yellow-primary)' : 'var(--text-secondary)',
      fontWeight: active ? 700 : 500, fontSize: '14px',
      borderBottom: active ? '2px solid var(--yellow-primary)' : '2px solid transparent',
      transition: 'all 0.2s', fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function OverviewTab({ user, bookings, plans }) {
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(245,158,11,0.05))',
        border: '1px solid var(--border-yellow)', borderRadius: 'var(--radius-lg)',
        padding: '28px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontWeight: 900, fontSize: '24px', color: '#000', fontFamily: 'Outfit' }}>
              {user?.firstName?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '22px', marginBottom: '4px' }}>
            Welcome back, <span style={{ color: 'var(--yellow-primary)' }}>{user?.firstName}!</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {user?.role === 'admin' ? '🛡️ Admin Account' : '💪 Fitness World Member'} • Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { icon: '📅', val: activeBookings.length, label: 'Active Bookings' },
          { icon: '✅', val: bookings.filter(b => b.status === 'completed').length, label: 'Sessions Done' },
          { icon: '📋', val: plans.length, label: 'Available Plans' },
          { icon: '🏆', val: user?.role === 'admin' ? 'Admin' : 'Member', label: 'Account Type' },
        ].map(({ icon, val, label }) => (
          <div key={label} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <div className="stat-card-value" style={{ fontSize: '24px' }}>{val}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', marginBottom: '16px' }}>Recent Bookings</h3>
        {activeBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📅</div>
            <p>No active bookings. Book a session to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeBookings.slice(0, 3).map(b => (
              <div key={b._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.type}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(b.sessionDate).toLocaleDateString()} at {b.sessionTime}
                    {b.trainer && ` • ${b.trainer.name}`}
                  </div>
                </div>
                <span className={`badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'pending' ? 'yellow' : 'gray'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingsTab({ bookings, loading, onCancel }) {
  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading bookings...</div>;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: '20px' }}>My Bookings</h3>
      </div>
      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: '8px' }}>No Bookings Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Book a training session or class to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map(b => (
            <div key={b._id} className="card" style={{ padding: '20px', flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius)', flexShrink: 0,
                  background: 'var(--yellow-glow)', border: '1px solid var(--border-yellow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>🏋️</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{b.type}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    📅 {new Date(b.sessionDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at {b.sessionTime}
                  </div>
                  {b.trainer && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>👤 Trainer: {b.trainer.name}</div>}
                  {b.notes && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>📝 {b.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'pending' ? 'yellow' : b.status === 'cancelled' ? 'red' : 'gray'}`}>
                  {b.status}
                </span>
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button className="btn btn-danger btn-sm" onClick={() => onCancel(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab({ user }) {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profileImage || '');
  const [profilePicLoading, setProfilePicLoading] = useState(false);
  
  // Update preview when user.profileImage changes
  useEffect(() => {
    if (user?.profileImage) {
      setProfilePicPreview(user.profileImage);
    }
  }, [user?.profileImage]);
  
  // Calculate age and BMI
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    height: user?.height || '',
    currentWeight: user?.currentWeight || '',
    targetWeight: user?.targetWeight || '',
    fitnessGoal: user?.fitnessGoal || '',
    trainingLevel: user?.trainingLevel || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || '',
  });
  
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePic) return;
    setProfilePicLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePictureFile', profilePic);
      const { data } = await userAPI.updateProfilePicture(formData);
      updateUser(data.user);
      addToast('Profile picture updated successfully!', 'success');
      setProfilePic(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed.', 'error');
    } finally {
      setProfilePicLoading(false);
    }
  };

  const age = calculateAge(form.dateOfBirth);
  const bmi = calculateBMI(form.height, form.currentWeight);

  const getBMICategory = (bmiVal) => {
    if (!bmiVal) return '';
    if (bmiVal < 18.5) return 'Underweight';
    if (bmiVal < 25) return 'Normal';
    if (bmiVal < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', marginBottom: '24px' }}>My Profile</h3>
      
      {/* Profile Picture Section */}
      <div className="card" style={{ maxWidth: '540px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', border: '3px solid var(--border-yellow)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#000', fontFamily: 'Outfit' }}>
                {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
              </span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h4 style={{ fontFamily: 'Outfit', marginBottom: '12px' }}>Profile Picture</h4>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleProfilePicChange}
              style={{ marginBottom: '12px', display: 'block' }}
            />
            <button 
              onClick={handleProfilePicUpload}
              className="btn btn-primary btn-sm"
              disabled={!profilePic || profilePicLoading}
            >
              {profilePicLoading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '540px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([f, l]) => (
              <div key={f} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{l}</label>
                <input className="form-input" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Username</label>
            <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email (not editable)</label>
            <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+94 71 234 5678" />
          </div>

          {/* Personal Details */}
          <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                className="form-input" 
                value={form.dateOfBirth} 
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Age</label>
              <input 
                className="form-input" 
                value={age ? `${age} years` : 'Enter DOB to calculate age'} 
                disabled 
                style={{ opacity: 0.7 }} 
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Gender</label>
            <select 
              className="form-input" 
              value={form.gender} 
              onChange={e => setForm({ ...form, gender: e.target.value })} 
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Fitness Details */}
          <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Height (cm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.height} 
                onChange={e => setForm({ ...form, height: e.target.value })} 
                placeholder="175" 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Current Weight (kg)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.currentWeight} 
                onChange={e => setForm({ ...form, currentWeight: e.target.value })} 
                placeholder="70" 
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">BMI</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                className="form-input" 
                value={bmi ? `${bmi} kg/m²` : 'Enter height & weight to calculate BMI'} 
                disabled 
                style={{ flex: 1, opacity: 0.7 }} 
              />
              {bmi && (
                <span className={`badge badge-${getBMICategory(bmi) === 'Normal' ? 'green' : 'yellow'}`}>
                  {getBMICategory(bmi)}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Weight (kg)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.targetWeight} 
                onChange={e => setForm({ ...form, targetWeight: e.target.value })} 
                placeholder="65" 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Fitness Goal</label>
              <select 
                className="form-input" 
                value={form.fitnessGoal} 
                onChange={e => setForm({ ...form, fitnessGoal: e.target.value })} 
              >
                <option value="">Select goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Strength">Strength</option>
                <option value="Bodybuilding">Bodybuilding</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Training Level</label>
            <select 
              className="form-input" 
              value={form.trainingLevel} 
              onChange={e => setForm({ ...form, trainingLevel: e.target.value })} 
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Emergency Contact */}
          <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Emergency Contact Name</label>
            <input 
              className="form-input" 
              value={form.emergencyContactName} 
              onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} 
              placeholder="Name of emergency contact" 
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Emergency Contact Phone</label>
            <input 
              className="form-input" 
              value={form.emergencyContactPhone} 
              onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} 
              placeholder="+94 71 123 4567" 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SecurityTab({ user }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { addToast('Passwords do not match.', 'error'); return; }
    if (form.newPassword.length < 6) { addToast('Password must be at least 6 characters.', 'error'); return; }
    setLoading(true);
    try {
      await userAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      addToast('Password changed successfully!', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Password change failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', marginBottom: '24px' }}>Security Settings</h3>
      <div className="card" style={{ maxWidth: '480px', marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Change Password</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[['currentPassword','Current Password'], ['newPassword','New Password'], ['confirmPassword','Confirm New Password']].map(([f,l]) => (
            <div key={f} className="form-group" style={{ margin: 0 }}>
              <label className="form-label">{l}</label>
              <input className="form-input" type="password" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      <div className="card" style={{ maxWidth: '480px' }}>
        <h4 style={{ marginBottom: '8px', fontFamily: 'Outfit' }}>Two-Factor Authentication</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          2FA adds an extra layer of security. When enabled, you'll receive a code via email on each login.
        </p>
        <div className="badge badge-gray">Status: {user?.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [bookings, setBookings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMyBookings().then(r => setBookings(r.data.bookings || [])).catch(() => {}).finally(() => setBookingsLoading(false));
    planAPI.getAll().then(r => setPlans(r.data.plans || [])).catch(() => {});
  }, []);

  const handleCancelBooking = async (id) => {
    try {
      await bookingAPI.cancel(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      addToast('Booking cancelled.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not cancel booking.', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '40px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '0', flexWrap: 'wrap' }}>
          {tabs.map(t => <TabBtn key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>{t}</TabBtn>)}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview'    && <OverviewTab user={user} bookings={bookings} plans={plans} />}
        {activeTab === 'My Bookings' && <BookingsTab bookings={bookings} loading={bookingsLoading} onCancel={handleCancelBooking} />}
        {activeTab === 'Profile'     && <ProfileTab user={user} />}
        {activeTab === 'Security'    && <SecurityTab user={user} />}
      </div>
    </div>
  );
}
