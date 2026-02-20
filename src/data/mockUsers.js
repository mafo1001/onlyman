// Mock user data for ONLYMAN
const names = [
  'Marcus', 'Diego', 'Kai', 'Theo', 'Axel', 'Rafael', 'Liam', 'Noah',
  'Ethan', 'Lucas', 'Mason', 'Oliver', 'Elijah', 'James', 'Benjamin',
  'Dante', 'Felix', 'Hugo', 'Ivan', 'Jasper', 'Roman', 'Soren',
  'Viktor', 'Zane', 'Adrian', 'Blake', 'Cyrus', 'Dex', 'Emilio', 'Finn',
  'Gabriel', 'Hector', 'Idris', 'Jace', 'Kendrick', 'Leo', 'Miguel',
  'Nico', 'Oscar', 'Phoenix'
];

const bios = [
  "Adventure seeker. Coffee addict. Let's explore the city together 🌃",
  "Gym rat by day, foodie by night. Looking for someone to share both 💪",
  "Artist & musician. Into deep conversations and good vibes ✨",
  "Tech nerd who loves hiking. Seeking genuine connection 🏔️",
  "Just moved here. Show me around? 🗺️",
  "Bookworm with a wild side. Don't let the glasses fool you 📚",
  "Professional chef. I'll cook you dinner if you bring the wine 🍷",
  "Traveler. 30+ countries. Looking for my next adventure partner ✈️",
  "Fitness coach. Passionate about health and deep conversations 🏋️",
  "Photographer. I see beauty in everything and everyone 📸",
  "DJ on weekends, software engineer on weekdays. Best of both worlds 🎧",
  "Dog dad. If you don't like dogs, we won't work out 🐕",
  "Surfer vibes. Beach lover. Sunset chaser 🌊",
  "Lawyer by profession, dancer by passion 💃",
  "Minimalist lifestyle. Maximum love to give ❤️",
  "Into motorsports, craft beer, and spontaneous road trips 🏎️",
  "Yoga instructor. Flexible in every way 🧘‍♂️",
  "Film buff. Let's binge-watch something together 🎬",
  "Architect. I build things, including great relationships 🏗️",
  "Marathon runner. I go the distance 🏃‍♂️",
  "Night owl. Best conversations happen after midnight 🦉",
  "Veggie lover. Cook, eat, repeat 🥗",
  "Skater. Punk rock. Don't take life too seriously 🛹",
  "Pilot. My head's in the clouds, but my heart's on the ground ✈️",
  "Tattoo artist. Every mark tells a story 🎨",
  "Firefighter. I know how to handle the heat 🔥",
  "Med student. Tired but worth it 🩺",
  "Personal trainer. Let me motivate you 💪",
  "Bartender. I make great cocktails and even better conversation 🍸",
  "Musician. Strings attached 🎸"
];

const tribes = ['Bear', 'Jock', 'Twink', 'Otter', 'Daddy', 'Geek', 'Rugged', 'Discreet', 'Leather', 'Clean-cut'];

const interests = [
  'Gym', 'Travel', 'Music', 'Cooking', 'Photography', 'Hiking',
  'Movies', 'Gaming', 'Art', 'Dancing', 'Yoga', 'Reading',
  'Surfing', 'Cycling', 'Running', 'Wine', 'Coffee', 'Dogs',
  'Tattoos', 'Fashion', 'Tech', 'Outdoors', 'Nightlife', 'Food'
];

