import { Skeleton } from "@radix-ui/themes";
import TaskFilter from "./TaskFilter";

export const TaskSkeleton = () => (
  <>
    <TaskFilter />
    <Skeleton className="relative w-[44rem] h-32 bg-white p-4 rounded shadow mt-1 border-b border-slate-300 max-w-2xl"></Skeleton>
    <Skeleton className="relative w-[44rem] h-32 bg-white p-4 rounded shadow mt-1 border-b border-slate-300 max-w-2xl"></Skeleton>
    <Skeleton className="relative w-[44rem] h-32 bg-white p-4 rounded shadow mt-1 border-b border-slate-300 max-w-2xl"></Skeleton>
  </>
);
