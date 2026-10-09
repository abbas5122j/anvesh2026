/**
 * Risk Detection Engine & Predictive Analytics
 * Multi-factor weighted score with rule-based overrides, explainability,
 * confidence intervals, and what-if simulation.
 */

export function calculateStudentRisk(student, subjects, configWeights = {}) {
  const {
    attendanceWeight = 0.35,
    marksWeight = 0.35,
    trendWeight = 0.15,
    submissionWeight = 0.10,
    topicWeaknessWeight = 0.05,
    attendanceHardThreshold = 65.0,
    subjectAttendanceHardThreshold = 55.0,
    passingMarksCutoff = 40.0
  } = configWeights;

  const reasons = [];
  const ruleOverrides = [];
  let totalDataPoints = 0;

  // 1. Attendance Analysis
  const overallAttendance = student.attendance?.overallPercentage ?? 100;
  const attendanceRiskScore = Math.max(0, Math.min(100, 100 - overallAttendance));
  
  if (overallAttendance < 75) {
    reasons.push(`Overall attendance is ${overallAttendance.toFixed(1)}%, below the university mandate of 75.0%`);
  }

  // Check subject-level attendance
  const subjectAttendanceList = student.attendance?.bySubject || {};
  let criticalSubjectAttendanceCount = 0;

  Object.entries(subjectAttendanceList).forEach(([subId, att]) => {
    const subObj = subjects.find(s => s.id === subId) || { name: subId };
    if (att.percentage < subjectAttendanceHardThreshold) {
      criticalSubjectAttendanceCount++;
      reasons.push(`Critical low attendance in ${subObj.name} (${att.percentage.toFixed(1)}% < ${subjectAttendanceHardThreshold}%)`);
    } else if (att.percentage < 75) {
      reasons.push(`Attendance in ${subObj.name} is ${att.percentage.toFixed(1)}% (requires catch-up)`);
    }
  });

  // 2. Academic Marks Analysis
  let totalWeightedScore = 0;
  let totalAssessmentsCount = 0;
  let failingSubjectsCount = 0;
  const subjectRisks = {};
  const scoresBySubject = {};

  subjects.forEach(sub => {
    const marksList = student.academicMarks?.[sub.id] || [];
    totalAssessmentsCount += marksList.length;
    totalDataPoints += marksList.length;

    if (marksList.length > 0) {
      let subEarned = 0;
      let subMax = 0;
      marksList.forEach(m => {
        subEarned += m.marks;
        subMax += m.maxMarks;
      });
      const subPercentage = subMax > 0 ? (subEarned / subMax) * 100 : 70;
      scoresBySubject[sub.id] = subPercentage;

      if (subPercentage < passingMarksCutoff) {
        failingSubjectsCount++;
        reasons.push(`Academic performance in ${sub.name} is below passing threshold (${subPercentage.toFixed(1)}% < ${passingMarksCutoff}%)`);
      }

      // Subject-level risk (0-100)
      const subAtt = subjectAttendanceList[sub.id]?.percentage ?? 100;
      const subRiskScore = Math.round((100 - subPercentage) * 0.6 + (100 - subAtt) * 0.4);
      subjectRisks[sub.id] = {
        subjectId: sub.id,
        name: sub.name,
        scorePercentage: Math.round(subPercentage),
        attendancePercentage: Math.round(subAtt),
        riskScore: subRiskScore,
        level: subRiskScore > 55 ? 'HIGH' : subRiskScore > 30 ? 'MEDIUM' : 'LOW'
      };

      totalWeightedScore += subPercentage;
    } else {
      scoresBySubject[sub.id] = null;
      subjectRisks[sub.id] = {
        subjectId: sub.id,
        name: sub.name,
        scorePercentage: null,
        attendancePercentage: subjectAttendanceList[sub.id]?.percentage ?? null,
        riskScore: 25,
        level: 'LOW'
      };
    }
  });

  const validSubjectsCount = Object.values(scoresBySubject).filter(v => v !== null).length;
  const overallMarksAverage = validSubjectsCount > 0 ? totalWeightedScore / validSubjectsCount : 75;
  const marksRiskScore = Math.max(0, Math.min(100, 100 - overallMarksAverage));

  // 3. Trend Trajectory Analysis
  let trendSlope = 0;
  let trendComparisons = 0;

  subjects.forEach(sub => {
    const marksList = student.academicMarks?.[sub.id] || [];
    if (marksList.length >= 2) {
      const first = (marksList[0].marks / marksList[0].maxMarks) * 100;
      const latest = (marksList[marksList.length - 1].marks / marksList[marksList.length - 1].maxMarks) * 100;
      trendSlope += (latest - first);
      trendComparisons++;
    }
  });

  const avgTrendDelta = trendComparisons > 0 ? trendSlope / trendComparisons : 0;
  // If scores fell by 15%, trendRisk increases
  const trendRiskScore = Math.max(0, Math.min(100, 50 - (avgTrendDelta * 1.5)));

  if (avgTrendDelta < -10) {
    reasons.push(`Declining trajectory across recent assessments (${avgTrendDelta.toFixed(1)}% decline between internal evaluations)`);
  } else if (avgTrendDelta > 10) {
    reasons.push(`Positive improvement trajectory (+${avgTrendDelta.toFixed(1)}% improvement in recent tests)`);
  }

  // 4. Submission Behavior
  const submissions = student.submissions || { assigned: 0, submitted: 0, late: 0, missed: 0 };
  const missedCount = submissions.missed || 0;
  const lateCount = submissions.late || 0;
  const submissionRiskScore = Math.min(100, (missedCount * 30) + (lateCount * 12));

  if (missedCount > 0) {
    reasons.push(`${missedCount} unsubmitted coursework assignment(s) impacting continuous assessment marks`);
  }
  if (lateCount > 1) {
    reasons.push(`${lateCount} delayed assignment submissions recorded`);
  }

  // 5. Topic Weakness Factor
  const weakTopicsCount = (student.knownWeakTopics || []).length;
  const topicRiskScore = Math.min(100, weakTopicsCount * 25);
  if (weakTopicsCount >= 2) {
    reasons.push(`${weakTopicsCount} prerequisite core topics flagged as learning roadblocks (${(student.knownWeakTopics || []).slice(0, 2).join(', ')})`);
  }

  // Multi-factor weighted score calculation (0 - 100)
  const weightedRisk = (
    (attendanceRiskScore * attendanceWeight) +
    (marksRiskScore * marksWeight) +
    (trendRiskScore * trendWeight) +
    (submissionRiskScore * submissionWeight) +
    (topicRiskScore * topicWeaknessWeight)
  );

  let finalRiskScore = Math.round(weightedRisk);

  // Confidence & Insufficient Data Handling
  const totalClassesConducted = student.attendance?.totalConducted || 0;
  const isInsufficientData = totalAssessmentsCount < 2 || totalClassesConducted < 15;
  const confidence = isInsufficientData ? 'Low (Needs more assessments)' : totalAssessmentsCount < 5 ? 'Moderate' : 'High';

  if (isInsufficientData) {
    reasons.unshift(`Evaluating on early data points: only ${totalAssessmentsCount} assessment(s) recorded to date`);
  }

  // Hard Rule-Based Overrides
  let hasHardOverride = false;

  // Rule 1: Attendance below hard threshold forces HIGH
  if (overallAttendance < attendanceHardThreshold) {
    hasHardOverride = true;
    ruleOverrides.push({
      rule: 'CRITICAL_ATTENDANCE_OVERRIDE',
      description: `Overall attendance (${overallAttendance.toFixed(1)}%) is below mandatory threshold ${attendanceHardThreshold}%`,
      forcedLevel: 'HIGH'
    });
  }

  // Rule 2: Single subject attendance critically low
  if (criticalSubjectAttendanceCount > 0) {
    hasHardOverride = true;
    ruleOverrides.push({
      rule: 'CRITICAL_SUBJECT_ATTENDANCE_OVERRIDE',
      description: `${criticalSubjectAttendanceCount} subject(s) have attendance below safety threshold ${subjectAttendanceHardThreshold}%`,
      forcedLevel: 'HIGH'
    });
  }

  // Rule 3: Failing in 2 or more subjects forces HIGH
  if (failingSubjectsCount >= 2) {
    hasHardOverride = true;
    ruleOverrides.push({
      rule: 'MULTIPLE_SUBJECT_FAILURE_OVERRIDE',
      description: `Student is failing ${failingSubjectsCount} subjects (< ${passingMarksCutoff}% cutoff)`,
      forcedLevel: 'HIGH'
    });
  }

  // Determine Level
  let level = 'LOW';
  if (hasHardOverride) {
    level = 'HIGH';
    finalRiskScore = Math.max(finalRiskScore, 75);
  } else if (finalRiskScore >= 55) {
    level = 'HIGH';
  } else if (finalRiskScore >= 32) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  // Supportive, non-punitive UI labels aligned with style.md
  const levelLabels = {
    LOW: {
      text: 'On Track (Minimal Risk)',
      badge: 'On Track',
      color: '#367A59',
      bg: 'rgba(54, 122, 89, 0.10)',
      border: 'rgba(54, 122, 89, 0.28)',
      tone: 'Positive'
    },
    MEDIUM: {
      text: 'Could Use Extra Support',
      badge: 'Extra Support Suggested',
      color: '#A56A16',
      bg: 'rgba(165, 106, 22, 0.10)',
      border: 'rgba(165, 106, 22, 0.28)',
      tone: 'Supportive'
    },
    HIGH: {
      text: 'Priority Academic Guidance Needed',
      badge: 'Priority Guidance',
      color: '#A33A35',
      bg: 'rgba(163, 58, 53, 0.10)',
      border: 'rgba(163, 58, 53, 0.28)',
      tone: 'Guidance & Outreach'
    }
  };

  // Historical simulation trajectory (4 checkpoints)
  const history = [
    { checkpoint: 'Week 2', score: Math.max(10, finalRiskScore - 12), level: finalRiskScore - 12 > 55 ? 'HIGH' : finalRiskScore - 12 > 30 ? 'MEDIUM' : 'LOW' },
    { checkpoint: 'Week 4', score: Math.max(15, finalRiskScore - 5), level: finalRiskScore - 5 > 55 ? 'HIGH' : finalRiskScore - 5 > 30 ? 'MEDIUM' : 'LOW' },
    { checkpoint: 'Week 6', score: Math.max(20, finalRiskScore + (avgTrendDelta < 0 ? 8 : -6)), level: finalRiskScore + (avgTrendDelta < 0 ? 8 : -6) > 55 ? 'HIGH' : 'MEDIUM' },
    { checkpoint: 'Current (Week 8)', score: finalRiskScore, level }
  ];

  return {
    studentId: student.id,
    riskScore: finalRiskScore,
    level,
    levelDetails: levelLabels[level],
    hasHardOverride,
    ruleOverrides,
    reasons: reasons.length > 0 ? reasons : ['Consistent attendance and stable academic performance recorded across all modules.'],
    confidence,
    isInsufficientData,
    overallAttendance,
    overallMarksAverage: Math.round(overallMarksAverage),
    trendDelta: avgTrendDelta,
    factors: {
      attendanceRiskScore: Math.round(attendanceRiskScore),
      marksRiskScore: Math.round(marksRiskScore),
      trendRiskScore: Math.round(trendRiskScore),
      submissionRiskScore: Math.round(submissionRiskScore),
      topicRiskScore: Math.round(topicRiskScore)
    },
    subjectRisks,
    history
  };
}