const lookingFor = ['Chat', 'Dates', 'Friends', 'Relationship', 'Networking', 'Right Now'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min, max) {
  const count = randomBetween(min, max);
  const shuffled = [...arr];
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function generateDistance() {
  const r = Math.random();
  if (r < 0.3) return (Math.random() * 1).toFixed(1);
  if (r < 0.6) return (Math.random() * 5).toFixed(1);
  if (r < 0.85) return (Math.random() * 20).toFixed(0);
  return (Math.random() * 80 + 20).toFixed(0);
}

function generateCoords(baseLat, baseLng, maxKm) {
  const kmToDeg = 1 / 111;
  const dLat = (Math.random() - 0.5) * 2 * maxKm * kmToDeg;
  const dLng = (Math.random() - 0.5) * 2 * maxKm * kmToDeg;
  return {
    lat: baseLat + dLat,
    lng: baseLng + dLng
  };
}

// Placeholder avatar URLs using DiceBear
function getAvatar(seed) {
  return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}&backgroundColor=1a1a1a`;
}

const statuses = ['online', 'online', 'online', 'away', 'offline'];

export function generateMockUsers(count = 40, baseLat = 45.5017, baseLng = -73.5673) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const age = randomBetween(20, 55);
    const coords = generateCoords(baseLat, baseLng, 50);
    const distKm = generateDistance();
    const status = randomFrom(statuses);
    const lastSeen = status === 'online' ? 'Now' : 
      status === 'away' ? `${randomBetween(5, 59)}min ago` :
      `${randomBetween(1, 23)}h ago`;
    
    users.push({
      id: `user-${i + 1}`,
      name,
      age,
      bio: randomFrom(bios),
      avatar: getAvatar(`${name}-${i}`),
      photos: [
        getAvatar(`${name}-${i}-1`),
        getAvatar(`${name}-${i}-2`),
        getAvatar(`${name}-${i}-3`),
      ],
      distance: parseFloat(distKm),
      distanceUnit: 'km',
      coords,
      status,
      lastSeen,
      tribe: randomFrom(tribes),
      interests: randomSubset(interests, 2, 6),
      lookingFor: randomSubset(lookingFor, 1, 3),
      height: `${randomBetween(165, 200)}cm`,
      weight: `${randomBetween(60, 110)}kg`,
      bodyType: randomFrom(['Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large']),
      position: randomFrom(['Top', 'Bottom', 'Versatile', 'Side']),
      verified: Math.random() > 0.4,
      isNew: Math.random() > 0.8,
      rightNow: Math.random() > 0.85,
      hasStory: Math.random() > 0.6,
      unreadMessages: Math.random() > 0.7 ? randomBetween(1, 5) : 0,
    });
  }
  return users.sort((a, b) => a.distance - b.distance);
}

export function generateMockMessages(users) {
  const messageTemplates = [
    "Hey, how's it going? 👋",
    "Nice profile! What are you up to tonight?",
    "Love your pics! You're cute 😏",
    "Want to grab a drink sometime?",
    "Hey handsome 🔥",
    "Just saw you're nearby! What's up?",
    "That bio is hilarious 😂",
    "Are you new here? Haven't seen you before",
    "Cool interests! We have a lot in common",
    "Hey! Looking to meet up?",
  ];

  const conversations = [];
  const chatUsers = users.filter(() => Math.random() > 0.5).slice(0, 12);
  
  chatUsers.forEach((user, idx) => {
    const msgs = [];
    const msgCount = randomBetween(1, 8);
    for (let i = 0; i < msgCount; i++) {
      const isFromThem = Math.random() > 0.4;
      msgs.push({
        id: `msg-${idx}-${i}`,
        text: randomFrom(messageTemplates),
        fromMe: !isFromThem,
        timestamp: new Date(Date.now() - randomBetween(0, 86400000 * 3)),
        read: i < msgCount - 1 || !isFromThem,
      });
    }
    msgs.sort((a, b) => a.timestamp - b.timestamp);
    
    conversations.push({
      id: `conv-${idx}`,
      user,
      messages: msgs,
      lastMessage: msgs[msgs.length - 1],
      unread: msgs.filter(m => !m.fromMe && !m.read).length,
    });
  });

  return conversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
}

function futureDate(daysFromNow, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} • ${h12} ${ampm}`;
}

export function generateMockEvents() {
  return [
    {
      id: 'evt-1',
      title: 'Pride Night Out',
      description: 'Join us for an unforgettable night of music, dancing, and celebration!',
      date: futureDate(2, 22),
      location: 'Downtown Club',
      distance: '2.3 km',
      attendees: 148,
      image: '🌈',
      category: 'Party'
    },
    {
      id: 'evt-2', 
      title: 'Coffee & Connect',
      description: 'Casual meetup for guys who prefer coffee over cocktails. Great for making new friends.',
      date: futureDate(3, 14),
      location: 'The Green Bean Café',
      distance: '0.8 km',
      attendees: 32,
      image: '☕',
      category: 'Social'
    },
    {
      id: 'evt-3',
      title: 'Hiking Group',
      description: 'Weekly hike for fitness lovers. All levels welcome!',
      date: futureDate(5, 9),
      location: 'Mountain Trail Head',
      distance: '5.1 km',
      attendees: 24,
      image: '🏔️',
      category: 'Outdoors'
    },
    {
      id: 'evt-4',
      title: 'Game Night',
      description: 'Board games, video games, and great company. Bring your competitive spirit!',
      date: futureDate(6, 19),
      location: 'The Arcade Bar',
      distance: '1.5 km',
      attendees: 45,
      image: '🎮',
      category: 'Social'
    },
    {
      id: 'evt-5',
      title: 'Leather & Lace',
      description: 'Fetish night. Dress code enforced. 18+ only.',
      date: futureDate(9, 23),
      location: 'The Underground',
      distance: '3.7 km',
      attendees: 89,
      image: '⛓️',
      category: 'Party'
    },
    {
      id: 'evt-6',
      title: 'Art Gallery Opening',
      description: 'Queer artists showcase. Wine reception included.',
      date: futureDate(7, 18),
      location: 'Modern Art Space',
      distance: '1.2 km',
      attendees: 67,
      image: '🎨',
      category: 'Culture'
    },
  ];
}
