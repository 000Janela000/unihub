'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserGroup } from '@/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/storage';

export function useUserGroup() {
  const [group, setGroupState] = useState<UserGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getItem<UserGroup | null>(STORAGE_KEYS.USER_GROUP, null);
    setGroupState(stored);
    setLoading(false);
  }, []);

  const setGroup = useCallback((g: UserGroup) => {
    setGroupState(g);
    setItem(STORAGE_KEYS.USER_GROUP, g);
  }, []);

  const clearGroup = useCallback(() => {
    setGroupState(null);
    removeItem(STORAGE_KEYS.USER_GROUP);
  }, []);

  return { group, setGroup, clearGroup, loading };
}
