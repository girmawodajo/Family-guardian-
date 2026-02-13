
import { Device, DeviceType, DetailedActivity, CallLog, SocialFlag, Rule, FileRecord, AppInventory, SocialConversation } from './types';

const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const MOCK_DEVICES: Device[] = [
  { 
    id: '1', 
    name: "Leo's iPhone", 
    type: DeviceType.MOBILE, 
    owner: "Leo", 
    status: 'online', 
    lastSeen: 'Just now', 
    screenTimeToday: 145,
    battery: 82,
    callRecordingEnabled: true,
    location: { lat: 40.7128, lng: -74.0060, address: "Lincoln Junior High School" }
  },
  { 
    id: '2', 
    name: "Emma's iPad", 
    type: DeviceType.TABLET, 
    owner: "Emma", 
    status: 'offline', 
    lastSeen: '2h ago', 
    screenTimeToday: 60,
    battery: 14,
    callRecordingEnabled: false,
    location: { lat: 40.7580, lng: -73.9855, address: "Public Library" }
  },
];

export const MOCK_DETAILED_ACTIVITIES: DetailedActivity[] = [
  { id: 'da1', type: 'app', name: 'Roblox', startTime: '14:20', duration: 45, category: 'Gaming', icon: 'fa-gamepad' },
  { id: 'da2', type: 'website', name: 'wikipedia.org', url: 'https://en.wikipedia.org/wiki/Space_X', startTime: '13:45', duration: 15, category: 'Education', icon: 'fa-book' },
  { id: 'da3', type: 'app', name: 'TikTok', startTime: '13:00', duration: 30, category: 'Social', icon: 'fa-brands fa-tiktok' },
];

export const MOCK_CALLS: CallLog[] = [
  { id: 'c1', contact: 'Jake (Friend)', number: '+1 (555) 123-4567', type: 'incoming', timestamp: 'Today, 15:30', duration: '12:45', hasRecording: true, recordingUrl: MOCK_AUDIO_URL, deviceId: '1' },
];

export const MOCK_SOCIAL_FLAGS: SocialFlag[] = [
  { id: 'sf1', platform: 'Instagram', sender: 'stranger_99', content: "Hey, are you home alone right now?", riskLevel: 'high', reason: "Solicitation/Location inquiry", timestamp: '10m ago' },
];

export const MOCK_CONVERSATIONS: SocialConversation[] = [
  {
    id: 'conv1',
    platform: 'WhatsApp',
    contactName: 'Leo (Son)',
    contactRisk: 'Safe',
    lastMessage: 'I will be home late today.',
    usageTimeToday: 42,
    messages: [
      { id: 'm1', sender: 'Leo', content: 'Hey dad, can I stay late at school?', timestamp: '14:00', isIncoming: true, sentiment: 'neutral' },
      { id: 'm2', sender: 'You', content: 'Sure, for how long?', timestamp: '14:05', isIncoming: false },
      { id: 'm3', sender: 'Leo', content: 'I will be home late today.', timestamp: '14:10', isIncoming: true, sentiment: 'positive' }
    ]
  },
  {
    id: 'conv2',
    platform: 'Instagram',
    contactName: 'stranger_99',
    contactRisk: 'Critical',
    lastMessage: '[RECOVERED] Hey, are you home alone right now?',
    usageTimeToday: 12,
    messages: [
      { id: 'm4', sender: 'stranger_99', content: 'Hi, I saw your post.', timestamp: 'Yesterday, 22:00', isIncoming: true, sentiment: 'neutral' },
      { id: 'm5', sender: 'stranger_99', content: 'You look cool!', timestamp: 'Yesterday, 22:05', isIncoming: true, sentiment: 'positive' },
      { id: 'm6', sender: 'Leo', content: 'Thanks?', timestamp: 'Yesterday, 22:10', isIncoming: false },
      { id: 'm7', sender: 'stranger_99', content: 'Hey, are you home alone right now?', timestamp: '10:15', isIncoming: true, sentiment: 'predatory', isDeleted: true }
    ]
  },
  {
    id: 'conv3',
    platform: 'Discord',
    contactName: 'GameMaster',
    contactRisk: 'Guarded',
    lastMessage: 'You are such a loser, why do you even play?',
    usageTimeToday: 120,
    messages: [
      { id: 'm8', sender: 'GameMaster', content: 'GG easy.', timestamp: '2h ago', isIncoming: true, sentiment: 'neutral' },
      { id: 'm9', sender: 'Leo', content: 'It was a close game though.', timestamp: '2h ago', isIncoming: false },
      { id: 'm10', sender: 'GameMaster', content: 'You are such a loser, why do you even play?', timestamp: '1h ago', isIncoming: true, sentiment: 'toxic' }
    ]
  },
  {
    id: 'conv4',
    platform: 'TikTok',
    contactName: 'TrendBot',
    contactRisk: 'Safe',
    lastMessage: 'Check out the latest challenge!',
    usageTimeToday: 85,
    messages: [
      { id: 'm11', sender: 'TrendBot', content: 'New video trend!', timestamp: '09:00', isIncoming: true, sentiment: 'positive' }
    ]
  },
  {
    id: 'conv5',
    platform: 'Snapchat',
    contactName: 'Emma (Daughter)',
    contactRisk: 'Safe',
    lastMessage: 'Look at this funny filter!',
    usageTimeToday: 15,
    messages: [
      { id: 'm12', sender: 'Emma', content: 'Look at this funny filter!', timestamp: '10m ago', isIncoming: true, sentiment: 'positive' }
    ]
  }
];

export const INITIAL_RULES: Rule[] = [
  { id: 'r1', title: 'Bedtime Mode', type: 'schedule', target: 'All Devices', status: true },
  { id: 'r2', title: 'Block Adult Content', type: 'block', target: 'Web Browsing', status: true },
];

export const MOCK_FILES: FileRecord[] = [
  { id: 'f1', name: 'homework.pdf', type: 'document', extension: 'pdf', size: '1.2 MB', owner: 'Leo', lastModified: '2h ago', riskLevel: 'low', path: '/School/' },
];

export const MOCK_APPS: AppInventory[] = [
  { id: 'app1', name: 'Instagram', version: '272.0', category: 'Social', status: 'installed', installDate: '2023-01-12', size: '142 MB', icon: 'fa-brands fa-instagram', description: 'Photo & Video Sharing' },
  { id: 'app2', name: 'TikTok', version: '28.1', category: 'Social', status: 'installed', installDate: '2023-02-05', size: '210 MB', icon: 'fa-brands fa-tiktok', description: 'Short-form Video' },
  { id: 'app3', name: 'Roblox', version: '2.560', category: 'Gaming', status: 'installed', installDate: '2022-11-20', size: '320 MB', icon: 'fa-gamepad', description: 'User-Generated Gaming' },
  { id: 'app4', name: 'Discord', version: '162.0', category: 'Social', status: 'restricted', installDate: '2023-03-10', size: '85 MB', icon: 'fa-brands fa-discord', description: 'Chat & Communities' },
  { id: 'app5', name: 'Snapchat', version: '12.2', category: 'Social', status: 'blocked', installDate: '2023-01-15', size: '120 MB', icon: 'fa-brands fa-snapchat', description: 'Ephemeral Messaging' },
];
