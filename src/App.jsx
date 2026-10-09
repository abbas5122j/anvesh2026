import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { StudentAssessments } from './components/StudentView/StudentAssessments';
import { StudentChatbot } from './components/StudentView/StudentChatbot';
import { StudentTimetable } from './components/StudentView/StudentTimetable';
import { FacultyDashboard } from './components/FacultyView/FacultyDashboard';
import { FacultyAssessments } from './components/FacultyView/FacultyAssessments';
import { InterventionHistory } from './components/FacultyView/InterventionHistory';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { NotificationModal } from './components/NotificationModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportReportModal } from './components/ExportReportModal';

import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Calendar, 
  Users, 
  Layers, 
  HeartHandshake, 
  Sliders, 
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="glass-card" 
          style={{ 
            maxWidth: '620px', 
            margin: '40px auto', 
            padding: '36px 40px', 
            textAlign: 'center', 
            border: '2px solid var(--color-terracotta)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(191, 76, 60, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={32} color="var(--color-terracotta)" />
          </div>
          <h3 style={{ fontSize: '1.45rem', color: 'var(--color-maroon)', margin: '0 0 10px' }}>
            Academic View State Preserved
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '24px' }}>
            A transient display condition occurred in this component. Your academic records and authentication session remain safely preserved.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            <RotateCcw size={16} />
            <span>Reload View</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { currentRole, currentUser, switchUser } = useApp();

  // Active navigation tab per role
  const [studentTab, setStudentTab] = useState('overview'); // 'overview', 'assessments', 'chatbot', 'timetable'
  const [facultyTab, setFacultyTab] = useState('roster'); // 'roster', 'assessments', 'interventions'
  const [adminTab, setAdminTab] = useState('overview'); // managed in AdminDashboard

  // Modals state
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Chatbot topic jump state
  const [chatbotTopic, setChatbotTopic] = useState(null);

  const handleOpenChatbotWithTopic = (topic) => {
    setChatbotTopic(topic);
    setStudentTab('chatbot');
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar 
        onOpenNotifs={() => setNotifsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenExport={() => setExportOpen(true)}
      />

      <main className="main-content">
        <ErrorBoundary>
          {/* Role Sub-Navigation Tabs */}
        {currentRole === 'student' && (
          <div className="subnav-tabs">
            <button 
              className={`subnav-tab ${studentTab === 'overview' ? 'active' : ''}`}
              onClick={() => setStudentTab('overview')}
            >
              <LayoutDashboard size={17} />
              <span>Academic Overview & Trajectory</span>
            </button>

            <button 
              className={`subnav-tab ${studentTab === 'assessments' ? 'active' : ''}`}
              onClick={() => setStudentTab('assessments')}
            >
              <BookOpen size={17} />
              <span>Coursework Knowledge Checks</span>
            </button>

            <button 
              className={`subnav-tab ${studentTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => { setChatbotTopic(null); setStudentTab('chatbot'); }}
            >
              <Bot size={17} />
              <span>Textbook & Syllabus Reference</span>
            </button>

            <button 
              className={`subnav-tab ${studentTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setStudentTab('timetable')}
            >
              <Calendar size={17} />
              <span>Weekly Study & Revision Schedule</span>
            </button>
          </div>
        )}

        {currentRole === 'faculty' && (
          <div className="subnav-tabs">
            <button 
              className={`subnav-tab ${facultyTab === 'roster' ? 'active' : ''}`}
              onClick={() => setFacultyTab('roster')}
            >
              <Users size={17} />
              <span>Student Cohort & Standing Roster</span>
            </button>

            <button 
              className={`subnav-tab ${facultyTab === 'assessments' ? 'active' : ''}`}
              onClick={() => setFacultyTab('assessments')}
            >
              <Layers size={17} />
              <span>Assessment Studio & Rubric Evaluation</span>
            </button>

            <button 
              className={`subnav-tab ${facultyTab === 'interventions' ? 'active' : ''}`}
              onClick={() => setFacultyTab('interventions')}
            >
              <HeartHandshake size={17} />
              <span>Mentorship Sessions & Advisory Log</span>
            </button>
          </div>
        )}

        {currentRole === 'admin' && (
          <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={26} color="var(--color-maroon)" />
              <h2 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Academic Administration & Department Overview</h2>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.88rem' }}>Department Leadership Access</span>
          </div>
        )}

        {/* Dynamic Views Rendering based on Role & Tab */}
        {currentRole === 'student' && (
          <>
            {studentTab === 'overview' && (
              <StudentDashboard 
                onOpenWhatIf={() => setWhatIfOpen(true)}
                onNavigateTab={(tab) => setStudentTab(tab)}
              />
            )}
            {studentTab === 'assessments' && (
              <StudentAssessments 
                onOpenChatbotWithTopic={handleOpenChatbotWithTopic}
              />
            )}
            {studentTab === 'chatbot' && (
              <StudentChatbot 
                initialWeakTopic={chatbotTopic}
              />
            )}
            {studentTab === 'timetable' && (
              <StudentTimetable />
            )}
          </>
        )}

        {currentRole === 'faculty' && (
          <>
            {facultyTab === 'roster' && (
              <FacultyDashboard 
                onSelectStudent={(stuId) => {
                  switchUser('student', stuId);
                  setStudentTab('overview');
                }}
              />
            )}
            {facultyTab === 'assessments' && (
              <FacultyAssessments />
            )}
            {facultyTab === 'interventions' && (
              <InterventionHistory />
            )}
          </>
        )}

        {currentRole === 'admin' && (
          <AdminDashboard />
        )}
        </ErrorBoundary>
      </main>

      {/* Global Modals */}
      <WhatIfSimulatorModal 
        isOpen={whatIfOpen}
        onClose={() => setWhatIfOpen(false)}
      />

      <NotificationModal 
        isOpen={notifsOpen}
        onClose={() => setNotifsOpen(false)}
      />

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ExportReportModal 
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
