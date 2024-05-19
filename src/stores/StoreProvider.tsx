"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot } from "mobx-state-tree";
import { storePromise, userIdPromise } from "./TaskStore";
import {
  collectionWrapper,
  docWrapper,
  getDocsWrapper,
  updateDocWrapper,
} from "./FireStore";
import db from "./db";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }: any) => {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      const { taskStore, updateTaskStoreWithSnapshot } = await storePromise;
      const { userId } = await userIdPromise();
      let initialSnapshot: string | null = null;

      // Update the taskStore with the initial snapshot
      if (process.browser) {
        if (userId) {
          let tasks: any = [];
          const { ref, error } = collectionWrapper(
            db,
            "users",
            userId,
            "tasks"
          );
          if (error) {
            console.error(error);
          } else {
            const { error, result: querySnapshot } = await getDocsWrapper(ref);
            if (error) {
              console.error(error);
            } else {
              querySnapshot?.forEach((doc: any) => {
                tasks.push(doc.data());
              });
              if (tasks.length) {
                updateTaskStoreWithSnapshot({ tasks: tasks });
              }
            }
            // Synchronize the store with db
            onSnapshot(taskStore, (snapshot: any) => {
              Promise.all(
                snapshot.tasks.map(async (task: any) => {
                  const { error, ref } = docWrapper(
                    db,
                    "users",
                    userId,
                    "tasks",
                    task.id
                  );
                  if (error) {
                    console.error(error);
                  } else {
                    const { error } = await updateDocWrapper(ref, task);
                    if (error) {
                      console.error(error);
                    }
                  }
                })
              );
            });
          }
        }
      } else {
        initialSnapshot = localStorage.getItem("taskStore");
        if (initialSnapshot) {
          updateTaskStoreWithSnapshot(JSON.parse(initialSnapshot));
        }
        // Synchronize the store with local storage
        onSnapshot(taskStore, (snapshot) => {
          localStorage.setItem("taskStore", JSON.stringify(snapshot));
        });
      }

      setStore({ taskStore });
      setLoading(false);
    };

    initializeStore();
  }, [storePromise, userIdPromise]);

  const stores = {
    taskStore: store?.taskStore,
    loading,
  };

  return (
    // @ts-ignore
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
