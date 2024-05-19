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

// Mock fetch if testing env
if (process.env.NODE_ENV === "test") {
  //@ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ userId: "mock user" }) })
  );
}

export const TaskModel = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.string,
  status: types.string,
});

export const userIdPromise = async () => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_URL + "/user");
    return data.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

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
        const { userId } = await userIdPromise();
        if (userId) {
          const { ref, error } = collectionWrapper(
            db,
            "users",
            userId,
            "tasks"
          );
          if (error) {
            console.error(error);
          } else {
            const { error, result } = await addDocWrapper(ref, task);
            if (error) console.error(error);
            console.log(result);
          }
        }
      },
      editTask: async (
        taskId: string,
        editedTask: { title: string; description: string; status: string }
      ) => {
        const task = self.tasks.find((task) => task.id === taskId);
        if (task) {
          task.title = editedTask.title;
          task.description = editedTask.description;
          task.status = editedTask.status;
          console.log(task);
          const { userId } = await userIdPromise();
          if (userId) {
            const { error, ref } = docWrapper(
              db,
              "users",
              userId,
              "tasks",
              taskId
            );
            if (error) {
              console.error(error);
            } else {
              const { error } = await updateDocWrapper(ref, editedTask);
              if (error) console.error(error);
            }
          }
        }
      },
      deleteTask: async (taskId: string) => {
        const taskIndex = self.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          self.tasks.splice(taskIndex, 1);
          const { userId } = await userIdPromise();
          if (userId) {
            const { error, ref } = docWrapper(
              db,
              "users",
              userId,
              "tasks",
              taskId
            );
            if (error) {
              console.error(error);
            } else {
              const { error } = await deleteDocWrapper(ref);

              if (error) {
                console.error(error);
              }
            }
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
  const { userId } = await userIdPromise();
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
      const { ref, error } = collectionWrapper(db, "users", userId, "tasks");
      if (error) {
        console.error(error);
      } else {
        const { error, result: querySnapshot } = await getDocsWrapper(ref);
        if (error) {
          console.error(error);
        } else {
          querySnapshot?.forEach((doc) => {
            const task: any = doc.data();
            tasksFromFirestore.push({ ...task, id: doc.id });
          });
          console.log(tasksFromFirestore);
        }
      }
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
      if (userId) {
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
      } else {
        localStorage.setItem("taskStore", JSON.stringify(snapshot));
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
