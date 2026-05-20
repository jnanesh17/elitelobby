import { useState } from "react";
import {
  useListMembers,
  getListMembersQueryKey,
  useCreateMember,
  useDeleteMember,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useForm } from "react-hook-form";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-500/15 text-violet-600 border-violet-200",
  manager: "bg-blue-500/15 text-blue-600 border-blue-200",
  developer: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
  designer: "bg-pink-500/15 text-pink-600 border-pink-200",
  viewer: "bg-muted text-muted-foreground",
};

export default function Members() {
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useListMembers({ query: { queryKey: getListMembersQueryKey() } });
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { name: "", email: "", role: "developer", avatarUrl: "" },
  });

  function onSubmit(data: any) {
    createMember.mutate(
      { data: { name: data.name, email: data.email, role: data.role, avatarUrl: data.avatarUrl || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
          setOpen(false);
          reset();
        },
      }
    );
  }

  function handleDelete(id: number) {
    deleteMember.mutate(
      { id },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }) }
    );
  }

  function initials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">
            {members?.length ?? 0} member{members?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (members ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl">
          <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="font-medium text-muted-foreground">No team members yet</p>
          <Button className="mt-6 gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(members ?? []).map((member) => (
            <Card key={member.id} className="group hover:border-primary/40 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={`text-xs capitalize ${ROLE_COLORS[member.role] ?? ""}`}>
                    {member.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {member.taskCount ?? 0} task{(member.taskCount ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mName">Full Name</Label>
              <Input id="mName" placeholder="Jane Smith" {...register("name", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mEmail">Email</Label>
              <Input id="mEmail" type="email" placeholder="jane@company.com" {...register("email", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select defaultValue="developer" onValueChange={(v) => setValue("role", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
              <Button type="submit" disabled={createMember.isPending}>
                {createMember.isPending ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
