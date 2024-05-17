import TaskList from "@/components/TaskList";
import "@radix-ui/themes/styles.css";

const Home = async ({}) => {
  return (
    <div className="h-fit min-h-screen">
      <div className="grid place-items-center">
        <TaskList />
      </div>
    </div>
  );
};

export default Home;
