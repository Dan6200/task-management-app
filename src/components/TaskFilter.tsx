import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface TaskFilterProps {}

const TaskFilter = ({}: TaskFilterProps) => {
  const searchParams = useSearchParams();
  const tasksFilter = searchParams.get("tasks");

  return (
    <div className="mb-4">
      <ul className="flex flex-wrap gap-1 sm:gap-4 justify-center text-xs sm:text-base font-medium text-center text-slate-500 border-b border-slate/20 ">
        <Link
          href="/"
          className={`${
            tasksFilter === null && "bg-primary/20 text-slate-900 "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          All
        </Link>

        <Link
          href="/?tasks=pending"
          className={`${
            tasksFilter === "pending" && "bg-primary/20 text-slate-900 "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          Pending
        </Link>

        <Link
          href="/?tasks=in_progress"
          className={`${
            tasksFilter === "in_progress" && "bg-primary/20 text-slate-900 "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          In Progress
        </Link>

        <Link
          href="/?tasks=completed"
          className={`${
            tasksFilter === "completed" && "bg-primary/20 text-slate-900 "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          Completed
        </Link>
      </ul>
    </div>
  );
};

export default TaskFilter;
