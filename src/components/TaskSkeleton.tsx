import { Skeleton } from "@/components/ui/skeleton";
import TaskFilter from "./TaskFilter";

export const TaskSkeleton = () => (
  <>
    <TaskFilter />
    <Skeleton className="relative w-full h-32 bg-skeleton p-4 rounded shadow mt-1 border-b max-w-2xl"></Skeleton>
    <Skeleton className="relative w-full h-32 bg-skeleton p-4 rounded shadow mt-1 border-b max-w-2xl"></Skeleton>
    <Skeleton className="relative w-full h-32 bg-skeleton p-4 rounded shadow mt-1 border-b max-w-2xl"></Skeleton>
  </>
);
