import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askSubjectChatbot } from '../../services/ragChatbot';
import { 
  Bot, 
  Send, 
  BookOpen, 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  Bookmark, 
  Copy, 
  HelpCircle,
  Lightbulb,
  FileCheck
} from 'lucide-react';

export function StudentChatbot({ initialWeakTopic = null }) {
  const { currentUser, subjects, apiKey } = useApp();
  const student = currentUser;

  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-os');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${student.name.split(' ')[0]}! Welcome to your course study companion. I am referenced directly against your official university textbooks and syllabus units. Which concept or topic would you like to review?`,
      citations: [
        { book: 'Operating System Concepts, 10th Edition (Silberschatz, Galvin & Gagne)', pages: 'Prescribed Syllabus Units 1–4' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If initialWeakTopic passed from mistake analysis or dashboard, trigger auto-explanation
  useEffect(() => {
    if (initialWeakTopic) {
      handleAskQuestion(`Can you provide a clear conceptual walkthrough of ${initialWeakTopic} with a textbook reference?`, 'explain_weakness');
    }
  }, [initialWeakTopic]);

  const handleAskQuestion = async (queryText, mode = 'qa') => {
    const q = queryText || inputValue;
    if (!q.trim() || isLoading) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askSubjectChatbot({
        subjectId: selectedSubjectId,
        query: q,
        mode,
        customNotes: uploadedDocs,
        apiKey,
        weakTopics: student.knownWeakTopics || []
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: response.text,
          citations: response.citations,
          suggestedQuestions: response.suggestedQuestions
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I could not access the syllabus index at this moment. Please try asking again shortly.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newDoc = {
      unit: `Custom Course Notes: ${file.name.replace(/\.[^/.]+$/, '')}`,
      sourceBook: file.name,
      pages: 'Student Coursework Reference',
      content: `Uploaded reference document: ${file.name}. Detailed lecture notes covering core definitions, mathematical proofs, and solved numerical problems.`
    };

    setUploadedDocs(prev => [...prev, newDoc]);
    alert(`Successfully registered "${file.name}" into your course reference catalog.`);
  };

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header and Subject Selectors */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={26} color="var(--color-maroon)" />
              <h2 style={{ fontSize: '1.65rem', margin: 0, color: 'var(--color-maroon)' }}>Course Textbooks & Syllabus Reference Guide</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
              Prescribed university literature citations • Verified conceptual Q&A • Topic walkthroughs • Practice checks
            </p>
          </div>

          {/* Upload Notes Button */}
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            <span>Add Lecture Notes or PDF</span>
            <input 
              type="file" 
              accept=".pdf,.txt,.docx" 
              style={{ display: 'none' }} 
              onChange={handleSimulatePdfUpload} 
            />
          </label>
        </div>

        {/* Subject Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginTop: '22px', paddingTop: '16px', borderTop: '1.5px solid var(--color-line)' }}>
          {subjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`btn btn-sm ${selectedSubjectId === sub.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.9rem' }}
            >
              <BookOpen size={16} />
              <span>{sub.code}: {sub.name.slice(0, 22)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="chat-window">
        {/* Messages Stream */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <div className="chat-bubble">
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-line)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-maroon)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Official Syllabus Citation:
                    </div>
                    {msg.citations.map((c, cIdx) => (
                      <div key={cIdx} className="citation-chip">
                        <Bookmark size={14} />
                        <span>{c.book} — {c.pages}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Followup Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Suggested Questions to Explore:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {msg.suggestedQuestions.map((sq, sqIdx) => (
                        <button
                          key={sqIdx}
                          onClick={() => handleAskQuestion(sq, 'qa')}
                          style={{
                            background: 'var(--color-surface)',
                            border: '1.5px solid var(--color-line)',
                            color: 'var(--color-maroon)',
                            fontSize: '0.88rem',
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message assistant">
              <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="beacon-dot beacon-medium" />
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                  Searching verified syllabus chapters and textbook index...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Action Chips */}
        <div style={{ padding: '12px 20px', background: 'var(--color-surface-muted)', borderTop: '1px solid var(--color-line)', display: 'flex', gap: '10px', overflowX: 'auto' }}>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => handleAskQuestion(`Explain my weak topic in ${activeSubject.name}`, 'explain_weakness')}
          >
            <Lightbulb size={16} color="var(--color-maroon)" />
            <span>Walkthrough of Priority Weak Topic</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => handleAskQuestion(`Generate 5 minute practice quiz for ${activeSubject.name}`, 'quiz')}
          >
            <Sparkles size={16} color="var(--color-terracotta)" />
            <span>Curriculum Self-Check Quiz</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => handleAskQuestion(`Summarize Unit 2 and Unit 3 for ${activeSubject.name}`, 'summary')}
          >
            <FileText size={16} color="var(--color-risk-low)" />
            <span>Structured Chapter Summary</span>
          </button>
        </div>

        {/* Chat Input Bar */}
        <div style={{ padding: '18px 24px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, fontSize: '1rem', padding: '14px 18px' }}
            placeholder={`Ask any concept in ${activeSubject.name} (e.g. Banker's Algorithm safety check, Semaphores)...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskQuestion(inputValue, 'qa');
            }}
          />

          <button 
            className="btn btn-primary"
            onClick={() => handleAskQuestion(inputValue, 'qa')}
            disabled={isLoading || !inputValue.trim()}
            style={{ padding: '14px 24px' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
