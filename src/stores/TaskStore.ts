//cspell:ignore firestore nextjs
import { types, Instance, SnapshotIn, onSnapshot } from "mobx-state-tree";
import {
  collectionWrapper,
  addDocWrapper,
  getDocsWrapper,
  docWrapper,
  updateDocWrapper,
  deleteDocWrapper,
} from "./FireStore";
import db from "./db";

export const TaskModel = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.string,
  status: types.string,
});

const userIdPromise = (async () => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_URL + "/user");
    return data.json();
  } catch {
    return null;
  }
})();

export const TaskStore = types
  .model("TaskStore", {
    tasks: types.optional(types.array(TaskModel), []),
  })
  .actions((self) => {
    return {
      addTask: async (
        task: SnapshotIn<typeof TaskModel> | Instance<typeof TaskModel>
      ) => {
        self.tasks.push(task);
        const { userId } = await userIdPromise;
        if (userId) {
          addDocWrapper(collectionWrapper(db, "users", userId, "tasks"), task);
        }
      },
      editTask: async (
        id: string,
        editedTask: { title: string; description: string; status: string }
      ) => {
        const task = self.tasks.find((task) => task.id === id);
        if (task) {
          task.title = editedTask.title;
          task.description = editedTask.description;
          task.status = editedTask.status;
          const { userId } = await userIdPromise;
          if (userId) {
            updateDocWrapper(
              docWrapper(db, "users", userId, "tasks", id),
              editedTask
            );
          }
        }
      },
      deleteTask: async (taskId: string) => {
        const taskIndex = self.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          self.tasks.splice(taskIndex, 1);
          const { userId } = await userIdPromise;
          if (userId) {
            deleteDocWrapper(docWrapper(db, "users", userId, "tasks", taskId));
          }
        }
      },
    };
  });

// If logged in in fetch tasks from Firestore under the current user's document and create the task store
// Parse the tasks from local storage and create the task store
let tasksFromLocalStorage: any = [];
let tasksFromFirestore: any = [];

async function initializeStore() {
  const { userId } = await userIdPromise;
  if (typeof window !== "undefined") {
    if (!userId) {
      const tasksJSON = localStorage.getItem("taskStore");
      if (tasksJSON) {
        try {
          tasksFromLocalStorage = JSON.parse(tasksJSON).tasks;
        } catch (error) {
          console.error("Error parsing tasks from local storage:", error);
        }
      }
    } else {
      await getDocsWrapper(
        collectionWrapper(db, "users", userId, "tasks")
      ).then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          tasksFromFirestore.push(doc.data());
        });
      });
    }
  }

  let taskStore: any = null;
  if (userId) {
    taskStore = TaskStore.create({
      tasks: tasksFromFirestore,
    });
  } else {
    taskStore = TaskStore.create({
      tasks: tasksFromLocalStorage,
    });
  }

  // Save tasks to local storage whenever a change occurs
  // If logged in, save tasks to Firestore under the current user's document whenever a change occurs
  if (typeof window == "undefined") {
    onSnapshot(taskStore, (snapshot: any) => {
      localStorage.setItem("taskStore", JSON.stringify(snapshot));
      if (userId) {
        snapshot.tasks.forEach((task: any) => {
          updateDocWrapper(
            docWrapper(db, "users", userId, "tasks", task.id),
            task
          );
        });
      }
    });
  }

  // Function to update the store with the initial snapshot
  function updateTaskStoreWithSnapshot(snapshot: any) {
    taskStore = TaskStore.create(snapshot);
  }

  return { taskStore, updateTaskStoreWithSnapshot };
}

export const storePromise = initializeStore();