/**
 * Attendance Calculator:
 * Calculates how many consecutive upcoming classes a student must attend to reach target % (e.g. 75%),
 * or how many classes they can safely skip without falling below target.
 */
export function calculateAttendanceBuffer(conducted, attended, targetPercent = 75) {
  const currentPercent = conducted > 0 ? (attended / conducted) * 100 : 100;
  
  if (currentPercent < targetPercent) {
    // Formula: (attended + X) / (conducted + X) = target / 100
    // 100*attended + 100*X = target*conducted + target*X
    // X * (100 - target) = target*conducted - 100*attended
    const targetFraction = targetPercent / 100;
    const numerator = (targetFraction * conducted) - attended;
    const denominator = 1 - targetFraction;
    const classesNeeded = Math.ceil(numerator / denominator);

    return {
      status: 'DEFICIT',
      currentPercent: Number(currentPercent.toFixed(1)),
      targetPercent,
      classesNeeded: Math.max(1, classesNeeded),
      message: `Attend the next ${Math.max(1, classesNeeded)} consecutive class(es) to attain ${targetPercent}% attendance.`
    };
  } else {
    // Current is above or equal target: how many can be missed?
    // attended / (conducted + Y) = target / 100
    // 100 * attended >= target * (conducted + Y)
    // Y <= (100*attended - target*conducted) / target
    const targetFraction = targetPercent / 100;
    const canMiss = Math.floor((attended - (targetFraction * conducted)) / targetFraction);

    return {
      status: 'SAFE',
      currentPercent: Number(currentPercent.toFixed(1)),
      targetPercent,
      canMiss: Math.max(0, canMiss),
      message: canMiss > 0
        ? `You can safely miss up to ${canMiss} upcoming class(es) while staying at or above ${targetPercent}%.`
        : `You are exactly at ${targetPercent}%. Attend the next class to maintain compliance.`
    };
  }
}

