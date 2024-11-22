"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Task } from "../data/schema";

export default function TaskDataTable() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/get-alteracoes");
        const data = await response.json();

        // Convert the object response to an array of tasks
        const tasksArray = Object.values(data);
        setTasks(tasksArray);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  // Update task value in the local state
  const handleTaskUpdate = (id: string, key: string, value: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, [key]: value } : task
      )
    );
  };

  return (
    // Pass tasks and the update handler to DataTable
    <DataTable data={tasks} columns={columns} onTaskUpdate={handleTaskUpdate} />
  );
}
