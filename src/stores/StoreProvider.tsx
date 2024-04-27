"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot } from "mobx-state-tree";
import { storePromise } from "./TaskStore";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }: any) => {
  const [store, setStore] = useState<any>(null);

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
    };

    initializeStore();
  }, []);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