/**
 * Performance Prediction Engine:
 * Forecasts end-semester CGPA and Percentage with confidence bounds.
 */
export function predictEndSemesterPerformance(student, riskReport) {
  const currentCGPA = student.currentCGPA || 7.0;
  const marksAvg = riskReport.overallMarksAverage || 70;
  const trend = riskReport.trendDelta || 0;
  const attendanceRatio = (student.attendance?.overallPercentage || 75) / 100;

  // Internal component weight (40%) + Projected External Exam (60%)
  // External exam correlation with internal marks + engagement trend
  const projectedExternalMarks = Math.max(35, Math.min(98, marksAvg + (trend * 0.4) + (attendanceRatio > 0.85 ? 4 : attendanceRatio < 0.65 ? -8 : 0)));
  const combinedEstimatedPercentage = Math.round((marksAvg * 0.4) + (projectedExternalMarks * 0.6));
  
  // Convert percentage to 10-point CGPA scale approximation: (Percentage / 10) + adjustment
  const projectedCGPA = Math.min(10, Math.max(4.0, Number((combinedEstimatedPercentage / 9.5).toFixed(2))));
  
  // Bounds
  const margin = riskReport.isInsufficientData ? 0.8 : 0.35;
  const lowerCGPA = Math.max(4.0, Number((projectedCGPA - margin).toFixed(2)));
  const upperCGPA = Math.min(10.0, Number((projectedCGPA + margin).toFixed(2)));

  const targetDiff = (student.targetCGPA || 8.0) - projectedCGPA;

  return {
    projectedPercentage: combinedEstimatedPercentage,
    projectedCGPA,
    lowerCGPA,
    upperCGPA,
    targetCGPA: student.targetCGPA || 8.0,
    targetDiff: Number(targetDiff.toFixed(2)),
    status: targetDiff <= 0 ? 'ON_TRACK' : targetDiff <= 0.6 ? 'ACHIEVABLE_WITH_EFFORT' : 'REQUIRES_REMEDIAL_ACTION'
  };
}

