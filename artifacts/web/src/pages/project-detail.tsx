import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetProject,
  getGetProjectQueryKey,
  useListProjectTasks,
  getListProjectTasksQueryKey,
  useListMembers,
  getListMembersQueryKey,
  useUpdateProject,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/15 text-blue-600 border-blue-200",
  in_review: "bg-amber-500/15 text-amber-600 border-amber-200",
  done: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/15 text-blue-600",
  high: "bg-amber-500/15 text-amber-600",
  urgent: "bg-red-500/15 text-red-600",
};

const STATUS_OPTIONS = ["todo", "in_progress", "in_review", "done"];
const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];

function label(val: string) {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  const queryClient = useQueryClient();

  const { data: project, isLoading: loadingProject } = useGetProject(id, {
    query: { enabled: !!id, queryKey: getGetProjectQueryKey(id) },
  });
  const { data: tasks, isLoading: loadingTasks } = useListProjectTasks(id, {
    query: { enabled: !!id, queryKey: getListProjectTasksQueryKey(id) },
  });
  const { data: members } = useListMembers({ query: { queryKey: getListMembersQueryKey() } });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { title: "", description: "", status: "todo", priority: "medium", assigneeId: "", dueDate: "" },
  });

  const progress =
    (project?.taskCount ?? 0) > 0
      ? Math.round(((project?.completedTaskCount ?? 0) / (project?.taskCount ?? 1)) * 100)
      : 0;

  function onSubmit(data: any) {
    createTask.mutate(
      {
        data: {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          priority: data.priority,
          projectId: id,
          assigneeId: data.assigneeId ? parseInt(data.assigneeId) : undefined,
          dueDate: data.dueDate || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectTasksQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(id) });
          setOpen(false);
          reset();
        },
      }
    );
  }

  function handleStatusChange(taskId: number, newStatus: string) {
    updateTask.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectTasksQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(id) });
        },
      }
    );
  }

  function handleDelete(taskId: number) {
    deleteTask.mutate(
      { id: taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectTasksQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(id) });
        },
      }
    );
  }

  // Group tasks by status
  const grouped: Record<string, typeof tasks> = { todo: [], in_progress: [], in_review: [], done: [] };
  for (const task of tasks ?? []) {
    if (grouped[task.status]) grouped[task.status]!.push(task);
    else grouped["todo"]!.push(task);
  }

  if (loadingProject) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects">
          <Button variant="link" className="mt-4">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex-shrink-0"
            style={{ backgroundColor: project.color ?? "#7c3aed" }}
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
            <p className="text-2xl font-bold font-mono mt-1">{project.taskCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Completed</p>
            <p className="text-2xl font-bold font-mono mt-1 text-emerald-600">{project.completedTaskCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Progress</p>
            <div className="mt-2 space-y-1">
              <p className="text-2xl font-bold font-mono">{progress}%</p>
              <Progress value={progress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Due Date</p>
            <p className="text-sm font-medium mt-2">
              {project.dueDate ? format(parseISO(project.dueDate), "MMM d, yyyy") : "No deadline"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Task
        </Button>
      </div>

      {loadingTasks ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (tasks ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
          <p className="font-medium text-muted-foreground text-sm">No tasks yet</p>
          <Button size="sm" className="mt-4 gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Add First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {STATUS_OPTIONS.map((status) => {
            const statusTasks = grouped[status] ?? [];
            if (statusTasks.length === 0) return null;
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-xs ${STATUS_COLORS[status]}`}>
                    {label(status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{statusTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {statusTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-3 border rounded-lg bg-card hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[task.priority] ?? ""}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                            {format(parseISO(task.dueDate), "MMM d")}
                          </span>
                        )}
                        {task.assigneeName ? (
                          <Avatar className="w-6 h-6">
                            {task.assigneeAvatar && <AvatarImage src={task.assigneeAvatar} />}
                            <AvatarFallback className="text-[10px]">
                              {task.assigneeName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                        <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v)}>
                          <SelectTrigger className="h-6 text-xs w-28 border-none bg-transparent p-0 focus:ring-0">
                            <Badge variant="outline" className={`text-xs capitalize ${STATUS_COLORS[task.status]}`}>
                              {label(task.status)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>{label(s)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(task.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task to {project.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="taskTitle">Title</Label>
              <Input id="taskTitle" placeholder="Task title" {...register("title", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taskDesc">Description</Label>
              <Textarea id="taskDesc" placeholder="Optional description" rows={2} {...register("description")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Select onValueChange={(v) => setValue("assigneeId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(members ?? []).map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select defaultValue="medium" onValueChange={(v) => setValue("priority", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>{label(p)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taskDue">Due Date</Label>
              <Input id="taskDue" type="date" {...register("dueDate")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? "Adding..." : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
