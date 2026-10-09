import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Key, ShieldCheck, Cpu, Check, AlertCircle } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }) {
  const { apiKey, saveApiKey } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '36px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={24} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-maroon)', fontFamily: 'var(--font-display)' }}>Course Reference & Evaluation Settings</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Google Gemini API Key (Optional)</label>
            <input 
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{ fontSize: '0.98rem' }}
            />
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              If provided, live queries will access Google Gemini 1.5 Flash. If blank or offline, the platform automatically references the embedded university textbook syllabus knowledge base.
            </span>
          </div>

          {/* Engine Status Card */}
          <div 
            style={{ 
              background: 'var(--color-surface-muted)', 
              border: '1.5px solid var(--color-line)', 
              borderRadius: 'var(--radius-md)', 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="var(--color-maroon)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-maroon)' }}>Official Curriculum Knowledge Base:</strong>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.65 }}>
              • <strong>Verified Textbook Citations:</strong> Referenced directly against Operating Systems (Silberschatz), Data Structures & Algorithms (CLRS), Database Systems (Korth), Computer Networks (Tanenbaum), and Theory of Computation (Sipser).<br />
              • <strong>Offline Campus Resilience:</strong> Complete semantic search and rubric grading available even when campus internet connectivity is offline.<br />
              • <strong>Institutional Data Privacy:</strong> Student grades, attendance, and queries remain securely on campus without external telemetry.
            </div>
          </div>

          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-risk-low)', fontSize: '0.92rem', fontWeight: 600 }}>
              <Check size={18} />
              <span>Configuration saved successfully!</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="submit" className="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}
