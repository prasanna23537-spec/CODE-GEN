import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, ShieldCheck, Users, Code2, Star, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { initActivityLine, initLanguageBar, initRatingDonut, initFeedbackBar, initUserActivityLine, generateAdminDashboardData } from "@/lib/analytics-charts";
import {
  getAllUsers,
  getAllPrompts,
  deleteUser as storeDeleteUser,
  updateUserRole,
  deletePrompt as storeDeletePrompt,
  initializeDummyData,
  type StoredUser,
  type StoredPrompt,
} from "@/lib/store";

export default function AdminPage() {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [prompts, setPrompts] = useState<StoredPrompt[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Initialize dummy data if store is empty
    initializeDummyData();
    
    const allUsers = getAllUsers();
    const allPrompts = getAllPrompts();
    setUsers(allUsers);
    setPrompts(allPrompts);
    setDashboardData(generateAdminDashboardData(allUsers, allPrompts));
  }, []);

  useEffect(() => {
    if (dashboardData) {
      try {
        initActivityLine("adminActivityLineCanvas", dashboardData.activity);
        initLanguageBar("adminLanguageBarCanvas", dashboardData.languageUsage);
        initRatingDonut("adminRatingDonutCanvas", dashboardData.ratingDistribution);
        initFeedbackBar("adminFeedbackBarCanvas", dashboardData.feedbackTags);
        initUserActivityLine("adminUserActivityLineCanvas", dashboardData.userActivity);
      } catch (e) {
        console.warn("Analytics init skipped:", e);
      }
    }
  }, [dashboardData]);

  const handleDeleteUser = (id: string) => {
    storeDeleteUser(id);
    const updatedUsers = getAllUsers();
    setUsers(updatedUsers);
    setDashboardData(generateAdminDashboardData(updatedUsers, prompts));
    toast.success("User deleted");
  };

  const handlePromoteUser = (id: string) => {
    updateUserRole(id, "admin");
    const updatedUsers = getAllUsers();
    setUsers(updatedUsers);
    setDashboardData(generateAdminDashboardData(updatedUsers, prompts));
    toast.success("User promoted to admin");
  };

  const handleDeletePrompt = (id: string) => {
    storeDeletePrompt(id);
    const updatedPrompts = getAllPrompts();
    setPrompts(updatedPrompts);
    setDashboardData(generateAdminDashboardData(users, updatedPrompts));
    toast.success("Prompt deleted");
  };

  const getAverageRating = () => {
    if (!dashboardData) return 4.5;
    const ratings = dashboardData.ratingDistribution.labels.map((l: string) => parseInt(l));
    const ratingValues = dashboardData.ratingDistribution.values;
    const totalRating = ratings.reduce((sum: number, r: number, i: number) => sum + r * ratingValues[i], 0);
    const totalCount = ratingValues.reduce((sum: number, v: number) => sum + v, 0);
    return totalCount === 0 ? 0 : (totalRating / totalCount).toFixed(1);
  };

  const getTopLanguage = () => {
    if (!dashboardData || dashboardData.languageUsage.labels.length === 0) return "N/A";
    const idx = dashboardData.languageUsage.values.indexOf(Math.max(...dashboardData.languageUsage.values));
    return dashboardData.languageUsage.labels[idx] || "N/A";
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <ShieldCheck className="h-8 w-8 text-primary" /> Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">Manage users and monitor all generated prompts.</p>
      </div>

      {/* Enhanced Stats Cards - 4 columns */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Snippets Saved</p>
              <p className="text-3xl font-bold mt-2">{prompts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total prompts</p>
            </div>
            <Code2 className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-3xl font-bold mt-2">{getAverageRating()}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of 5</p>
            </div>
            <Star className="h-8 w-8 text-amber-500 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top Language</p>
              <p className="text-3xl font-bold mt-2">{getTopLanguage()}</p>
              <p className="text-xs text-muted-foreground mt-1">Most popular</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Activity & Language Usage Charts */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="border-b border-border/50 p-3">
            <h3 className="font-semibold">Activity (last 14 days)</h3>
            <p className="text-sm text-muted-foreground">Daily user activity</p>
          </div>
          <div className="p-4 h-64">
            <canvas id="adminActivityLineCanvas" aria-label="Activity chart"></canvas>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="border-b border-border/50 p-3">
            <h3 className="font-semibold">Language Usage</h3>
            <p className="text-sm text-muted-foreground">Most used technologies</p>
          </div>
          <div className="p-4 h-64">
            <canvas id="adminLanguageBarCanvas" aria-label="Language usage chart"></canvas>
          </div>
        </div>
      </div>

      {/* Rating & Feedback Charts */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="border-b border-border/50 p-3">
            <h3 className="font-semibold">Rating Distribution</h3>
            <p className="text-sm text-muted-foreground">Donut chart of user ratings</p>
          </div>
          <div className="p-4 h-56">
            <canvas id="adminRatingDonutCanvas" aria-label="Rating distribution chart"></canvas>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="border-b border-border/50 p-3">
            <h3 className="font-semibold">Feedback Tags</h3>
            <p className="text-sm text-muted-foreground">Bar chart showing top feedback topics</p>
          </div>
          <div className="p-4 h-56">
            <canvas id="adminFeedbackBarCanvas" aria-label="Feedback tags chart"></canvas>
          </div>
        </div>

        <div className="sm:col-span-2 rounded-xl border border-border/50 bg-card p-4">
          <div className="border-b border-border/50 p-3">
            <h3 className="font-semibold">User Activity over time</h3>
            <p className="text-sm text-muted-foreground">Line chart of active users</p>
          </div>
          <div className="p-4 h-64">
            <canvas id="adminUserActivityLineCanvas" aria-label="User activity chart"></canvas>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="prompts">All Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">No registered users yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {u.role !== "admin" && (
                              <Button variant="ghost" size="sm" onClick={() => handlePromoteUser(u.id)}>Promote</Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUser(u.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="mt-4">
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {prompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Code2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">No prompts generated yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prompt</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Language</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {prompts.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">{p.userEmail}</td>
                        <td className="px-4 py-3 font-medium max-w-xs truncate">{p.prompt}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{p.language}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePrompt(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
