import { useState, useEffect, useCallback } from 'react';

export type RouteType = 'home' | 'trace' | 'admin-batches' | 'admin-simulator' | 'not-found';

export interface RouteState {
  type: RouteType;
  batchId?: string;
  path: string;
}

export function parseCurrentLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { type: 'home', path: '/' };
  }

  let fullPath = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');
  const searchParams = new URLSearchParams(window.location.search);

  // If hash routing is used (e.g. #/t/LT-2610-001 or #/admin/batches)
  if (hash && hash.startsWith('/')) {
    fullPath = hash;
  }

  // Also check query param fallback ?batch=LT-2610-001 or ?t=LT-2610-001
  const queryBatch = searchParams.get('batch') || searchParams.get('t');
  if (queryBatch && (fullPath === '/' || fullPath === '')) {
    return {
      type: 'trace',
      batchId: queryBatch,
      path: `/t/${queryBatch}`,
    };
  }

  if (fullPath === '/' || fullPath === '') {
    return { type: 'home', path: '/' };
  }

  if (fullPath.startsWith('/t/')) {
    const parts = fullPath.split('/t/');
    const batchId = decodeURIComponent(parts[1]?.split('/')[0]?.split('?')[0] || '');
    return {
      type: 'trace',
      batchId,
      path: fullPath,
    };
  }

  if (fullPath === '/admin/batches' || fullPath === '/admin/batches/') {
    return { type: 'admin-batches', path: '/admin/batches' };
  }

  if (fullPath === '/admin/simulator' || fullPath === '/admin/simulator/') {
    return { type: 'admin-simulator', path: '/admin/simulator' };
  }

  return { type: 'not-found', path: fullPath };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseCurrentLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseCurrentLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    window.history.pushState({}, '', to);
    setRoute(parseCurrentLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}
