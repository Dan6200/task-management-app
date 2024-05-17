import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface TaskFilterProps {}

const TaskFilter = ({}: TaskFilterProps) => {
  const searchParams = useSearchParams();
  const tasksFilter = searchParams.get("tasks");

  return (
    <div className="shadow-md rounded-sm mb-2">
      <ul className="flex justify-between text-xs sm:text-base font-medium text-center text-heading/50 border-b">
        <Link
          href="/"
          className={`${
            tasksFilter === null && "bg-primary/20 text-heading "
          } w-fit inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          All
        </Link>

        <Link
          href="/?tasks=pending"
          className={`${
            tasksFilter === "pending" && "bg-primary/20 text-heading "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          Pending
        </Link>

        <Link
          href="/?tasks=in_progress"
          className={`${
            tasksFilter === "in_progress" && "bg-primary/20 text-heading "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          In Progress
        </Link>

        <Link
          href="/?tasks=completed"
          className={`${
            tasksFilter === "completed" && "bg-primary/20 text-heading "
          } inline-block px-3 sm:px-14 py-2 rounded focus:outline-none`}
        >
          Completed
        </Link>
      </ul>
    </div>
  );
};

export default TaskFilter;
