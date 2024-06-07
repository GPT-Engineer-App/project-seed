import React from "react";
import { useSupabaseAuth, SupabaseAuthUI } from "./integrations/supabase/auth.jsx";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from "./integrations/supabase/index.js";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useForm } from "react-hook-form";

function App() {
  const { session, logout } = useSupabaseAuth();

  const { register, handleSubmit, reset } = useForm();
  const { data: tasks, isLoading, isError } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTask, setEditingTask] = React.useState(null);

  const onSubmit = async (data) => {
    if (editingTask) {
      await updateTask.mutateAsync({ ...editingTask, ...data });
      setEditingTask(null);
    } else {
      await addTask.mutateAsync(data);
    }
    reset();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    reset(task);
  };

  const handleDelete = async (taskId) => {
    await deleteTask.mutateAsync(taskId);
  };

  return (
    <div>
      <NavigationMenu className="bg-gray-800 text-white p-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>My App</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
              <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {session ? (
              <Button variant="outline" onClick={logout}>Logout</Button>
            ) : (
              <Button variant="outline" asChild>
                <a href="/login">Login</a>
              </Button>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main className="p-4">
        {session ? (
          <div>
            <h2 className="text-2xl font-bold">Welcome, {session.user.email}</h2>
            <p className="text-gray-600">This is your dashboard.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
                  <DialogDescription>
                    {editingTask ? "Edit the details of your task." : "Fill in the details of your new task."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input {...register("task_name")} placeholder="Task Name" required />
                  <Textarea {...register("task_description")} placeholder="Task Description" required />
                  <DialogFooter>
                    <Button type="submit">{editingTask ? "Update Task" : "Add Task"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : isError ? (
                <p>Error loading tasks.</p>
              ) : (
                tasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <CardTitle>{task.task_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{task.task_description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => handleEdit(task)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(task.id)}>Delete</Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold">Welcome to My App</h2>
            <p className="text-gray-600">Please log in to access your dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;