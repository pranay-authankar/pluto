import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { useAuth } from '../context/AuthContext';
import { askGeminiGuide, isGeminiConfigured } from '../services/gemini';

export default function AskPlutoChat() {
  const { college, showToast } = useRelocation() || {};
  const { studentName, user } = useAuth() || {};
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isCollegeSelected = Boolean(college && college.trim());
  const activeStudent = studentName || (user?.email ? user.email.split('@')[0] : 'Student');

  // Reset or initialize greeting when college changes
  useEffect(() => {
    if (isCollegeSelected) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: `Hey ${activeStudent === 'Hey there' ? 'there' : activeStudent}! 👋 I'm your Pluto Guide for ${college}. Ask me about student PGs, mess options, transport, or essentials near campus!`,
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [college, activeStudent, isCollegeSelected]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened and college is selected
  useEffect(() => {
    if (isOpen && isCollegeSelected) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isCollegeSelected]);

  const handleSendMessage = async (customText = null) => {
    if (!isCollegeSelected) {
      if (showToast) {
        showToast('Select College First', 'Please pick your college to unlock the Ask Pluto AI guide.', 'warning');
      }
      return;
    }

    const textToSend = typeof customText === 'string' ? customText : inputMessage;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    setInputMessage('');
    setErrorMessage('');

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askGeminiGuide({
        message: userText,
        college,
        studentName: activeStudent,
        history: messages
      });

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: response.text,
            timestamp: new Date()
          }
        ]);
      } else {
        setErrorMessage(response.error || 'Failed to get an answer from Gemini.');
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'model',
            isError: true,
            text: `⚠️ ${response.error || 'Unable to load guidance at the moment.'}`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cleans raw Gemini markdown outputs:
   * - Strips hashtags (###, ##, #)
   * - Strips bold/italic asterisks (**text**, *text*)
   * - Normalizes bullet points into clean, styled bullet dots
   */
  const renderCleanText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return lines
      .filter((line, i, arr) => {
        // Drop extra blank lines
        if (!line.trim() && i > 0 && !arr[i - 1]?.trim()) return false;
        return true;
      })
      .map((line, idx) => {
        let clean = line.trim();

        // 1. Strip markdown header hashes (###, ##, #)
        clean = clean.replace(/^#{1,6}\s*/, '');

        // 2. Detect bullet point
        let isBullet = false;
        if (/^[\*\-•]\s+/.test(clean)) {
          isBullet = true;
          clean = clean.replace(/^[\*\-•]\s+/, '');
        }

        // 3. Strip bold/italic asterisks (**word** or *word*)
        clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');
        clean = clean.replace(/\*(.*?)\*/g, '$1');

        if (!clean) {
          return <div key={idx} style={{ height: '0.35rem' }} />;
        }

        if (isBullet) {
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '4px',
                paddingLeft: '2px'
              }}
            >
              <span
                style={{
                  color: 'var(--primary-600, #4f46e5)',
                  fontSize: '0.85rem',
                  lineHeight: '1.45',
                  flexShrink: 0
                }}
              >
                •
              </span>
              <span style={{ flex: 1, lineHeight: '1.45' }}>{clean}</span>
            </div>
          );
        }

        // Detect numbered point like "1. " or "2) "
        const isNumbered = /^\d+[\.\)]\s+/.test(clean);
        if (isNumbered) {
          return (
            <div
              key={idx}
              style={{
                fontWeight: 600,
                color: 'var(--slate-900, #0f172a)',
                marginTop: idx > 0 ? '6px' : '0px',
                marginBottom: '3px',
                lineHeight: '1.45'
              }}
            >
              {clean}
            </div>
          );
        }

        return (
          <div key={idx} style={{ marginBottom: '4px', lineHeight: '1.45' }}>
            {clean}
          </div>
        );
      });
  };

  const quickQuestions = [
    `Best PG areas near ${college}?`,
    `Average monthly mess cost near ${college}?`,
    `Local auto & transit tips near ${college}`,
    `Student hangout spots near ${college}`
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ask-pluto-fab"
        aria-label="Open Ask Pluto AI Campus Guide"
        title={!isCollegeSelected ? 'Select your college first to unlock Ask Pluto' : 'Ask Pluto AI Campus Guide'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.75rem 1.25rem',
          borderRadius: '9999px',
          background: isCollegeSelected
            ? 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))'
            : 'var(--slate-700, #334155)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: 'none',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35), 0 2px 6px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'scale(0.96)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isOpen ? 'scale(0.96)' : 'scale(1)';
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>
          {isCollegeSelected ? '✨' : '🔒'}
        </span>
        <span>{isOpen ? 'Close Guide' : 'Ask Pluto'}</span>
        {!isOpen && (
          <span
            style={{
              fontSize: '0.65rem',
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '2px 6px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {isCollegeSelected ? 'AI' : 'Locked'}
          </span>
        )}
      </button>

      {/* Compact Chat Window */}
      {isOpen && (
        <div
          className="ask-pluto-window"
          role="region"
          aria-label="Ask Pluto Campus Chat"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            zIndex: 1500,
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '550px',
            maxHeight: 'calc(100vh - 100px)',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl, 18px)',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px var(--slate-200, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-family-sans, sans-serif)',
            animation: 'plutoChatSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1rem',
              background: isCollegeSelected
                ? 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))'
                : 'var(--slate-800, #1e293b)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: '#fff',
                  fontWeight: 700
                }}
              >
                🪐
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ask Pluto</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.25)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}
                  >
                    Campus Guide
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.725rem',
                    opacity: 0.9,
                    maxWidth: '190px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={college || 'College not selected'}
                >
                  {isCollegeSelected ? `🎓 ${college}` : '🔒 College Required'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                lineHeight: 1
              }}
              title="Close chat"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Missing API Key Warning Notice */}
          {!isGeminiConfigured() && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                background: '#fffbeb',
                borderBottom: '1px solid #fde68a',
                fontSize: '0.725rem',
                color: '#92400e',
                lineHeight: 1.35,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>ℹ️</span>
              <span>
                To enable live AI answers, add <code>VITE_GEMINI_API_KEY</code> in your <code>.env</code> file.
              </span>
            </div>
          )}

          {/* Body Content */}
          {!isCollegeSelected ? (
            /* LOCKED STATE: Prompt student to choose a college first */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'var(--slate-50, #f8fafc)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'var(--primary-50, #eef2ff)',
                  color: 'var(--primary-600, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.12)'
                }}
              >
                🎓
              </div>

              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--slate-900, #0f172a)',
                  margin: '0 0 0.5rem'
                }}
              >
                Select Your College First
              </h3>

              <p
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--slate-600, #475569)',
                  lineHeight: 1.5,
                  margin: '0 0 1.5rem',
                  maxWidth: '280px'
                }}
              >
                Ask Pluto provides tailored local advice on student PGs, mess plans, and transit routes around your specific campus.
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/');
                }}
                className="btn btn-primary"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Choose College on Home
              </button>
            </div>
          ) : (
            /* ACTIVE CHAT STATE */
            <>
              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  background: 'var(--slate-50, #f8fafc)'
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '100%'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '92%',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                        background:
                          msg.role === 'user'
                            ? 'var(--primary-600, #4f46e5)'
                            : msg.isError
                            ? '#fef2f2'
                            : '#ffffff',
                        color:
                          msg.role === 'user'
                            ? '#ffffff'
                            : msg.isError
                            ? '#991b1b'
                            : 'var(--slate-800, #1e293b)',
                        boxShadow:
                          msg.role === 'user'
                            ? '0 1px 3px rgba(79, 70, 229, 0.2)'
                            : '0 1px 3px rgba(0, 0, 0, 0.06)',
                        border:
                          msg.role === 'user'
                            ? 'none'
                            : msg.isError
                            ? '1px solid #fecaca'
                            : '1px solid var(--slate-200, #e2e8f0)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.role === 'user' ? msg.text : renderCleanText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.35rem' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--primary-500, #6366f1)',
                        animation: 'plutoBounce 1.2s infinite 0s'
                      }}
                    />
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--primary-500, #6366f1)',
                        animation: 'plutoBounce 1.2s infinite 0.2s'
                      }}
                    />
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--primary-500, #6366f1)',
                        animation: 'plutoBounce 1.2s infinite 0.4s'
                      }}
                    />
                    <span style={{ fontSize: '0.725rem', color: 'var(--slate-400, #94a3b8)', marginLeft: '4px' }}>
                      Pluto is thinking...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts (visible if conversation is short) */}
              {messages.length <= 2 && !loading && (
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: '#ffffff',
                    borderTop: '1px solid var(--slate-100, #f1f5f9)',
                    display: 'flex',
                    gap: '6px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      style={{
                        background: 'var(--primary-50, #eef2ff)',
                        color: 'var(--primary-700, #4338ca)',
                        border: '1px solid var(--primary-100, #e0e7ff)',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-100, #e0e7ff)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary-50, #eef2ff)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem',
              background: '#ffffff',
              borderTop: '1px solid var(--slate-200, #e2e8f0)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isCollegeSelected
                  ? `Ask about PGs, mess, or commute near ${college}...`
                  : 'Select your college first to ask questions...'
              }
              disabled={!isCollegeSelected || loading}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--slate-200, #e2e8f0)',
                background: !isCollegeSelected ? 'var(--slate-100, #f1f5f9)' : 'var(--slate-50, #f8fafc)',
                fontSize: '0.85rem',
                outline: 'none',
                color: 'var(--slate-900, #0f172a)',
                cursor: !isCollegeSelected ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                if (isCollegeSelected) e.target.style.borderColor = 'var(--primary-500, #6366f1)';
              }}
              onBlur={(e) => (e.target.style.borderColor = 'var(--slate-200, #e2e8f0)')}
            />

            <button
              type="submit"
              disabled={!isCollegeSelected || !inputMessage.trim() || loading}
              style={{
                background:
                  !isCollegeSelected || !inputMessage.trim() || loading
                    ? 'var(--slate-200, #e2e8f0)'
                    : 'var(--primary-600, #4f46e5)',
                color:
                  !isCollegeSelected || !inputMessage.trim() || loading
                    ? 'var(--slate-400, #94a3b8)'
                    : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !isCollegeSelected || !inputMessage.trim() || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={!isCollegeSelected ? 'Select your college first' : 'Send message'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes plutoChatSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes plutoBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
