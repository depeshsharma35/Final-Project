import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import PageLayout from '../ui/PageLayout';

const THUMBS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', label: 'Abstract AI Flow' },
  { id: 2, url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', label: 'Cyber Matrix' },
  { id: 3, url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', label: 'Neon Tech' },
  { id: 4, url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', label: 'Studio Mic' },
];

const inputCls = 'w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50';

export default function UploadView() {
  const { setView, addVideo } = useApp();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState(currentUser?.name || 'StreamVault Creator');
  const [category, setCategory] = useState('tutorial');
  const [quality, setQuality] = useState('1080p Full HD');
  const [desc, setDesc] = useState('');
  const [thumb, setThumb] = useState(THUMBS[0].url);
  const [customThumb, setCustomThumb] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('0 MB/s');
  const fileRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('video/')) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '')); }
    else showToast('Please upload a valid video file (MP4, MKV, MOV, WebM)', 'warning');
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) { showToast('Please enter a title', 'warning'); return; }
    setUploading(true); setProgress(0);
    const sizeMB = file ? +(file.size / 1024 / 1024).toFixed(1) : Math.floor(Math.random() * 300 + 100);
    const finalThumb = customThumb.trim() || thumb;
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.floor(Math.random() * 15 + 8));
      setProgress(p); setSpeed((Math.random() * 8 + 12).toFixed(1) + ' MB/s');
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          addVideo({ id: Date.now(), title: title.trim(), creator: creator.trim() || 'Anonymous', category, duration: `${Math.floor(Math.random() * 15 + 5)}:${Math.floor(Math.random() * 50 + 10)}`, size: `${sizeMB} MB`, sizeMB, thumbnail: finalThumb, views: '1 view', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', channel: creator.trim(), channelAvatar: currentUser?.avatar, subs: '1.2K subs', date: 'Just now', desc: desc.trim() || 'Uploaded by community creator.' });
          setUploading(false); showToast(`🎉 "${title}" published!`, 'success', 5000); setView('catalog');
        }, 600);
      }
    }, 200);
  };

  return (
    <PageLayout className="max-w-3xl">
      {/* Header */}
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => setView('catalog')}>
        <i className="fa-solid fa-arrow-left" /> Back to Catalog
      </Button>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Upload Video</h1>
      <p className="text-sm text-zinc-400 mb-8">Publish your content to the StreamVault streaming network</p>

      <form onSubmit={submit} className="flex flex-col gap-6">
        {/* Drop zone */}
        <div onDragEnter={e => { e.preventDefault(); setDrag(true); }} onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)} onDrop={onDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden
            ${drag ? 'border-amber-500 bg-amber-500/5' : file ? 'border-green-500 bg-green-500/5' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 hover:border-zinc-400 dark:hover:border-zinc-600'}
            ${uploading ? 'cursor-default' : ''}
          `}>
          <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFileChange} disabled={uploading} />

          {file ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-file-video text-3xl text-green-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{file.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready for upload</p>
              <Button type="button" variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setFile(null); }} disabled={uploading}>
                <i className="fa-solid fa-rotate" /> Change file
              </Button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-amber-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Drag & drop video here</h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-5">Supports MP4, MKV, MOV, WebM — up to 4K resolution</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-xl pointer-events-none">
                <i className="fa-solid fa-folder-open" /> Browse Files
              </span>
            </div>
          )}

          {/* Upload progress overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                <i className="fa-solid fa-cloud-arrow-up fa-bounce text-2xl text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-1">Uploading & Transcoding...</h3>
              <p className="text-sm text-zinc-400 mb-5">Speed: <strong className="text-amber-500">{speed}</strong> · Do not close</p>
              <div className="w-full max-w-xs h-2.5 bg-zinc-800 rounded-full mb-3">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xl font-bold text-amber-500">{progress}%</span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-5 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-amber-500" /> Video Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input type="text" className={inputCls} placeholder="e.g. Building an AI Agent in Node.js" value={title} onChange={e => setTitle(e.target.value)} required disabled={uploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Creator / Channel</label>
              <input type="text" className={inputCls} placeholder="Your channel name" value={creator} onChange={e => setCreator(e.target.value)} disabled={uploading} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} disabled={uploading} className={inputCls}>
                <option value="tutorial">Tutorial</option>
                <option value="tech">Tech & AI</option>
                <option value="documentary">Documentary</option>
                <option value="music">Music Video</option>
                <option value="podcast">Podcast & Talk</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Quality Preset</label>
              <select value={quality} onChange={e => setQuality(e.target.value)} disabled={uploading} className={inputCls}>
                <option value="4K Ultra HD">4K Ultra HD (2160p)</option>
                <option value="1080p Full HD">1080p Full HD (60fps)</option>
                <option value="720p HD">720p HD</option>
              </select>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-3">Select Thumbnail</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {THUMBS.map(t => (
                <button type="button" key={t.id} onClick={() => { setThumb(t.url); setCustomThumb(''); }} disabled={uploading}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${thumb === t.url && !customThumb ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'}`}>
                  <img src={t.url} alt={t.label} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-[10px] text-white text-center truncate px-1">{t.label}</div>
                </button>
              ))}
            </div>
            <input type="url" className={inputCls} placeholder="Or paste a custom image URL..." value={customThumb} onChange={e => setCustomThumb(e.target.value)} disabled={uploading} />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Description</label>
            <textarea rows={4} className={`${inputCls} resize-vertical`} placeholder="Tell viewers what your video is about..." value={desc} onChange={e => setDesc(e.target.value)} disabled={uploading} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setView('catalog')} disabled={uploading}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={uploading} disabled={uploading || !title.trim()}>
            {!uploading && <i className="fa-solid fa-rocket" />}
            {uploading ? 'Uploading & Publishing...' : 'Upload & Publish'}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}
