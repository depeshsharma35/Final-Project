// Unified video catalog (Task 2 + Task 4)
export const VIDEOS = [
  { id: 1, title: 'Building a React App from Scratch', creator: 'CodeCraft Studio', category: 'tutorial', duration: '42:15', size: '380 MB', sizeMB: 380, thumbnail: 'https://picsum.photos/seed/react-tut/400/225', views: '124K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', channel: 'CodeCraft Studio', channelAvatar: 'C', subs: '500K subscribers', date: '1 year ago', desc: 'A comprehensive guide to building modern React applications from the ground up.' },
  { id: 2, title: 'The Deep Ocean: Earth\'s Last Frontier', creator: 'NatureVision', category: 'documentary', duration: '1:28:30', size: '920 MB', sizeMB: 920, thumbnail: 'https://picsum.photos/seed/deep-ocean/400/225', views: '892K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', channel: 'NatureVision', channelAvatar: 'N', subs: '1.2M subscribers', date: '6 months ago', desc: 'Explore the mysterious depths of the ocean and discover marine life never seen before.' },
  { id: 3, title: 'Ambient Piano — Midnight Sessions', creator: 'SoundScape Records', category: 'music', duration: '1:02:00', size: '145 MB', sizeMB: 145, thumbnail: 'https://picsum.photos/seed/piano-midnight/400/225', views: '67K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', channel: 'SoundScape Records', channelAvatar: 'S', subs: '340K subscribers', date: '3 months ago', desc: 'Relax and unwind with soothing ambient piano melodies recorded during midnight sessions.' },
  { id: 4, title: 'AI in 2025: What\'s Actually Happening', creator: 'TechForward', category: 'tech', duration: '35:42', size: '310 MB', sizeMB: 310, thumbnail: 'https://picsum.photos/seed/ai-2025/400/225', views: '1.2M', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', channel: 'TechForward', channelAvatar: 'T', subs: '890K subscribers', date: '1 month ago', desc: 'An in-depth analysis of artificial intelligence breakthroughs and what they mean for the future.' },
  { id: 5, title: 'CSS Grid Mastery — Complete Guide', creator: 'Frontend Masters', category: 'tutorial', duration: '58:10', size: '520 MB', sizeMB: 520, thumbnail: 'https://picsum.photos/seed/css-grid/400/225', views: '203K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', channel: 'Frontend Masters', channelAvatar: 'F', subs: '450K subscribers', date: '8 months ago', desc: 'Master CSS Grid layout with practical examples and responsive design techniques.' },
  { id: 6, title: 'Volcanic Eruptions Caught on Camera', creator: 'GeoExplore', category: 'documentary', duration: '47:55', size: '680 MB', sizeMB: 680, thumbnail: 'https://picsum.photos/seed/volcano-cam/400/225', views: '2.1M', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', channel: 'GeoExplore', channelAvatar: 'G', subs: '2.5M subscribers', date: '2 years ago', desc: 'Witness breathtaking and powerful volcanic eruptions captured on high-definition cameras.' },
  { id: 7, title: 'Lo-fi Beats to Study and Relax', creator: 'ChillWave Audio', category: 'music', duration: '3:15:00', size: '280 MB', sizeMB: 280, thumbnail: 'https://picsum.photos/seed/lofi-study/400/225', views: '4.5M', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', channel: 'ChillWave Audio', channelAvatar: 'C', subs: '3.1M subscribers', date: '1 year ago', desc: 'Endless chill lo-fi hip hop beats perfect for studying, reading, or relaxing.' },
  { id: 8, title: 'Building Your Own Keyboard from Parts', creator: 'Maker\'s Haven', category: 'tech', duration: '28:33', size: '245 MB', sizeMB: 245, thumbnail: 'https://picsum.photos/seed/keyboard-build/400/225', views: '345K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', channel: 'Maker\'s Haven', channelAvatar: 'M', subs: '210K subscribers', date: '5 months ago', desc: 'Step-by-step tutorial on assembling a custom mechanical keyboard from scratch.' },
  { id: 9, title: 'Python for Data Science — Crash Course', creator: 'DataLab Academy', category: 'tutorial', duration: '1:15:40', size: '670 MB', sizeMB: 670, thumbnail: 'https://picsum.photos/seed/python-ds/400/225', views: '567K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', channel: 'DataLab Academy', channelAvatar: 'D', subs: '680K subscribers', date: '9 months ago', desc: 'Learn essential Python libraries like Pandas, NumPy, and Matplotlib for data science.' },
  { id: 10, title: 'The Story of the Silk Road', creator: 'HistoryUnfolded', category: 'documentary', duration: '52:18', size: '750 MB', sizeMB: 750, thumbnail: 'https://picsum.photos/seed/silk-road/400/225', views: '412K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', channel: 'HistoryUnfolded', channelAvatar: 'H', subs: '520K subscribers', date: '1 year ago', desc: 'Journey through history along the ancient Silk Road connecting East and West.' },
  { id: 11, title: 'Synthwave Retro Mix — Neon Drive', creator: 'RetroWave FM', category: 'music', duration: '2:05:00', size: '190 MB', sizeMB: 190, thumbnail: 'https://picsum.photos/seed/synthwave-neon/400/225', views: '178K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', channel: 'RetroWave FM', channelAvatar: 'R', subs: '190K subscribers', date: '4 months ago', desc: 'Immerse yourself in nostalgic 80s synthwave and retrowave electronic tracks.' },
  { id: 12, title: 'Inside a Quantum Computing Lab', creator: 'QuantumLeap', category: 'tech', duration: '31:20', size: '275 MB', sizeMB: 275, thumbnail: 'https://picsum.photos/seed/quantum-lab/400/225', views: '890K', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', channel: 'QuantumLeap', channelAvatar: 'Q', subs: '750K subscribers', date: '7 months ago', desc: 'A fascinating tour inside a cutting-edge quantum computing research laboratory.' },
];

// Playlist for the Video Player section (Task 4)
export const PLAYLIST = [
  {
    id: 'bunny-2024',
    title: 'Big Buck Bunny — Official Short Film',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://picsum.photos/seed/bunny2024/640/360',
    channel: 'Blender Foundation',
    channelAvatar: 'B',
    subs: '2.1M subscribers',
    duration: '9:56',
    views: '12.4M views',
    date: '3 years ago',
    desc: 'Big Buck Bunny is a short computer-animated comedy film featuring a giant rabbit with a heart bigger than himself.'
  },
  {
    id: 'bear-country',
    title: 'Wildlife in Motion — Bear Country',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/bear2024/640/360',
    channel: 'Wild Earth',
    channelAvatar: 'W',
    subs: '890K subscribers',
    duration: '10:54',
    views: '8.1M views',
    date: '1 year ago',
    desc: 'Experience the raw beauty of bear country as we follow these magnificent creatures through their natural habitat.'
  },
  {
    id: 'flower-bloom',
    title: 'Flower Bloom — Macro Timelapse',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    thumbnail: 'https://picsum.photos/seed/flower2024/640/360',
    channel: 'Botanical Films',
    channelAvatar: 'B',
    subs: '340K subscribers',
    duration: '0:06',
    views: '3.2M views',
    date: '6 months ago',
    desc: 'A stunning macro timelapse capturing the intricate process of a flower blooming in vivid detail.'
  },
  {
    id: 'coral-reef',
    title: 'Ocean Depths — Coral Reef Exploration',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/coral2024/640/360',
    channel: 'Deep Blue Docs',
    channelAvatar: 'D',
    subs: '1.5M subscribers',
    duration: '9:56',
    views: '5.7M views',
    date: '2 years ago',
    desc: 'Dive into the vibrant world of coral reefs and discover the incredible biodiversity hidden beneath the waves.'
  },
  {
    id: 'storm-chasers',
    title: 'Storm Chasers — Lightning in Slow Motion',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://picsum.photos/seed/storm2024/640/360',
    channel: 'Weather Warriors',
    channelAvatar: 'W',
    subs: '670K subscribers',
    duration: '12:14',
    views: '9.3M views',
    date: '8 months ago',
    desc: 'Witness the raw power of nature as we capture spectacular lightning strikes in breathtaking slow motion.'
  },
  {
    id: 'city-nights',
    title: 'City Nights — Urban Timelapse at Golden Hour',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    thumbnail: 'https://picsum.photos/seed/city2024/640/360',
    channel: 'Metro Lens',
    channelAvatar: 'M',
    subs: '420K subscribers',
    duration: '0:06',
    views: '2.8M views',
    date: '4 months ago',
    desc: 'The city comes alive as day transitions to night — a mesmerizing urban timelapse capturing the golden hour glow.'
  }
];

export function getCategoryIcon(cat) {
  const icons = { tutorial: 'fa-graduation-cap', documentary: 'fa-earth-americas', music: 'fa-music', tech: 'fa-microchip' };
  return icons[cat] || 'fa-film';
}

export function getCategoryColor(cat) {
  const colors = { tutorial: 'text-emerald', documentary: 'text-sky', music: 'text-pink', tech: 'text-violet' };
  return colors[cat] || 'text-gray';
}

export function getCategoryStyle(cat) {
  const styles = {
    tutorial: { color: '#34d399', background: 'rgba(52,211,153,0.1)' },
    documentary: { color: '#38bdf8', background: 'rgba(56,189,248,0.1)' },
    music: { color: '#f472b6', background: 'rgba(244,114,182,0.1)' },
    tech: { color: '#a78bfa', background: 'rgba(167,139,250,0.1)' },
  };
  return styles[cat] || { color: '#94a3b8', background: 'rgba(148,163,184,0.1)' };
}
