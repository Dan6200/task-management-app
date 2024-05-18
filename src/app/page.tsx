import TaskList from "@/components/TaskList";

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
