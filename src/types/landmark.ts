export type LandmarkCategory = 'landmark' | 'school' | 'dining' | 'special'

export interface Landmark {
  id: string
  name: string
  nameZh: string
  category: LandmarkCategory
  lat: number
  lng: number
  imageUrl?: string
  openingHours?: string
  introduction?: string
  introductionZh?: string
  features?: string[]
  isUserCreated?: boolean
}

export interface LandmarkCategoryInfo {
  id: LandmarkCategory
  name: string
  color: string
  bgColor: string
  icon: string
}

export const CATEGORY_INFO: Record<LandmarkCategory, LandmarkCategoryInfo> = {
  landmark: {
    id: 'landmark',
    name: 'Landmarks',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    icon: 'MapPin'
  },
  school: {
    id: 'school',
    name: 'Schools',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    icon: 'GraduationCap'
  },
  dining: {
    id: 'dining',
    name: 'Dining',
    color: '#22c55e',
    bgColor: 'bg-green-500',
    icon: 'UtensilsCrossed'
  },
  special: {
    id: 'special',
    name: 'Special Spots',
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    icon: 'Heart'
  }
}

export const DEFAULT_LANDMARKS: Landmark[] = [
  {
    id: '1',
    name: 'The Wave',
    nameZh: 'THE WAVE 蜂巢',
    category: 'landmark',
    lat: 1.3456,
    lng: 103.6805,
    imageUrl: 'https://images.unsplash.com/photo-1562783487-623d9030b551?w=800',
    openingHours: 'Open 24 hours',
    introduction: 'A iconic student center with unique architectural design resembling a wave. Popular spot for events and gatherings.',
    introductionZh: '标志性的学生中心，独特的设计如波浪般起伏。是活动和聚会的热门地点。',
    features: ['Student Center', 'Events Hall', 'Study Area']
  },
  {
    id: '2',
    name: 'Lee Kuan Yew School of Public Policy',
    nameZh: '李光耀公共政策学院',
    category: 'school',
    lat: 1.3423,
    lng: 103.6812,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    openingHours: 'Mon-Fri: 8:00 AM - 10:00 PM',
    introduction: 'A leading public policy school in Asia, offering graduate programs in public policy and international affairs.',
    introductionZh: '亚洲领先的公共政策学院，提供公共政策和国际事务研究生课程。',
    features: ['Research Center', 'Library', 'Conference Rooms']
  },
  {
    id: '3',
    name: 'North Spine Food Court',
    nameZh: '北纬美食广场',
    category: 'dining',
    lat: 1.3478,
    lng: 103.6815,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    openingHours: 'Daily: 7:00 AM - 10:00 PM',
    introduction: 'One of the largest food courts on campus with diverse Asian cuisine options.',
    introductionZh: '校园内最大的美食广场之一，提供多样的亚洲美食选择。',
    features: ['Asian Cuisine', 'Western Food', 'Vegetarian Options']
  },
  {
    id: '4',
    name: 'Sun Yanzi Photo Spot',
    nameZh: '孙燕姿打卡点',
    category: 'special',
    lat: 1.3490,
    lng: 103.6830,
    imageUrl: 'https://images.unsplash.com/photo-1562783534-c5d2a5d5e5e5?w=800',
    openingHours: 'Open 24 hours',
    introduction: 'A popular photo spot where local singer Sun Yanzi used to take photos. A must-visit for fans!',
    introductionZh: '本地歌手孙燕姿曾经拍照的热门打卡点，粉丝必访！',
    features: ['Photo Spot', 'Scenic View', 'Instagram Famous']
  },
  {
    id: '5',
    name: 'Nanyang Technological University',
    nameZh: '南洋理工大学',
    category: 'landmark',
    lat: 1.3462,
    lng: 103.6798,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    openingHours: 'Open 24 hours',
    introduction: 'NTU is one of the top universities in Singapore and Asia, known for its research and innovation.',
    introductionZh: '南洋理工大学是新加坡和亚洲顶尖大学之一，以研究和创新著称。',
    features: ['World-Class Research', 'Beautiful Campus', 'Sports Facilities']
  },
  {
    id: '6',
    name: 'School of Computer Engineering',
    nameZh: '计算机工程学院',
    category: 'school',
    lat: 1.3445,
    lng: 103.6850,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    openingHours: 'Mon-Fri: 8:00 AM - 9:00 PM',
    introduction: 'The School of Computer Engineering offers cutting-edge programs in AI, cybersecurity, and software engineering.',
    introductionZh: '计算机工程学院提供人工智能、网络安全和软件工程等前沿课程。',
    features: ['AI Lab', 'Cybersecurity Lab', 'Software Engineering']
  },
  {
    id: '7',
    name: 'The Steak House',
    nameZh: '牛排屋',
    category: 'dining',
    lat: 1.3458,
    lng: 103.6820,
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800',
    openingHours: 'Daily: 11:00 AM - 9:00 PM',
    introduction: 'Popular Western restaurant known for its premium steaks and cozy atmosphere.',
    introductionZh: '以优质牛排和舒适氛围闻名的热门西餐厅。',
    features: ['Western Cuisine', 'Premium Steaks', 'Cozy Atmosphere']
  },
  {
    id: '8',
    name: 'Art & Design Museum',
    nameZh: '艺术设计博物馆',
    category: 'landmark',
    lat: 1.3430,
    lng: 103.6780,
    imageUrl: 'https://images.unsplash.com/photo-1562783534-c5d2a5d5e5e5?w=800',
    openingHours: 'Tue-Sun: 10:00 AM - 6:00 PM',
    introduction: 'A museum showcasing contemporary art and design exhibitions from around the world.',
    introductionZh: '展示来自世界各地当代艺术和设计展览的博物馆。',
    features: ['Contemporary Art', 'Design Exhibitions', 'Interactive Displays']
  }
]
