import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, Calendar, FileText, Send } from 'lucide-react';

export function InterventionLoggerModal({ isOpen, onClose, preselectedStudentId = null }) {
  const { students, logIntervention } = useApp();

  const [studentId, setStudentId] = useState(preselectedStudentId || (students[0]?.id || ''));
  const [type, setType] = useState('1-on-1 Academic Counseling');
  const [notes, setNotes] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
    }
  }, [preselectedStudentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim() || !actionPlan.trim()) {
      alert('Please provide counseling notes and an agreed action plan.');
      return;
    }

    logIntervention({
      studentId,
      type,
      notes,
      actionPlan,
      followUpDate
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '36px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={24} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Record Mentorship Counseling Session</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Enrolled Student</label>
            <select 
              className="form-select" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)}
              style={{ fontSize: '0.96rem' }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) — Attendance: {s.attendance?.overallPercentage?.toFixed(1)}%
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Counseling Format & Topic</label>
            <select 
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ fontSize: '0.96rem' }}
            >
              <option value="1-on-1 Academic Counseling">1-on-1 Academic Counseling</option>
              <option value="Remedial Session & Doubt Clearing">Remedial Session & Doubt Clearing</option>
              <option value="Parent Consultation Call">Parent Consultation Call</option>
              <option value="Peer Tutoring Assignment">Peer Tutoring Assignment</option>
              <option value="Attendance Recovery Warning">Attendance Recovery Warning</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Discussion & Root Cause Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Student reported personal illness during weeks 3-4, causing gaps in Operating Systems scheduling concepts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Agreed Action Plan & Deliverables</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Complete 2 remedial assignments by next Tuesday; attend lab doubt clearing hours..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Progress Review Date</label>
            <input
              type="date"
              className="form-input"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              style={{ fontSize: '0.96rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Send size={17} />
              <span>Save & Send Student Guidance Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
