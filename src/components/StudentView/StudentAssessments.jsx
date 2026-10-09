import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  HelpCircle, 
  Flag, 
  Check, 
  Award,
  ChevronRight,
  TrendingDown,
  Sparkles,
  PlusCircle,
  Loader2,
  BookOpen,
  X,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAssignmentGroq, evaluateAssignmentGroq } from '../../services/groqService';

export function StudentAssessments({ onOpenChatbotWithTopic }) {
  const { 
    currentUser, 
    assessments, 
    subjects, 
    submitAssessmentAttempt,
    createAssessment
  } = useApp();

  const student = currentUser;
  const [activeTest, setActiveTest] = useState(null); // Assessment currently being taken
  const [reviewAttempt, setReviewAttempt] = useState(null); // Attempt being reviewed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Groq AI Evaluation & Custom Assignment Generator State
  const [groqFeedback, setGroqFeedback] = useState(null);
  const [isEvaluatingGroq, setIsEvaluatingGroq] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('CPU Scheduling & Deadlocks');
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [customAssessments, setCustomAssessments] = useState([]);

  // Timer countdown hook
  useEffect(() => {
    if (!activeTest || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, secondsRemaining]);

  const handleStartTest = (asmt) => {
    setActiveTest(asmt);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlaggedQuestions({});
    setGroqFeedback(null);
    setSecondsRemaining((asmt.durationMinutes || 15) * 60);
    setStartTime(Date.now());
  };

  const handleSelectOption = (qId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleNumericInput = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const toggleFlagQuestion = (qId) => {
    setFlaggedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async (isAuto = false) => {
    if (!activeTest) return;

    const timeTaken = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    let result = submitAssessmentAttempt(activeTest.id, student.id, answers, timeTaken, activeTest);
    
    if (!result) {
      const qList = activeTest.questions || [];
      let totalPts = qList.length * 20;
      let earnedPts = 0;
      let skipCnt = 0;
      const topicBk = {};
      qList.forEach(q => {
        const topic = q.topicTag || 'General';
        if (!topicBk[topic]) topicBk[topic] = { correct: 0, total: 0, percentage: 0 };
        topicBk[topic].total += 1;
        const stuAns = answers[q.id];
        if (stuAns === undefined || stuAns === null || stuAns === '') {
          skipCnt++;
          return;
        }
        const isCorr = q.type === 'mcq' ? Number(stuAns) === q.correctOptionIndex : Math.abs(Number(stuAns) - (q.correctNumeric || 0)) <= (q.tolerance || 0);
        if (isCorr) {
          earnedPts += 20;
          topicBk[topic].correct += 1;
        }
      });
      Object.keys(topicBk).forEach(t => {
        topicBk[t].percentage = topicBk[t].total > 0 ? Math.round((topicBk[t].correct / topicBk[t].total) * 100) : 0;
      });
      result = {
        studentId: student.id,
        studentName: student.name,
        score: totalPts > 0 ? Math.round((earnedPts / totalPts) * 100) : 70,
        totalPoints: totalPts,
        completedAt: new Date().toISOString(),
        timeTakenSeconds: timeTaken,
        skippedCount: skipCnt,
        answers: answers || {},
        topicBreakdown: topicBk
      };
    }

    setActiveTest(null);
    setReviewAttempt({ asmt: activeTest, result });

    if (result && result.score >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Call Groq evaluate_assignment (openai/gpt-oss-120b)
    setIsEvaluatingGroq(true);
    try {
      const groqFormattedQuestions = {
        topic: activeTest.title,
        questions: (activeTest.questions || []).map((q, idx) => ({
          question: q.text,
          correct_answer: q.type === 'mcq' 
            ? String.fromCharCode(65 + (q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0))
            : String(q.correctNumeric || '0'),
          explanation: q.explanation || ''
        }))
      };

      const groqFormattedAnswers = {};
      (activeTest.questions || []).forEach((q, idx) => {
        const studentAns = answers[q.id];
        if (studentAns !== undefined && studentAns !== '') {
          groqFormattedAnswers[idx + 1] = q.type === 'mcq' ? String.fromCharCode(65 + Number(studentAns)) : String(studentAns);
        }
      });

      const groqResult = await evaluateAssignmentGroq(groqFormattedQuestions, groqFormattedAnswers);
      if (groqResult && groqResult.feedback) {
        setGroqFeedback(groqResult.feedback);
      }
    } catch (err) {
      console.warn('Groq assessment evaluation fell back to local review:', err);
    } finally {
      setIsEvaluatingGroq(false);
    }
  };

  // Generate 15-question custom assignment with Groq
  const handleGenerateCustomAssignment = async (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGeneratingAssignment(true);
    try {
      const generated = await generateAssignmentGroq(customTopic.trim(), 15);
      if (generated && generated.questions && generated.questions.length > 0) {
        const newAsmt = {
          id: `asmt-groq-${Date.now()}`,
          subjectId: subjects[0]?.id || 'sub-os',
          title: `${generated.topic || customTopic} (15-Question Practice)`,
          description: `Custom practice assessment generated by Groq AI learning assistant`,
          durationMinutes: 20,
          passingScorePercent: 70,
          questions: generated.questions.map((q, qIdx) => ({
            id: `q-groq-${qIdx}`,
            type: 'mcq',
            text: q.question,
            options: [q.options?.A || 'Option A', q.options?.B || 'Option B', q.options?.C || 'Option C', q.options?.D || 'Option D'],
            correctOptionIndex: q.correct_answer === 'B' ? 1 : q.correct_answer === 'C' ? 2 : q.correct_answer === 'D' ? 3 : 0,
            explanation: q.explanation || '',
            topicTag: generated.topic || 'Practice Unit'
          })),
          attempts: []
        };

        if (createAssessment) {
          createAssessment(newAsmt);
        }
        setCustomAssessments(prev => [newAsmt, ...prev]);
        setIsModalOpen(false);
        handleStartTest(newAsmt);
      }
    } catch (err) {
      alert('Could not generate assignment with Groq right now. Please verify internet connection.');
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  // If student is currently taking a timed assessment
  if (activeTest) {
    const q = activeTest.questions[currentQuestionIndex];
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const isFlagged = flaggedQuestions[q.id];
    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Test Header with Live Timer */}
        <div 
          className="glass-card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '22px 32px',
            borderBottom: '2.5px solid var(--color-maroon)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-maroon)' }}>{activeTest.title}</h3>
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Question {currentQuestionIndex + 1} of {activeTest.questions.length} • {q.topicTag}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: secondsRemaining < 120 ? 'rgba(163, 58, 53, 0.15)' : 'var(--color-surface-muted)',
                border: `1.5px solid ${secondsRemaining < 120 ? 'var(--color-risk-high)' : 'var(--color-line)'}`,
                padding: '10px 20px',
                borderRadius: 'var(--radius-lg)',
                color: secondsRemaining < 120 ? 'var(--color-risk-high)' : 'var(--color-text)',
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              <Clock size={20} color={secondsRemaining < 120 ? 'var(--color-risk-high)' : 'var(--color-maroon)'} />
              <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => {
                if (window.confirm('Ready to submit your assessment? Scores will be instantly calculated.')) {
                  handleSubmitTest(false);
                }
              }}
            >
              <Check size={18} />
              <span>Submit Assessment</span>
            </button>
          </div>
        </div>

        {/* Question Area & Navigator */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
          {/* Main Question Card */}
          <div className="glass-card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <span className="badge badge-primary">
                {q.type === 'mcq' ? 'Multiple Choice' : 'Numeric Value'}
              </span>

              <button 
                className={`btn btn-sm ${isFlagged ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => toggleFlagQuestion(q.id)}
              >
                <Flag size={16} />
                <span>{isFlagged ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.65, marginBottom: '28px' }}>
              {q.text}
            </p>

            {/* Answer Options */}
            {q.type === 'mcq' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      style={{
                        padding: '18px 22px',
                        borderRadius: 'var(--radius-lg)',
                        background: isSelected ? 'rgba(141, 32, 31, 0.08)' : 'var(--color-surface-muted)',
                        border: `1.5px solid ${isSelected ? 'var(--color-maroon)' : 'var(--color-line)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div 
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--color-maroon)' : 'var(--color-text-muted)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--color-maroon)' : 'var(--color-text-muted)',
                          background: isSelected ? 'rgba(141, 32, 31, 0.12)' : 'transparent'
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span style={{ fontSize: '1.02rem', color: isSelected ? 'var(--color-maroon)' : 'var(--color-text)', fontWeight: isSelected ? 700 : 500 }}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <label className="form-label" style={{ fontSize: '1rem', marginBottom: '8px' }}>Enter numeric solution:</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '240px', fontSize: '1.2rem', padding: '12px 18px' }}
                  placeholder="e.g. 9"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleNumericInput(q.id, e.target.value)}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1.5px solid var(--color-line)' }}>
              <button 
                className="btn btn-secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Previous Question
              </button>

              <button 
                className="btn btn-primary"
                disabled={currentQuestionIndex === activeTest.questions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              >
                Next Question
              </button>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--color-maroon)' }}>Question Navigator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {activeTest.questions.map((ques, idx) => {
                const ans = answers[ques.id] !== undefined && answers[ques.id] !== '';
                const flg = flaggedQuestions[ques.id];
                const isCurr = idx === currentQuestionIndex;

                let bg = 'var(--color-surface-muted)';
                let color = 'var(--color-text-muted)';
                if (ans) { bg = 'var(--color-risk-low)'; color = '#FFFCF6'; }
                if (flg) { bg = 'var(--color-terracotta)'; color = '#FFFCF6'; }
                if (isCurr) { bg = 'var(--color-maroon)'; color = '#FFFCF6'; }

                return (
                  <button
                    key={ques.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    style={{
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      color: color,
                      border: isCurr ? '2px solid var(--color-maroon-deep)' : '1px solid var(--color-line)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-risk-low)' }} />
                <span>Answered ({Object.keys(answers).filter(k => answers[k] !== '').length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-terracotta)' }} />
                <span>Marked ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)' }} />
                <span>Unvisited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }  // Mistake Analysis & Detailed Review View
  if (reviewAttempt) {
    const { asmt, result: rawResult } = reviewAttempt;
    if (!asmt || !rawResult) {
      return (
        <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No completed assessment attempt available to display.</p>
          <button className="btn btn-secondary" onClick={() => setReviewAttempt(null)}>Return to List</button>
        </div>
      );
    }

    const result = {
      score: 0,
      completedAt: new Date().toISOString(),
      timeTakenSeconds: 60,
      answers: {},
      topicBreakdown: {},
      ...rawResult
    };
    const isPassing = (result.score || 0) >= (asmt.passingScorePercent || 60);

    const improvementSuggestions = Array.isArray(groqFeedback?.improvement_suggestions)
      ? groqFeedback.improvement_suggestions
      : (typeof groqFeedback?.improvement_suggestions === 'string' && groqFeedback.improvement_suggestions ? [groqFeedback.improvement_suggestions] : []);

    const topicsToRevise = Array.isArray(groqFeedback?.topics_to_revise)
      ? groqFeedback.topics_to_revise
      : (typeof groqFeedback?.topics_to_revise === 'string' && groqFeedback.topics_to_revise ? [groqFeedback.topics_to_revise] : []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Results Header Banner */}
        <div 
          className="glass-card" 
          style={{ 
            background: isPassing ? 'rgba(54, 122, 89, 0.08)' : 'rgba(163, 58, 53, 0.08)',
            borderColor: isPassing ? 'rgba(54, 122, 89, 0.35)' : 'rgba(163, 58, 53, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            padding: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div 
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: isPassing ? 'var(--color-risk-low)' : 'var(--color-risk-high)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#FFFCF6',
                boxShadow: '0 4px 14px rgba(52, 40, 36, 0.12)'
              }}
            >
              {isPassing ? <Award size={38} /> : <AlertCircle size={38} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '1.65rem', margin: 0, color: 'var(--color-maroon)' }}>{asmt.title}</h2>
                <span className={`badge badge-${isPassing ? 'low' : 'high'}`}>
                  {isPassing ? 'Satisfactory Standard' : 'Extra Review Recommended'}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: '6px 0 0' }}>
                Completed on {new Date(result.completedAt).toLocaleString()} • Assessment Duration: {Math.round(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: isPassing ? 'var(--color-risk-low)' : 'var(--color-risk-high)', lineHeight: 1 }}>
                {result.score}%
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Recorded in Academic Portfolio</div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => { setReviewAttempt(null); setGroqFeedback(null); }}
            >
              Back to Assessment List
            </button>
          </div>
        </div>

        {/* Groq AI Supportive Mentor Evaluation (from evaluate_assignment) */}
        {(isEvaluatingGroq || groqFeedback) && (
          <div 
            className="glass-card" 
            style={{ 
              background: 'rgba(141, 32, 31, 0.04)', 
              border: '1.5px solid var(--color-maroon)',
              padding: '28px 32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="var(--color-maroon)" />
                <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--color-maroon)' }}>
                  Supportive Mentor Assessment Analysis
                </h3>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.82rem' }}>Groq AI Mentorship</span>
            </div>

            {isEvaluatingGroq ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', color: 'var(--color-text-muted)' }}>
                <Loader2 size={20} className="spin" color="var(--color-maroon)" />
                <span style={{ fontSize: '0.95rem' }}>Analyzing question responses with Groq AI mentor...</span>
              </div>
            ) : groqFeedback ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {groqFeedback.performance_analysis && (
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Performance Analysis:
                    </div>
                    <p style={{ fontSize: '0.96rem', color: 'var(--color-text)', margin: '4px 0 0', lineHeight: 1.6 }}>
                      {groqFeedback.performance_analysis}
                    </p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {improvementSuggestions.length > 0 && (
                    <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-maroon)' }}>💡 Suggestions for Improvement:</strong>
                      <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                        {improvementSuggestions.map((sug, sIdx) => (
                          <li key={sIdx} style={{ marginBottom: '4px' }}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {topicsToRevise.length > 0 && (
                    <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-terracotta)' }}>📖 Key Topics to Revise:</strong>
                      <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                        {topicsToRevise.map((top, tIdx) => (
                          <li key={tIdx} style={{ marginBottom: '4px' }}>{top}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {groqFeedback.motivation && (
                  <div style={{ background: 'rgba(54, 122, 89, 0.08)', border: '1px solid var(--color-risk-low)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-risk-low)' }}>🌟 Mentor Encouragement:</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.55 }}>
                      {groqFeedback.motivation}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Topic-wise Breakdown & Weak Topic Identification */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>Topic Mastery Breakdown</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Syllabus competency diagnostics</p>
            </div>
            <span className="badge badge-neutral">Curriculum Alignment</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {Object.entries(result.topicBreakdown || {}).map(([topic, stat]) => {
              const isWeak = stat.percentage < 60;
              return (
                <div 
                  key={topic} 
                  style={{ 
                    background: 'var(--color-surface-muted)', 
                    border: `1.5px solid ${isWeak ? 'rgba(163, 58, 53, 0.35)' : 'var(--color-line)'}`, 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '20px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1.02rem', color: 'var(--color-maroon)' }}>{topic}</strong>
                    <span className={`badge badge-${isWeak ? 'high' : 'low'}`}>
                      {stat.percentage}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    {stat.correct} of {stat.total} question(s) answered correctly
                  </div>
                  {isWeak && (
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => onOpenChatbotWithTopic(topic)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <BookOpen size={16} />
                      <span>Review in Textbook Guide</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Question Review with Explanations */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.35rem', marginBottom: '22px', color: 'var(--color-maroon)' }}>Detailed Question Review & Explanations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {(asmt.questions || []).map((q, idx) => {
              const studentAns = result.answers?.[q.id];
              let isCorrect = false;
              if (q.type === 'mcq') {
                isCorrect = Number(studentAns) === q.correctOptionIndex;
              } else if (q.type === 'numeric') {
                isCorrect = Math.abs(Number(studentAns) - q.correctNumeric) <= (q.tolerance || 0);
              }
              const isSkipped = studentAns === undefined || studentAns === '';

              return (
                <div 
                  key={q.id}
                  style={{
                    background: 'var(--color-surface-muted)',
                    border: `1.5px solid ${isCorrect ? 'rgba(54, 122, 89, 0.35)' : 'rgba(163, 58, 53, 0.35)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-maroon)' }}>Q{idx + 1}.</span>
                      <span className="badge badge-neutral">{q.topicTag}</span>
                    </div>

                    <span className={`badge badge-${isCorrect ? 'low' : 'high'}`}>
                      {isCorrect ? 'Correct Solution (+20)' : isSkipped ? 'Unanswered (0)' : 'Review Needed (0)'}
                    </span>
                  </div>

                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', margin: '10px 0 18px', lineHeight: 1.6 }}>
                    {q.text}
                  </p>

                  {/* Options display */}
                  {q.type === 'mcq' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isStudentChoice = Number(studentAns) === oIdx;
                        const isCorrectChoice = q.correctOptionIndex === oIdx;

                        let rowBg = 'var(--color-surface)';
                        let border = 'var(--color-line)';
                        if (isCorrectChoice) {
                          rowBg = 'rgba(54, 122, 89, 0.12)';
                          border = 'var(--color-risk-low)';
                        } else if (isStudentChoice && !isCorrectChoice) {
                          rowBg = 'rgba(163, 58, 53, 0.12)';
                          border = 'var(--color-risk-high)';
                        }

                        return (
                          <div 
                            key={oIdx} 
                            style={{ 
                              padding: '12px 18px', 
                              borderRadius: 'var(--radius-md)', 
                              background: rowBg, 
                              border: `1.5px solid ${border}`,
                              fontSize: '0.98rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span><strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}</span>
                            {isCorrectChoice && <span style={{ color: 'var(--color-risk-low)', fontWeight: 700, fontSize: '0.88rem' }}>✓ Reference Answer</span>}
                            {isStudentChoice && !isCorrectChoice && <span style={{ color: 'var(--color-risk-high)', fontWeight: 700, fontSize: '0.88rem' }}>✗ Selected Response</span>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.98rem', margin: '10px 0 18px', background: 'var(--color-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
                      <div>Your Answer: <strong style={{ color: isCorrect ? 'var(--color-risk-low)' : 'var(--color-risk-high)' }}>{studentAns || 'None'}</strong></div>
                      <div style={{ marginTop: '4px' }}>Reference Answer: <strong style={{ color: 'var(--color-risk-low)' }}>{q.correctNumeric}</strong></div>
                    </div>
                  )}

                  {/* Educational Explanation */}
                  <div style={{ background: 'var(--color-surface)', padding: '16px 20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-maroon)', border: '1px solid var(--color-line)', borderLeftWidth: '4px', borderLeftColor: 'var(--color-maroon)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Curriculum Concept Note:
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Available & Completed Assessments List
  const allAssessments = [...customAssessments, ...assessments];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-maroon)' }}>Coursework Knowledge Checks & Practice Assessments</h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
            Faculty-aligned curriculum evaluations with immediate explanatory feedback and targeted topic guidance
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Sparkles size={18} />
          <span>Generate 15-Question Quiz (Groq AI)</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '26px' }}>
        {allAssessments.map(asmt => {
          const subject = subjects.find(s => s.id === asmt.subjectId);
          const pastAttempt = asmt.attempts.find(a => a.studentId === student.id);

          return (
            <div 
              key={asmt.id} 
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span className="badge badge-primary">{subject?.code || 'CS'}</span>
                  <span className={`badge badge-${pastAttempt ? 'low' : 'neutral'}`}>
                    {pastAttempt ? 'Completed' : 'Ready to Take'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: 'var(--color-maroon)' }}>{asmt.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                  {subject?.name} • Passing Standard: {asmt.passingScorePercent}%
                </p>

                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="var(--color-maroon)" />
                    <span>{asmt.durationMinutes} mins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="var(--color-maroon)" />
                    <span>{asmt.questions.length} questions</span>
                  </div>
                </div>

                {pastAttempt && (
                  <div style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Your Result:</span>
                      <strong style={{ fontSize: '1.35rem', color: pastAttempt.score >= asmt.passingScorePercent ? 'var(--color-risk-low)' : 'var(--color-risk-high)' }}>
                        {pastAttempt.score}%
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {pastAttempt ? (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setReviewAttempt({ asmt, result: pastAttempt })}
                    style={{ width: '100%' }}
                  >
                    <span>Review Detailed Solutions & Notes</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStartTest(asmt)}
                    style={{ width: '100%' }}
                  >
                    <Play size={18} />
                    <span>Begin Timed Assessment</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Groq Custom Assignment Generator Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={24} color="var(--color-maroon)" />
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-maroon)' }}>
                  Generate 15-Question Practice Quiz
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateCustomAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Syllabus Topic or Concept</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. CPU Scheduling & Deadlocks, Banker's Algorithm, Binary Search Trees..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  required
                  style={{ fontSize: '1rem', padding: '12px 16px' }}
                />
              </div>

              {/* Quick suggestions */}
              <div>
                <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Suggested Focus Areas:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {['CPU Scheduling & Deadlocks', 'Process Synchronization & Semaphores', 'Virtual Memory & Page Replacement', 'B-Trees & Indexing'].map(topic => (
                    <button
                      key={topic}
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setCustomTopic(topic)}
                      style={{ fontSize: '0.82rem', padding: '4px 10px', background: 'var(--color-surface-muted)' }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isGeneratingAssignment}>
                  {isGeneratingAssignment ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
                  <span>{isGeneratingAssignment ? 'Generating with Groq...' : 'Generate & Start 15-MCQ Quiz'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
