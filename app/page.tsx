'use client';

import { useState } from 'react';
import { useAssistant } from 'ai/react';

export default function Home() {
  const [region, setRegion] = useState('');
  const { status, messages, input, submitMessage, handleInputChange } = useAssistant({ api: '/api/assistant' });

  // 1. REGION FORM
  if (!region) {
    return (
      <div className="container">
        <div className="region-card">
          <h1 className="title">Welcome!</h1>
          <p>Enter your FTC Region</p>
          <input 
            className="region-input"
            placeholder="e.g. Northern California" 
            onKeyDown={(e) => e.key === 'Enter' && setRegion(e.currentTarget.value)}
          />
          <button 
            onClick={() => setRegion('Northern California')}
            className="start-btn"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  // 2. CHAT UI
  return (
    <div className="container">
      <div className="header">
        <div className="title">Sharp-AI</div>
        <small>Region: {region}</small>
      </div>

      <div className="chat-box">
        {messages.map((m: any) => (
          <div key={m.id} className={`message ${m.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
            <strong>{m.role === 'user' ? 'You' : 'Bot'}</strong>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{m.content}</div>
          </div>
        ))}
        {status === 'in_progress' && <div style={{ textAlign: 'center', color: '#888' }}>Thinking...</div>}
      </div>

      <div className="input-area">
        <form onSubmit={submitMessage} className="input-form">
          <input
            className="input-field"
            value={input}
            placeholder="Ask a question..."
            onChange={handleInputChange}
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}