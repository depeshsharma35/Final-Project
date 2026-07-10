import User from '../models/User.js';
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';
import { USER_DB } from '../../../client/src/data/mockDb.js';
import { VIDEOS, PLAYLIST } from '../../../client/src/data/videos.js';
import { SAMPLE_COMMENTS } from '../../../client/src/data/comments.js';

export async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users into MongoDB...');
      const usersToInsert = Object.entries(USER_DB).map(([email, data]) => ({
        email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        otpMethod: data.otpMethod,
        securitySettings: { locationCheck: true, deviceCheck: true },
        themePreference: 'auto'
      }));
      await User.insertMany(usersToInsert);
      console.log('✅ Users seeded successfully!');
    }

    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      console.log('🌱 Seeding video catalog into MongoDB...');
      const catalogToInsert = VIDEOS.map(v => {
        const playlistMatch = PLAYLIST.find(p => p.title.includes(v.title) || v.title.includes(p.title.split(' — ')[0]));
        return {
          id: v.id,
          title: v.title,
          creator: v.creator,
          category: v.category,
          duration: v.duration,
          size: v.size,
          sizeMB: v.sizeMB,
          thumbnail: v.thumbnail,
          views: v.views,
          src: v.src || playlistMatch?.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          channel: v.channel || playlistMatch?.channel || v.creator,
          channelAvatar: v.channelAvatar || playlistMatch?.channelAvatar || v.creator[0],
          subs: v.subs || playlistMatch?.subs || '500K subscribers',
          date: v.date || playlistMatch?.date || '1 year ago',
          desc: v.desc || playlistMatch?.desc || `Enjoy watching ${v.title} by ${v.creator} on StreamVault.`
        };
      });
      await Video.insertMany(catalogToInsert);
      console.log('✅ Videos seeded successfully!');
    }

    const commentCount = await Comment.countDocuments();
    if (commentCount === 0) {
      console.log('🌱 Seeding sample comments into MongoDB...');
      const commentsToInsert = SAMPLE_COMMENTS.map(c => ({
        id: c.id,
        videoId: 1,
        username: c.username,
        lang: c.lang,
        text: c.text,
        translations: c.translations || {},
        location: c.location || null,
        showLocation: c.showLocation || false,
        ts: c.ts,
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
        reports: c.reports || 0,
        flagged: c.flagged || false
      }));
      await Comment.insertMany(commentsToInsert);
      console.log('✅ Comments seeded successfully!');
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
}
