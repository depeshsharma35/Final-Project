// Shared layout wrapper for all page views
import React from 'react';

export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 ${className}`}>
      {children}
    </div>
  );
}
