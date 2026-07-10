import React from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';
import WatchPartyRoom from './WatchPartyRoom';
import LandingScreen from './LandingScreen';

export default function WatchPartyView() {
  const { wpScreen } = useWatchParty();

  if (wpScreen === 'room') return <WatchPartyRoom />;
  return <LandingScreen />;
}
