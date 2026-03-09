import { ActivityLog, DetectionAlert } from "@/lib/simulation";
import { Activity, FileWarning, Bell, Shield } from "lucide-react";

export function StatsCards({
  activities,
  alerts,
}: {
  activities: ActivityLog[];
  alerts: DetectionAlert[];
}) {
  const suspicious = activities.filter((a) => a.suspicious).length;
  const critical = alerts.filter((a) => a.level === "critical").length;

  const stats = [
    { label: "Total Events", value: activities.length, icon: <Activity className="w-4 h-4 text-primary" /> },
    { label: "Suspicious", value: suspicious, icon: <FileWarning className="w-4 h-4 text-caution" /> },
    { label: "Alerts", value: alerts.length, icon: <Bell className="w-4 h-4 text-danger" /> },
    { label: "Critical", value: critical, icon: <Shield className="w-4 h-4 text-danger" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            {s.icon}
            {s.label}
          </div>
          <div className="text-2xl font-bold font-mono">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
