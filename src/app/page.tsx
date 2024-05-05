import TaskList from "@/components/TaskList";
import "@radix-ui/themes/styles.css";

const Home = async ({}) => {
  return (
    <div className="h-screen">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-wide text-center pt-6 pb-10 sm:pb-24">
        Welcome to Task Manager
      </h1>

      <div className="grid place-items-center">
        <TaskList />
      </div>
    </div>
  );
};

export default Home;
