import React, { useState } from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';
import Button from '../ui/Button';

export function InviteModal({ isOpen, onClose, roomCode, onCopyLink }) {
  if (!isOpen) return null;
  const url = `https://syncwatch.app/room/${roomCode || 'XYZ-123'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-display">Invite Friends</h3>
          <button id="invite-modal-close" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-4 flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-link text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Room Link</p>
            <p className="text-xs font-mono text-zinc-800 dark:text-zinc-300 truncate">{url}</p>
          </div>
          <Button id="copy-link-btn" variant="primary" size="xs" onClick={() => onCopyLink(url)}>Copy</Button>
        </div>

        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3.5">Share via</p>
        <div className="flex gap-2.5">
          {[
            { icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', color: '#25d366' },
            { icon: 'fa-brands fa-telegram', label: 'Telegram', color: '#0088cc' },
            { icon: 'fa-brands fa-discord', label: 'Discord', color: '#5865f2' },
          ].map(s => (
            <button key={s.label} id={`share-${s.label.toLowerCase()}-btn`} onClick={() => onCopyLink(url)}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all bg-transparent focus:outline-none">
              <i className={`${s.icon} text-2xl`} style={{ color: s.color }} />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsModal({ isOpen, onClose }) {
  const { isRecording, setIsRecording, isScreenSharing, setIsScreenSharing, leaveRoom } = useWatchParty();
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const Toggle = ({ value, onChange, id, label }) => (
    <button id={id} type="button" role="switch" aria-checked={value} aria-label={label}
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${value ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-4' : ''}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-display">Room Settings</h3>
          <button id="settings-modal-close" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {[
            { label: 'Session Recording', desc: 'Record video and chat for later', value: isRecording, onChange: () => setIsRecording(r => !r), id: 'toggle-recording' },
            { label: 'Allow Screen Share', desc: 'Participants can share their screen', value: isScreenSharing, onChange: () => setIsScreenSharing(s => !s), id: 'toggle-screenshare' },
            { label: 'Private Room', desc: 'Require password to join', value: isPrivate, onChange: () => setIsPrivate(p => !p), id: 'toggle-private' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">{item.label}</p>
                <p className="text-xs text-zinc-400 leading-normal">{item.desc}</p>
              </div>
              <Toggle id={item.id} value={item.value} onChange={item.onChange} label={item.label} />
            </div>
          ))}

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 mt-2">
            <Button id="end-session-btn" variant="danger" className="w-full" onClick={() => { leaveRoom(); onClose(); }}>
              <i className="fa-solid fa-door-open" /> End Session for All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPartyModals({ onCopyLink }) {
  const { showInviteModal, setShowInviteModal, showSettingsModal, setShowSettingsModal, roomCode } = useWatchParty();
  return (
    <>
      <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} roomCode={roomCode} onCopyLink={onCopyLink} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
}
