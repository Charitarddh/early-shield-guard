import { Shield, ShieldAlert, ShieldX } from "lucide-react";
import type { ThreatLevel } from "@/lib/simulation";

const config: Record<ThreatLevel, { icon: React.ReactNode; label: string; className: string }> = {
  safe: {
    icon: <Shield className="w-6 h-6" />,
    label: "System Safe",
    className: "text-safe glow-green border-safe/30 bg-safe/10",
  },
  warning: {
    icon: <ShieldAlert className="w-6 h-6" />,
    label: "Suspicious Activity",
    className: "text-caution glow-yellow border-caution/30 bg-caution/10",
  },
  critical: {
    icon: <ShieldX className="w-6 h-6" />,
    label: "Ransomware Detected!",
    className: "text-danger glow-red border-danger/30 bg-danger/10 animate-pulse",
  },
};

export function StatusBar({ level }: { level: ThreatLevel }) {
  const c = config[level];
  return (
    <div className={`rounded-lg border p-4 flex items-center gap-3 ${c.className}`}>
      {c.icon}
      <div>
        <div className="font-semibold text-lg">{c.label}</div>
        <div className="text-xs opacity-70">
          {level === "safe" && "No suspicious behavior detected"}
          {level === "warning" && "Monitoring escalated — potential threat"}
          {level === "critical" && "Immediate action recommended — potential ransomware"}
        </div>
      </div>
    </div>
  );
}
