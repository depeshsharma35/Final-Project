import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const WatchPartyContext = createContext(null);

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '-' +
    Array.from({ length: 3 }, () => '0123456789'[Math.floor(Math.random() * 10)]).join('');
}

function generateParticipantId() {
  return 'p_' + Math.random().toString(36).slice(2, 9);
}

const MOCK_PARTICIPANTS = [
  { id: 'p_alice', name: 'Alice Chen', avatar: 'https://i.pravatar.cc/100?img=5', audio: true, video: false, color: '#6366f1', isHost: false },
  { id: 'p_bob', name: 'Bob Kowalski', avatar: 'https://i.pravatar.cc/100?img=12', audio: false, video: false, color: '#8b5cf6', isHost: false },
  { id: 'p_carol', name: 'Carol Singh', avatar: 'https://i.pravatar.cc/100?img=9', audio: true, video: false, color: '#ec4899', isHost: false },
];

const MOCK_CHAT = [
  { id: 'sys1', isSystem: true, text: 'Alice Chen joined the room' },
  { id: 'c1', isMe: false, user: 'Alice', avatar: 'https://i.pravatar.cc/100?img=5', color: 'text-indigo-400', text: 'Hey everyone! Ready to watch? 🎬', time: '10:02 PM' },
  { id: 'c2', isMe: false, user: 'Bob', avatar: 'https://i.pravatar.cc/100?img=12', color: 'text-purple-400', text: 'Yeah, let\'s go!', time: '10:03 PM' },
];

export function WatchPartyProvider({ children }) {
  const { currentUser } = useAuth();

  const [wpScreen, setWpScreen] = useState('landing'); // 'landing' | 'room'
  const [roomCode, setRoomCode] = useState('');
  const [hostName, setHostName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Media states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isLocalVideoOn, setIsLocalVideoOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const myName = currentUser?.name?.split(' ')[0] || 'You';

  const createRoom = useCallback((displayName) => {
    const code = generateRoomCode();
    const me = {
      id: 'p_me',
      name: displayName || myName,
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 30 + 1)}`,
      audio: true,
      video: false,
      color: '#e2a832',
      isHost: true
    };
    const initialParticipants = [me, ...MOCK_PARTICIPANTS];
    const initialMessages = [
      { id: 'sys0', isSystem: true, text: `${displayName || myName} created the room` },
      ...MOCK_CHAT
    ];

    setRoomCode(code);
    setHostName(displayName || myName);
    setParticipants(initialParticipants);
    setMessages(initialMessages);
    setWpScreen('room');

    // Sync to MongoDB
    api.post('/watchparty/create', {
      roomCode: code,
      hostName: displayName || myName,
      participants: initialParticipants,
      messages: initialMessages
    });
  }, [myName]);

  const joinRoom = useCallback((displayName, code) => {
    const actualCode = code || generateRoomCode();
    const me = {
      id: 'p_me',
      name: displayName || myName,
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 30 + 1)}`,
      audio: true,
      video: false,
      color: '#e2a832',
      isHost: false
    };
    const sysMsg = { id: 'sys_' + Date.now(), isSystem: true, text: `${displayName || myName} joined the room` };

    setRoomCode(actualCode);
    setHostName(displayName || myName);
    setParticipants([me, ...MOCK_PARTICIPANTS.slice(0, 2)]);
    setMessages([sysMsg, ...MOCK_CHAT.slice(0, 2)]);
    setWpScreen('room');

    // Sync to MongoDB
    api.post('/watchparty/join', {
      roomCode: actualCode,
      participant: me,
      message: sysMsg
    });
  }, [myName]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: 'm_' + Date.now(), isMe: true, user: myName, text, time };
    setMessages(prev => [...prev, newMsg]);

    // Sync to MongoDB
    if (roomCode) {
      api.post('/watchparty/message', { roomCode, message: newMsg });
    }

    // Simulate response after 2-4s
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const responders = MOCK_PARTICIPANTS.filter(p => p.audio);
      if (responders.length > 0) {
        const r = responders[Math.floor(Math.random() * responders.length)];
        const responses = ['Nice!', '👍', 'Totally agree!', 'lol', 'haha', 'same', 'True!', '🔥', 'Let\'s gooo!'];
        const reply = { id: 'm_' + Date.now(), isMe: false, user: r.name.split(' ')[0], avatar: r.avatar, color: 'text-indigo-400', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, reply]);
        if (roomCode) {
          api.post('/watchparty/message', { roomCode, message: reply });
        }
      }
    }, delay);
  }, [myName, roomCode]);

  const leaveRoom = useCallback(() => {
    if (window.localStream) {
      window.localStream.getTracks().forEach(track => track.stop());
      window.localStream = null;
    }
    if (window.socket && typeof window.socket.disconnect === 'function') {
      window.socket.disconnect();
    }
    if (window.peerConnection && typeof window.peerConnection.close === 'function') {
      window.peerConnection.close();
    }
    if (window.webrtc && typeof window.webrtc.disconnect === 'function') {
      window.webrtc.disconnect();
    }
    if (roomCode) {
      api.post('/watchparty/leave', { roomCode, participantId: 'p_me', isHost: participants.some(p => p.id === 'p_me' && p.isHost) }).catch(() => {});
    }

    setWpScreen('landing');
    setParticipants([]);
    setMessages([]);
    setRoomCode('');
    setIsPlaying(false);
    setIsRecording(false);
    setIsScreenSharing(false);
    setIsCamOn(false);
    setIsMicOn(true);
    setIsLocalVideoOn(false);
  }, [roomCode, participants]);

  const copyInviteLink = useCallback((url) => {
    navigator.clipboard.writeText(url).catch(() => {});
  }, []);

  return (
    <WatchPartyContext.Provider value={{
      wpScreen, setWpScreen,
      roomCode, hostName,
      participants, messages,
      activeTab, setActiveTab,
      isSidebarOpen, setIsSidebarOpen,
      isPlaying, setIsPlaying,
      isMicOn, setIsMicOn,
      isCamOn, setIsCamOn,
      isLocalVideoOn, setIsLocalVideoOn,
      isRecording, setIsRecording,
      isScreenSharing, setIsScreenSharing,
      currentTime, setCurrentTime,
      duration, setDuration,
      volume, setVolume,
      unreadCount, setUnreadCount,
      showInviteModal, setShowInviteModal,
      showSettingsModal, setShowSettingsModal,
      myName,
      createRoom, joinRoom, sendMessage, leaveRoom, copyInviteLink,
    }}>
      {children}
    </WatchPartyContext.Provider>
  );
}

export function useWatchParty() {
  const ctx = useContext(WatchPartyContext);
  if (!ctx) throw new Error('useWatchParty must be used within WatchPartyProvider');
  return ctx;
}
