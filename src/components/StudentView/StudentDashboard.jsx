import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  calculateAttendanceBuffer, 
  predictEndSemesterPerformance 
} from '../../services/riskEngine';
import { generateStudentWeeklySummary } from '../../services/ragChatbot';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  Flame, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Calculator, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function StudentDashboard({ onOpenWhatIf, onNavigateTab }) {
  const { currentUser, subjects, getStudentRiskReport, updateStudentTargetCGPA } = useApp();
  const student = currentUser;
  const riskReport = getStudentRiskReport(student.id);

  // Attendance Calculator state
  const [calcTarget, setCalcTarget] = useState(75);
  const [editingTargetCGPA, setEditingTargetCGPA] = useState(false);
  const [newTargetInput, setNewTargetInput] = useState(student.targetCGPA || 8.5);

  if (!riskReport) return <div>Loading diagnostic profile...</div>;

  const attendanceBuffer = calculateAttendanceBuffer(
    student.attendance?.totalConducted || 0,
    student.attendance?.totalAttended || 0,
    calcTarget
  );

  const prediction = predictEndSemesterPerformance(student, riskReport);
  const weeklyBriefing = generateStudentWeeklySummary(student, riskReport);

  const handleSaveTarget = () => {
    updateStudentTargetCGPA(student.id, newTargetInput);
    setEditingTargetCGPA(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Student Welcome & Editorial Header (Ivory Maroon Friendly Rounded Style) */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'var(--color-surface)',
          border: '1px solid var(--color-line)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={student.avatar} 
            alt={student.name} 
            style={{ width: '64px', height: '64px', borderRadius: '18px', border: '2px solid var(--color-line)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-maroon)' }}>Welcome back, {student.name}</h2>
              <span className="badge badge-primary">{student.rollNo}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', marginTop: '6px' }}>
              Department of Computer Science & Engineering • Semester 5 Mentorship Group
            </p>
          </div>
        </div>

        {/* Supportive Streaks & Target */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(191, 76, 60, 0.10)', border: '1.5px solid rgba(191, 76, 60, 0.28)', padding: '12px 20px', borderRadius: 'var(--radius-lg)' }}>
            <Flame size={24} color="var(--color-terracotta)" />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>{student.studyStreak} Day Habit</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active learning streak</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(141, 32, 31, 0.08)', border: '1.5px solid rgba(141, 32, 31, 0.22)', padding: '12px 20px', borderRadius: 'var(--radius-lg)' }}>
            <Clock size={24} color="var(--color-maroon)" />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-maroon)' }}>{student.studyHoursLogged} hrs Logged</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Dedicated study time</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(54, 122, 89, 0.10)', border: '1.5px solid rgba(54, 122, 89, 0.28)', padding: '12px 20px', borderRadius: 'var(--radius-lg)' }}>
            <Target size={24} color="var(--color-risk-low)" />
            <div>
              {editingTargetCGPA ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    value={newTargetInput}
                    onChange={(e) => setNewTargetInput(e.target.value)}
                    style={{ width: '65px', padding: '4px 8px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid var(--color-line)' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleSaveTarget}>Save</button>
                </div>
              ) : (
                <div 
                  onClick={() => setEditingTargetCGPA(true)} 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Click to edit Target CGPA"
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-risk-low)' }}>Target {student.targetCGPA || 8.5}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>✏️</span>
                </div>
              )}
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Current: {student.currentCGPA} CGPA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Early Warning Risk Status & Performance Prediction */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Core Risk Status Card */}
        <div 
          className="glass-card" 
          style={{ 
            borderColor: riskReport.levelDetails.border,
            boxShadow: `0 8px 24px ${riskReport.levelDetails.bg}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`beacon-dot beacon-${riskReport.level.toLowerCase()}`} />
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Academic Standing & Advisory Status</h3>
            </div>
            <span 
              className="badge" 
              style={{ 
                background: riskReport.levelDetails.bg, 
                color: riskReport.levelDetails.color,
                border: `1.5px solid ${riskReport.levelDetails.border}` 
              }}
            >
              {riskReport.levelDetails.text}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '20px 0' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={riskReport.levelDetails.color}
                  strokeWidth="3.5"
                  strokeDasharray={`${riskReport.riskScore}, 100`}
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: riskReport.levelDetails.color }}>
                  {riskReport.riskScore}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Standing</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: '8px' }}>
                <strong>Assessment Reliability:</strong>{' '}
                <span style={{ color: riskReport.isInsufficientData ? 'var(--color-risk-medium)' : 'var(--color-risk-low)', fontWeight: 700 }}>
                  {riskReport.confidence}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                Comprehensive evaluation weighted across classroom attendance (35%), assessment marks (35%), semester trajectory (15%), and timely assignments (10%).
              </div>
            </div>
          </div>

          {/* Hard Rule Overrides Alert if any */}
          {riskReport.hasHardOverride && (
            <div 
              style={{ 
                background: 'rgba(163, 58, 53, 0.10)', 
                border: '1.5px solid rgba(163, 58, 53, 0.35)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '14px 18px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <ShieldAlert size={22} color="var(--color-risk-high)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-risk-high)' }}>Academic Advisory Note:</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {riskReport.ruleOverrides.map(o => o.description.replace('MULTIPLE_SUBJECT_FAILURE_OVERRIDE', 'Multiple course alerts').replace('CRITICAL_ATTENDANCE_OVERRIDE', 'Attendance below institution threshold')).join('; ')}
                </p>
              </div>
            </div>
          )}

          {/* Explainable Reasons */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-maroon)', letterSpacing: '0.01em', marginBottom: '10px' }}>
              Academic Guidance Observations:
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {riskReport.reasons.map((r, i) => (
                <li key={i} style={{ fontSize: '0.93rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '22px', display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary"
              onClick={onOpenWhatIf}
              style={{ flex: 1 }}
            >
              <Target size={18} />
              <span>Explore Goal & Progress Scenarios</span>
            </button>
          </div>
        </div>

        {/* Performance Prediction & Forecast Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={22} color="var(--color-maroon)" />
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>End-Semester Academic Forecast</h3>
            </div>
            <span className="badge badge-primary">Progress Projection</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', margin: '16px 0' }}>
            <div style={{ background: 'var(--color-surface-muted)', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-line)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Projected CGPA</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                {prediction.projectedCGPA}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Expected range: {prediction.lowerCGPA} – {prediction.upperCGPA}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-muted)', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-line)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Expected Exam Score</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-risk-low)', marginTop: '4px' }}>
                {prediction.projectedPercentage}%
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Continuous internal assessment pace
              </div>
            </div>
          </div>

          {/* Target Gap Analysis */}
          <div style={{ padding: '16px 20px', background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Semester Target Standing:</span>
              <strong style={{ color: prediction.targetDiff <= 0 ? 'var(--color-risk-low)' : 'var(--color-terracotta)', fontWeight: 700 }}>
                {prediction.targetDiff <= 0 ? 'Comfortably Meeting Target' : `${prediction.targetDiff.toFixed(2)} CGPA to target`}
              </strong>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              {prediction.targetDiff <= 0
                ? 'Your current coursework trajectory comfortably fulfills your academic milestone.'
                : `Focus on scoring 80%+ on upcoming internal tests and assignments to bridge this difference.`}
            </div>
          </div>

          {/* AI Weekly Progress Briefing */}
          <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <BookOpen size={18} color="var(--color-maroon)" />
              <strong style={{ fontSize: '0.96rem', color: 'var(--color-maroon)' }}>{weeklyBriefing.title}</strong>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.6 }}>
              {weeklyBriefing.body}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart & Attendance Calculator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Performance Trend Visualizer (SVG) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Continuous Coursework Progression</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Unit Tests compared with Mid-term Internal Evaluations</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-neutral">Unit Test 1</span>
              <span className="badge badge-primary">Internal 1</span>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="var(--color-line)" strokeDasharray="4 4" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="var(--color-line)" strokeDasharray="4 4" />
              <line x1="40" y1="150" x2="480" y2="150" stroke="var(--color-line)" strokeDasharray="4 4" />

              {/* Y Axis labels */}
              <text x="30" y="34" fill="var(--color-text-muted)" fontSize="11" textAnchor="end" fontWeight="600">100%</text>
              <text x="30" y="94" fill="var(--color-text-muted)" fontSize="11" textAnchor="end" fontWeight="600">60%</text>
              <text x="30" y="154" fill="var(--color-text-muted)" fontSize="11" textAnchor="end" fontWeight="600">20%</text>

              {/* Subject Comparison Points */}
              {subjects.map((sub, i) => {
                const marksList = student.academicMarks?.[sub.id] || [];
                const x = 75 + (i * 90);
                const score1 = marksList[0] ? (marksList[0].marks / marksList[0].maxMarks) * 100 : 70;
                const score2 = marksList[1] ? (marksList[1].marks / marksList[1].maxMarks) * 100 : score1;

                const y1 = 170 - (score1 * 1.35);
                const y2 = 170 - (score2 * 1.35);
                const isDeclining = score2 < score1 - 5;

                return (
                  <g key={sub.id}>
                    {/* Connecting line between Test 1 and Test 2 */}
                    <line 
                      x1={x - 16} 
                      y1={y1} 
                      x2={x + 16} 
                      y2={y2} 
                      stroke={isDeclining ? 'var(--color-terracotta)' : 'var(--color-maroon)'} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    
                    {/* Point 1 */}
                    <circle cx={x - 16} cy={y1} r="5" fill="var(--color-line)" stroke="var(--color-surface)" strokeWidth="2" />
                    {/* Point 2 */}
                    <circle cx={x + 16} cy={y2} r="6" fill={isDeclining ? 'var(--color-terracotta)' : 'var(--color-maroon)'} stroke="var(--color-surface)" strokeWidth="2" />

                    {/* Subject label */}
                    <text x={x} y="195" fill="var(--color-maroon)" fontSize="12" textAnchor="middle" fontWeight="700">
                      {sub.code}
                    </text>

                    {/* Percentage on latest */}
                    <text x={x + 16} y={y2 - 10} fill="var(--color-text)" fontSize="12" textAnchor="middle" fontWeight="800">
                      {Math.round(score2)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '12px', borderTop: '1px solid var(--color-line)', paddingTop: '10px' }}>
            <span>CS502 (Operating Systems): Notable decline observed (-20%)</span>
            <span>CS503 (Database Systems): Strong academic mastery (88%)</span>
          </div>
        </div>

        {/* Interactive Attendance Calculator */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calculator size={22} color="var(--color-maroon)" />
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Attendance Advisory Calculator</h3>
            </div>
            <span className="badge badge-primary">University 75% Requirement</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={student.attendance.overallPercentage >= 75 ? 'var(--color-risk-low)' : student.attendance.overallPercentage >= 65 ? 'var(--color-risk-medium)' : 'var(--color-risk-high)'}
                  strokeWidth="3.8"
                  strokeDasharray={`${student.attendance.overallPercentage}, 100`}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)' }}>{student.attendance.overallPercentage.toFixed(1)}%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.98rem', color: 'var(--color-text)', fontWeight: 600 }}>
                {student.attendance.totalAttended} attended out of {student.attendance.totalConducted} classes conducted
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Target Threshold:</span>
                <select 
                  value={calcTarget} 
                  onChange={(e) => setCalcTarget(Number(e.target.value))}
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1.5px solid var(--color-line)', borderRadius: '8px', padding: '4px 10px', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value={75}>75% (Mandatory Cutoff)</option>
                  <option value={80}>80% (Safety Buffer)</option>
                  <option value={85}>85% (Distinction Tier)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculator Output Message */}
          <div 
            style={{ 
              background: attendanceBuffer.status === 'DEFICIT' ? 'rgba(163, 58, 53, 0.10)' : 'rgba(54, 122, 89, 0.10)', 
              border: `1.5px solid ${attendanceBuffer.status === 'DEFICIT' ? 'rgba(163, 58, 53, 0.35)' : 'rgba(54, 122, 89, 0.35)'}`,
              borderRadius: 'var(--radius-lg)', 
              padding: '16px 18px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {attendanceBuffer.status === 'DEFICIT' ? (
                <AlertTriangle size={20} color="var(--color-risk-high)" />
              ) : (
                <CheckCircle2 size={20} color="var(--color-risk-low)" />
              )}
              <strong style={{ fontSize: '0.95rem', color: attendanceBuffer.status === 'DEFICIT' ? 'var(--color-risk-high)' : 'var(--color-risk-low)' }}>
                {attendanceBuffer.status === 'DEFICIT' ? 'Action Advised: Attendance Deficit' : 'Attendance in Good Standing'}
              </strong>
            </div>
            <p style={{ fontSize: '0.92rem', margin: '6px 0 0', color: 'var(--color-text)', lineHeight: 1.5 }}>
              {attendanceBuffer.message}
            </p>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={() => onNavigateTab('timetable')}
            style={{ width: '100%', marginTop: '16px' }}
          >
            <span>Review Personalized Study Timetable</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Subject Strengths and Weaknesses Matrix */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Coursework Diagnostics & Subject Breakdown</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Classroom attendance, assessment standing, and focus areas</p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigateTab('chatbot')}
          >
            <BookOpen size={18} />
            <span>Course Textbooks & Syllabus Guide</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {subjects.map(sub => {
            const att = student.attendance.bySubject[sub.id] || { percentage: 100, conducted: 0, attended: 0 };
            const subRisk = riskReport.subjectRisks?.[sub.id] || { riskScore: 20, level: 'LOW' };
            const isCriticalAtt = att.percentage < 65;

            return (
              <div 
                key={sub.id} 
                style={{ 
                  background: 'var(--color-surface-muted)', 
                  border: `1.5px solid ${subRisk.level === 'HIGH' ? 'rgba(163, 58, 53, 0.4)' : 'var(--color-line)'}`,
                  borderRadius: 'var(--radius-lg)', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-maroon)', fontWeight: 700, letterSpacing: '0.04em' }}>{sub.code}</span>
                    <h4 style={{ fontSize: '1.1rem', margin: '2px 0 0', color: 'var(--color-maroon)' }}>{sub.name}</h4>
                  </div>
                  <span className={`badge badge-${subRisk.level.toLowerCase()}`}>
                    {subRisk.level}
                  </span>
                </div>

                {/* Progress bars for Marks & Attendance */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Attendance:</span>
                    <strong style={{ color: isCriticalAtt ? 'var(--color-risk-high)' : 'var(--color-text)' }}>
                      {att.percentage.toFixed(1)}% ({att.attended}/{att.conducted})
                    </strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--color-line)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, att.percentage)}%`, 
                        background: att.percentage >= 75 ? 'var(--color-risk-low)' : att.percentage >= 65 ? 'var(--color-risk-medium)' : 'var(--color-risk-high)' 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Exam Score Avg:</span>
                    <strong style={{ color: 'var(--color-text)' }}>{subRisk.scorePercentage !== null ? `${subRisk.scorePercentage}%` : 'Pending'}</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--color-line)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${subRisk.scorePercentage || 60}%`, 
                        background: 'var(--color-maroon)' 
                      }} 
                    />
                  </div>
                </div>

                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigateTab('chatbot')}
                  style={{ marginTop: 'auto', fontSize: '0.88rem', padding: '6px 12px', justifyContent: 'space-between', color: 'var(--color-maroon)' }}
                >
                  <span>Review Subject Chapters</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
