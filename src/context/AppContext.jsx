import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_FACULTY,
  INITIAL_STUDENTS,
  INITIAL_ASSESSMENTS,
  INITIAL_RISK_WEIGHTS,
  INITIAL_INTERVENTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { calculateStudentRisk } from '../services/riskEngine';
import { generatePersonalizedTimetable } from '../services/timetableEngine';

const AppContext = createContext(null);

const STORAGE_KEY = 'academi_pulse_state_v1';

export function AppProvider({ children }) {
  // Load initial state or localStorage
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assessments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });
  const [interventions, setInterventions] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_interventions`);
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [riskWeights, setRiskWeights] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_weights`);
    return saved ? JSON.parse(saved) : INITIAL_RISK_WEIGHTS;
  });
  const [theme, setTheme] = useState(() => {
    localStorage.setItem('academi_pulse_theme', 'light');
    return 'light';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('academi_pulse_gemini_key') || '';
  });

  // Active Role and Persona
  // Roles: 'student', 'faculty', 'admin'
  const [currentRole, setCurrentRole] = useState('student');
  const [currentUserId, setCurrentUserId] = useState('stu-1'); // Default Rahul Sharma

  // Personalized timetables cache by studentId
  const [timetables, setTimetables] = useState({});

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assessments`, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_interventions`, JSON.stringify(interventions));
  }, [interventions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_weights`, JSON.stringify(riskWeights));
  }, [riskWeights]);

  useEffect(() => {
    localStorage.setItem('academi_pulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('academi_pulse_gemini_key', key);
  };

  // Add an audit log entry
  const logAuditAction = useCallback((action, details) => {
    const actorName = currentRole === 'student'
      ? `${students.find(s => s.id === currentUserId)?.name || 'Student'} (Student)`
      : currentRole === 'faculty'
      ? `${faculty.find(f => f.id === currentUserId)?.name || 'Faculty'} (Faculty)`
      : 'Dr. Vikramaditya Reddy (HOD Admin)';

    const newLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      action,
      details,
      ip: '192.168.1.100'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentRole, currentUserId, students, faculty]);

  // Current active user object
  const currentUser = useMemo(() => {
    if (currentRole === 'student') {
      return students.find(s => s.id === currentUserId) || students[0];
    } else if (currentRole === 'faculty') {
      return faculty.find(f => f.id === currentUserId) || faculty[0];
    } else {
      return faculty.find(f => f.role === 'admin') || faculty[2];
    }
  }, [currentRole, currentUserId, students, faculty]);

  // Compute risk reports for all students
  const riskReports = useMemo(() => {
    const map = {};
    students.forEach(stu => {
      map[stu.id] = calculateStudentRisk(stu, subjects, riskWeights);
    });
    return map;
  }, [students, subjects, riskWeights]);

  const getStudentRiskReport = useCallback((studentId) => {
    const stu = students.find(s => s.id === studentId);
    if (!stu) return null;
    return riskReports[studentId] || calculateStudentRisk(stu, subjects, riskWeights);
  }, [students, subjects, riskWeights, riskReports]);

  // Initialize or get student timetable
  const getStudentTimetable = useCallback((studentId) => {
    if (timetables[studentId]) return timetables[studentId];
    const stu = students.find(s => s.id === studentId);
    if (!stu) return {};
    const report = getStudentRiskReport(studentId);
    const table = generatePersonalizedTimetable(stu, subjects, report);
    setTimetables(prev => ({ ...prev, [studentId]: table }));
    return table;
  }, [timetables, students, subjects, getStudentRiskReport]);

  const toggleTimetableSlot = (studentId, day, slotId) => {
    setTimetables(prev => {
      const current = prev[studentId] || getStudentTimetable(studentId);
      const daySlots = (current[day] || []).map(s => {
        if (s.id === slotId) {
          return { ...s, completed: !s.completed };
        }
        return s;
      });
      return {
        ...prev,
        [studentId]: {
          ...current,
          [day]: daySlots
        }
      };
    });
  };

  const regenerateStudentTimetable = (studentId) => {
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;
    const report = getStudentRiskReport(studentId);
    const table = generatePersonalizedTimetable(stu, subjects, report);
    setTimetables(prev => ({ ...prev, [studentId]: table }));
    logAuditAction('Timetable Regenerated', `Generated updated risk-weighted timetable for ${stu.name}`);
  };

  // Switch persona/role
  const switchUser = (role, id) => {
    setCurrentRole(role);
    setCurrentUserId(id);
  };

  // Manual Marks Entry
  const addStudentMarks = (studentId, subjectId, newMark) => {
    setStudents(prev => prev.map(stu => {
      if (stu.id !== studentId) return stu;
      const currentList = stu.academicMarks[subjectId] || [];
      const updatedMarks = {
        ...stu.academicMarks,
        [subjectId]: [...currentList, newMark]
      };
      return { ...stu, academicMarks: updatedMarks };
    }));

    const stuObj = students.find(s => s.id === studentId);
    const subObj = subjects.find(s => s.id === subjectId);
    logAuditAction('Manual Marks Entry', `Added ${newMark.assessment} (${newMark.marks}/${newMark.maxMarks}) for ${stuObj?.name} in ${subObj?.name}`);

    // Check if new risk warrants notification
    setTimeout(() => {
      checkAndDispatchRiskAlerts(studentId);
    }, 100);
  };

  // Manual Attendance Update
  const updateStudentAttendance = (studentId, subjectId, conductedDelta, attendedDelta) => {
    setStudents(prev => prev.map(stu => {
      if (stu.id !== studentId) return stu;
      const subAtt = stu.attendance.bySubject[subjectId] || { conducted: 0, attended: 0, percentage: 100 };
      const newSubConducted = subAtt.conducted + conductedDelta;
      const newSubAttended = subAtt.attended + attendedDelta;
      const newSubPercentage = newSubConducted > 0 ? (newSubAttended / newSubConducted) * 100 : 100;

      const newTotalConducted = stu.attendance.totalConducted + conductedDelta;
      const newTotalAttended = stu.attendance.totalAttended + attendedDelta;
      const newOverallPercentage = newTotalConducted > 0 ? (newTotalAttended / newTotalConducted) * 100 : 100;

      return {
        ...stu,
        attendance: {
          totalConducted: newTotalConducted,
          totalAttended: newTotalAttended,
          overallPercentage: newOverallPercentage,
          bySubject: {
            ...stu.attendance.bySubject,
            [subjectId]: {
              conducted: newSubConducted,
              attended: newSubAttended,
              percentage: newSubPercentage
            }
          }
        }
      };
    }));

    const stuObj = students.find(s => s.id === studentId);
    const subObj = subjects.find(s => s.id === subjectId);
    logAuditAction('Attendance Recorded', `Updated attendance for ${stuObj?.name} in ${subObj?.name} (+${attendedDelta}/${conductedDelta} classes)`);

    setTimeout(() => {
      checkAndDispatchRiskAlerts(studentId);
    }, 100);
  };

  // Bulk Data Upload
  const bulkUploadData = ({ type, records, filename }) => {
    let updatedCount = 0;
    const errors = [];

    setStudents(prev => {
      const next = [...prev];
      records.forEach((row, idx) => {
        const student = next.find(s => s.rollNo.toLowerCase() === (row.rollNo || '').trim().toLowerCase());
        if (!student) {
          errors.push(`Row ${idx + 1}: Roll No "${row.rollNo}" not found`);
          return;
        }

        const subject = subjects.find(s => s.code.toLowerCase() === (row.subjectCode || '').trim().toLowerCase());
        if (!subject) {
          errors.push(`Row ${idx + 1}: Subject "${row.subjectCode}" not recognized`);
          return;
        }

        if (type === 'marks') {
          const marks = Number(row.marks);
          const maxMarks = Number(row.maxMarks) || 100;
          if (isNaN(marks) || marks < 0 || marks > maxMarks) {
            errors.push(`Row ${idx + 1}: Invalid marks ${row.marks}/${maxMarks}`);
            return;
          }

          const existingMarks = student.academicMarks[subject.id] || [];
          student.academicMarks[subject.id] = [
            ...existingMarks,
            {
              assessment: row.assessmentName || 'Bulk Imported Exam',
              marks,
              maxMarks,
              weight: Number(row.weight) || 20,
              date: row.date || new Date().toISOString().split('T')[0]
            }
          ];
          updatedCount++;
        } else if (type === 'attendance') {
          const attended = Number(row.attended);
          const conducted = Number(row.conducted);
          if (isNaN(attended) || isNaN(conducted) || attended > conducted) {
            errors.push(`Row ${idx + 1}: Invalid attendance ${row.attended}/${row.conducted}`);
            return;
          }

          student.attendance.bySubject[subject.id] = {
            conducted,
            attended,
            percentage: conducted > 0 ? (attended / conducted) * 100 : 100
          };

          // Recompute overall
          let totC = 0;
          let totA = 0;
          Object.values(student.attendance.bySubject).forEach(att => {
            totC += att.conducted;
            totA += att.attended;
          });
          student.attendance.totalConducted = totC;
          student.attendance.totalAttended = totA;
          student.attendance.overallPercentage = totC > 0 ? (totA / totC) * 100 : 100;
          updatedCount++;
        }
      });
      return next;
    });

    logAuditAction('Bulk CSV Upload', `Imported ${filename} (${updatedCount} valid records updated, ${errors.length} errors)`);

    return { updatedCount, errors };
  };

  // Trigger recalculation of all risk scores
  const recalculateAllRiskScores = () => {
    // Force re-render of computed reports
    logAuditAction('Risk Engine Full Recalculation', `Recalculated academic risk indices across ${students.length} students with updated weights`);
    return { success: true, count: students.length };
  };

  // Create Assessment
  const createAssessment = (assessmentData) => {
    const newAsmt = {
      ...assessmentData,
      id: `asmt-${Date.now()}`,
      attempts: []
    };
    setAssessments(prev => [newAsmt, ...prev]);
    logAuditAction('Assessment Created', `Created assessment "${newAsmt.title}" with ${newAsmt.questions?.length || 0} questions`);

    // Dispatch notification to enrolled students
    dispatchSimulatedNotification({
      recipientId: 'stu-1',
      type: 'assessment_due',
      title: `📝 New Test Available: ${newAsmt.title}`,
      message: `Duration: ${newAsmt.durationMinutes} mins. Due date: ${newAsmt.deadline}.`,
      channels: ['in_app']
    });

    return newAsmt;
  };

  // Submit Assessment Attempt
  const submitAssessmentAttempt = (assessmentId, studentId, answers, timeTakenSeconds, fallbackAsmt = null) => {
    let asmt = assessments.find(a => a.id === assessmentId) || fallbackAsmt;
    if (!asmt) return null;
    const stu = students.find(s => s.id === studentId);

    let totalPoints = 0;
    let earnedPoints = 0;
    let skippedCount = 0;
    const topicBreakdown = {};

    const questionsList = asmt.questions || [];
    questionsList.forEach(q => {
      totalPoints += 20; // 20 pts per question, 100 total
      const topic = q.topicTag || 'General';
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0, percentage: 0 };
      }
      topicBreakdown[topic].total += 1;

      const studentAns = answers[q.id];
      if (studentAns === undefined || studentAns === null || studentAns === '') {
        skippedCount++;
        return;
      }

      let isCorrect = false;
      if (q.type === 'mcq') {
        isCorrect = Number(studentAns) === q.correctOptionIndex;
      } else if (q.type === 'numeric') {
        isCorrect = Math.abs(Number(studentAns) - q.correctNumeric) <= (q.tolerance || 0);
      }

      if (isCorrect) {
        earnedPoints += 20;
        topicBreakdown[topic].correct += 1;
      }
    });

    Object.keys(topicBreakdown).forEach(t => {
      const b = topicBreakdown[t];
      b.percentage = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
    });

    const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    const attempt = {
      studentId,
      studentName: stu?.name || 'Student',
      score: scorePercent,
      totalPoints,
      completedAt: new Date().toISOString(),
      timeTakenSeconds,
      skippedCount,
      answers,
      topicBreakdown
    };

    // Update assessment attempts
    setAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      return {
        ...a,
        attempts: [...a.attempts.filter(att => att.studentId !== studentId), attempt]
      };
    }));

    // Automatically push score to marks engine
    const markEntry = {
      assessment: `Online Quiz: ${asmt.title.slice(0, 20)}...`,
      marks: scorePercent,
      maxMarks: 100,
      weight: 15,
      date: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const subMarks = s.academicMarks[asmt.subjectId] || [];
      return {
        ...s,
        academicMarks: {
          ...s.academicMarks,
          [asmt.subjectId]: [...subMarks, markEntry]
        }
      };
    }));

    logAuditAction('Assessment Completed', `${stu?.name} scored ${scorePercent}% on "${asmt.title}" (Score auto-synced to marks records)`);

    return attempt;
  };

  // Mentor Intervention Logging
  const logIntervention = (interventionData) => {
    const student = students.find(s => s.id === interventionData.studentId);
    const currentReport = getStudentRiskReport(interventionData.studentId);

    const newInt = {
      ...interventionData,
      id: `int-${Date.now()}`,
      studentName: student?.name || 'Student',
      mentorName: currentUser.name || 'Faculty Mentor',
      date: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      previousRisk: currentReport?.level || 'HIGH',
      currentRisk: currentReport?.level || 'HIGH'
    };

    setInterventions(prev => [newInt, ...prev]);
    logAuditAction('Mentor Intervention Logged', `Logged ${newInt.type} for ${newInt.studentName}: ${newInt.actionPlan}`);

    // Notify student
    dispatchSimulatedNotification({
      recipientId: interventionData.studentId,
      type: 'mentor_action',
      title: `🤝 Action Plan Created by ${currentUser.name}`,
      message: `Your mentor logged a guidance plan: "${newInt.actionPlan}". Follow-up scheduled for ${newInt.followUpDate}.`,
      channels: ['in_app', 'email']
    });

    return newInt;
  };

  const updateInterventionStatus = (interventionId, status, newRiskLevel) => {
    setInterventions(prev => prev.map(item => {
      if (item.id !== interventionId) return item;
      return {
        ...item,
        status,
        currentRisk: newRiskLevel || item.currentRisk
      };
    }));
    logAuditAction('Intervention Status Updated', `Updated intervention ${interventionId} to ${status}`);
  };

  // Notifications and Alert Fatigue Control
  const dispatchSimulatedNotification = ({ recipientId, type, title, message, channels = ['in_app'], severity = 'medium' }) => {
    // Alert fatigue check: do not flood student with more than 1 alert of same type within short period
    const existingRecent = notifications.find(n => n.recipientId === recipientId && n.type === type && !n.read);
    if (existingRecent && severity !== 'high') {
      return null; // Suppressed by alert-fatigue controller
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      recipientId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      severity,
      channels
    };

    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const checkAndDispatchRiskAlerts = (studentId) => {
    const report = getStudentRiskReport(studentId);
    const stu = students.find(s => s.id === studentId);
    if (!report || !stu) return;

    if (report.level === 'HIGH') {
      dispatchSimulatedNotification({
        recipientId: studentId,
        type: 'risk_escalation',
        title: 'Priority Academic Support Notice',
        message: `Our early warning engine noticed an alert in your progress (${report.reasons[0]}). Explore the AI Study Timetable or meet your mentor.`,
        severity: 'high',
        channels: ['in_app', 'email', 'sms']
      });

      // Notify mentor as well
      dispatchSimulatedNotification({
        recipientId: 'fac-1',
        type: 'mentor_alert',
        title: `🚨 High Risk Warning: ${stu.name} (${stu.rollNo})`,
        message: `${stu.name} triggered risk flags: ${report.reasons.join('; ')}. Remedial counseling advised.`,
        severity: 'high',
        channels: ['in_app', 'email']
      });
    }
  };

  const updateStudentTargetCGPA = (studentId, newTarget) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, targetCGPA: Number(newTarget) } : s));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_assessments`);
    localStorage.removeItem(`${STORAGE_KEY}_interventions`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
    localStorage.removeItem(`${STORAGE_KEY}_weights`);
    setStudents(INITIAL_STUDENTS);
    setAssessments(INITIAL_ASSESSMENTS);
    setInterventions(INITIAL_INTERVENTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRiskWeights(INITIAL_RISK_WEIGHTS);
    setTimetables({});
    logAuditAction('System Reset', 'Reset all system data to fresh factory mock seed state');
  };

  const value = {
    departments,
    classes,
    subjects,
    faculty,
    students,
    assessments,
    interventions,
    auditLogs,
    notifications,
    riskWeights,
    setRiskWeights,
    currentRole,
    currentUserId,
    currentUser,
    switchUser,
    theme,
    toggleTheme,
    apiKey,
    saveApiKey,
    riskReports,
    getStudentRiskReport,
    getStudentTimetable,
    toggleTimetableSlot,
    regenerateStudentTimetable,
    addStudentMarks,
    updateStudentAttendance,
    bulkUploadData,
    recalculateAllRiskScores,
    createAssessment,
    submitAssessmentAttempt,
    logIntervention,
    updateInterventionStatus,
    dispatchSimulatedNotification,
    markNotificationRead,
    updateStudentTargetCGPA,
    resetToDefaults,
    logAuditAction
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
