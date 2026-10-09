import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Calendar, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { InterventionLoggerModal } from './InterventionLoggerModal';

export function InterventionHistory() {
  const { interventions, updateInterventionStatus } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeartHandshake size={24} color="var(--color-maroon)" />
            <h2 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Mentorship Advising & Academic Support Log</h2>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
            Document student counseling sessions, agree on remedial action plans, and track long-term academic recovery
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <UserPlus size={17} />
          <span>Record Advisory Session</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {interventions.map(item => {
          const isImproved = (item.previousRisk === 'HIGH' && item.currentRisk !== 'HIGH') ||
                             (item.previousRisk === 'MEDIUM' && item.currentRisk === 'LOW');

          return (
            <div key={item.id} className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.studentName}</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{item.type}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Faculty Mentor: {item.mentorName} • Conducted: {item.date} • Next Scheduled Review: {item.followUpDate}
                  </div>
                </div>

                {/* Outcome Indicator (Before vs After) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--color-surface-muted)', padding: '10px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--color-line)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '2px' }}>Prior Standing</div>
                      <span className={`badge badge-${item.previousRisk.toLowerCase()}`} style={{ fontSize: '0.82rem' }}>
                        {item.previousRisk}
                      </span>
                    </div>

                    <ArrowRight size={16} color="var(--color-maroon)" />

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '2px' }}>Current Standing</div>
                      <span className={`badge badge-${item.currentRisk.toLowerCase()}`} style={{ fontSize: '0.82rem' }}>
                        {item.currentRisk}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${isImproved ? 'badge-low' : 'badge-medium'}`} style={{ fontSize: '0.88rem', padding: '8px 16px' }}>
                    {isImproved ? 'Standing Improved' : item.status}
                  </span>
                </div>
              </div>

              {/* Discussion & Action Plan */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', background: 'var(--color-surface-muted)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Session Discussion & Academic Concerns:
                  </div>
                  <p style={{ fontSize: '0.94rem', color: 'var(--color-text)', margin: '6px 0 0', lineHeight: 1.6 }}>
                    {item.notes}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Agreed Action Plan & Milestones:
                  </div>
                  <p style={{ fontSize: '0.94rem', color: 'var(--color-text)', margin: '6px 0 0', lineHeight: 1.6 }}>
                    {item.actionPlan}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                {item.status !== 'Completed' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => updateInterventionStatus(item.id, 'Completed', 'MEDIUM')}
                  >
                    <CheckCircle size={16} />
                    <span>Mark Action Plan as Completed</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <InterventionLoggerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
