/* Reusable analytics chart initializers using global Chart (loaded via CDN)
   - Exports init functions that accept canvas element ids and data objects
   - Uses responsive defaults and modern card-friendly styling
*/

declare const Chart: any;

type RatingData = { labels: string[]; values: number[] };
type FeedbackData = { labels: string[]; values: number[] };
type ActivityData = { labels: string[]; values: number[] };

const defaultColors = [
  "#06b6d4",
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
];

function getOrCreateCtx(id: string): CanvasRenderingContext2D | null {
  const el = document.getElementById(id) as HTMLCanvasElement | null;
  if (!el) return null;
  return el.getContext("2d");
}

export function initRatingDonut(canvasId: string, data: RatingData) {
  const ctx = getOrCreateCtx(canvasId);
  if (!ctx) return null;
  // @ts-ignore
  if ((window as any)[canvasId + "_chart"]) {
    // destroy previous chart if exists
    (window as any)[canvasId + "_chart"].destroy();
  }
  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.labels.map((_, i) => defaultColors[i % defaultColors.length]),
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { boxWidth: 12, padding: 8 } },
      },
    },
  });
  (window as any)[canvasId + "_chart"] = chart;
  return chart;
}

export function initFeedbackBar(canvasId: string, data: FeedbackData) {
  const ctx = getOrCreateCtx(canvasId);
  if (!ctx) return null;
  if ((window as any)[canvasId + "_chart"]) {
    (window as any)[canvasId + "_chart"].destroy();
  }
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Count",
          data: data.values,
          backgroundColor: defaultColors.slice(0, data.labels.length),
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      plugins: { legend: { display: false } },
    },
  });
  (window as any)[canvasId + "_chart"] = chart;
  return chart;
}

export function initUserActivityLine(canvasId: string, data: ActivityData) {
  const ctx = getOrCreateCtx(canvasId);
  if (!ctx) return null;
  if ((window as any)[canvasId + "_chart"]) {
    (window as any)[canvasId + "_chart"].destroy();
  }
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Active Users",
          data: data.values,
          fill: true,
          backgroundColor: "rgba(59,130,246,0.08)",
          borderColor: "#3b82f6",
          tension: 0.25,
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      plugins: { legend: { display: false } },
    },
  });
  (window as any)[canvasId + "_chart"] = chart;
  return chart;
}

// Example dummy data that can be imported and later replaced by backend data
export const sampleAnalyticsData = {
  ratingDistribution: { labels: ["5★", "4★", "3★", "2★", "1★"], values: [45, 25, 15, 8, 7] },
  feedbackTags: { labels: ["UI", "Performance", "Docs", "Bug", "Feature"], values: [34, 21, 18, 12, 10] },
  userActivity: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [120, 150, 140, 170, 200, 180, 160] },
};

export function initAllAnalytics(prefixIds: { donut: string; bar: string; line: string }, data = sampleAnalyticsData) {
  const donut = initRatingDonut(prefixIds.donut, data.ratingDistribution);
  const bar = initFeedbackBar(prefixIds.bar, data.feedbackTags);
  const line = initUserActivityLine(prefixIds.line, data.userActivity);
  return { donut, bar, line };
}
