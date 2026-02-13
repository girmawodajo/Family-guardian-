
export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  PC = 'PC',
  CONSOLE = 'CONSOLE'
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  owner: string;
  status: 'online' | 'offline';
  lastSeen: string;
  screenTimeToday: number; // minutes
  battery: number;
  callRecordingEnabled: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DetailedActivity {
  id: string;
  type: 'website' | 'app';
  name: string;
  url?: string;
  startTime: string;
  duration: number; // minutes
  category: string;
  icon: string;
}

export interface CallLog {
  id: string;
  contact: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration: string;
  hasRecording: boolean;
  recordingUrl?: string;
  deviceId: string;
}

export interface SocialFlag {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'Discord' | 'TikTok' | 'Snapchat';
  sender: string;
  content: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  timestamp: string;
}

export interface SocialMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isIncoming: boolean;
  isDeleted?: boolean; // New: Full access simulation
  sentiment?: 'positive' | 'neutral' | 'toxic' | 'predatory'; // New: AI Insights
}

export interface SocialConversation {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'Discord' | 'TikTok' | 'Snapchat';
  contactName: string;
  contactRisk: 'Safe' | 'Guarded' | 'Critical'; // New: Contact profiling
  lastMessage: string;
  messages: SocialMessage[];
  isDecrypted?: boolean;
  usageTimeToday: number; // minutes
}

export interface Rule {
  id: string;
  title: string;
  type: 'block' | 'limit' | 'schedule';
  target: string;
  status: boolean;
}

export interface FileRecord {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'archive' | 'other';
  extension: string;
  size: string;
  owner: string;
  lastModified: string;
  riskLevel: 'low' | 'medium' | 'high';
  path: string;
  thumbnail?: string;
}

export interface AppInventory {
  id: string;
  name: string;
  version: string;
  category: 'Social' | 'Gaming' | 'Education' | 'System' | 'Entertainment';
  status: 'installed' | 'restricted' | 'blocked' | 'installing';
  installDate: string;
  size: string;
  icon: string;
  description: string;
}

export interface AssistantHistoryItem {
  id: string;
  timestamp: number;
  query: string;
  type: 'text' | 'image';
  imagePreview?: string;
  response: {
    content: string;
    suggestions: string[];
    riskLevel?: string;
    detectedPlatform?: string;
  };
}

export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  isRead: boolean;
}
