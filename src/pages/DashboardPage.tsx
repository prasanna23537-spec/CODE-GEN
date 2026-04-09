import { useAuth } from "@/context/AuthContext";
import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Zap, History, ArrowRight, TrendingUp } from "lucide-react";
import { getPromptsByUser, getTodayPromptCount } from "@/lib/store";
import { initAllAnalytics, sampleAnalyticsData } from "@/lib/analytics-charts";
import FeedbackForm from "@/components/FeedbackForm";

export default function DashboardPage() {
  const { user } = useAuth();

  const userPrompts = user ? getPromptsByUser(user.id) : [];
  const todayCount = user ? getTodayPromptCount(user.id) : 0;

  const stats = [
    { label: "Prompts Today", value: String(todayCount), max: "/5", icon: Code2, color: "text-primary" },
    { label: "Total Generated", value: String(userPrompts.length), icon: TrendingUp, color: "text-success" },
  ];

  const recentPrompts = userPrompts.slice(0, 5);

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (user?.role !== "admin") return;
    // Fetch real analytics from backend and initialize charts
    const fetchAndInit = async () => {
      try {
        const res = await fetch('/api/feedback-stats');
        if (!res.ok) {
          initAllAnalytics({ donut: 'ratingDonutCanvas', bar: 'feedbackBarCanvas', line: 'userActivityLineCanvas' }, sampleAnalyticsData);
          return;
        }
        const json = await res.json();
        if (!json.success) {
          initAllAnalytics({ donut: 'ratingDonutCanvas', bar: 'feedbackBarCanvas', line: 'userActivityLineCanvas' }, sampleAnalyticsData);
          return;
        }
        // build rating distribution labels/values in order 5..1
        const ratings = json.ratings || json.ratings || {};
        const ratingValues = [5,4,3,2,1].map(n => Number(ratings[String(n)] || 0));
        const ratingData = { labels: ['5★','4★','3★','2★','1★'], values: ratingValues };

        const tagsObj = json.tags || {};
        const tagLabels = Object.keys(tagsObj);
        const tagValues = tagLabels.map(k => Number(tagsObj[k] || 0));
        const tagData = { labels: tagLabels, values: tagValues };

        initAllAnalytics({ donut: 'ratingDonutCanvas', bar: 'feedbackBarCanvas', line: 'userActivityLineCanvas' }, { ratingDistribution: ratingData, feedbackTags: tagData, userActivity: sampleAnalyticsData.userActivity });
      } catch (e) {
        // fallback to sample data
        initAllAnalytics({ donut: 'ratingDonutCanvas', bar: 'feedbackBarCanvas', line: 'userActivityLineCanvas' }, sampleAnalyticsData);
      }
    };
    fetchAndInit();
  }, [user?.role]);

  const refreshAnalytics = useCallback(async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await fetch('/api/feedback-stats');
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success) return;
      const ratings = json.ratings || {};
      const ratingValues = [5,4,3,2,1].map(n => Number(ratings[String(n)] || 0));
      const ratingData = { labels: ['5★','4★','3★','2★','1★'], values: ratingValues };
      const tagsObj = json.tags || {};
      const tagLabels = Object.keys(tagsObj);
      const tagValues = tagLabels.map(k => Number(tagsObj[k] || 0));
      const tagData = { labels: tagLabels, values: tagValues };
      initAllAnalytics({ donut: 'ratingDonutCanvas', bar: 'feedbackBarCanvas', line: 'userActivityLineCanvas' }, { ratingDistribution: ratingData, feedbackTags: tagData, userActivity: sampleAnalyticsData.userActivity });
    } catch (e) {
      // ignore
    }
  }, [user?.role]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's an overview of your coding activity.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="mt-2 text-3xl font-bold">
              {stat.value}<span className="text-lg text-muted-foreground">{stat.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link to="/generate" className="group rounded-xl border border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary/10 hover:shadow-glow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Generate Code</h3>
              <p className="text-sm text-muted-foreground">Create new code with AI</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-primary opacity-0 transition-all group-hover:opacity-100" />
          </div>
        </Link>
        <Link to="/history" className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">View History</h3>
              <p className="text-sm text-muted-foreground">Browse past generations</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <div className="border-b border-border/50 p-4">
          <h2 className="font-semibold">Recent Prompts</h2>
        </div>
        {recentPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Code2 className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No prompts yet. Start generating!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {recentPrompts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{p.prompt}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{p.language}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback form (for all users) */}
      <FeedbackForm onSuccess={refreshAnalytics} />

      {/* Admin-only features */}
      {user?.role === "admin" && (
        <div>
          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="font-semibold mb-2">Admin Features</h2>
            <ul className="list-disc pl-5">
              <li>View all users</li>
              <li>Manage prompts</li>
              <li>Access admin analytics</li>
            </ul>
          </div>

          {/* Dashboard Analytics - non-invasive add-on */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="border-b border-border/50 p-3">
                <h3 className="font-semibold">Rating Distribution</h3>
                <p className="text-sm text-muted-foreground">Donut chart of user ratings</p>
              </div>
              <div className="p-4 h-56">
                <canvas id="ratingDonutCanvas" aria-label="Rating distribution chart"></canvas>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="border-b border-border/50 p-3">
                <h3 className="font-semibold">Feedback Tags</h3>
                <p className="text-sm text-muted-foreground">Bar chart showing top feedback topics</p>
              </div>
              <div className="p-4 h-56">
                <canvas id="feedbackBarCanvas" aria-label="Feedback tags chart"></canvas>
              </div>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-border/50 bg-card p-4">
              <div className="border-b border-border/50 p-3">
                <h3 className="font-semibold">User Activity over time</h3>
                <p className="text-sm text-muted-foreground">Line chart of active users</p>
              </div>
              <div className="p-4 h-64">
                <canvas id="userActivityLineCanvas" aria-label="User activity chart" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Plan Daily Limit Reminder */}
      {todayCount >= 4 && (
        <div className="mt-8 rounded-xl border border-info/30 bg-info/5 p-6 text-center">
          <p className="font-medium">You've used {todayCount} of 5 free prompts today</p>
          <p className="mt-1 text-sm text-muted-foreground">Please come back tomorrow for more free generations</p>
        </div>
      )}
    </div>
  );
}
