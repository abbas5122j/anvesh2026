/**
 * Personalized Weekly Study Timetable Generator
 * Allocates study hours weighted by student's subject risk, weak topics, and exam deadlines.
 */

export function generatePersonalizedTimetable(student, subjects, riskReport) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Rank subjects by risk score (highest risk gets more slots)
  const rankedSubjects = subjects.map(sub => {
    const subRisk = riskReport.subjectRisks?.[sub.id]?.riskScore || 30;
    const isWeak = (student.knownWeakTopics || []).some(w => w.toLowerCase().includes(sub.code.toLowerCase()) || w.toLowerCase().includes(sub.name.toLowerCase()));
    const weight = subRisk + (isWeak ? 25 : 0);
    return { ...sub, riskScore: subRisk, allocationWeight: weight };
  }).sort((a, b) => b.allocationWeight - a.allocationWeight);

  // Time slots for self-study (evening and weekend morning/evening)
  const weekdaySlots = [
    { time: '05:00 PM - 06:15 PM', type: 'High Priority Remedial' },
    { time: '06:30 PM - 07:45 PM', type: 'Core Theory & Practice' },
    { time: '08:30 PM - 09:30 PM', type: 'Revision & Quiz' }
  ];

  const weekendSlots = [
    { time: '10:00 AM - 11:30 AM', type: 'Deep Focus & Notes Review' },
    { time: '02:00 PM - 03:30 PM', type: 'Problem Solving & Coding' },
    { time: '05:00 PM - 06:30 PM', type: 'Weak Topic Remediation' },
    { time: '07:30 PM - 08:30 PM', type: 'Self Assessment Mock Test' }
  ];

  const schedule = {};
  let subjectPointer = 0;

  days.forEach(day => {
    const isWeekend = day === 'Saturday' || day === 'Sunday';
    const slots = isWeekend ? weekendSlots : weekdaySlots;

    schedule[day] = slots.map((slot, idx) => {
      // Pick subject with weighted bias toward top-ranked subjects
      let chosenSubject;
      if (idx === 0 || idx === 2) {
        // High priority slots go to top 2 risk subjects
        chosenSubject = rankedSubjects[idx % Math.min(2, rankedSubjects.length)];
      } else {
        chosenSubject = rankedSubjects[(subjectPointer++) % rankedSubjects.length];
      }

      const isHighPriority = (riskReport.subjectRisks?.[chosenSubject.id]?.riskScore || 0) > 50;

      return {
        id: `slot-${day}-${idx}`,
        time: slot.time,
        slotType: slot.type,
        subjectId: chosenSubject.id,
        subjectName: chosenSubject.name,
        subjectCode: chosenSubject.code,
        topicFocus: getSuggestedTopicFocus(chosenSubject.id, student),
        isHighPriority,
        completed: (day === 'Monday' || day === 'Tuesday') ? (idx === 0) : false,
        durationMinutes: isWeekend ? 90 : 70
      };
    });
  });

  return schedule;
}

function getSuggestedTopicFocus(subjectId, student) {
  const weakList = student.knownWeakTopics || [];
  if (subjectId === 'sub-os') {
    return weakList.find(w => w.includes('OS')) || 'Deadlock Avoidance & Banker Algorithm';
  }
  if (subjectId === 'sub-dsa') {
    return weakList.find(w => w.includes('DSA')) || 'Binary Search Trees & AVL Rotations';
  }
  if (subjectId === 'sub-dbms') {
    return 'Normalization (3NF & BCNF) & SQL Joins';
  }
  if (subjectId === 'sub-cn') {
    return 'TCP Sliding Window & Congestion Control';
  }
  return 'Core Syllabus Review & Practice Questions';
}
