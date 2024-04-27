"use client";
import TaskList from "@/components/TaskList";
import { useStore } from "@/stores/StoreProvider";
import { useState } from "react";

const Home = ({}) => {
  const [loading, setLoading] = useState(true);
  const store = useStore();
  if (store) setLoading(false);
  return (
    <div className="h-screen">
      <h1 className="text-2xl sm:text-4xl font-black tracking-wide text-center pt-6 pb-10 sm:pb-24">
        Welcome to Task Manager
      </h1>

      <div className="grid place-items-center">
        {loading ? <TaskList /> : <h1>Loading</h1>}
      </div>
    </div>
  );
};

export default Home;
