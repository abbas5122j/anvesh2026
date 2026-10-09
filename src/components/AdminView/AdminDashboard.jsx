import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Sliders, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Save, 
  Layers,
  History,
  Plus
} from 'lucide-react';

export function AdminDashboard() {
  const { 
    departments, 
    subjects, 
    students, 
    riskWeights, 
    setRiskWeights, 
    recalculateAllRiskScores, 
    bulkUploadData, 
    addStudentMarks, 
    updateStudentAttendance, 
    auditLogs 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'weights', 'data_entry', 'bulk_upload', 'audit'

  // Weights configuration local form state
  const [weightsForm, setWeightsForm] = useState(riskWeights);

  // Manual Marks entry form state
  const [markStudentId, setMarkStudentId] = useState(students[0]?.id || '');
  const [markSubjectId, setMarkSubjectId] = useState(subjects[0]?.id || '');
  const [assessmentName, setAssessmentName] = useState('Internal Exam 2');
  const [marksValue, setMarksValue] = useState(42);
  const [maxMarksValue, setMaxMarksValue] = useState(50);

  // Manual Attendance entry form state
  const [attStudentId, setAttStudentId] = useState(students[0]?.id || '');
  const [attSubjectId, setAttSubjectId] = useState(subjects[0]?.id || '');
  const [conductedDelta, setConductedDelta] = useState(4);
  const [attendedDelta, setAttendedDelta] = useState(4);

  // Bulk Upload state
  const [uploadType, setUploadType] = useState('marks'); // 'marks', 'attendance'
  const [csvPreviewRows, setCsvPreviewRows] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');

  // Save weights & recalculate
  const handleSaveWeights = (e) => {
    e.preventDefault();
    setRiskWeights(weightsForm);
    const res = recalculateAllRiskScores();
    alert(`Risk weights updated and recalculated across all ${res.count} students!`);
  };

  // Download Sample CSV Templates
  const handleDownloadTemplate = (type) => {
    let csvContent = '';
    let filename = '';

    if (type === 'marks') {
      csvContent = 'rollNo,subjectCode,assessmentName,marks,maxMarks,weight,date\n' +
                   '23CS101,CS501,Unit Test 2,22,25,15,2026-10-09\n' +
                   '23CS102,CS501,Unit Test 2,24,25,15,2026-10-09\n' +
                   '23CS103,CS501,Unit Test 2,14,25,15,2026-10-09\n';
      filename = 'AcademiPulse_Marks_Template.csv';
    } else {
      csvContent = 'rollNo,subjectCode,conducted,attended\n' +
                   '23CS101,CS502,12,7\n' +
                   '23CS102,CS502,12,11\n' +
                   '23CS103,CS502,12,5\n';
      filename = 'AcademiPulse_Attendance_Template.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process selected CSV file with validation preview
  const handleCsvFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        alert('File is empty or contains no data rows.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const parsedRows = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const rowObj = {};
        headers.forEach((h, hIdx) => {
          rowObj[h] = parts[hIdx] || '';
        });
        parsedRows.push(rowObj);
      }

      setCsvPreviewRows(parsedRows);
      setUploadStatus(null);
    };
    reader.readAsText(file);
  };

  const handleCommitBulkUpload = () => {
    if (csvPreviewRows.length === 0) return;
    const result = bulkUploadData({
      type: uploadType,
      records: csvPreviewRows,
      filename: `Bulk_${uploadType}_Import.csv`
    });

    setUploadStatus(result);
    setCsvPreviewRows([]);
  };

  // Manual Marks Submit
  const handleManualMarksSubmit = (e) => {
    e.preventDefault();
    addStudentMarks(markStudentId, markSubjectId, {
      assessment: assessmentName,
      marks: Number(marksValue),
      maxMarks: Number(maxMarksValue),
      weight: 20,
      date: new Date().toISOString().split('T')[0]
    });
    alert('Marks record logged and student risk recalculated!');
  };

  // Manual Attendance Submit
  const handleManualAttendanceSubmit = (e) => {
    e.preventDefault();
    updateStudentAttendance(
      attStudentId, 
      attSubjectId, 
      Number(conductedDelta), 
      Number(attendedDelta)
    );
    alert('Attendance updated and risk index recomputed!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Subnav */}
      <div className="subnav-tabs" style={{ marginBottom: '24px' }}>
        <button 
          className={`subnav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Building2 size={17} />
          <span>Department Performance Overview</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'weights' ? 'active' : ''}`}
          onClick={() => setActiveTab('weights')}
        >
          <Sliders size={17} />
          <span>Academic Advisory Weights & Safeguards</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'data_entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('data_entry')}
        >
          <Plus size={17} />
          <span>Marks & Attendance Recording</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'bulk_upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk_upload')}
        >
          <FileSpreadsheet size={17} />
          <span>Batch CSV Records Upload</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <History size={17} />
          <span>Compliance & Records Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Department Overview & Cross-Dept Comparison */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Department Academic Standing & Resource Distribution</h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
              Comparative student retention rates, academic support allocations, and faculty mentorship assignments
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {departments.map((dept, idx) => {
              return (
                <div key={dept.id} className="glass-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.88rem' }}>{dept.code}</span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>HOD: {dept.hod}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', margin: '0 0 16px', color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{dept.name}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'var(--color-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Enrollment</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-maroon)' }}>{idx === 0 ? students.length * 12 : 140}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Average Department CGPA</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>{idx === 0 ? '7.8' : '7.5'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', borderTop: '1.5px solid var(--color-line)', paddingTop: '14px' }}>
                    <span>High Advisory Priority: <strong style={{ color: 'var(--color-risk-high)' }}>{idx === 0 ? '25%' : '14%'}</strong></span>
                    <span>Attendance Rate: <strong style={{ color: 'var(--color-maroon)' }}>{idx === 0 ? '79.4%' : '82.1%'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Configurable Risk Weights & Policy Thresholds */}
      {activeTab === 'weights' && (
        <form onSubmit={handleSaveWeights} className="glass-card" style={{ maxWidth: '820px', margin: '0 auto', width: '100%', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={22} color="var(--color-maroon)" />
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Academic Standing Weights & Policy Safeguards</h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '6px 0 0', lineHeight: 1.5 }}>
                Configure relative factor weightings and institutional minimum thresholds. Changes update student records across all classes.
              </p>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={recalculateAllRiskScores}>
              <RotateCcw size={16} />
              <span>Recalculate All Standings</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Attendance Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Attendance Rate Weight: <strong style={{ color: 'var(--color-maroon)' }}>{Math.round(weightsForm.attendanceWeight * 100)}%</strong></span>
                <span style={{ color: 'var(--color-text-muted)' }}>Institutional Default: 35%</span>
              </div>
              <input 
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={weightsForm.attendanceWeight}
                onChange={(e) => setWeightsForm({ ...weightsForm, attendanceWeight: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
              />
            </div>

            {/* Marks Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Continuous Marks Weight: <strong style={{ color: 'var(--color-maroon)' }}>{Math.round(weightsForm.marksWeight * 100)}%</strong></span>
                <span style={{ color: 'var(--color-text-muted)' }}>Institutional Default: 35%</span>
              </div>
              <input 
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={weightsForm.marksWeight}
                onChange={(e) => setWeightsForm({ ...weightsForm, marksWeight: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
              />
            </div>

            {/* Trend Slope Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Academic Trajectory Weight: <strong style={{ color: 'var(--color-maroon)' }}>{Math.round(weightsForm.trendWeight * 100)}%</strong></span>
                <span style={{ color: 'var(--color-text-muted)' }}>Institutional Default: 15%</span>
              </div>
              <input 
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weightsForm.trendWeight}
                onChange={(e) => setWeightsForm({ ...weightsForm, trendWeight: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
              />
            </div>

            {/* Institutional Rule: Attendance Cutoff */}
            <div style={{ borderTop: '1.5px solid var(--color-line)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Mandatory Institutional Standing Safeguards</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Minimum Attendance Requirement (%)</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={weightsForm.attendanceHardThreshold}
                    onChange={(e) => setWeightsForm({ ...weightsForm, attendanceHardThreshold: parseFloat(e.target.value) })}
                    min="50"
                    max="75"
                    style={{ fontSize: '1rem', padding: '10px 14px' }}
                  />
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Attendance below this percentage automatically designates High Advisory status.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Passing Subject Benchmark (%)</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={weightsForm.passingMarksCutoff}
                    onChange={(e) => setWeightsForm({ ...weightsForm, passingMarksCutoff: parseFloat(e.target.value) })}
                    min="35"
                    max="50"
                    style={{ fontSize: '1rem', padding: '10px 14px' }}
                  />
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Failing 2 or more subjects automatically flags student for advisory support.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Apply & Update Student Records</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Manual Marks & Attendance Entry */}
      {activeTab === 'data_entry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '28px' }}>
          {/* Manual Marks Card */}
          <form onSubmit={handleManualMarksSubmit} className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Record Assessment Marks</h3>
            
            <div className="form-group">
              <label className="form-label">Enrolled Student</label>
              <select className="form-select" value={markStudentId} onChange={(e) => setMarkStudentId(e.target.value)} style={{ fontSize: '0.96rem' }}>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course Subject</label>
              <select className="form-select" value={markSubjectId} onChange={(e) => setMarkSubjectId(e.target.value)} style={{ fontSize: '0.96rem' }}>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assessment Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={assessmentName} 
                onChange={(e) => setAssessmentName(e.target.value)} 
                required 
                style={{ fontSize: '0.96rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Marks Obtained</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={marksValue} 
                  onChange={(e) => setMarksValue(e.target.value)} 
                  required 
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Marks</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={maxMarksValue} 
                  onChange={(e) => setMaxMarksValue(e.target.value)} 
                  required 
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              <span>Save Marks & Update Student Standing</span>
            </button>
          </form>

          {/* Manual Attendance Recording Card */}
          <form onSubmit={handleManualAttendanceSubmit} className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Record Course Attendance</h3>

            <div className="form-group">
              <label className="form-label">Enrolled Student</label>
              <select className="form-select" value={attStudentId} onChange={(e) => setAttStudentId(e.target.value)} style={{ fontSize: '0.96rem' }}>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course Subject</label>
              <select className="form-select" value={attSubjectId} onChange={(e) => setAttSubjectId(e.target.value)} style={{ fontSize: '0.96rem' }}>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Additional Classes Held</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={conductedDelta} 
                  onChange={(e) => setConductedDelta(e.target.value)} 
                  min="1" 
                  required 
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Classes Attended</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={attendedDelta} 
                  onChange={(e) => setAttendedDelta(e.target.value)} 
                  min="0" 
                  required 
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              <span>Record Attendance & Update Standing</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Bulk CSV Upload with Validation Preview */}
      {activeTab === 'bulk_upload' && (
        <div className="glass-card" style={{ maxWidth: '880px', margin: '0 auto', width: '100%', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Batch Academic Records Import</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
                Import spreadsheet records with pre-upload format verification and official audit tracking
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownloadTemplate('marks')}
              >
                <Download size={16} />
                <span>Marks Template</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownloadTemplate('attendance')}
              >
                <Download size={16} />
                <span>Attendance Template</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.96rem', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="radio" 
                name="uploadType" 
                checked={uploadType === 'marks'} 
                onChange={() => setUploadType('marks')} 
                style={{ accentColor: 'var(--color-maroon)' }}
              />
              <span>Assessment Marks Spreadsheet (.csv)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.96rem', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="radio" 
                name="uploadType" 
                checked={uploadType === 'attendance'} 
                onChange={() => setUploadType('attendance')} 
                style={{ accentColor: 'var(--color-maroon)' }}
              />
              <span>Attendance Register Spreadsheet (.csv)</span>
            </label>
          </div>

          {/* Upload Area */}
          <div 
            style={{ 
              border: '2px dashed var(--color-maroon)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '40px 24px', 
              textAlign: 'center',
              background: 'var(--color-surface-muted)',
              marginBottom: '24px'
            }}
          >
            <Upload size={40} color="var(--color-maroon)" style={{ margin: '0 auto 14px' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>Select or Drop CSV file to import</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Must include roll number and subject code columns matching official institutional templates
            </div>

            <label className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex', cursor: 'pointer' }}>
              <span>Browse CSV File</span>
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvFileSelect} />
            </label>
          </div>

          {/* Validation Preview Table */}
          {csvPreviewRows.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>
                Verification Preview ({csvPreviewRows.length} rows detected)
              </h4>
              <div className="table-responsive" style={{ maxHeight: '260px' }}>
                <table className="custom-table" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      {Object.keys(csvPreviewRows[0]).map(k => (
                        <th key={k}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreviewRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {Object.values(row).map((val, vIdx) => (
                          <td key={vIdx}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button className="btn btn-secondary" onClick={() => setCsvPreviewRows([])}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCommitBulkUpload}>
                  <CheckCircle2 size={17} />
                  <span>Confirm & Import Records</span>
                </button>
              </div>
            </div>
          )}

          {/* Upload Result Status */}
          {uploadStatus && (
            <div 
              style={{ 
                background: uploadStatus.errors.length === 0 ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)', 
                border: `1.5px solid ${uploadStatus.errors.length === 0 ? 'var(--color-risk-low)' : 'var(--color-risk-high)'}`,
                padding: '20px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <strong style={{ fontSize: '1rem', color: uploadStatus.errors.length === 0 ? 'var(--color-risk-low)' : 'var(--color-risk-high)' }}>
                Import Status: {uploadStatus.updatedCount} records successfully imported.
              </strong>
              {uploadStatus.errors.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-risk-high)' }}>Validation Issues ({uploadStatus.errors.length}):</div>
                  <ul style={{ margin: '6px 0 0 20px', fontSize: '0.84rem', color: 'var(--color-risk-high)' }}>
                    {uploadStatus.errors.map((err, eIdx) => (
                      <li key={eIdx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Audit Trail Table */}
      {activeTab === 'audit' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Academic Records & Compliance Audit Trail</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
                Official immutable register of academic evaluations, attendance revisions, and mentorship sessions
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--color-text-muted)' }} />
              <input 
                type="text"
                placeholder="Search audit register..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', width: '260px', height: '42px', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.92rem' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Faculty / Administrator</th>
                  <th>Action</th>
                  <th>Audit Notes</th>
                  <th>Terminal ID</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs
                  .filter(l => l.actor.toLowerCase().includes(auditSearch.toLowerCase()) || 
                               l.action.toLowerCase().includes(auditSearch.toLowerCase()) || 
                               l.details.toLowerCase().includes(auditSearch.toLowerCase()))
                  .map(log => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-text)' }}>{log.actor}</strong>
                      </td>
                      <td>
                        <span className="badge badge-primary" style={{ fontSize: '0.82rem' }}>{log.action}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text)' }}>{log.details}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                        {log.ip}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
