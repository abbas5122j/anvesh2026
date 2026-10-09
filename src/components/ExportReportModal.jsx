import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, BookOpen, CheckCircle, AlertTriangle, Users } from 'lucide-react';

export function ExportReportModal({ isOpen, onClose }) {
  const { currentUser, currentRole, subjects, getStudentRiskReport, students } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState(
    currentRole === 'student' ? currentUser.id : (students[0]?.id || '')
  );

  const student = currentRole === 'student' 
    ? currentUser 
    : (students.find(s => s.id === selectedStudentId) || students[0] || null);
  const riskReport = student ? getStudentRiskReport(student.id) : null;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!student || !riskReport) return;

    let csv = `AcademiPulse Official Continuous Evaluation & Academic Diagnostic Report\n`;
    csv += `Student Name,${student.name}\n`;
    csv += `Roll No,${student.rollNo}\n`;
    csv += `Advisory Standing,${riskReport.levelDetails.badge} (Index: ${riskReport.riskScore}/100)\n`;
    csv += `Overall Attendance,${student.attendance.overallPercentage.toFixed(1)}%\n\n`;
    csv += `Subject,Code,Attendance %,Marks %,Advisory Status\n`;

    subjects.forEach(sub => {
      const att = student.attendance.bySubject[sub.id]?.percentage || 100;
      const subR = riskReport.subjectRisks?.[sub.id];
      csv += `"${sub.name}",${sub.code},${att.toFixed(1)}%,${subR?.scorePercentage || 'N/A'}%,${subR?.level || 'LOW'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Academic_Diagnostic_Report_${student.rollNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '840px', maxHeight: '88vh', padding: '36px 42px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Official Academic Diagnostic & Advisory Report</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        {currentRole !== 'student' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', background: 'var(--color-surface-muted)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
            <Users size={18} color="var(--color-maroon)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-maroon)' }}>Select Student Dossier:</span>
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="form-select"
              style={{ maxWidth: '320px', padding: '6px 12px', fontSize: '0.92rem' }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
              ))}
            </select>
          </div>
        )}

        {/* Printable Document Preview Area */}
        <div 
          id="printable-report"
          style={{ 
            background: 'var(--color-surface)', 
            border: '1.5px solid var(--color-line)', 
            borderRadius: 'var(--radius-md)', 
            padding: '30px',
            overflowY: 'auto',
            maxHeight: '490px'
          }}
        >
          {/* Institutional Header */}
          <div style={{ borderBottom: '2px solid var(--color-line)', paddingBottom: '20px', marginBottom: '22px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>NATIONAL INSTITUTE OF TECHNOLOGY & SCIENCE</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
              Department of Computer Science & Engineering • Academic Session 2025-2026
            </p>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-maroon)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Continuous Evaluation & Early Academic Mentorship Dossier
            </div>
          </div>

          {student && riskReport ? (
            <div>
              {/* Student Bio */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', background: 'var(--color-surface-muted)', padding: '18px 20px', borderRadius: 'var(--radius-md)', marginBottom: '22px', fontSize: '0.95rem' }}>
                <div><strong>Student Name:</strong> {student.name}</div>
                <div><strong>Roll Number:</strong> {student.rollNo}</div>
                <div><strong>Advisory Standing:</strong> {riskReport.levelDetails.badge}</div>
                <div><strong>Overall Attendance:</strong> {student.attendance.overallPercentage.toFixed(1)}%</div>
                <div><strong>Current CGPA:</strong> {student.currentCGPA}</div>
                <div><strong>Target CGPA:</strong> {student.targetCGPA || 8.5}</div>
              </div>

              {/* Subject Breakdown Table */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Course Performance Breakdown</h4>
                <table className="custom-table" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th>Course Subject</th>
                      <th>Code</th>
                      <th>Class Attendance</th>
                      <th>Continuous Marks</th>
                      <th>Advisory Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map(s => {
                      const att = student.attendance.bySubject[s.id]?.percentage || 100;
                      const subRisk = riskReport.subjectRisks?.[s.id];
                      return (
                        <tr key={s.id}>
                          <td><strong>{s.name}</strong></td>
                          <td><code>{s.code}</code></td>
                          <td style={{ color: att < 65 ? 'var(--color-risk-high)' : att < 75 ? 'var(--color-risk-medium)' : 'var(--color-text)', fontWeight: 700 }}>
                            {att.toFixed(1)}%
                          </td>
                          <td style={{ fontWeight: 600 }}>{subRisk?.scorePercentage !== null ? `${subRisk.scorePercentage}%` : 'Pending'}</td>
                          <td>
                            <span className={`badge badge-${subRisk?.level?.toLowerCase() || 'low'}`} style={{ fontSize: '0.8rem' }}>
                              {subRisk?.level || 'LOW'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Advisory Reasons */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '10px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Academic Progress Notes:</h4>
                <ul style={{ margin: '0 0 0 20px', fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {riskReport.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Mentorship Actions */}
              <div style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)', padding: '18px 22px', borderRadius: 'var(--radius-md)', fontSize: '0.92rem' }}>
                <strong style={{ color: 'var(--color-maroon)' }}>Recommended Mentorship Guidance:</strong>
                <p style={{ margin: '6px 0 0', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {riskReport.level === 'HIGH'
                    ? 'Schedule a 1-on-1 counseling session with your assigned faculty mentor. Attend weekly remedial doubt-clearing sessions in Operating Systems (CS502) and maintain regular class attendance.'
                    : 'Maintain current consistent study pace. Complete remaining weekly topic practice questions and review recursion concepts.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Switch to a Student persona from the top navigation to preview and export their complete individual academic diagnostic report.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          
          <button className="btn btn-secondary" onClick={handleDownloadCSV} disabled={!student}>
            <Download size={17} />
            <span>Export CSV</span>
          </button>

          <button className="btn btn-primary" onClick={handlePrint} disabled={!student}>
            <Printer size={17} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
