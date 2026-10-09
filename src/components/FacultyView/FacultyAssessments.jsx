import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateDescriptiveAnswer } from '../../services/ragChatbot';
import { generateAssignmentGroq } from '../../services/groqService';
import { 
  PlusCircle, 
  Sparkles, 
  Upload, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  Trash2, 
  Layers, 
  Check, 
  AlertTriangle,
  FileText,
  BarChart2
} from 'lucide-react';

export function FacultyAssessments() {
  const { subjects, assessments, createAssessment, students, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'descriptive_grading'
  const [isGeneratingGroq, setIsGeneratingGroq] = useState(false);
  
  // Test creation form state
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub-os');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [deadline, setDeadline] = useState('2026-11-01T23:59:00');
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState([
    {
      id: 'q-new-1',
      type: 'mcq',
      text: 'Which CPU scheduling algorithm is non-preemptive?',
      options: ['Round Robin', 'FCFS', 'SRTF', 'Preemptive Priority'],
      correctOptionIndex: 1,
      topicTag: 'CPU Scheduling',
      explanation: 'First-Come First-Served runs each process to completion of its CPU burst without preemption.',
      difficulty: 'easy'
    }
  ]);

  // Descriptive AI grading simulation state
  const [descriptiveQuestion, setDescriptiveQuestion] = useState('Explain Coffman conditions for deadlock and describe Banker algorithm safety check.');
  const [referenceKey, setReferenceKey] = useState('Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Banker algorithm maintains Available, Max, Allocation, Need matrices to ensure system stays in safe state where all processes can finish.');
  const [studentDescriptiveAnswer, setStudentDescriptiveAnswer] = useState('Deadlock requires 4 conditions: mutual exclusion, hold and wait, circular wait, and no preemption. Bankers algorithm uses Need = Max - Allocation to test if available resources can satisfy at least one process until finish.');
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [facultyConfirmedScore, setFacultyConfirmedScore] = useState(8);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Add question to new assessment
  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-new-${Date.now()}`,
        type: 'mcq',
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        topicTag: 'Core Concepts',
        explanation: '',
        difficulty: 'medium'
      }
    ]);
  };

  // AI-Assisted Question Generator (Feature 6)
  const handleAIGenerateQuestions = () => {
    const selectedSub = subjects.find(s => s.id === subjectId) || subjects[0];
    const generated = [
      {
        id: `q-ai-1-${Date.now()}`,
        type: 'mcq',
        text: `In ${selectedSub.name}, what condition is formally required to guarantee linear-time performance in average-case operations?`,
        options: ['Uniform hash distribution', 'Strict binary balance', 'Asymptotic recurrence dominance', 'Guaranteed disjoint partition'],
        correctOptionIndex: 0,
        topicTag: 'Complexity Analysis',
        explanation: 'Uniform hashing ensures independent probability distribution across all slots.',
        difficulty: 'medium'
      },
      {
        id: `q-ai-2-${Date.now()}`,
        type: 'numeric',
        text: 'A system has 12 tape drives and 3 processes competing. P0 requires max 10, P1 requires 4, P2 requires 9. If current allocations are 5, 2, and 2 respectively, how many free tape drives remain in Available?',
        correctNumeric: 3,
        tolerance: 0,
        topicTag: 'Banker Safety Allocation',
        explanation: 'Total = 12. Allocated = 5 + 2 + 2 = 9. Available = 12 - 9 = 3.',
        difficulty: 'hard'
      }
    ];

    setQuestions(prev => [...prev, ...generated]);
    alert(`AI generated 2 syllabus-aligned questions for ${selectedSub.name}! You can review and edit them below.`);
  };

  // Bulk CSV Question Upload Simulator
  const handleBulkUploadQuestions = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate CSV parsing
    const parsedQuestions = [
      {
        id: `q-csv-1-${Date.now()}`,
        type: 'mcq',
        text: 'Which memory allocation strategy produces the largest leftover hole?',
        options: ['First-fit', 'Best-fit', 'Worst-fit', 'Next-fit'],
        correctOptionIndex: 2,
        topicTag: 'Memory Management',
        explanation: 'Worst-fit allocates the largest hole so the remaining block might be useful.',
        difficulty: 'medium'
      }
    ];

    setQuestions(prev => [...prev, ...parsedQuestions]);
    alert(`Imported questions from ${file.name}!`);
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) {
      alert('Please enter a title and at least one question.');
      return;
    }

    createAssessment({
      title,
      subjectId,
      facultyId: currentUser.id,
      durationMinutes: Number(durationMinutes),
      deadline,
      status: 'published',
      passingScorePercent: Number(passingScore),
      questions
    });

    alert('Assessment successfully published to enrolled students!');
    setActiveTab('list');
    setTitle('');
  };

  // Run AI Descriptive Evaluation (Feature 12)
  const handleRunAiEvaluation = () => {
    const evalResult = evaluateDescriptiveAnswer({
      question: descriptiveQuestion,
      studentAnswer: studentDescriptiveAnswer,
      rubricKey: referenceKey
    });

    setAiEvaluation(evalResult);
    setFacultyConfirmedScore(evalResult.suggestedMarks);
    setIsConfirmed(false);
  };

  const handleConfirmAiScore = () => {
    setIsConfirmed(true);
    alert(`Confirmed final score of ${facultyConfirmedScore}/10 for Rahul Sharma (23CS101). Grade locked into database.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Subnav Tabs */}
      <div className="subnav-tabs">
        <button 
          className={`subnav-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <Layers size={18} />
          <span>Active Course Assessments & Analytics</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <PlusCircle size={18} />
          <span>Create Curriculum Assessment</span>
        </button>

        <button 
          className={`subnav-tab ${activeTab === 'descriptive_grading' ? 'active' : ''}`}
          onClick={() => setActiveTab('descriptive_grading')}
        >
          <FileText size={18} />
          <span>Descriptive Answer Rubric Evaluation</span>
        </button>
      </div>

      {/* Tab 1: Active Assessments & Analytics */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-maroon)' }}>Course Assessments & Cohort Mastery</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Track student submissions, auto-evaluated score distributions, and topic struggle points
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => setActiveTab('create')}>
              <PlusCircle size={18} />
              <span>Create New Assessment</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {assessments.map(asmt => {
              const sub = subjects.find(s => s.id === asmt.subjectId);
              const attemptsCount = asmt.attempts.length;
              const avgScore = attemptsCount > 0 
                ? Math.round(asmt.attempts.reduce((acc, a) => acc + a.score, 0) / attemptsCount) 
                : null;

              return (
                <div key={asmt.id} className="glass-card" style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span className="badge badge-primary">{sub?.code}</span>
                    <span className="badge badge-low">{asmt.status}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 8px', color: 'var(--color-maroon)' }}>{asmt.title}</h3>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
                    {sub?.name} • Due Date: {new Date(asmt.deadline).toLocaleDateString()}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'var(--color-surface-muted)', border: '1px solid var(--color-line)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Class Submissions</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '2px' }}>{attemptsCount} / {students.length}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Class Average</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: avgScore !== null && avgScore >= asmt.passingScorePercent ? 'var(--color-risk-low)' : 'var(--color-risk-high)', marginTop: '2px' }}>
                        {avgScore !== null ? `${avgScore}%` : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Question Difficulty Breakdown across cohort */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                      Question Difficulty Index (% Cohort Correct)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {asmt.questions.slice(0, 3).map((q, qIdx) => {
                        let correctCount = 0;
                        asmt.attempts.forEach(att => {
                          if (q.type === 'mcq' && Number(att.answers[q.id]) === q.correctOptionIndex) correctCount++;
                          if (q.type === 'numeric' && Number(att.answers[q.id]) === q.correctNumeric) correctCount++;
                        });
                        const pct = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 50;

                        return (
                          <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                            <span style={{ color: 'var(--color-text)' }}>Q{qIdx + 1}: {q.topicTag}</span>
                            <span style={{ fontWeight: 800, color: pct < 50 ? 'var(--color-risk-high)' : 'var(--color-risk-low)' }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}      {/* Tab 2: Assessment Creation Tool */}
      {activeTab === 'create' && (
        <form onSubmit={handleSaveAssessment} className="glass-card" style={{ maxWidth: '880px', margin: '0 auto', width: '100%', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-maroon)' }}>Create Course Assessment</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Compose MCQ and numeric problem sets manually, import from CSV, or generate from curriculum topics
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAIGenerateQuestions}
              >
                <Sparkles size={16} color="var(--color-maroon)" />
                <span>Generate Syllabus Questions</span>
              </button>

              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <Upload size={16} />
                <span>Upload CSV</span>
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleBulkUploadQuestions} />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Assessment Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Unit 3 Test: Deadlock Avoidance & Banker's Algorithm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Subject</label>
              <select className="form-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <input 
                type="number" 
                className="form-input" 
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                min="5"
                max="180"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Submission Deadline</label>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passing Standard (%)</label>
              <input 
                type="number" 
                className="form-input" 
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                min="30"
                max="90"
              />
            </div>
          </div>

          {/* Question List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-maroon)' }}>Configured Questions ({questions.length})</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    const topic = title.trim() || subjects.find(s => s.id === subjectId)?.name || 'Computer Science';
                    setIsGeneratingGroq(true);
                    try {
                      const res = await generateAssignmentGroq(topic, 5);
                      if (res && res.questions && res.questions.length > 0) {
                        const newQuestions = res.questions.map((q, idx) => ({
                          id: `q-gen-${Date.now()}-${idx}`,
                          type: 'mcq',
                          text: q.question,
                          options: [q.options?.A || 'Option A', q.options?.B || 'Option B', q.options?.C || 'Option C', q.options?.D || 'Option D'],
                          correctOptionIndex: q.correct_answer === 'B' ? 1 : q.correct_answer === 'C' ? 2 : q.correct_answer === 'D' ? 3 : 0,
                          explanation: q.explanation || '',
                          topicTag: topic
                        }));
                        setQuestions(prev => [...prev, ...newQuestions]);
                      }
                    } catch (e) {
                      alert('Could not generate questions with Groq. Please check connection.');
                    } finally {
                      setIsGeneratingGroq(false);
                    }
                  }}
                  disabled={isGeneratingGroq}
                >
                  <Sparkles size={16} />
                  <span>{isGeneratingGroq ? 'Generating with Groq...' : 'Generate Syllabus Questions (Groq AI)'}</span>
                </button>

                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddQuestion}>
                  <PlusCircle size={16} />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {questions.map((q, idx) => (
              <div 
                key={q.id}
                style={{ 
                  background: 'var(--color-surface-muted)', 
                  border: '1.5px solid var(--color-line)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '22px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-maroon)' }}>Question {idx + 1}</strong>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Topic Tag (e.g. CPU Scheduling)"
                      value={q.topicTag}
                      onChange={(e) => {
                        const next = [...questions];
                        next[idx].topicTag = e.target.value;
                        setQuestions(next);
                      }}
                      style={{ height: '36px', fontSize: '0.9rem', width: '200px' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                    >
                      <Trash2 size={18} color="var(--color-risk-high)" />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <textarea 
                    className="form-textarea" 
                    rows={2}
                    placeholder="Enter question prompt..."
                    value={q.text}
                    onChange={(e) => {
                      const next = [...questions];
                      next[idx].text = e.target.value;
                      setQuestions(next);
                    }}
                    required
                  />
                </div>

                {q.type === 'mcq' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`} 
                          checked={q.correctOptionIndex === oIdx}
                          onChange={() => {
                            const next = [...questions];
                            next[idx].correctOptionIndex = oIdx;
                            setQuestions(next);
                          }}
                          style={{ accentColor: 'var(--color-maroon)', transform: 'scale(1.2)' }}
                        />
                        <input 
                          type="text"
                          className="form-input"
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          value={opt}
                          onChange={(e) => {
                            const next = [...questions];
                            next[idx].options[oIdx] = e.target.value;
                            setQuestions(next);
                          }}
                          style={{ height: '38px', fontSize: '0.92rem' }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Educational syllabus explanation for student review..."
                    value={q.explanation}
                    onChange={(e) => {
                      const next = [...questions];
                      next[idx].explanation = e.target.value;
                      setQuestions(next);
                    }}
                    style={{ fontSize: '0.92rem' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Publish Assessment</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Descriptive Answer Rubric Evaluation (Feature 12) */}
      {activeTab === 'descriptive_grading' && (
        <div className="glass-card" style={{ maxWidth: '880px', margin: '0 auto', width: '100%', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={24} color="var(--color-maroon)" />
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-maroon)' }}>Descriptive Answer Rubric Evaluation</h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Benchmark student submissions against official syllabus rubrics with faculty oversight
              </p>
            </div>
            <span className="badge badge-neutral">Student: Rahul Sharma (23CS101)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Descriptive Examination Question</label>
            <textarea 
              className="form-textarea" 
              rows={2} 
              value={descriptiveQuestion} 
              onChange={(e) => setDescriptiveQuestion(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Faculty Reference Key / Rubric Concept Checklist</label>
            <textarea 
              className="form-textarea" 
              rows={3} 
              value={referenceKey} 
              onChange={(e) => setReferenceKey(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Submitted Student Response</label>
            <textarea 
              className="form-textarea" 
              rows={4} 
              value={studentDescriptiveAnswer} 
              onChange={(e) => setStudentDescriptiveAnswer(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <button className="btn btn-primary" onClick={handleRunAiEvaluation}>
              <Sparkles size={18} />
              <span>Evaluate Against Rubric</span>
            </button>
          </div>

          {/* Rubric Alignment Preview */}
          {aiEvaluation && (
            <div 
              style={{ 
                background: 'var(--color-surface-muted)', 
                border: '1.5px solid var(--color-line)', 
                borderRadius: 'var(--radius-xl)', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-medium">{aiEvaluation.disclaimer.replace('AI Preliminary Feedback', 'Rubric Preliminary Evaluation')}</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                  Conceptual Accuracy: <strong style={{ color: 'var(--color-risk-low)' }}>{aiEvaluation.conceptualAccuracy}</strong>
                </span>
              </div>

              <div style={{ fontSize: '0.98rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                {aiEvaluation.feedback}
              </div>

              <div style={{ display: 'flex', gap: '20px', fontSize: '0.92rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Key concepts covered: </span>
                  <strong style={{ color: 'var(--color-risk-low)' }}>{aiEvaluation.keyConceptsIdentified.join(', ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Missing concepts: </span>
                  <strong style={{ color: 'var(--color-risk-high)' }}>{aiEvaluation.missingKeyConcepts.join(', ') || 'None'}</strong>
                </div>
              </div>

              {/* Faculty Confirmation Control */}
              <div 
                style={{ 
                  marginTop: '12px', 
                  paddingTop: '16px', 
                  borderTop: '1.5px solid var(--color-line)', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '16px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>Faculty Final Score (0 – 10):</label>
                  <input 
                    type="number"
                    min="0"
                    max="10"
                    className="form-input"
                    value={facultyConfirmedScore}
                    onChange={(e) => setFacultyConfirmedScore(Number(e.target.value))}
                    style={{ width: '80px', padding: '6px 10px', fontSize: '1rem', fontWeight: 700 }}
                    disabled={isConfirmed}
                  />
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                    (Suggested rubric benchmark: {aiEvaluation.suggestedMarks}/10)
                  </span>
                </div>

                <button 
                  className={`btn ${isConfirmed ? 'btn-success' : 'btn-primary'}`}
                  onClick={handleConfirmAiScore}
                  disabled={isConfirmed}
                >
                  <Check size={18} />
                  <span>{isConfirmed ? 'Grade Confirmed & Locked' : 'Confirm & Finalize Grade'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
