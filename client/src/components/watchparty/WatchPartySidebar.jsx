import React, { useRef, useEffect } from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';

export default function WatchPartySidebar() {
  const { isSidebarOpen, activeTab, setActiveTab, messages, sendMessage, participants } = useWatchParty();
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab, isSidebarOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className={`shrink-0 flex flex-col h-full bg-zinc-900 border-l border-zinc-800 transition-all duration-300 ${
      isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-l-0'
    }`}>
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 p-1 bg-zinc-950/40">
        <button id="wp-chat-tab" onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'chat'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}>
          <i className="fa-solid fa-comment" /> Chat
        </button>
        <button id="wp-participants-tab" onClick={() => setActiveTab('participants')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'participants'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}>
          <i className="fa-solid fa-users" /> People ({participants.length})
        </button>
      </div>

      {/* Chat Tab Content */}
      {activeTab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map(msg => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="text-center py-1 text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">
                    {msg.text}
                  </div>
                );
              }
              return (
                <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${msg.isMe ? 'self-end flex-row-reverse' : ''}`}>
                  {!msg.isMe && (
                    <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0" />
                  )}
                  <div className={`flex flex-col ${msg.isMe ? 'items-end' : ''}`}>
                    {!msg.isMe && (
                      <span className="text-[10px] text-zinc-500 font-semibold mb-0.5 ml-1">{msg.user}</span>
                    )}
                    <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-600 mt-1 px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input box */}
          <div className="p-3 bg-zinc-950/30 border-t border-zinc-800 flex gap-2">
            <input
              id="wp-chat-input"
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-zinc-800 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button id="wp-chat-send-btn" onClick={handleSend}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 transition-colors shrink-0 text-white">
              <i className="fa-solid fa-paper-plane text-[10px]" />
            </button>
          </div>
        </>
      )}

      {/* Participants Tab Content */}
      {activeTab === 'participants' && (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {participants.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/40 transition-colors group cursor-pointer">
              <div className="relative shrink-0">
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-zinc-800" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                  p.audio ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {p.name} {p.id === 'p_me' && <span className="text-[10px] text-zinc-500 font-normal ml-0.5">(You)</span>}
                </p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {p.video ? 'Camera On' : 'Camera Off'} · {p.audio ? 'Mic On' : 'Muted'}
                </p>
              </div>
              {p.isHost && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
