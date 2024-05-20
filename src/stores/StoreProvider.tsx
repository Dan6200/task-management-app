"use client";
//cspell:ignore firestore

import { createContext, useContext, useState, useEffect } from "react";
import { getSnapshot, onSnapshot } from "mobx-state-tree";
import { storePromise, userIdPromise } from "./TaskStore";
import { collectionWrapper, docWrapper, getDocsWrapper } from "./FireStore";
import { DocumentReference, Query, writeBatch } from "firebase/firestore";
import db from "./db";
import { useUser } from "@clerk/nextjs";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }: any) => {
  const [store, setStore] = useState<any>(null);
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      const { taskStore, updateTaskStoreWithSnapshot } = await storePromise;
      let initialSnapshot: string | null = null;
      console.log(user);

      // Update the taskStore with the initial snapshot
      if (process.browser) {
        if (isSignedIn) {
          let tasks: any = [];
          const { ref, error } = collectionWrapper(
            db,
            "users",
            user.id,
            "tasks"
          );
          if (error) {
            console.error(error);
          } else {
            const { error, result: querySnapshot } = await getDocsWrapper(
              ref as Query
            );
            if (error) {
              console.error(error);
            } else {
              querySnapshot?.forEach((doc: any) => {
                const task: any = doc.data();
                tasks.push({ ...task, id: doc.id });
              });
              if (tasks.length) {
                updateTaskStoreWithSnapshot({ tasks: tasks });
              }
            }
          }
        } else {
          initialSnapshot = localStorage.getItem("taskStore");
          console.log("local storage", initialSnapshot);
          if (initialSnapshot) {
            updateTaskStoreWithSnapshot(JSON.parse(initialSnapshot));
          }
          console.dir(getSnapshot(taskStore));
          // Synchronize the store with local storage
          onSnapshot(taskStore, (snapshot) => {
            console.log("snapshot", snapshot);
            localStorage.setItem("taskStore", JSON.stringify(snapshot));
          });
        }
      }

      setStore({ taskStore });
      setLoading(false);
    };

    initializeStore();
  }, [storePromise, isSignedIn, user]);

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
