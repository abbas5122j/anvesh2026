import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Bell, 
  Sun, 
  Moon, 
  RotateCcw, 
  Key, 
  BookOpen, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export function Navbar({ onOpenNotifs, onOpenSettings, onOpenExport }) {
  const { 
    currentUser, 
    currentRole, 
    currentUserId, 
    switchUser, 
    theme, 
    toggleTheme, 
    notifications, 
    resetToDefaults,
    students,
    faculty
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read && (n.recipientId === currentUserId || currentRole === 'admin')).length;

  return (
    <header className="navbar">
      {/* Brand & Institution */}
      <div className="brand-wrapper">
        <div className="brand-icon-box">
          <GraduationCap size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="brand-title">AcademiPulse</span>
            <span className="brand-badge">Academic Portal</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '2px 0 0', lineHeight: 1.2 }}>
            Student Mentorship & Early Academic Support
          </p>
        </div>
      </div>

      {/* Role / Persona Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="role-switcher">
          <button
            className={`role-tab-btn ${currentRole === 'student' ? 'active' : ''}`}
            onClick={() => switchUser('student', 'stu-1')}
            title="Switch to Student View (Rahul Sharma)"
          >
            <GraduationCap size={16} />
            <span>Student</span>
          </button>
          
          <button
            className={`role-tab-btn ${currentRole === 'faculty' ? 'active' : ''}`}
            onClick={() => switchUser('faculty', 'fac-1')}
            title="Switch to Faculty Mentor View (Dr. Ramesh Sharma)"
          >
            <Users size={16} />
            <span>Faculty Mentor</span>
          </button>

          <button
            className={`role-tab-btn ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => switchUser('admin', 'admin-1')}
            title="Switch to Department Head View (Dr. Vikramaditya Reddy)"
          >
            <ShieldCheck size={16} />
            <span>Department Head</span>
          </button>
        </div>

        {/* Persona quick select dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px' }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-maroon)' }} 
            />
            <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-maroon)' }}>▼</span>
          </button>

          {roleMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '10px',
                width: '300px',
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-line)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '6px 12px', fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--color-maroon)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Select Active Persona
              </div>

              <div style={{ padding: '6px 0' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', padding: '6px 12px', fontWeight: 700 }}>Students:</div>
                {students.slice(0, 3).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { switchUser('student', s.id); setRoleMenuOpen(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: currentUserId === s.id && currentRole === 'student' ? 'var(--color-surface-muted)' : 'transparent',
                      border: currentUserId === s.id && currentRole === 'student' ? '1px solid var(--color-maroon)' : '1px solid transparent',
                      color: currentUserId === s.id && currentRole === 'student' ? 'var(--color-maroon)' : 'var(--color-text)',
                      fontWeight: currentUserId === s.id && currentRole === 'student' ? 700 : 500,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{s.name} ({s.rollNo})</span>
                    {currentUserId === s.id && currentRole === 'student' && <CheckCircle size={16} />}
                  </button>
                ))}
              </div>

              <div style={{ padding: '6px 0', borderTop: '1px solid var(--color-line)' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', padding: '6px 12px', fontWeight: 700 }}>Faculty / Mentors:</div>
                {faculty.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { switchUser(f.role, f.id); setRoleMenuOpen(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: currentUserId === f.id && currentRole === f.role ? 'var(--color-surface-muted)' : 'transparent',
                      border: currentUserId === f.id && currentRole === f.role ? '1px solid var(--color-maroon)' : '1px solid transparent',
                      color: currentUserId === f.id && currentRole === f.role ? 'var(--color-maroon)' : 'var(--color-text)',
                      fontWeight: currentUserId === f.id && currentRole === f.role ? 700 : 500,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{f.name} ({f.role === 'admin' ? 'HOD' : 'Faculty'})</span>
                    {currentUserId === f.id && currentRole === f.role && <CheckCircle size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* Export Report */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenExport}
          title="Export Academic Diagnostic Report (PDF/Print)"
        >
          <BookOpen size={16} />
          <span>Diagnostic Report</span>
        </button>

        {/* Notifications */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenNotifs}
          style={{ position: 'relative' }}
          title="Academic Notices & Updates"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-terracotta)',
                color: 'var(--color-canvas)',
                fontSize: '0.72rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--color-canvas)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* AI & System Settings */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenSettings}
          title="Curriculum Settings & Keys"
        >
          <Key size={17} />
        </button>

        {/* Reset Demo Data */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm('Reset all demo marks, assessments, and attendance to factory seed state?')) {
              resetToDefaults();
            }
          }}
          title="Reset to Demo State"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
