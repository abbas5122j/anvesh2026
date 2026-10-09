import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulateWhatIfScenario } from '../services/riskEngine';
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Flame, Target, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WhatIfSimulatorModal({ isOpen, onClose }) {
  const { currentUser, subjects, riskWeights, getStudentRiskReport } = useApp();
  const student = currentUser;
  const currentRiskReport = getStudentRiskReport(student.id);

  // Simulator adjustments state
  const [additionalClassesTotal, setAdditionalClassesTotal] = useState(10);
  const [additionalClassesAttended, setAdditionalClassesAttended] = useState(10);
  const [projectedNextExamScore, setProjectedNextExamScore] = useState(78);
  const [completeMissedAssignments, setCompleteMissedAssignments] = useState(true);

  if (!isOpen || !currentRiskReport) return null;

  const simulation = simulateWhatIfScenario(student, subjects, riskWeights, {
    additionalClassesTotal,
    additionalClassesAttended,
    projectedNextExamScore,
    completeMissedAssignments
  });

  const simRisk = simulation.simulatedRisk;
  const simPrediction = simulation.simulatedPrediction;

  const isImproved = simRisk.riskScore < currentRiskReport.riskScore;

  const handleCelebrateIfImproved = () => {
    if (simRisk.level === 'LOW' && currentRiskReport.level !== 'LOW') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '760px', padding: '38px 44px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={26} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.65rem', margin: 0, color: 'var(--color-maroon)' }}>Academic Progress & Goal Planning</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', marginBottom: '26px', lineHeight: 1.6 }}>
          Explore supportive pathways to achieve your target standing by projecting upcoming classroom attendance, target test marks, and timely assignment submissions.
        </p>

        {/* Sliders Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', background: 'var(--color-surface-muted)', border: '1.5px solid var(--color-line)', padding: '24px 28px', borderRadius: 'var(--radius-xl)', marginBottom: '28px' }}>
          {/* Upcoming Classes Attended */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.96rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Attend Next Classroom Sessions: <strong>{additionalClassesAttended} of {additionalClassesTotal}</strong></span>
              <span style={{ color: 'var(--color-risk-low)', fontWeight: 700 }}>+{additionalClassesAttended} sessions</span>
            </div>
            <input 
              type="range"
              min="0"
              max="20"
              value={additionalClassesAttended}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAdditionalClassesAttended(val);
                setAdditionalClassesTotal(Math.max(val, additionalClassesTotal));
              }}
              style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
            />
          </div>

          {/* Projected Next Exam Marks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.96rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Target Score on Upcoming Assessment: <strong>{projectedNextExamScore}%</strong></span>
              <span style={{ color: projectedNextExamScore >= 75 ? 'var(--color-risk-low)' : 'var(--color-risk-medium)', fontWeight: 700 }}>
                {projectedNextExamScore >= 75 ? 'Distinction Pace' : 'Continuous Effort Pace'}
              </span>
            </div>
            <input 
              type="range"
              min="35"
              max="100"
              value={projectedNextExamScore}
              onChange={(e) => setProjectedNextExamScore(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
            />
          </div>

          {/* Missed Assignments Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1.5px solid var(--color-line)' }}>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Turn In All Pending Coursework & Assignments</strong>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Fulfills continuous evaluation requirements and eliminates deduction flags
              </div>
            </div>
            <input 
              type="checkbox"
              checked={completeMissedAssignments}
              onChange={(e) => setCompleteMissedAssignments(e.target.checked)}
              style={{ transform: 'scale(1.4)', cursor: 'pointer', accentColor: 'var(--color-maroon)' }}
            />
          </div>
        </div>

        {/* Counterfactual Outcome Side-by-Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '20px', marginBottom: '26px' }}>
          {/* Current State */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-line)', padding: '22px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Current Standing</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: currentRiskReport.levelDetails.color, marginTop: '6px' }}>
              {currentRiskReport.riskScore}
            </div>
            <span className={`badge badge-${currentRiskReport.level.toLowerCase()}`} style={{ marginTop: '8px' }}>
              {currentRiskReport.levelDetails.badge}
            </span>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '10px' }}>
              Attendance: <strong>{currentRiskReport.overallAttendance.toFixed(1)}%</strong>
            </div>
          </div>

          <ArrowRight size={28} color="var(--color-maroon)" />

          {/* Simulated State */}
          <div 
            style={{ 
              background: 'var(--color-surface)', 
              padding: '22px', 
              borderRadius: 'var(--radius-lg)', 
              textAlign: 'center',
              border: `2px solid ${simRisk.levelDetails.border}`,
              boxShadow: '0 4px 18px rgba(52, 40, 36, 0.06)'
            }}
          >
            <div style={{ fontSize: '0.88rem', color: 'var(--color-maroon)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Projected Standing</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: simRisk.levelDetails.color, marginTop: '6px' }}>
              {simRisk.riskScore}
            </div>
            <span className={`badge badge-${simRisk.level.toLowerCase()}`} style={{ marginTop: '8px' }}>
              {simRisk.levelDetails.badge}
            </span>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '10px' }}>
              Attendance: <strong>{simRisk.overallAttendance.toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* Simulated CGPA Gains */}
        <div 
          style={{ 
            background: isImproved ? 'rgba(54, 122, 89, 0.10)' : 'rgba(141, 32, 31, 0.08)', 
            border: `1.5px solid ${isImproved ? 'rgba(54, 122, 89, 0.35)' : 'rgba(141, 32, 31, 0.25)'}`,
            borderRadius: 'var(--radius-lg)', 
            padding: '20px 24px',
            marginBottom: '26px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={22} color={isImproved ? 'var(--color-risk-low)' : 'var(--color-maroon)'} />
            <strong style={{ fontSize: '1.05rem', color: isImproved ? 'var(--color-risk-low)' : 'var(--color-maroon)' }}>
              Suggested Next Step & Path to Improvement
            </strong>
          </div>
          <p style={{ fontSize: '0.95rem', margin: '8px 0 0', color: 'var(--color-text)', lineHeight: 1.6 }}>
            By attending the next <strong>{additionalClassesAttended} classes</strong> and scoring <strong>{projectedNextExamScore}%</strong> on your next exam, your advisory score improves by <strong>{Math.max(0, currentRiskReport.riskScore - simRisk.riskScore)} points</strong> to the <strong>{simRisk.levelDetails.badge}</strong> tier! Projected end-semester CGPA rises to <strong>{simPrediction.projectedCGPA}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Planner</button>
          <button className="btn btn-primary" onClick={handleCelebrateIfImproved}>
            <Award size={18} />
            <span>Confirm Target Pathway</span>
          </button>
        </div>
      </div>
    </div>
  );
}
