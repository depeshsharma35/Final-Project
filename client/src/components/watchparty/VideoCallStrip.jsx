import React, { useRef, useEffect, useState } from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

function getColor(name) {
  const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

export default function VideoCallStrip() {
  const { participants, isMicOn, setIsMicOn, isCamOn, setIsCamOn, isLocalVideoOn, setIsLocalVideoOn, myName, leaveRoom } = useWatchParty();
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camError, setCamError] = useState('');

  const requestCam = async () => {
    try {
      setCamError('');
      if (stream) stream.getTracks().forEach(t => t.stop());
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      ms.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
      setStream(ms);
      streamRef.current = ms;
      window.localStream = ms;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = ms;
        localVideoRef.current.play().catch(() => {});
      }
    } catch (err) {
      setCamError(err.name === 'NotAllowedError' ? 'Camera access denied' : 'Camera unavailable');
      setIsCamOn(false);
    }
  };

  useEffect(() => {
    if (isCamOn && isLocalVideoOn) requestCam();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (window.localStream) { window.localStream.getTracks().forEach(t => t.stop()); window.localStream = null; }
    };
  }, []);

  useEffect(() => {
    if (!isCamOn || !isLocalVideoOn) {
      stream?.getVideoTracks().forEach(t => t.stop());
    } else if (!stream) {
      requestCam();
    }
  }, [isCamOn, isLocalVideoOn]);

  useEffect(() => {
    stream?.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
  }, [isMicOn, stream]);

  const toggleCam = () => {
    if (!isCamOn) { setIsCamOn(true); setIsLocalVideoOn(true); requestCam(); }
    else { stream?.getVideoTracks().forEach(t => t.stop()); setIsCamOn(false); setIsLocalVideoOn(false); }
  };

  const showLocalVideo = isCamOn && isLocalVideoOn && stream;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-3 px-4 bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl w-full scrollbar-none">
      {/* Local (Me) tile */}
      <div className="relative shrink-0 w-24 h-20 bg-zinc-800 rounded-xl overflow-hidden group flex flex-col items-center justify-center border border-zinc-700/60" title={myName}>
        {showLocalVideo ? (
          <video ref={localVideoRef} muted autoPlay playsInline className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(myName)}
          </div>
        )}
        <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white truncate max-w-[80%] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">{myName} (You)</span>
        <div className="absolute top-1 right-1 flex gap-1">
          {!isMicOn && (
            <div className="w-4 h-4 rounded bg-red-600/90 flex items-center justify-center text-white" title="Mic off">
              <i className="fa-solid fa-microphone-slash text-[8px]" />
            </div>
          )}
        </div>
        {camError && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[9px] text-red-400 text-center p-2 rounded-xl">
            {camError}
          </div>
        )}
      </div>

      {/* Remote participants */}
      {participants.filter(p => p.id !== 'p_me').map(p => (
        <div key={p.id} className={`relative shrink-0 w-24 h-20 bg-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-zinc-700/60 transition-all ${p.audio ? 'ring-2 ring-emerald-500' : ''}`} title={p.name}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getColor(p.name)}`}>
            {getInitials(p.name)}
          </div>
          <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white truncate max-w-[80%] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {p.name}{p.isHost ? ' ♛' : ''}
          </span>
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            {!p.audio && (
              <div className="w-4 h-4 rounded bg-red-600/90 flex items-center justify-center text-white" title="Mic off">
                <i className="fa-solid fa-microphone-slash text-[8px]" />
              </div>
            )}
            {!p.video && (
              <div className="w-4 h-4 rounded bg-zinc-900/90 flex items-center justify-center text-zinc-400" title="Cam off">
                <i className="fa-solid fa-video-slash text-[8px]" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add participant placeholder */}
      <button className="shrink-0 w-24 h-20 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-all bg-transparent focus:outline-none">
        <i className="fa-solid fa-user-plus text-base" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Invite</span>
      </button>

      <div className="flex-1" />

      {/* Control buttons on the right */}
      <div className="flex items-center gap-2 shrink-0">
        <button id="vc-mic-btn" onClick={() => setIsMicOn(m => !m)} title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border ${
            isMicOn ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700' : 'bg-red-600 text-white border-transparent hover:bg-red-500 shadow-md shadow-red-600/20'
          }`}>
          <i className={`fa-solid ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`} />
        </button>
        <button id="vc-cam-btn" onClick={toggleCam} title={isCamOn ? 'Turn off camera' : 'Turn on camera'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border ${
            isCamOn ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700' : 'bg-red-600 text-white border-transparent hover:bg-red-500 shadow-md shadow-red-600/20'
          }`}>
          <i className={`fa-solid ${isCamOn ? 'fa-video' : 'fa-video-slash'}`} />
        </button>
        <button id="vc-leave-btn" onClick={leaveRoom} title="Leave call"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/20">
          <i className="fa-solid fa-phone-slash" />
        </button>
      </div>
    </div>
  );
}
