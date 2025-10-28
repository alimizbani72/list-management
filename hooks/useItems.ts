"use client";

import { Item } from "@/types";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "list_items";

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  //  Load items only on client
  useEffect(() => {
    if (typeof window === "undefined") return; // prevent SSR access

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Item[];
        setItems(data);
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  //  Persist items after load
  useEffect(() => {
    if (!isLoaded) return; // skip first render before localStorage is ready
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save items", e);
    }
  }, [items, isLoaded]);

  const create = useCallback((payload: { title: string; subtitle: string }) => {
    const newItem: Item = {
      id: (Date.now() + Math.random()).toString(36),
      title: payload.title,
      subtitle: payload.subtitle,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const update = useCallback(
    (id: string, payload: { title: string; subtitle: string }) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? { ...it, title: payload.title, subtitle: payload.subtitle }
            : it
        )
      );
    },
    []
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  return { items, create, update, remove, clearAll, isLoaded };
};
