import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetRecentActivity, getGetRecentActivityQueryKey, useGetOverdueTasks, getGetOverdueTasksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Users, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isPast } from "date-fns";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  const { data: activity, isLoading: loadingActivity } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey() }
  });

  const { data: overdue, isLoading: loadingOverdue } = useGetOverdueTasks({
    query: { queryKey: getGetOverdueTasksQueryKey() }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening in your workspace today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Projects" 
          value={summary?.activeProjects} 
          total={summary?.totalProjects}
          icon={FolderKanban} 
          loading={loadingSummary} 
        />
        <StatsCard 
          title="Tasks Completed" 
          value={summary?.completedTasks} 
          total={summary?.totalTasks}
          icon={CheckSquare} 
          loading={loadingSummary} 
        />
        <StatsCard 
          title="Team Members" 
          value={summary?.teamSize} 
          icon={Users} 
          loading={loadingSummary} 
        />
        <StatsCard 
          title="Overdue Tasks" 
          value={summary?.overdueTasks} 
          icon={AlertCircle} 
          loading={loadingSummary} 
          trend="Needs attention"
          trendUp={false}
          alert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Overdue Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Overdue Tasks
              </CardTitle>
              <Link href="/tasks" className="text-sm text-primary hover:underline font-medium">View all</Link>
            </CardHeader>
            <CardContent>
              {loadingOverdue ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : overdue?.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                  No overdue tasks. Great job!
                </div>
              ) : (
                <div className="space-y-4">
                  {overdue?.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg bg-card hover:border-border transition-colors">
                      <div className="flex flex-col gap-1">
                        <Link href={`/projects/${task.projectId}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {task.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{task.projectName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-destructive font-medium">
                            <Clock className="w-3 h-3" />
                            {task.dueDate ? format(parseISO(task.dueDate), 'MMM d') : 'No date'}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs font-mono">{task.status.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="col-span-1 space-y-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : activity?.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No recent activity
                </div>
              ) : (
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                  {activity?.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                      <p className="text-sm leading-snug">
                        <span className="font-semibold text-foreground mr-1">{item.actorName}</span>
                        <span className="text-muted-foreground">{item.description}</span>
                        {item.entityName && <span className="font-medium text-foreground ml-1">{item.entityName}</span>}
                      </p>
                      <span className="text-xs text-muted-foreground font-mono mt-1 block">
                        {format(parseISO(item.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, total, icon: Icon, loading, trend, trendUp, alert }: any) {
  return (
    <Card className={alert ? "border-destructive/50 bg-destructive/5" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className={`text-3xl font-bold font-mono tracking-tighter ${alert ? 'text-destructive' : ''}`}>{value || 0}</h3>
                {total !== undefined && <span className="text-sm text-muted-foreground font-mono">/ {total}</span>}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-md ${alert ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend && !loading && (
          <div className="mt-4 text-xs">
            <span className={trendUp ? "text-emerald-500 font-medium" : "text-destructive font-medium"}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
