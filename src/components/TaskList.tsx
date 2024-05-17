"use client";

import { useSearchParams } from "next/navigation";
import { types, Instance } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import Task from "./Task";
import AddTask from "./AddTask";
import TaskFilter from "./TaskFilter";
import { useStore } from "@/stores/StoreProvider";
import { TaskModel } from "@/stores/TaskStore";
import { Button } from "./ui/Button";
import { useAtomValue } from "jotai";
import { isSmallScreenAtom } from "@/atoms";
import { LoaderCircle } from "lucide-react";
import { TaskSkeleton } from "./TaskSkeleton";

const TaskList = observer(() => {
  //@ts-ignore
  const { taskStore, loading } = useStore();
  const isSmallScreen = useAtomValue(isSmallScreenAtom);
  const searchParams = useSearchParams();

  const tasksFilter = searchParams.get("tasks");

  //@ts-ignore

  let filteredTasks: types.Array<Instance<typeof TaskModel>> | null = null;
  if (!loading) {
    filteredTasks = taskStore.tasks;

    if (tasksFilter === "pending") {
      filteredTasks = taskStore.tasks.filter(
        (task: any) => task.status === "pending"
      );
    } else if (tasksFilter === "in_progress") {
      filteredTasks = taskStore.tasks.filter(
        (task: any) => task.status === "in_progress"
      );
    } else if (tasksFilter === "completed") {
      filteredTasks = taskStore.tasks.filter(
        (task: any) => task.status === "completed"
      );
    }
  }

  return (
    <div className="">
      <div className="flex sm:flex-row items-center justify-center sm:justify-between mb-8 sm:mb-14">
        <h2
          className={
            (loading ? "animate-pulse " : "") +
            "text-heading text-2xl font-semibold"
          }
        >
          {filteredTasks === null
            ? "Loading"
            : tasksFilter === "pending"
            ? "Pending"
            : tasksFilter === "in_progress"
            ? "In Progress"
            : tasksFilter === "completed"
            ? "Completed"
            : "All"}{" "}
          Tasks
        </h2>
        {isSmallScreen ? null : (
          <div className="flex flex-col">
            {loading ? (
              <Button variant="default" className="flex gap-1 animate-pulse">
                Loading Tasks <LoaderCircle className="w-4 animate-spin" />
              </Button>
            ) : (
              <AddTask />
            )}
          </div>
        )}
      </div>

      {loading ? null : <TaskFilter />}

      <div className="flex w-full items-center flex-col gap-2 sm:px-4 py-5">
        {loading ? (
          <TaskSkeleton />
        ) : taskStore.tasks?.length ? (
          filteredTasks?.length ? (
            filteredTasks.map((task: any) => (
              <Task
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
              />
            ))
          ) : (
            <div className="w-full capitalize text-heading/50 bg-primary/10 rounded-md font-semibold flex justify-center px-2 py-8 sm:p-8">
              <div className="text-xl sm:text-2xl mb-4 sm:mb-8">
                <h1>No {tasksFilter + " "}tasks.</h1>
              </div>
            </div>
          )
        ) : (
          <div className="w-full capitalize text-heading/50 bg-primary/10 rounded-md font-semibold flex flex-col items-center px-2 py-8 sm:p-8">
            <div className="text-2xl sm:text-4xl mb-4 sm:mb-8">
              <h1>No tasks yet.</h1>
            </div>
            <div className="text-lg sm:text-2xl">
              <h3>click the add new tasks button</h3>
            </div>
          </div>
        )}
        {isSmallScreen && (
          <div className="flex flex-col mt-4">
            {loading ? (
              <Button variant="default" className="flex gap-1 animate-pulse">
                Loading Tasks <LoaderCircle className="w-2 animate-spin" />
              </Button>
            ) : (
              <AddTask />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default TaskList;
