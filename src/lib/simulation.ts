export type ActivityType = 
  | "file_access" 
  | "file_rename" 
  | "file_modify" 
  | "screen_lock" 
  | "encryption";

export type ThreatLevel = "safe" | "warning" | "critical";

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: ActivityType;
  detail: string;
  path: string;
  suspicious: boolean;
}

export interface DetectionAlert {
  id: string;
  timestamp: Date;
  rule: string;
  description: string;
  level: ThreatLevel;
  activities: string[];
}

const FILE_PATHS = [
  "/sdcard/DCIM/Camera/IMG_2024.jpg",
  "/sdcard/Documents/report.pdf",
  "/sdcard/Downloads/invoice.docx",
  "/sdcard/Music/track01.mp3",
  "/sdcard/WhatsApp/Media/photo.jpg",
  "/sdcard/Documents/passwords.txt",
  "/sdcard/DCIM/Screenshots/screen01.png",
  "/sdcard/Downloads/backup.zip",
];

const EXTENSIONS_ENCRYPTED = [".locked", ".cry", ".enc", ".ransom"];

let idCounter = 0;
const uid = () => `act-${++idCounter}`;

export function generateNormalActivity(): ActivityLog {
  const path = FILE_PATHS[Math.floor(Math.random() * FILE_PATHS.length)];
  return {
    id: uid(),
    timestamp: new Date(),
    type: "file_access",
    detail: `Read file: ${path.split("/").pop()}`,
    path,
    suspicious: false,
  };
}

export function generateSuspiciousActivity(): ActivityLog {
  const types: ActivityType[] = ["file_rename", "file_modify", "encryption", "screen_lock"];
  const type = types[Math.floor(Math.random() * types.length)];
  const path = FILE_PATHS[Math.floor(Math.random() * FILE_PATHS.length)];
  const fileName = path.split("/").pop()!;

  const details: Record<ActivityType, string> = {
    file_rename: `Renamed ${fileName} → ${fileName}${EXTENSIONS_ENCRYPTED[Math.floor(Math.random() * EXTENSIONS_ENCRYPTED.length)]}`,
    file_modify: `Rapid modification burst: ${fileName} (${Math.floor(Math.random() * 50 + 10)} writes/sec)`,
    encryption: `Encryption detected on ${fileName} — entropy spike to ${(Math.random() * 0.3 + 0.7).toFixed(2)}`,
    screen_lock: `Attempted DeviceAdmin screen lock — unauthorized call`,
    file_access: "",
  };

  return {
    id: uid(),
    timestamp: new Date(),
    type,
    detail: details[type],
    path,
    suspicious: true,
  };
}

// Detection rules
interface DetectionRule {
  name: string;
  description: string;
  check: (activities: ActivityLog[]) => ActivityLog[] | null;
  level: ThreatLevel;
}

export const DETECTION_RULES: DetectionRule[] = [
  {
    name: "Rapid File Rename Burst",
    description: "Multiple file renames with encrypted extensions detected in short window",
    level: "critical",
    check: (activities) => {
      const renames = activities.filter(a => a.type === "file_rename" && a.suspicious);
      return renames.length >= 2 ? renames : null;
    },
  },
  {
    name: "Mass File Modification",
    description: "Abnormal burst of file write operations detected",
    level: "warning",
    check: (activities) => {
      const mods = activities.filter(a => a.type === "file_modify" && a.suspicious);
      return mods.length >= 2 ? mods : null;
    },
  },
  {
    name: "Encryption Activity Detected",
    description: "File entropy spike indicating possible encryption in progress",
    level: "critical",
    check: (activities) => {
      const enc = activities.filter(a => a.type === "encryption");
      return enc.length >= 1 ? enc : null;
    },
  },
  {
    name: "Suspicious Screen Lock Attempt",
    description: "Unauthorized DeviceAdmin API call to lock screen",
    level: "warning",
    check: (activities) => {
      const locks = activities.filter(a => a.type === "screen_lock");
      return locks.length >= 1 ? locks : null;
    },
  },
];

let alertCounter = 0;

export function runDetection(activities: ActivityLog[]): DetectionAlert[] {
  const alerts: DetectionAlert[] = [];
  for (const rule of DETECTION_RULES) {
    const matched = rule.check(activities);
    if (matched) {
      alerts.push({
        id: `alert-${++alertCounter}`,
        timestamp: new Date(),
        rule: rule.name,
        description: rule.description,
        level: rule.level,
        activities: matched.map(a => a.id),
      });
    }
  }
  return alerts;
}
