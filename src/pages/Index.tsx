import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActivityMonitor } from "@/components/ActivityMonitor";
import { AlertPanel } from "@/components/AlertPanel";
import { StatusBar } from "@/components/StatusBar";
import { StatsCards } from "@/components/StatsCards";
import {
  ActivityLog,
  DetectionAlert,
  ThreatLevel,
  generateNormalActivity,
  generateSuspiciousActivity,
  runDetection } from
"@/lib/simulation";
import { Play, Square, RotateCcw, Shield } from "lucide-react";

const Index = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [alerts, setAlerts] = useState<DetectionAlert[]>([]);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("safe");
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const addActivity = useCallback(() => {
    stepRef.current++;
    const step = stepRef.current;

    // After ~10 normal events, start injecting suspicious ones
    const isSuspicious = step > 10 && Math.random() < 0.4;
    const activity = isSuspicious ? generateSuspiciousActivity() : generateNormalActivity();

    setActivities((prev) => {
      const next = [activity, ...prev].slice(0, 200);

      // Run detection on recent window
      const recent = next.filter((a) => a.suspicious).slice(0, 20);
      const newAlerts = runDetection(recent);

      if (newAlerts.length > 0) {
        setAlerts((prevAlerts) => {
          const existingRules = new Set(prevAlerts.map((a) => a.rule));
          const unique = newAlerts.filter((a) => !existingRules.has(a.rule));
          return [...unique, ...prevAlerts].slice(0, 50);
        });

        const hasCritical = newAlerts.some((a) => a.level === "critical");
        setThreatLevel(hasCritical ? "critical" : "warning");
      }

      return next;
    });
  }, []);

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(addActivity, 600);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    stop();
    setActivities([]);
    setAlerts([]);
    setThreatLevel("safe");
    stepRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Ransomware Early Warning System</h1>
              <p className="text-xs text-muted-foreground">Android Device Behavioral Monitor-ELEXCENTRA</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!running ?
            <Button onClick={start} size="sm" className="gap-1.5">
                <Play className="w-3.5 h-3.5" /> Start
              </Button> :

            <Button onClick={stop} size="sm" variant="destructive" className="gap-1.5">
                <Square className="w-3.5 h-3.5" /> Stop
              </Button>
            }
            <Button onClick={reset} size="sm" variant="outline" className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        </div>

        {/* Status */}
        <StatusBar level={threatLevel} />

        {/* Stats */}
        <StatsCards activities={activities} alerts={alerts} />

        {/* Main panels */}
        <div className="grid md:grid-cols-2 gap-4">
          <ActivityMonitor activities={activities} />
          <AlertPanel alerts={alerts} />
        </div>
      </div>
    </div>);

};

export default Index;