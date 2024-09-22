import * as React from 'react';

export function Badge({ children, variant }: { children: React.ReactNode; variant: 'success' | 'destructive' }) {
  const color = variant === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  return <span className={`px-2 py-1 rounded ${color} text-sm`}>{children}</span>;
}