/**
 * What-If Sandbox Simulator:
 * Given hypothetical user changes, recalculates risk score and projection.
 */
export function simulateWhatIfScenario(student, subjects, configWeights, adjustments) {
  const {
    additionalClassesAttended = 0,
    additionalClassesTotal = 0,
    projectedNextExamScore = 75,
    completeMissedAssignments = false
  } = adjustments;

  // Clone student data shallowly with modifications
  const simStudent = JSON.parse(JSON.stringify(student));

  if (additionalClassesTotal > 0) {
    simStudent.attendance.totalConducted += additionalClassesTotal;
    simStudent.attendance.totalAttended += additionalClassesAttended;
    simStudent.attendance.overallPercentage = (simStudent.attendance.totalAttended / simStudent.attendance.totalConducted) * 100;
  }

  if (completeMissedAssignments) {
    simStudent.submissions.submitted += simStudent.submissions.missed;
    simStudent.submissions.onTime += simStudent.submissions.missed;
    simStudent.submissions.missed = 0;
  }

  // Inject hypothetical exam score into all subjects
  if (projectedNextExamScore !== undefined) {
    subjects.forEach(sub => {
      simStudent.academicMarks[sub.id] = simStudent.academicMarks[sub.id] || [];
      simStudent.academicMarks[sub.id].push({
        assessment: 'Projected Next Exam',
        marks: projectedNextExamScore,
        maxMarks: 100,
        weight: 30,
        date: '2026-11-15'
      });
    });
  }

  const simulatedRisk = calculateStudentRisk(simStudent, subjects, configWeights);
  const simulatedPrediction = predictEndSemesterPerformance(simStudent, simulatedRisk);

  return {
    simulatedRisk,
    simulatedPrediction
  };
}
