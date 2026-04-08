import { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import styles from './AtlasModeLayout.module.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const defaultSessions: ChatSession[] = [
  { id: '1', title: 'Dispatch optimization', messages: [
    { role: 'user', text: 'How can I optimize my dispatch board for next week?' },
    { role: 'assistant', text: 'Based on your current job density and technician availability, I recommend grouping jobs by zip code clusters. You have 14 jobs in the north zone on Tuesday — assigning two crews there would reduce drive time by ~35%.' },
  ]},
  { id: '2', title: 'Invoice follow-up', messages: [
    { role: 'user', text: 'Show me overdue invoices from last month.' },
    { role: 'assistant', text: 'You have 8 overdue invoices totaling $12,450. The largest is $4,200 from Greenfield Properties (45 days past due). Would you like me to draft follow-up emails?' },
  ]},
  { id: '3', title: 'Revenue analysis Q1', messages: [
    { role: 'user', text: 'What was our revenue trend in Q1?' },
    { role: 'assistant', text: 'Q1 revenue was $1.24M, up 18% from Q4. January saw a dip due to weather cancellations, but February and March recovered strongly. Your top revenue category was HVAC maintenance at 42% of total.' },
  ]},
  { id: '4', title: 'Technician performance', messages: [
    { role: 'user', text: 'Who are my top performing technicians this month?' },
    { role: 'assistant', text: 'Your top 3 by completed jobs: 1) Mike R. — 47 jobs, 98% satisfaction. 2) Sarah L. — 42 jobs, 96% satisfaction. 3) James K. — 39 jobs, 97% satisfaction.' },
  ]},
  { id: '5', title: 'Membership renewals', messages: [
    { role: 'user', text: 'How many memberships are expiring this month?' },
    { role: 'assistant', text: '23 memberships expire this month. 15 are set to auto-renew. The remaining 8 need outreach — I can generate a call list sorted by membership value.' },
  ]},
];

const referenceDocuments = [
  { title: 'Q1 Revenue Report', type: 'PDF', size: '2.4 MB' },
  { title: 'Dispatch Efficiency Metrics', type: 'Sheet', size: '1.1 MB' },
  { title: 'Customer Satisfaction Survey', type: 'PDF', size: '890 KB' },
  { title: 'Technician KPI Dashboard', type: 'Link', size: '' },
  { title: 'Inventory Reorder Thresholds', type: 'Sheet', size: '340 KB' },
];

export default function AtlasModeLayout() {
  const [sessions, setSessions] = useState<ChatSession[]>(defaultSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages.length]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, { role: 'user' as const, text: inputValue.trim() }] }
        : s
    ));
    setInputValue('');
  };

  const handleNewChat = () => {
    const newId = String(Date.now());
    const newSession: ChatSession = { id: newId, title: 'New conversation', messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  return (
    <div className={styles.container}>
      {/* Left: Chat sessions list */}
      <div className={styles.sessionsSidebar}>
        <div className={styles.sessionsHeader}>
          <span className={styles.sessionsTitle}>Chat History</span>
          <button className={styles.newChatBtn} onClick={handleNewChat} aria-label="New chat">
            <AddIcon style={{ fontSize: 18 }} />
          </button>
        </div>
        <ul className={styles.sessionsList}>
          {sessions.map(session => (
            <li
              key={session.id}
              className={`${styles.sessionItem} ${session.id === activeSessionId ? styles.sessionItemActive : ''}`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <ChatBubbleOutlineIcon style={{ fontSize: 16, flexShrink: 0, opacity: 0.5 }} />
              <span className={styles.sessionItemTitle}>{session.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Center: Chat area */}
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <AutoAwesomeIcon style={{ fontSize: 18, fill: 'url(#sparkle-gradient)' }} />
          <span className={styles.chatHeaderTitle}>{activeSession.title}</span>
        </div>
        <div className={styles.messagesContainer}>
          {activeSession.messages.length === 0 && (
            <div className={styles.emptyState}>
              <AutoAwesomeIcon style={{ fontSize: 40, fill: 'url(#sparkle-gradient)', marginBottom: 12 }} />
              <p className={styles.emptyTitle}>How can Atlas help you today?</p>
              <p className={styles.emptySubtitle}>Ask about your business data, get recommendations, or automate tasks.</p>
            </div>
          )}
          {activeSession.messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? styles.msgUser : styles.msgAssistant}>
              <div className={msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputArea}>
          <input
            className={styles.chatInput}
            type="text"
            placeholder="Ask Atlas anything..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendBtn} onClick={handleSend} aria-label="Send message">
            <SendIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Right: Reference panel */}
      <div className={styles.referencePanel}>
        <div className={styles.refHeader}>Context</div>
        <div className={styles.refSection}>
          <div className={styles.refSectionTitle}>Referenced Documents</div>
          <ul className={styles.refList}>
            {referenceDocuments.map((doc, i) => (
              <li key={i} className={styles.refItem}>
                <DescriptionOutlinedIcon style={{ fontSize: 16, color: '#6B7280', flexShrink: 0 }} />
                <div className={styles.refItemInfo}>
                  <span className={styles.refItemTitle}>{doc.title}</span>
                  <span className={styles.refItemMeta}>{doc.type}{doc.size ? ` · ${doc.size}` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.refSection}>
          <div className={styles.refSectionTitle}>Data Sources</div>
          <ul className={styles.refList}>
            <li className={styles.refItem}>
              <span className={styles.refDot} style={{ backgroundColor: '#10B981' }} />
              <div className={styles.refItemInfo}>
                <span className={styles.refItemTitle}>Live CRM Data</span>
                <span className={styles.refItemMeta}>Connected · Real-time</span>
              </div>
            </li>
            <li className={styles.refItem}>
              <span className={styles.refDot} style={{ backgroundColor: '#10B981' }} />
              <div className={styles.refItemInfo}>
                <span className={styles.refItemTitle}>Accounting Module</span>
                <span className={styles.refItemMeta}>Connected · Real-time</span>
              </div>
            </li>
            <li className={styles.refItem}>
              <span className={styles.refDot} style={{ backgroundColor: '#F59E0B' }} />
              <div className={styles.refItemInfo}>
                <span className={styles.refItemTitle}>Dispatch History</span>
                <span className={styles.refItemMeta}>Synced · 5 min ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
