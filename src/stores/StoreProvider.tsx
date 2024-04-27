"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot } from "mobx-state-tree";
import { storePromise } from "./TaskStore";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }: any) => {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      const { taskStore, updateTaskStoreWithSnapshot } = await storePromise;

      // Update the taskStore with the initial snapshot
      if (process.browser) {
        const initialSnapshot = localStorage.getItem("taskStore");
        if (initialSnapshot) {
          updateTaskStoreWithSnapshot(JSON.parse(initialSnapshot));
        }
      }

      // Synchronize the store with local storage
      onSnapshot(taskStore, (snapshot) => {
        localStorage.setItem("taskStore", JSON.stringify(snapshot));
      });

      setStore({ taskStore });
      setLoading(false);
    };

    initializeStore();
  }, []);

  const stores = {
    taskStore: store?.taskStore,
    loading,
  };

  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
