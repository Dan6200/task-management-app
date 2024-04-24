//cspell:ignore firestore
import { types, Instance, SnapshotIn, onSnapshot } from "mobx-state-tree";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "./db";
import { useClerk } from "@clerk/nextjs";

export const TaskModel = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.string,
  status: types.string,
});

const { user } = useClerk();

export const TaskStore = types
  .model("TaskStore", {
    tasks: types.optional(types.array(TaskModel), []),
  })
  .actions((self) => {
    return {
      addTask(task: SnapshotIn<typeof TaskModel> | Instance<typeof TaskModel>) {
        self.tasks.push(task);
        if (user) {
          addDoc(collection(db, "users", user.id, "tasks"), task);
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
          if (user) {
            updateDoc(doc(db, "users", user.id, "tasks", id), editedTask);
          }
        }
      },
      deleteTask(taskId: string) {
        const taskIndex = self.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          self.tasks.splice(taskIndex, 1);
          if (user) {
            deleteDoc(doc(db, "users", user.id, "tasks", taskId));
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
  if (user == null) {
    const tasksJSON = localStorage.getItem("taskStore");
    if (tasksJSON) {
      try {
        tasksFromLocalStorage = JSON.parse(tasksJSON).tasks;
      } catch (error) {
        console.error("Error parsing tasks from local storage:", error);
      }
    }
  } else {
    getDocs(collection(db, "users", user.id, "tasks")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tasksFromFirestore.push(doc.data());
      });
    });
  }
}

let taskStore = null;
if (user) {
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
if (typeof window !== "undefined") {
  onSnapshot(taskStore, (snapshot) => {
    localStorage.setItem("taskStore", JSON.stringify(snapshot));
    if (user) {
      snapshot.tasks.forEach((task: any) => {
        updateDoc(doc(db, "users", user.id, "tasks", task.id), task);
      });
    }
  });
}
