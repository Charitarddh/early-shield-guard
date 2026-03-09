import { ActivityLog } from "@/lib/simulation";
import { FileText, FilePen, Lock, ShieldAlert, File } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  file_access: <File className="w-4 h-4 text-muted-foreground" />,
  file_rename: <FilePen className="w-4 h-4 text-caution" />,
  file_modify: <FileText className="w-4 h-4 text-caution" />,
  screen_lock: <Lock className="w-4 h-4 text-danger" />,
  encryption: <ShieldAlert className="w-4 h-4 text-danger" />,
};

export function ActivityMonitor({ activities }: { activities: ActivityLog[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Activity Monitor
      </h2>
      <div className="space-y-1 max-h-[400px] overflow-y-auto font-mono text-xs">
        {activities.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">No activity yet. Start simulation to begin monitoring.</p>
        )}
        {activities.map((a) => (
          <div
            key={a.id}
            className={`flex items-start gap-2 px-2 py-1.5 rounded ${
              a.suspicious ? "bg-danger/10 border border-danger/20" : "hover:bg-secondary/50"
            }`}
          >
            {typeIcons[a.type]}
            <span className="text-muted-foreground shrink-0">
              {a.timestamp.toLocaleTimeString()}
            </span>
            <span className={a.suspicious ? "text-danger" : "text-foreground"}>
              {a.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
