export interface Spark {
  id: string;
  matchName: string;
  matchAge: number;
  matchCity: string;
  matchPhoto: string;
  roomName: string;
  sparkedAt: string;
  lastMessage: string | null;
  voiceIntroAvailable: boolean;
  unread: boolean;
  isNew: boolean;
  online: boolean;
  lastActive: string;
}

export const mockSparks: Spark[] = [
  {
    id: "spark-1",
    matchName: "Lena",
    matchAge: 29,
    matchCity: "Melbourne",
    matchPhoto: "",
    roomName: "Tech Professionals",
    sparkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastMessage: null,
    voiceIntroAvailable: true,
    unread: true,
    isNew: true,
    online: true,
    lastActive: "now",
  },
  {
    id: "spark-2",
    matchName: "James",
    matchAge: 34,
    matchCity: "Sydney",
    matchPhoto: "",
    roomName: "Night Owls",
    sparkedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessage: "That coffee spot you mentioned sounds amazing",
    voiceIntroAvailable: true,
    unread: true,
    isNew: false,
    online: false,
    lastActive: "3 hours ago",
  },
  {
    id: "spark-3",
    matchName: "Priya",
    matchAge: 27,
    matchCity: "Brisbane",
    matchPhoto: "",
    roomName: "Creatives & Makers",
    sparkedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessage: "I'd love to see your work sometime",
    voiceIntroAvailable: false,
    unread: false,
    isNew: false,
    online: true,
    lastActive: "now",
  },
  {
    id: "spark-4",
    matchName: "Oliver",
    matchAge: 38,
    matchCity: "Perth",
    matchPhoto: "",
    roomName: "Over 35",
    sparkedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessage: "Hope your week's going well",
    voiceIntroAvailable: true,
    unread: false,
    isNew: false,
    online: false,
    lastActive: "yesterday",
  },
];

export interface ChatMessage {
  id: string;
  senderId: "me" | "them";
  text: string;
  timestamp: string;
  read: boolean;
}

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "them",
    text: "Hey! That was such a great call. I loved hearing about your travels.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "m2",
    senderId: "me",
    text: "Likewise! Your energy was so warm. Where was that trip to Japan you mentioned?",
    timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "m3",
    senderId: "them",
    text: "Kyoto and Osaka — two weeks last autumn. The food alone was worth it. Have you been?",
    timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "m4",
    senderId: "me",
    text: "Not yet, but it's top of my list. I'm planning something for later this year.",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "m5",
    senderId: "them",
    text: "That coffee spot you mentioned sounds amazing",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
];
