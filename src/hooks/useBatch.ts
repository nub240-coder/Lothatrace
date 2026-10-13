import { useState, useEffect, useCallback } from 'react';
import { Batch } from '../types';
import { getBatch, EVENT_DATA_UPDATED } from '../data/storage';

export function useBatch(batchId: string | undefined) {
  const [batch, setBatch] = useState<Batch | null>(() => {
    return batchId ? getBatch(batchId) : null;
  });

  const refresh = useCallback(() => {
    if (!batchId) {
      setBatch(null);
      return;
    }
    const updated = getBatch(batchId);
    setBatch(updated ? { ...updated } : null);
  }, [batchId]);

  useEffect(() => {
    refresh();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ batchId?: string }>;
      if (!customEvent.detail?.batchId || customEvent.detail.batchId.toLowerCase() === batchId?.toLowerCase()) {
        refresh();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lothatrace_batches_v1') {
        refresh();
      }
    };

    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [batchId, refresh]);

  return { batch, refresh };
}
