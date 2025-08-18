import {
  useAddDocumentMutation,
  useCollectionQuery,
} from "@tanstack-query-firebase/react/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export function CollectionQueryExample() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("medium");
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const firestore = getFirestore();
  const tasksCollection = collection(firestore, "tasks");

  // Create query based on filter
  const tasksQuery =
    filterCompleted !== null
      ? query(tasksCollection, where("completed", "==", filterCompleted))
      : tasksCollection;

  // Query all tasks
  const {
    data: tasksSnapshot,
    isLoading,
    isError,
    error,
  } = useCollectionQuery(tasksQuery, {
    queryKey: ["tasks", filterCompleted],
  });

  // Add task mutation
  const addTaskMutation = useAddDocumentMutation(tasksCollection);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date(),
    };

    try {
      await addTaskMutation.mutateAsync(newTask);
      setNewTaskTitle("");
      setNewTaskPriority("medium");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleTask = async (
    taskId: string,
    currentCompleted: boolean,
  ) => {
    // Note: In a real app, you'd use useUpdateDocumentMutation here
    // For simplicity, we're just showing the query functionality
    console.log(`Would toggle task ${taskId} to ${!currentCompleted}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskRef = doc(firestore, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const tasks =
    (tasksSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]) || [];

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Task Management with useCollectionQuery
      </h2>

      {/* Add Task Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
          </div>
          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(e.target.value as Task["priority"])
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            onClick={handleAddTask}
            disabled={addTaskMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addTaskMutation.isPending ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-4 items-center">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <button
          onClick={() => setFilterCompleted(null)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterCompleted === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterCompleted(false)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterCompleted === false
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterCompleted(true)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterCompleted === true
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Query Status */}
      <div className="mb-4">
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">Error loading tasks</h3>
            <p className="text-red-600 text-sm mt-1">
              {error?.message || "An unknown error occurred"}
            </p>
          </div>
        )}
      </div>

      {/* Tasks List */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filterCompleted === null
                ? "No tasks found. Add your first task above!"
                : `No ${
                    filterCompleted ? "completed" : "pending"
                  } tasks found.`}
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  task.completed
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id, task.completed)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Created: {task.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Query Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Query Information</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Query Key:</strong>{" "}
            {JSON.stringify(["tasks", filterCompleted])}
          </p>
          <p>
            <strong>Total Tasks:</strong> {tasks.length}
          </p>
          <p>
            <strong>Filter:</strong>{" "}
            {filterCompleted === null
              ? "All"
              : filterCompleted
                ? "Completed"
                : "Pending"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {isLoading ? "Loading" : isError ? "Error" : "Success"}
          </p>
        </div>
      </div>
    </div>
  );
}
