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

let userId: string | null = "blablabla";

// const getUser = async () => {
//   if (typeof window !== undefined) {
//     ({ userId } = await fetch("http://localhost:3000/user") // error occurs here!
//       .then((res) => res.json())
//       .then((res) => res));
//   }
// };

console.log("user Id", userId);

export const TaskStore = types
  .model("TaskStore", {
    tasks: types.optional(types.array(TaskModel), []),
  })
  .actions((self) => {
    return {
      addTask(task: SnapshotIn<typeof TaskModel> | Instance<typeof TaskModel>) {
        self.tasks.push(task);
        if (userId) {
          addDocWrapper(collectionWrapper(db, "users", userId, "tasks"), task);
        }
      },
      editTask(
        id: string,
        editedTask: { title: string; description: string; status: string }
      ) {
        const task = self.tasks.find((task) => task.id === id);
        if (task) {
          task.title = editedTask.title;
          task.description = editedTask.description;
          task.status = editedTask.status;
          if (userId) {
            updateDocWrapper(
              docWrapper(db, "users", userId, "tasks", id),
              editedTask
            );
          }
        }
      },
      deleteTask(taskId: string) {
        const taskIndex = self.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          self.tasks.splice(taskIndex, 1);
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
    getDocsWrapper(collectionWrapper(db, "users", userId, "tasks")).then(
      (querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          tasksFromFirestore.push(doc.data());
        });
      }
    );
  }
}

export let taskStore: any = null;
if (userId) {
  taskStore = TaskStore.create({
    tasks: tasksFromFirestore,
  });
} else {
  taskStore = TaskStore.create({
    tasks: tasksFromLocalStorage,
  });
}

// Function to update the store with the initial snapshot
export function updateTaskStoreWithSnapshot(snapshot: any) {
  taskStore = TaskStore.create(snapshot);
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
