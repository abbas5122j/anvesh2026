import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Award,
  BookOpen,
  Loader2,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { changeTimetableGroq } from '../../services/groqService';

export function StudentTimetable() {
  const { 
    currentUser, 
    getStudentTimetable, 
    toggleTimetableSlot, 
    regenerateStudentTimetable, 
    getStudentRiskReport 
  } = useApp();

  const student = currentUser;
  const timetable = getStudentTimetable(student.id);
  const riskReport = getStudentRiskReport(student.id);

  const [isRecalculating, setIsRecalculating] = useState(false);
  const [aiPlanInsights, setAiPlanInsights] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle Groq AI Timetable Recalculation
  const handleRecalculateTimetable = async () => {
    setIsRecalculating(true);
    try {
      const performanceContext = {
        studentName: student.name,
        targetCGPA: student.targetCGPA || 8.5,
        currentAttendance: `${riskReport?.overallAttendance?.toFixed(1) || 72}%`,
        weakTopics: student.knownWeakTopics || ['CPU Scheduling', 'Process Synchronization', 'Banker Algorithm'],
        academicRisk: riskReport?.level || 'MEDIUM'
      };

      const result = await changeTimetableGroq(timetable, performanceContext);
      if (result) {
        setAiPlanInsights(result);
      }
      regenerateStudentTimetable(student.id);
    } catch (err) {
      console.warn('Groq timetable adaptation falling back to local heuristic:', err);
      regenerateStudentTimetable(student.id);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Calculate adherence statistics
  let totalSlots = 0;
  let completedSlots = 0;

  Object.values(timetable).forEach(slotList => {
    slotList.forEach(slot => {
      totalSlots++;
      if (slot.completed) completedSlots++;
    });
  });

  const adherencePercent = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Timetable Header */}
      <div 
        className="glass-card"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '32px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={28} color="var(--color-maroon)" />
            <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-maroon)' }}>Weekly Academic Study & Revision Plan</h2>
          </div>
          <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
            Structured schedule balanced toward subjects requiring reinforcement (Operating Systems & Algorithms)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Adherence Card */}
          <div style={{ background: 'var(--color-surface-muted)', border: '1.5px solid var(--color-line)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Weekly Completion</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: adherencePercent >= 70 ? 'var(--color-risk-low)' : 'var(--color-risk-medium)' }}>
                {adherencePercent}%
              </div>
            </div>
            <Award size={28} color={adherencePercent >= 70 ? 'var(--color-risk-low)' : 'var(--color-risk-medium)'} />
          </div>

          <button 
            className="btn btn-secondary"
            onClick={handleRecalculateTimetable}
            disabled={isRecalculating}
          >
            {isRecalculating ? <Loader2 size={18} className="spin" /> : <RotateCcw size={18} />}
            <span>{isRecalculating ? 'Adapting with Groq...' : 'Recalculate Study Plan'}</span>
          </button>
        </div>
      </div>

      {/* AI Timetable Adaptation Insights Banner */}
      {aiPlanInsights && (
        <div 
          className="glass-card"
          style={{ 
            background: 'rgba(141, 32, 31, 0.04)',
            border: '1.5px solid var(--color-maroon)',
            padding: '24px 28px',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Compass size={22} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-maroon)' }}>
              AI Study Plan Adaptation Rationale
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.82rem' }}>Groq openai/gpt-oss-120b</span>
          </div>

          <p style={{ fontSize: '0.94rem', color: 'var(--color-text)', lineHeight: 1.6, margin: '0 0 16px' }}>
            {aiPlanInsights.reason_for_changes}
          </p>

          {(() => {
            const recList = Array.isArray(aiPlanInsights.recommendations)
              ? aiPlanInsights.recommendations
              : (typeof aiPlanInsights.recommendations === 'string' && aiPlanInsights.recommendations ? [aiPlanInsights.recommendations] : []);
            
            if (recList.length === 0) return null;

            return (
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mentor Recommendations for this Week:
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {recList.map((rec, rIdx) => (
                    <div 
                      key={rIdx}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-line)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--color-text)' }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* College Schedule Notice */}
      <div 
        style={{ 
          background: 'var(--color-surface-muted)', 
          border: '1.5px solid var(--color-line)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.95rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={20} color="var(--color-maroon)" />
          <span style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-maroon)' }}>Academic Advisory Structure:</strong> Regular college lecture sessions (09:00 AM – 04:30 PM) remain protected. Evening study periods are thoughtfully dedicated to priority topics.
          </span>
        </div>
        <span className="badge badge-primary">Balanced Load</span>
      </div>

      {/* Days Grid */}
      <div className="timetable-grid">
        {days.map(day => {
          const daySlots = timetable[day] || [];
          return (
            <div key={day} className="timetable-day-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid var(--color-line)', paddingBottom: '10px' }}>
                <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-maroon)' }}>{day}</h4>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {daySlots.filter(s => s.completed).length} of {daySlots.length} Done
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {daySlots.map(slot => (
                  <div 
                    key={slot.id} 
                    className={`timetable-slot ${slot.completed ? 'completed' : ''} ${slot.isHighPriority ? 'high-priority' : ''}`}
                    onClick={() => toggleTimetableSlot(student.id, day, slot.id)}
                    style={{ cursor: 'pointer', padding: '16px' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-maroon)', letterSpacing: '0.03em' }}>
                          {slot.subjectCode}
                        </span>
                        {slot.isHighPriority && (
                          <span className="badge badge-high" style={{ padding: '2px 8px', fontSize: '0.78rem' }}>
                            Priority Focus
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '4px' }}>
                        {slot.subjectName}
                      </div>

                      <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        📖 {slot.topicFocus}
                      </div>

                      <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                        ⏱ {slot.time} ({slot.durationMinutes} mins)
                      </div>
                    </div>

                    <div style={{ marginTop: '4px' }}>
                      <input 
                        type="checkbox" 
                        checked={slot.completed} 
                        onChange={() => {}} // handled by parent onClick
                        style={{ cursor: 'pointer', transform: 'scale(1.3)', accentColor: 'var(--color-maroon)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
