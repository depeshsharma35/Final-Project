// Unified Plans data (Task 2 + Task 3 merged)
export const PLANS = {
  free: {
    key: 'free',
    name: 'Free',
    price: 0,
    priceLabel: '₹0',
    period: 'forever',
    dailyLimit: 1,
    quality: '720p',
    color: '#6b7280',
    contentAccess: 3, // out of 12 videos
    features: [
      { label: '1 download / day', included: true },
      { label: '720p Quality', included: true },
      { label: 'Basic catalog access', included: true },
      { label: 'Watch Party (view only)', included: true },
      { label: 'HD & 4K downloads', included: false },
      { label: 'Premium content', included: false },
      { label: 'Priority support', included: false },
      { label: 'Offline playlists', included: false },
    ]
  },
  bronze: {
    key: 'bronze',
    name: 'Bronze',
    price: 99,
    priceLabel: '₹99',
    period: '/ month',
    dailyLimit: 5,
    quality: '1080p',
    color: '#cd7f32',
    contentAccess: 6,
    features: [
      { label: '5 downloads / day', included: true },
      { label: '1080p Quality', included: true },
      { label: 'Full catalog access', included: true },
      { label: 'Watch Party host', included: true },
      { label: '4K downloads', included: false },
      { label: 'All premium content', included: false },
      { label: 'Priority support', included: false },
      { label: 'Offline playlists', included: false },
    ]
  },
  pro: {
    key: 'pro',
    name: 'Silver',
    price: 249,
    priceLabel: '₹249',
    period: '/ month',
    dailyLimit: 10,
    quality: '1080p+',
    color: '#b0b8c8',
    contentAccess: 9,
    features: [
      { label: '10 downloads / day', included: true },
      { label: '1080p+ Quality', included: true },
      { label: 'Full catalog access', included: true },
      { label: 'Watch Party host', included: true },
      { label: 'Ad-free experience', included: true },
      { label: '4K downloads', included: false },
      { label: 'Priority support', included: false },
      { label: 'Offline playlists', included: false },
    ]
  },
  elite: {
    key: 'elite',
    name: 'Gold',
    price: 499,
    priceLabel: '₹499',
    period: '/ month',
    dailyLimit: Infinity,
    quality: '4K',
    color: '#d4a843',
    contentAccess: 12,
    features: [
      { label: 'Unlimited downloads', included: true },
      { label: '4K Ultra HD Quality', included: true },
      { label: 'All content unlocked', included: true },
      { label: 'Watch Party host', included: true },
      { label: 'Ad-free experience', included: true },
      { label: 'Priority support', included: true },
      { label: 'Offline playlists', included: true },
      { label: 'Early access to features', included: true },
    ]
  }
};

export const PLAN_ORDER = ['free', 'bronze', 'pro', 'elite'];

export const COMPARISON_FEATURES = [
  { label: 'Daily Download Limit', free: '1', bronze: '5', pro: '10', elite: 'Unlimited' },
  { label: 'Video Quality', free: '720p', bronze: '1080p', pro: '1080p+', elite: '4K HDR' },
  { label: 'Catalog Access', free: '3/12 videos', bronze: '6/12 videos', pro: '9/12 videos', elite: '12/12 videos' },
  { label: 'Watch Party Host', free: false, bronze: true, pro: true, elite: true },
  { label: 'Ad-free', free: false, bronze: false, pro: true, elite: true },
  { label: 'Offline Playlists', free: false, bronze: false, pro: false, elite: true },
  { label: 'Priority Support', free: false, bronze: false, pro: false, elite: true },
  { label: 'Early Access', free: false, bronze: false, pro: false, elite: true },
];

export function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
