import { DetectionAlert } from "@/lib/simulation";
import { AlertTriangle, ShieldX } from "lucide-react";

export function AlertPanel({ alerts }: { alerts: DetectionAlert[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Detection Alerts
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {alerts.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">No alerts triggered.</p>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-3 ${
              alert.level === "critical"
                ? "border-danger/40 bg-danger/10 glow-red"
                : "border-caution/40 bg-caution/10 glow-yellow"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {alert.level === "critical" ? (
                <ShieldX className="w-4 h-4 text-danger" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-caution" />
              )}
              <span className={`font-semibold text-sm ${
                alert.level === "critical" ? "text-danger" : "text-caution"
              }`}>
                {alert.rule}
              </span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
