import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Mail, Smartphone, Check, ShieldAlert, AlertTriangle, BookOpen, UserCheck } from 'lucide-react';

export function NotificationModal({ isOpen, onClose }) {
  const { notifications, markNotificationRead, currentUserId, currentRole } = useApp();
  const [activeChannelFilter, setActiveChannelFilter] = useState('ALL'); // ALL, email, sms

  if (!isOpen) return null;

  // Filter notifications for active user (or all if admin)
  const userNotifs = notifications.filter(n => currentRole === 'admin' || n.recipientId === currentUserId);
  const filteredNotifs = userNotifs.filter(n => {
    if (activeChannelFilter === 'ALL') return true;
    return n.channels?.includes(activeChannelFilter);
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px', padding: '36px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Academic Notices & Advisory Center</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Advisory Fatigue Control Banner */}
        <div 
          style={{ 
            background: 'var(--color-surface-muted)', 
            border: '1.5px solid var(--color-line)', 
            borderRadius: 'var(--radius-md)', 
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <strong style={{ fontSize: '0.92rem', color: 'var(--color-maroon)' }}>Advisory Frequency Schedule: Active</strong>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginTop: '3px', lineHeight: 1.4 }}>
              Low-urgency notices are automatically bundled weekly so critical academic deadlines and mentor notes receive prompt attention.
            </div>
          </div>
          <span className="badge badge-primary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Digest Active</span>
        </div>

        {/* Channel Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeChannelFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveChannelFilter('ALL')}
          >
            All Notices ({userNotifs.length})
          </button>

          <button 
            className={`btn btn-sm ${activeChannelFilter === 'email' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveChannelFilter('email')}
          >
            <Mail size={15} />
            <span>Official Email</span>
          </button>

          <button 
            className={`btn btn-sm ${activeChannelFilter === 'sms' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveChannelFilter('sms')}
          >
            <Smartphone size={15} />
            <span>SMS Alerts</span>
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '440px', overflowY: 'auto' }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              No notices matching this channel filter.
            </div>
          ) : (
            filteredNotifs.map(n => {
              const isHigh = n.severity === 'high';
              return (
                <div 
                  key={n.id}
                  style={{
                    background: n.read ? 'var(--color-surface)' : 'var(--color-surface-muted)',
                    border: `1.5px solid ${!n.read ? (isHigh ? 'var(--color-risk-high)' : 'var(--color-maroon)') : 'var(--color-line)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.02rem', color: isHigh ? 'var(--color-risk-high)' : 'var(--color-text)' }}>
                        {n.title}
                      </strong>
                      <span className={`badge badge-${isHigh ? 'high' : 'neutral'}`} style={{ fontSize: '0.8rem' }}>
                        {isHigh ? 'Priority Attention' : 'General Notice'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 10px', lineHeight: 1.55 }}>
                      {n.message}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>Dispatched via: {n.channels?.join(', ')}</span>
                    </div>
                  </div>

                  {!n.read && (
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => markNotificationRead(n.id)}
                      title="Mark as Read"
                      style={{ padding: '6px 10px' }}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
