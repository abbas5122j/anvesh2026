import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateFacultyClassSummary } from '../../services/ragChatbot';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  UserPlus, 
  Flame,
  ArrowRight,
  X
} from 'lucide-react';
import { InterventionLoggerModal } from './InterventionLoggerModal';

export function FacultyDashboard({ onSelectStudent }) {
  const { students, subjects, getStudentRiskReport, switchUser } = useApp();

  const [riskFilter, setRiskFilter] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW
  const [searchTerm, setSearchTerm] = useState('');
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState(null);
  const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);

  // Compute reports for all students
  const studentReports = students.map(s => ({
    student: s,
    report: getStudentRiskReport(s.id)
  }));

  const classSummary = generateFacultyClassSummary(students, studentReports.map(sr => sr.report));

  // Filter students
  const filteredStudents = studentReports.filter(({ student, report }) => {
    const matchesFilter = riskFilter === 'ALL' || report.level === riskFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate subject difficulty metrics
  const subjectDifficulty = subjects.map(sub => {
    let totalScore = 0;
    let scoreCount = 0;
    let failCount = 0;
    let totalAtt = 0;

    students.forEach(s => {
      const marks = s.academicMarks[sub.id] || [];
      if (marks.length > 0) {
        let earned = 0, max = 0;
        marks.forEach(m => { earned += m.marks; max += m.maxMarks; });
        const pct = max > 0 ? (earned / max) * 100 : 70;
        totalScore += pct;
        scoreCount++;
        if (pct < 40) failCount++;
      }
      const att = s.attendance.bySubject[sub.id]?.percentage || 75;
      totalAtt += att;
    });

    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 70;
    const failureRate = scoreCount > 0 ? Math.round((failCount / scoreCount) * 100) : 0;
    const avgAttendance = Math.round(totalAtt / students.length);

    return {
      ...sub,
      avgScore,
      failureRate,
      avgAttendance,
      difficultyRank: avgScore < 60 ? 'HIGH' : avgScore < 75 ? 'MEDIUM' : 'NORMAL'
    };
  }).sort((a, b) => b.failureRate - a.failureRate);

  const handleOpenIntervention = (studentId) => {
    setSelectedStudentForIntervention(studentId);
    setInterventionModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Faculty KPI Cards (style.md specifications) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(141, 32, 31, 0.08)', color: 'var(--color-maroon)' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Students in Class (CSE-3A)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(163, 58, 53, 0.3)' }}>
          <div className="stat-icon" style={{ background: 'rgba(163, 58, 53, 0.10)', color: 'var(--color-risk-high)' }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--color-risk-high)' }}>{classSummary.highRiskCount}</div>
            <div className="stat-label">Priority Academic Guidance (High)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(165, 106, 22, 0.3)' }}>
          <div className="stat-icon" style={{ background: 'rgba(165, 106, 22, 0.10)', color: 'var(--color-risk-medium)' }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--color-risk-medium)' }}>{classSummary.medRiskCount}</div>
            <div className="stat-label">Could Use Extra Support (Medium)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(54, 122, 89, 0.3)' }}>
          <div className="stat-icon" style={{ background: 'rgba(54, 122, 89, 0.10)', color: 'var(--color-risk-low)' }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--color-risk-low)' }}>{classSummary.lowRiskCount}</div>
            <div className="stat-label">On Track Cohort (Low)</div>
          </div>
        </div>
      </div>

      {/* Weekly Faculty Mentorship Briefing (Ivory & Maroon editorial) */}
      <div 
        className="glass-card"
        style={{ 
          background: 'var(--color-surface-muted)',
          border: '1.5px solid var(--color-line)',
          padding: '28px 32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Sparkles size={22} color="var(--color-maroon)" />
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>
            {classSummary.title}
          </h3>
        </div>
        <p style={{ fontSize: '0.98rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.65 }}>
          {classSummary.actionAdvice}
        </p>
      </div>

      {/* At-Risk Student Priority Roster */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--color-maroon)' }}>Class Roster & Academic Mentorship Roster</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Multi-factor assessment standing, compliance overrides, and student diagnostics
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
              <input 
                type="text"
                placeholder="Search by roll number or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', width: '260px', height: '42px', fontSize: '0.95rem' }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={`btn btn-sm ${riskFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}
                >
                  {f === 'ALL' ? 'All Students' : f === 'HIGH' ? 'Priority Attention' : f === 'MEDIUM' ? 'Support' : 'On Track'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Attendance</th>
                <th>Exam Avg</th>
                <th>Standing</th>
                <th>Status & Primary Advisory Reason</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(({ student, report }) => {
                const isOverridden = report.hasHardOverride;
                return (
                  <tr key={student.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-line)' }}
                        />
                        <div>
                          <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{student.name}</strong>
                          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 600 }}>{student.rollNo}</span>
                    </td>

                    <td>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: student.attendance.overallPercentage < 65 ? 'var(--color-risk-high)' : student.attendance.overallPercentage < 75 ? 'var(--color-risk-medium)' : 'var(--color-risk-low)' }}>
                          {student.attendance.overallPercentage.toFixed(1)}%
                        </strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {student.attendance.totalAttended}/{student.attendance.totalConducted} classes
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>{report.overallMarksAverage}%</strong>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`beacon-dot beacon-${report.level.toLowerCase()}`} />
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{report.riskScore}</span>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span className={`badge badge-${report.level.toLowerCase()}`}>
                            {report.levelDetails.badge}
                          </span>
                          {isOverridden && (
                            <span className="badge badge-high" style={{ padding: '2px 8px', fontSize: '0.78rem' }}>
                              Policy Override
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginTop: '6px', maxWidth: '320px', lineHeight: 1.4 }}>
                          {report.reasons[0]}
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenIntervention(student.id)}
                        >
                          <UserPlus size={16} />
                          <span>Log Mentoring</span>
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            if (onSelectStudent) {
                              onSelectStudent(student.id);
                            } else {
                              setSelectedStudentForReview({ student, report });
                            }
                          }}
                        >
                          <span>Review</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Heatmap & Subject Difficulty Ranking */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
        {/* Class Heatmap Matrix */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Class Coursework Heatmap</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Evaluation standing per enrolled student</p>
            </div>
            <span className="badge badge-neutral">Cohort Distribution</span>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.92rem' }}>
              <thead>
                <tr>
                  <th>Student</th>
                  {subjects.map(s => (
                    <th key={s.id} style={{ textAlign: 'center' }}>{s.code}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(stu => {
                  const r = getStudentRiskReport(stu.id);
                  return (
                    <tr key={stu.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-text)' }}>{stu.name.split(' ')[0]}</td>
                      {subjects.map(sub => {
                        const subRisk = r.subjectRisks?.[sub.id] || { riskScore: 20, level: 'LOW' };
                        let cellBg = 'rgba(54, 122, 89, 0.12)';
                        let cellColor = 'var(--color-risk-low)';
                        if (subRisk.level === 'HIGH') {
                          cellBg = 'rgba(163, 58, 53, 0.16)';
                          cellColor = 'var(--color-risk-high)';
                        } else if (subRisk.level === 'MEDIUM') {
                          cellBg = 'rgba(165, 106, 22, 0.14)';
                          cellColor = 'var(--color-risk-medium)';
                        }

                        return (
                          <td 
                            key={sub.id} 
                            style={{ 
                              textAlign: 'center', 
                              background: cellBg, 
                              color: cellColor, 
                              fontWeight: 800,
                              fontSize: '0.95rem'
                            }}
                          >
                            {subRisk.scorePercentage !== null ? `${subRisk.scorePercentage}%` : '–'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Difficulty Ranking */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Curriculum Subject Diagnostics</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Classroom mastery & pass-rate rank</p>
            </div>
            <span className="badge badge-primary">Curriculum Insight</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {subjectDifficulty.map((sub, idx) => (
              <div 
                key={sub.id}
                style={{ 
                  background: 'var(--color-surface-muted)', 
                  border: '1.5px solid var(--color-line)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-maroon)' }}>#{idx + 1}</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-maroon)' }}>{sub.name}</strong>
                    <span className="badge badge-neutral">{sub.code}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '18px', fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                    <span>Avg Score: <strong>{sub.avgScore}%</strong></span>
                    <span>Cohort Attendance: <strong>{sub.avgAttendance}%</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: sub.failureRate > 20 ? 'var(--color-risk-high)' : 'var(--color-risk-low)' }}>
                    {sub.failureRate}% Alert Rate
                  </div>
                  <span className={`badge badge-${sub.difficultyRank.toLowerCase()}`} style={{ marginTop: '4px' }}>
                    {sub.difficultyRank} Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intervention Modal */}
      <InterventionLoggerModal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        preselectedStudentId={selectedStudentForIntervention}
      />

      {/* Student Dossier Review Modal */}
      {selectedStudentForReview && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={selectedStudentForReview.student.avatar} 
                  alt={selectedStudentForReview.student.name}
                  style={{ width: '48px', height: '48px', borderRadius: '14px', border: '1.5px solid var(--color-line)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-maroon)' }}>
                    {selectedStudentForReview.student.name}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                    Roll No: {selectedStudentForReview.student.rollNo} • Group: {selectedStudentForReview.student.group}
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudentForReview(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', background: 'var(--color-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Advisory Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedStudentForReview.report.levelDetails.color }}>
                  {selectedStudentForReview.report.riskScore}/100
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Attendance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                  {selectedStudentForReview.student.attendance.overallPercentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Standing Tier</div>
                <span className={`badge badge-${selectedStudentForReview.report.level.toLowerCase()}`} style={{ marginTop: '4px' }}>
                  {selectedStudentForReview.report.levelDetails.badge}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '8px' }}>Course Performance Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {subjects.map(s => {
                  const att = selectedStudentForReview.student.attendance.bySubject[s.id]?.percentage || 100;
                  const marks = selectedStudentForReview.student.academicMarks[s.id] || [];
                  const avgMark = marks.length > 0 ? Math.round(marks.reduce((acc, m) => acc + (m.marks / m.maxMarks)*100, 0) / marks.length) : 'N/A';
                  return (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-line)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                      <span><strong>{s.code}</strong> — {s.name}</span>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '0.86rem' }}>
                        <span>Att: <strong>{att.toFixed(0)}%</strong></span>
                        <span>Marks: <strong>{avgMark}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedStudentForReview.report.reasons && selectedStudentForReview.report.reasons.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '8px' }}>Advisory Guidance Notes</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {selectedStudentForReview.report.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const sId = selectedStudentForReview.student.id;
                  setSelectedStudentForReview(null);
                  handleOpenIntervention(sId);
                }}
              >
                <UserPlus size={16} />
                <span>Log Mentoring Session</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const sId = selectedStudentForReview.student.id;
                  setSelectedStudentForReview(null);
                  if (switchUser) switchUser('student', sId);
                }}
              >
                <span>Open Student Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
