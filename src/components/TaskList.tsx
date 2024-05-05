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
import { Spinner } from "@radix-ui/themes";
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
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-between mb-8 sm:mb-14">
        <h2
          className={
            (loading ? "animate-pulse " : "") + "text-2xl font-semibold"
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
          <div className="flex flex-col mt-4">
            {loading ? (
              <Button variant="default" className="flex gap-1 animate-pulse">
                Loading <Spinner />
              </Button>
            ) : (
              <AddTask />
            )}
          </div>
        )}
      </div>

      {loading ? null : <TaskFilter />}

      <div className="flex w-full items-center flex-col gap-2 sm:px-4 py-5 max-h-[600px] overflow-auto">
        {loading ? (
          <TaskSkeleton />
        ) : (
          filteredTasks &&
          filteredTasks.map((task: any) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
            />
          ))
        )}
        {isSmallScreen && (
          <div className="flex flex-col mt-4">
            {loading ? (
              <Button variant="default" className="flex gap-1 animate-pulse">
                Loading <Spinner />
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
