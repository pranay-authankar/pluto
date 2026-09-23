export const indianColleges = [
  'IIT Bombay',
  'IIT Delhi',
  'BITS Pilani',
  'IIT Madras',
  'Delhi University (DU)',
  'IIT Kharagpur',
  'IISc Bangalore',
  'IIT Roorkee',
  'VIT Vellore',
  'Manipal University (MAHE)',
  'SRM Institute of Science and Technology',
  'IIT Guwahati',
  'NIT Trichy',
  'Jadavpur University',
  'Anna University'
];

export const campusCoordinates = {
  // Indian Campuses
  'IIT Bombay': { lat: 19.1334, lng: 72.9133 },
  'IIT Delhi': { lat: 28.5450, lng: 77.1926 },
  'BITS Pilani': { lat: 28.3639, lng: 75.5873 },
  'IIT Madras': { lat: 12.9915, lng: 80.2337 },
  'Delhi University (DU)': { lat: 28.6892, lng: 77.2106 },
  'IIT Kharagpur': { lat: 22.3149, lng: 87.3105 },
  'IISc Bangalore': { lat: 13.0219, lng: 77.5671 },
  'IIT Roorkee': { lat: 29.8649, lng: 77.8966 },
  'VIT Vellore': { lat: 12.9692, lng: 79.1559 },
  'Manipal University (MAHE)': { lat: 13.3525, lng: 74.7928 },
  'SRM Institute of Science and Technology': { lat: 12.8231, lng: 80.0442 },
  'IIT Guwahati': { lat: 26.1878, lng: 91.6916 },
  'NIT Trichy': { lat: 10.7589, lng: 78.8132 },
  'Jadavpur University': { lat: 22.4989, lng: 88.3716 },
  'Anna University': { lat: 13.0109, lng: 80.2354 },

  // Global fallbacks
  'UC Berkeley': { lat: 37.8719, lng: -122.2585 },
  'UT Austin': { lat: 30.2849, lng: -97.7341 },
  'Boston University': { lat: 42.3505, lng: -71.1054 },
  'NYU': { lat: 40.7295, lng: -73.9965 },
  'New York University (NYU)': { lat: 40.7295, lng: -73.9965 },
  'Stanford University': { lat: 37.4275, lng: -122.1697 },
  'UCLA': { lat: 34.0689, lng: -118.4452 },
  'Georgia Tech': { lat: 33.7756, lng: -84.3963 }
};

export const roomsData = [
  {
    id: 'room-1',
    name: 'Telegraph Student Lofts',
    type: 'Single',
    priceINR: '₹8,500/mo',
    numericPrice: 8500,
    distance: '0.4 km',
    walkTime: '5 min walk',
    image: '/assets/dorm_main.jpg',
    secondaryImage: '/assets/dorm_study.jpg',
    facilities: ['Wi-Fi', 'AC', 'Laundry', 'Furnished', 'Attached Bath'],
    billsIncluded: true,
    offset: { lat: -0.0031, lng: 0.0024 },
    owner: {
      name: 'Rajesh Sharma',
      role: 'Verified Property Owner',
      phone: '+91 98201 *****',
      whatsapp: '+91 98201 *****',
      responseRate: 'Under 15 mins'
    }
  },
  {
    id: 'room-2',
    name: 'Northgate Shared Suites',
    type: 'Shared',
    priceINR: '₹6,800/mo',
    numericPrice: 6800,
    distance: '0.2 km',
    walkTime: '3 min walk',
    image: '/assets/dorm_study.jpg',
    secondaryImage: '/assets/dorm_main.jpg',
    facilities: ['Wi-Fi', 'AC', 'Attached Bath', 'Food/Mess Nearby'],
    billsIncluded: true,
    offset: { lat: 0.0022, lng: -0.0019 },
    owner: {
      name: 'Suresh Patil',
      role: 'PG Warden / Owner',
      phone: '+91 98332 *****',
      whatsapp: '+91 98332 *****',
      responseRate: 'Under 30 mins'
    }
  },
  {
    id: 'room-3',
    name: 'Southside Campus Studio',
    type: 'Single',
    priceINR: '₹9,800/mo',
    numericPrice: 9800,
    distance: '0.5 km',
    walkTime: '7 min walk',
    image: '/assets/dorm_main.jpg',
    secondaryImage: '/assets/dorm_study.jpg',
    facilities: ['Wi-Fi', 'AC', 'Furnished', 'Attached Bath', 'Power Backup'],
    billsIncluded: true,
    offset: { lat: -0.0045, lng: 0.0015 },
    owner: {
      name: 'Meenakshi Iyer',
      role: 'Independent Landlord',
      phone: '+91 97654 *****',
      whatsapp: '+91 97654 *****',
      responseRate: 'Under 10 mins'
    }
  },
  {
    id: 'room-4',
    name: 'Bancroft Student Residence',
    type: 'Shared',
    priceINR: '₹6,200/mo',
    numericPrice: 6200,
    distance: '0.3 km',
    walkTime: '4 min walk',
    image: '/assets/dorm_study.jpg',
    secondaryImage: '/assets/dorm_main.jpg',
    facilities: ['Wi-Fi', 'Laundry', 'Furnished', 'Study Desk'],
    billsIncluded: true,
    offset: { lat: -0.0015, lng: -0.0030 },
    owner: {
      name: 'Vikram Malhotra',
      role: 'Property Manager',
      phone: '+91 99100 *****',
      whatsapp: '+91 99100 *****',
      responseRate: 'Under 20 mins'
    }
  },
  {
    id: 'room-5',
    name: 'Oxford Garden Single Room',
    type: 'Single',
    priceINR: '₹7,400/mo',
    numericPrice: 7400,
    distance: '0.3 km',
    walkTime: '4 min walk',
    image: '/assets/dorm_main.jpg',
    secondaryImage: '/assets/dorm_study.jpg',
    facilities: ['Wi-Fi', 'Attached Bath', 'Furnished', 'Power Backup'],
    billsIncluded: true,
    offset: { lat: 0.0018, lng: -0.0025 },
    owner: {
      name: 'Anil Kulkarni',
      role: 'Resident Landlord',
      phone: '+91 98450 *****',
      whatsapp: '+91 98450 *****',
      responseRate: 'Under 15 mins'
    }
  },
  {
    id: 'room-6',
    name: 'University Crescent Shared Flat',
    type: 'Shared',
    priceINR: '₹5,500/mo',
    numericPrice: 5500,
    distance: '0.6 km',
    walkTime: '8 min walk',
    image: '/assets/dorm_study.jpg',
    secondaryImage: '/assets/dorm_main.jpg',
    facilities: ['Wi-Fi', 'Laundry', 'Food/Mess Nearby'],
    billsIncluded: true,
    offset: { lat: -0.0038, lng: 0.0032 },
    owner: {
      name: 'Pooja Agarwal',
      role: 'Verified Landlord',
      phone: '+91 98112 *****',
      whatsapp: '+91 98112 *****',
      responseRate: 'Under 25 mins'
    }
  },
  {
    id: 'room-7',
    name: 'Hearst Premier Studio Suite',
    type: 'Single',
    priceINR: '₹11,500/mo',
    numericPrice: 11500,
    distance: '0.2 km',
    walkTime: '2 min walk',
    image: '/assets/dorm_main.jpg',
    secondaryImage: '/assets/dorm_study.jpg',
    facilities: ['Wi-Fi', 'AC', 'Attached Bath', 'Furnished', 'Power Backup'],
    billsIncluded: true,
    offset: { lat: 0.0015, lng: 0.0018 },
    owner: {
      name: 'Col. R.K. Verma (Retd.)',
      role: 'Building Owner',
      phone: '+91 98990 *****',
      whatsapp: '+91 98990 *****',
      responseRate: 'Immediate'
    }
  },
  {
    id: 'room-8',
    name: 'Channing Way Double Share',
    type: 'Shared',
    priceINR: '₹7,200/mo',
    numericPrice: 7200,
    distance: '0.4 km',
    walkTime: '5 min walk',
    image: '/assets/dorm_study.jpg',
    secondaryImage: '/assets/dorm_main.jpg',
    facilities: ['Wi-Fi', 'Attached Bath', 'AC', 'Study Desk'],
    billsIncluded: true,
    offset: { lat: -0.0028, lng: -0.0015 },
    owner: {
      name: 'Deepak Joshi',
      role: 'Hostel Manager',
      phone: '+91 98220 *****',
      whatsapp: '+91 98220 *****',
      responseRate: 'Under 30 mins'
    }
  }
];

export const foodData = [
  {
    id: 'food-1',
    name: 'Annapurna Daily Tiffin',
    type: 'Tiffin • Pure Veg',
    veg: true,
    startPrice: 'Meal starts from ₹80',
    price: 'Meal starts from ₹80',
    distance: '0.3 km',
    location: 'Shop 12, Telegraph Avenue, Near Campus Gate 2',
    contact: '+91 98234 *****',
    mealInfo: 'Home-style vegetarian thali with 4 phulkas, seasonal dal, sabzi, and steamed rice.',
    image: '/assets/food_tiffin.jpg',
    offset: { lat: -0.0024, lng: 0.0018 }
  },
  {
    id: 'food-2',
    name: 'Campus Hostel Mess',
    type: 'Mess • North & South',
    veg: true,
    startPrice: 'Meal starts from ₹90',
    price: 'Meal starts from ₹90',
    distance: '0.1 km',
    location: 'Northgate Campus Dining Hall, Gate 1',
    contact: '+91 98450 *****',
    mealInfo: 'All-you-can-eat student mess with rotating daily specials, sambar, curd & chapatis.',
    image: '/assets/food_mess.jpg',
    offset: { lat: 0.0012, lng: -0.0015 }
  },
  {
    id: 'food-3',
    name: 'Bowl & Rice Kitchen',
    type: 'Restaurant • Multi-Cuisine',
    veg: false,
    startPrice: 'Meal starts from ₹140',
    price: 'Meal starts from ₹140',
    distance: '0.4 km',
    location: '142 Bancroft Way, Student Market',
    contact: '+91 97123 *****',
    mealInfo: 'Rice bowls with grilled paneer or butter chicken, fresh greens and mint iced tea.',
    image: '/assets/food_restaurant.jpg',
    offset: { lat: -0.0035, lng: -0.0028 }
  },
  {
    id: 'food-4',
    name: 'Shree Krishna Veg Thali',
    type: 'Mess • Gujarati / Marwari',
    veg: true,
    startPrice: 'Meal starts from ₹100',
    price: 'Meal starts from ₹100',
    distance: '0.5 km',
    location: '22 Southside Food Street',
    contact: '+91 98901 *****',
    mealInfo: 'Unlimited pure veg thali served with ghee chapatis, 3 curries, kadhi, and sweet dish.',
    image: '/assets/food_tiffin.jpg',
    offset: { lat: -0.0042, lng: 0.0022 }
  },
  {
    id: 'food-5',
    name: 'Spiced Grill & Rolls',
    type: 'Restaurant • Quick Bites',
    veg: false,
    startPrice: 'Meal starts from ₹120',
    price: 'Meal starts from ₹120',
    distance: '0.6 km',
    location: '88 University Avenue, Center Mall',
    contact: '+91 99112 *****',
    mealInfo: 'Freshly rolled kathi rolls, egg combos, grilled shawarma plates, and masala coolers.',
    image: '/assets/food_restaurant.jpg',
    offset: { lat: 0.0028, lng: -0.0040 }
  },
  {
    id: 'food-6',
    name: 'Mom’s Home Tiffin Box',
    type: 'Tiffin • Homestyle',
    veg: true,
    startPrice: 'Meal starts from ₹85',
    price: 'Meal starts from ₹85',
    distance: '0.4 km',
    location: 'Plot 4, Oxford Street, Student Colony',
    contact: '+91 98334 *****',
    mealInfo: 'Healthy low-oil home delivery box with rotis, dal palak, dry vegetable, and salad.',
    image: '/assets/food_tiffin.jpg',
    offset: { lat: -0.0018, lng: -0.0032 }
  },
  {
    id: 'food-7',
    name: 'Green Leaf South Mess',
    type: 'Mess • South Indian',
    veg: true,
    startPrice: 'Meal starts from ₹75',
    price: 'Meal starts from ₹75',
    distance: '0.2 km',
    location: '15 College Lane, East Block',
    contact: '+91 98401 *****',
    mealInfo: 'Traditional banana leaf lunch with rasam, sambar, papad, curd rice, and vegetable poriyal.',
    image: '/assets/food_mess.jpg',
    offset: { lat: 0.0019, lng: 0.0025 }
  },
  {
    id: 'food-8',
    name: 'Punjab Dhaba Express',
    type: 'Restaurant • Punjabi',
    veg: false,
    startPrice: 'Meal starts from ₹150',
    price: 'Meal starts from ₹150',
    distance: '0.5 km',
    location: '51 College Road, Corner Plaza',
    contact: '+91 98110 *****',
    mealInfo: 'Tandoori paratha combo with dal makhani, paneer bhurji or chicken curry gravy.',
    image: '/assets/food_restaurant.jpg',
    offset: { lat: -0.0031, lng: 0.0038 }
  }
];

export const roommatesData = [
  // IIT Bombay (iit-bombay)
  {
    id: 'p-iitb-1',
    name: 'Aryan Sharma',
    initials: 'AS',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay',
    gender: 'male',
    budgetINR: '₹8,500/mo',
    budgetValue: 8500,
    distance: '0.3 km from Campus',
    avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    tags: ['Veg', 'Quiet Study', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet Study', icon: '📚' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitb-2',
    name: 'Sneha Kulkarni',
    initials: 'SK',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay',
    gender: 'female',
    budgetINR: '₹9,200/mo',
    budgetValue: 9200,
    distance: '0.5 km from Campus',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    tags: ['Veg', 'Early Riser', 'Non-Smoker'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Early Riser', icon: '🌅' },
      { label: 'Non-Smoker', icon: '🚭' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitb-3',
    name: 'Varun Deshmukh',
    initials: 'VD',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay',
    gender: 'male',
    budgetINR: '₹7,200/mo',
    budgetValue: 7200,
    distance: '0.6 km from Campus',
    avatarBg: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    tags: ['Non-Veg', 'Night Owl', 'Shared Room'],
    preferences: [
      { label: 'Non-Veg', icon: '🍗' },
      { label: 'Night Owl', icon: '🌙' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitb-4',
    name: 'Ananya Iyer',
    initials: 'AI',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay',
    gender: 'female',
    budgetINR: '₹8,000/mo',
    budgetValue: 8000,
    distance: '0.2 km from Campus',
    avatarBg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    tags: ['Veg', 'Quiet', 'AC Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet', icon: '🤫' },
      { label: 'AC Room', icon: '❄️' }
    ],
    contact: '*****'
  },

  // IIT Delhi (iit-delhi)
  {
    id: 'p-iitd-1',
    name: 'Kabir Verma',
    initials: 'KV',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi',
    gender: 'male',
    budgetINR: '₹8,200/mo',
    budgetValue: 8200,
    distance: '0.4 km from Campus',
    avatarBg: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    tags: ['Veg', 'Quiet', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet', icon: '🤫' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitd-2',
    name: 'Riya Gupta',
    initials: 'RG',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi',
    gender: 'female',
    budgetINR: '₹9,000/mo',
    budgetValue: 9000,
    distance: '0.3 km from Campus',
    avatarBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    tags: ['Veg', 'Early Riser', 'Non-Smoker'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Early Riser', icon: '🌅' },
      { label: 'Non-Smoker', icon: '🚭' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitd-3',
    name: 'Aman Mehra',
    initials: 'AM',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi',
    gender: 'male',
    budgetINR: '₹7,000/mo',
    budgetValue: 7000,
    distance: '0.5 km from Campus',
    avatarBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    tags: ['Non-Veg', 'Night Owl', 'Shared Room'],
    preferences: [
      { label: 'Non-Veg', icon: '🍗' },
      { label: 'Night Owl', icon: '🌙' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },

  // BITS Pilani (bits-pilani)
  {
    id: 'p-bits-1',
    name: 'Siddharth Roy',
    initials: 'SR',
    college: 'BITS Pilani',
    collegeId: 'bits-pilani',
    gender: 'male',
    budgetINR: '₹6,500/mo',
    budgetValue: 6500,
    distance: '0.3 km from Campus',
    avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    tags: ['Veg', 'Quiet Study', 'Early Riser'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet Study', icon: '📚' },
      { label: 'Early Riser', icon: '🌅' }
    ],
    contact: '*****'
  },
  {
    id: 'p-bits-2',
    name: 'Meera Nair',
    initials: 'MN',
    college: 'BITS Pilani',
    collegeId: 'bits-pilani',
    gender: 'female',
    budgetINR: '₹7,200/mo',
    budgetValue: 7200,
    distance: '0.5 km from Campus',
    avatarBg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    tags: ['Veg', 'Non-Smoker', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Non-Smoker', icon: '🚭' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },

  // IIT Madras (iit-madras)
  {
    id: 'p-iitm-1',
    name: 'Karthik Sundaram',
    initials: 'KS',
    college: 'IIT Madras',
    collegeId: 'iit-madras',
    gender: 'male',
    budgetINR: '₹7,800/mo',
    budgetValue: 7800,
    distance: '0.4 km from Campus',
    avatarBg: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    tags: ['Veg', 'Quiet', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet', icon: '🤫' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitm-2',
    name: 'Deepa Ramanathan',
    initials: 'DR',
    college: 'IIT Madras',
    collegeId: 'iit-madras',
    gender: 'female',
    budgetINR: '₹8,500/mo',
    budgetValue: 8500,
    distance: '0.6 km from Campus',
    avatarBg: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
    tags: ['Veg', 'Early Riser', 'Non-Smoker'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Early Riser', icon: '🌅' },
      { label: 'Non-Smoker', icon: '🚭' }
    ],
    contact: '*****'
  },

  // Delhi University (DU) (delhi-university-du)
  {
    id: 'p-du-1',
    name: 'Shreya Malhotra',
    initials: 'SM',
    college: 'Delhi University (DU)',
    collegeId: 'delhi-university-du',
    gender: 'female',
    budgetINR: '₹7,500/mo',
    budgetValue: 7500,
    distance: '0.3 km from Campus',
    avatarBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
    tags: ['Veg', 'Quiet', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet', icon: '🤫' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-du-2',
    name: 'Ayush Mathur',
    initials: 'AM',
    college: 'Delhi University (DU)',
    collegeId: 'delhi-university-du',
    gender: 'male',
    budgetINR: '₹8,500/mo',
    budgetValue: 8500,
    distance: '0.4 km from Campus',
    avatarBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    tags: ['Non-Veg', 'Night Owl', 'Shared Room'],
    preferences: [
      { label: 'Non-Veg', icon: '🍗' },
      { label: 'Night Owl', icon: '🌙' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },

  // VIT Vellore (vit-vellore)
  {
    id: 'p-vit-1',
    name: 'Rohit Balakrishnan',
    initials: 'RB',
    college: 'VIT Vellore',
    collegeId: 'vit-vellore',
    gender: 'male',
    budgetINR: '₹6,500/mo',
    budgetValue: 6500,
    distance: '0.3 km from Campus',
    avatarBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    tags: ['Veg', 'Quiet Study', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet Study', icon: '📚' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  },
  {
    id: 'p-vit-2',
    name: 'Pooja Reddy',
    initials: 'PR',
    college: 'VIT Vellore',
    collegeId: 'vit-vellore',
    gender: 'female',
    budgetINR: '₹7,500/mo',
    budgetValue: 7500,
    distance: '0.5 km from Campus',
    avatarBg: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
    tags: ['Veg', 'Early Riser', 'Non-Smoker'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Early Riser', icon: '🌅' },
      { label: 'Non-Smoker', icon: '🚭' }
    ],
    contact: '*****'
  },

  // Generic / Fallback for other Indian Campuses
  {
    id: 'p-iisc-1',
    name: 'Tejaswini Rao',
    initials: 'TR',
    college: 'IISc Bangalore',
    collegeId: 'iisc-bangalore',
    gender: 'female',
    budgetINR: '₹8,800/mo',
    budgetValue: 8800,
    distance: '0.4 km from Campus',
    avatarBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    tags: ['Veg', 'Quiet Study', 'Shared Room'],
    preferences: [
      { label: 'Veg', icon: '🌱' },
      { label: 'Quiet Study', icon: '📚' }
    ],
    contact: '*****'
  },
  {
    id: 'p-iitkgp-1',
    name: 'Subhash Mukherjee',
    initials: 'SM',
    college: 'IIT Kharagpur',
    collegeId: 'iit-kharagpur',
    gender: 'male',
    budgetINR: '₹6,200/mo',
    budgetValue: 6200,
    distance: '0.5 km from Campus',
    avatarBg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    tags: ['Non-Veg', 'Night Owl', 'Shared Room'],
    preferences: [
      { label: 'Non-Veg', icon: '🍗' },
      { label: 'Shared Room', icon: '👥' }
    ],
    contact: '*****'
  }
];

export const vacantSharedRooms = [
  // IIT Bombay (iit-bombay)
  {
    id: 'vr-iitb-1',
    room: 'Powai Lakeview 2BHK Double Share',
    rent: '₹7,800/mo',
    rentValue: 7800,
    location: 'Central Ave, Hiranandani (0.4 km from IIT Bombay)',
    distance: '0.4 km from Campus',
    currentOccupant: 'Aditya (3rd Year CS)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98765 *****',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay'
  },
  {
    id: 'vr-iitb-2',
    room: 'JVLR Link Rd Student Flat',
    rent: '₹6,500/mo',
    rentValue: 6500,
    location: 'Near IIT Market Gate, Powai (0.3 km from IIT Bombay)',
    distance: '0.3 km from Campus',
    currentOccupant: 'Rohan & Sahil (Dual Degree Mech)',
    sharingType: '3-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
    contact: '+91 98450 *****',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay'
  },
  {
    id: 'vr-iitb-3',
    room: 'Hillside Heights 2-Sharing Room',
    rent: '₹8,900/mo',
    rentValue: 8900,
    location: 'Powai Vihar, Mumbai (0.5 km from IIT Bombay)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Manish (MTech Data Science)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
    contact: '+91 98112 *****',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay'
  },

  // IIT Delhi (iit-delhi)
  {
    id: 'vr-iitd-1',
    room: 'Hauz Khas Enclave Student Apartment',
    rent: '₹8,500/mo',
    rentValue: 8500,
    location: 'C-Block, Hauz Khas (0.4 km from IIT Delhi)',
    distance: '0.4 km from Campus',
    currentOccupant: 'Tushar (3rd Year EE)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98101 *****',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi'
  },
  {
    id: 'vr-iitd-2',
    room: 'SDA Commercial Shared 3BHK',
    rent: '₹7,400/mo',
    rentValue: 7400,
    location: 'SDA Market Complex (0.3 km from IIT Delhi)',
    distance: '0.3 km from Campus',
    currentOccupant: 'Akash (4th Year Civil)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
    contact: '+91 98102 *****',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi'
  },
  {
    id: 'vr-iitd-3',
    room: 'Ber Sarai Scholars Flat',
    rent: '₹6,200/mo',
    rentValue: 6200,
    location: 'Main Ber Sarai Rd (0.5 km from IIT Delhi)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Nitin & Pranav (MTech AI)',
    sharingType: '3-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Study Desks', 'Cook Available', 'Washing Machine'],
    contact: '+91 98103 *****',
    college: 'IIT Delhi',
    collegeId: 'iit-delhi'
  },

  // BITS Pilani (bits-pilani)
  {
    id: 'vr-bits-1',
    room: 'Vidya Vihar Student Cottage Share',
    rent: '₹5,800/mo',
    rentValue: 5800,
    location: 'Near Clock Tower Gate, Pilani (0.3 km from BITS)',
    distance: '0.3 km from Campus',
    currentOccupant: 'Devansh (2nd Year CS)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98290 *****',
    college: 'BITS Pilani',
    collegeId: 'bits-pilani'
  },
  {
    id: 'vr-bits-2',
    room: 'Pilani Greens 2-Sharing Room',
    rent: '₹6,400/mo',
    rentValue: 6400,
    location: 'Station Road, Pilani (0.5 km from BITS)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Shubham (3rd Year Chem)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
    contact: '+91 98291 *****',
    college: 'BITS Pilani',
    collegeId: 'bits-pilani'
  },

  // IIT Madras (iit-madras)
  {
    id: 'vr-iitm-1',
    room: 'Adyar Canopy 2BHK Room Share',
    rent: '₹7,500/mo',
    rentValue: 7500,
    location: 'Kasturba Nagar, Adyar (0.5 km from IIT Madras)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Venkatesh (3rd Year Aero)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98401 *****',
    college: 'IIT Madras',
    collegeId: 'iit-madras'
  },
  {
    id: 'vr-iitm-2',
    room: 'Velachery Link Road Shared Flat',
    rent: '₹6,200/mo',
    rentValue: 6200,
    location: 'Near Taramani Link (0.6 km from IIT Madras)',
    distance: '0.6 km from Campus',
    currentOccupant: 'Raghav & Surya (Dual Degree Biotech)',
    sharingType: '3-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
    contact: '+91 98402 *****',
    college: 'IIT Madras',
    collegeId: 'iit-madras'
  },

  // Delhi University (DU) (delhi-university-du)
  {
    id: 'vr-du-1',
    room: 'Kamla Nagar Sparkle PG Share',
    rent: '₹7,200/mo',
    rentValue: 7200,
    location: 'Block D, Kamla Nagar (0.3 km from DU North Campus)',
    distance: '0.3 km from Campus',
    currentOccupant: 'Dhruv (Hansraj 2nd Year)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98111 *****',
    college: 'Delhi University (DU)',
    collegeId: 'delhi-university-du'
  },
  {
    id: 'vr-du-2',
    room: 'Hudson Lane Studio Sharing',
    rent: '₹8,000/mo',
    rentValue: 8000,
    location: 'Near Kingsway Camp (0.4 km from DU North Campus)',
    distance: '0.4 km from Campus',
    currentOccupant: 'Karan (Kirori Mal 3rd Year)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
    contact: '+91 98112 *****',
    college: 'Delhi University (DU)',
    collegeId: 'delhi-university-du'
  },

  // VIT Vellore (vit-vellore)
  {
    id: 'vr-vit-1',
    room: 'Katpadi Railway Link Shared Room',
    rent: '₹6,000/mo',
    rentValue: 6000,
    location: 'Main Katpadi Road (0.4 km from VIT Vellore)',
    distance: '0.4 km from Campus',
    currentOccupant: 'Sai (3rd Year IT)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
    contact: '+91 98410 *****',
    college: 'VIT Vellore',
    collegeId: 'vit-vellore'
  },
  {
    id: 'vr-vit-2',
    room: 'Gandhi Nagar Pearl Residency',
    rent: '₹7,200/mo',
    rentValue: 7200,
    location: '7th East Cross Rd (0.5 km from VIT Vellore)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Gautam (2nd Year ECE)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['AC Room', 'Power Backup', 'Study Desk'],
    contact: '+91 98411 *****',
    college: 'VIT Vellore',
    collegeId: 'vit-vellore'
  },

  // Generic / Fallback for other Indian Campuses
  {
    id: 'vr-iisc-1',
    room: 'Malleswaram Scholar Shared Flat',
    rent: '₹7,500/mo',
    rentValue: 7500,
    location: '8th Main, Malleswaram (0.5 km from IISc Bangalore)',
    distance: '0.5 km from Campus',
    currentOccupant: 'Chinmay (PhD Physics)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_main.jpg',
    tags: ['Quiet Flat', 'High-Speed Wi-Fi', 'Library Access'],
    contact: '+91 98991 *****',
    college: 'IISc Bangalore',
    collegeId: 'iisc-bangalore'
  },
  {
    id: 'vr-iitkgp-1',
    room: 'Prem Bazar Student Residency',
    rent: '₹5,500/mo',
    rentValue: 5500,
    location: 'Near Puri Gate (0.4 km from IIT Kharagpur)',
    distance: '0.4 km from Campus',
    currentOccupant: 'Debashis (4th Year Mining)',
    sharingType: '2-Sharing (1 Bed Open)',
    image: '/assets/dorm_study.jpg',
    tags: ['Furnished', 'Cook Available', 'Wi-Fi'],
    contact: '+91 98992 *****',
    college: 'IIT Kharagpur',
    collegeId: 'iit-kharagpur'
  }
];

export const nearbyCategories = [
  { id: 'food', label: 'Food', icon: '🍲' },
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  { id: 'stationery', label: 'Stationery', icon: '✏️' },
  { id: 'atm', label: 'ATM', icon: '💳' },
  { id: 'laundry', label: 'Laundry', icon: '🧺' },
  { id: 'transport', label: 'Transport', icon: '🚇' }
];

export const nearbyServicesData = {
  food: [
    { id: 'food-s1', name: 'Campus Dining Commons', dist: '0.2 km', status: 'Open until 10 PM', address: 'Upper Sproul Plaza', hours: '7:30 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Student meal swipes accepted • Buffet style', offset: { lat: 0.0014, lng: -0.0018 } },
    { id: 'food-s2', name: 'Telegraph Food Court', dist: '0.4 km', status: 'Open until 11 PM', address: '2430 Telegraph Ave', hours: '10:00 AM – 11:00 PM', contact: '+1 (510) 55*-****', highlights: 'Multi-cuisine • Affordable student meal combos', offset: { lat: -0.0032, lng: 0.0021 } },
    { id: 'food-s3', name: 'Golden Bear Cafe', dist: '0.1 km', status: 'Open until 9 PM', address: 'MLK Jr. Student Union', hours: '8:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'Grab-and-go bowls, coffee, smoothies', offset: { lat: 0.0008, lng: 0.0012 } },
    { id: 'food-s4', name: 'Berkeley Thai House', dist: '0.3 km', status: 'Open until 10 PM', address: '2511 Channing Way', hours: '11:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Authentic noodles & curry • Outdoor patio', offset: { lat: -0.0028, lng: 0.0019 } },
    { id: 'food-s5', name: 'Gypsy’s Trattoria Italiana', dist: '0.4 km', status: 'Open until 11 PM', address: '2519 Durant Ave', hours: '10:30 AM – 11:00 PM', contact: '+1 (510) 55*-****', highlights: 'Huge pasta portions • Budget student favorite', offset: { lat: -0.0035, lng: 0.0028 } },
    { id: 'food-s6', name: 'Top Dog Hot Dogs', dist: '0.3 km', status: 'Open until 2 AM', address: '2534 Durant Ave', hours: '10:00 AM – 2:00 AM', contact: '+1 (510) 55*-****', highlights: 'Late-night spot • 12+ grilled varieties', offset: { lat: -0.0031, lng: 0.0023 } },
    { id: 'food-s7', name: 'Artichoke Basille’s Pizza', dist: '0.4 km', status: 'Open until 1 AM', address: '2590 Telegraph Ave', hours: '11:00 AM – 1:00 AM', contact: '+1 (510) 55*-****', highlights: 'Creamy jumbo slices • Quick takeaway', offset: { lat: -0.0041, lng: 0.0014 } },
    { id: 'food-s8', name: 'Bongo Burger & Shakes', dist: '0.5 km', status: 'Open until 10 PM', address: '2154 Center St', hours: '10:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Fresh burgers & thick shakes • Student discount', offset: { lat: 0.0024, lng: -0.0035 } }
  ],
  grocery: [
    { id: 'groc-s1', name: 'Trader Joe’s Campus', dist: '0.5 km', status: 'Open until 9 PM', address: '1885 University Ave', hours: '8:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'Affordable snacks, ready meals, organic produce', offset: { lat: -0.0041, lng: -0.0035 } },
    { id: 'groc-s2', name: 'Berkeley Fresh Market', dist: '0.3 km', status: 'Open until 10 PM', address: '2410 Telegraph Ave', hours: '7:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Daily fruits, milk, instant pantry essentials', offset: { lat: -0.0019, lng: 0.0028 } },
    { id: 'groc-s3', name: 'Safeway Community Market', dist: '0.6 km', status: 'Open until 11 PM', address: '1444 Shattuck Ave', hours: '6:00 AM – 11:00 PM', contact: '+1 (510) 55*-****', highlights: 'Full supermarket with student rewards club', offset: { lat: -0.0038, lng: -0.0045 } },
    { id: 'groc-s4', name: 'Whole Foods Market Mini', dist: '0.7 km', status: 'Open until 9 PM', address: '3000 Telegraph Ave', hours: '8:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'Organic groceries & hot food salad bar', offset: { lat: -0.0055, lng: 0.0032 } },
    { id: 'groc-s5', name: 'Student Co-op Organic Grocery', dist: '0.2 km', status: 'Open until 8 PM', address: '2424 Bancroft Way', hours: '9:00 AM – 8:00 PM', contact: '+1 (510) 55*-****', highlights: 'Bulk grains, spices, volunteer discounts', offset: { lat: -0.0015, lng: -0.0012 } },
    { id: 'groc-s6', name: 'Target Grocery & Essentials', dist: '0.4 km', status: 'Open until 10 PM', address: '2187 Shattuck Ave', hours: '8:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Dorm essentials, snacks, personal care', offset: { lat: -0.0022, lng: -0.0038 } },
    { id: 'groc-s7', name: 'Berkeley Bowl Express', dist: '0.8 km', status: 'Open until 8 PM', address: '2020 Oregon St', hours: '9:00 AM – 8:00 PM', contact: '+1 (510) 55*-****', highlights: 'Legendary exotic produce & budget bulk foods', offset: { lat: -0.0062, lng: -0.0021 } },
    { id: 'groc-s8', name: 'Campus Corner Mart', dist: '0.1 km', status: 'Open 24/7', address: '2600 Hearst Ave', hours: 'Open 24 Hours', contact: '+1 (510) 55*-****', highlights: 'Late-night snacks, drinks, quick supplies', offset: { lat: 0.0022, lng: 0.0014 } }
  ],
  pharmacy: [
    { id: 'pharm-s1', name: 'CVS Pharmacy 24/7', dist: '0.4 km', status: 'Open 24/7', address: '2651 Telegraph Ave', hours: 'Open 24 Hours', contact: '+1 (510) 55*-****', highlights: 'Prescription refills, OTC medicine, health essentials', offset: { lat: -0.0028, lng: 0.0015 } },
    { id: 'pharm-s2', name: 'University Health Clinic Rx', dist: '0.2 km', status: 'Open until 6 PM', address: '2222 Bancroft Way', hours: '8:00 AM – 6:00 PM', contact: '+1 (510) 55*-****', highlights: 'Direct student health insurance billing (SHIP)', offset: { lat: 0.0016, lng: 0.0019 } },
    { id: 'pharm-s3', name: 'Walgreens Campus Store', dist: '0.5 km', status: 'Open until 10 PM', address: '2310 Shattuck Ave', hours: '7:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Flu shots, first-aid, vitamins & toiletries', offset: { lat: -0.0034, lng: -0.0041 } },
    { id: 'pharm-s4', name: 'Berkeley Community Pharmacy', dist: '0.3 km', status: 'Open until 7 PM', address: '2525 Channing Way', hours: '9:00 AM – 7:00 PM', contact: '+1 (510) 55*-****', highlights: 'Independent pharmacy with fast consultation', offset: { lat: -0.0025, lng: 0.0022 } },
    { id: 'pharm-s5', name: 'Tang Center Student Dispensary', dist: '0.2 km', status: 'Open until 5 PM', address: '2222 Durant Ave', hours: '8:30 AM – 5:00 PM', contact: '+1 (510) 55*-****', highlights: 'Subsidized student prescriptions & wellness kits', offset: { lat: -0.0012, lng: 0.0016 } },
    { id: 'pharm-s6', name: 'WellCare Campus Chemist', dist: '0.6 km', status: 'Open until 8 PM', address: '2120 Center St', hours: '9:00 AM – 8:00 PM', contact: '+1 (510) 55*-****', highlights: 'Prescription delivery available near dorms', offset: { lat: 0.0021, lng: -0.0032 } },
    { id: 'pharm-s7', name: 'Rite Aid Student Pharmacy', dist: '0.7 km', status: 'Open until 9 PM', address: '1900 University Ave', hours: '8:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'Drive-thru pickup & wellness rewards card', offset: { lat: 0.0032, lng: -0.0048 } }
  ],
  stationery: [
    { id: 'stat-s1', name: 'Campus Bookstore & Print', dist: '0.2 km', status: 'Open until 7 PM', address: '2495 Bancroft Way', hours: '8:30 AM – 7:00 PM', contact: '+1 (510) 55*-****', highlights: 'Textbooks, notebooks, branded university supplies', offset: { lat: -0.0011, lng: -0.0012 } },
    { id: 'stat-s2', name: 'Ink & Paper Student Hub', dist: '0.4 km', status: 'Open until 9 PM', address: '2518 Telegraph Ave', hours: '9:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'High-speed color printing, poster laminating, pens', offset: { lat: -0.0035, lng: 0.0009 } },
    { id: 'stat-s3', name: 'FedEx Office Print & Ship', dist: '0.5 km', status: 'Open until 8 PM', address: '2150 Shattuck Ave', hours: '8:00 AM – 8:00 PM', contact: '+1 (510) 55*-****', highlights: 'Binding, packaging, thesis document printing', offset: { lat: -0.0029, lng: -0.0042 } },
    { id: 'stat-s4', name: 'Berkeley Art & Notebook Studio', dist: '0.3 km', status: 'Open until 8 PM', address: '2540 Durant Ave', hours: '10:00 AM – 8:00 PM', contact: '+1 (510) 55*-****', highlights: 'Architecture drafting gear, sketchbooks, markers', offset: { lat: -0.0032, lng: 0.0024 } },
    { id: 'stat-s5', name: 'Copy Central Quick Xerox', dist: '0.3 km', status: 'Open until 6 PM', address: '2560 Channing Way', hours: '8:30 AM – 6:00 PM', contact: '+1 (510) 55*-****', highlights: 'Self-serve copiers, course readers, scanning', offset: { lat: -0.0026, lng: 0.0029 } },
    { id: 'stat-s6', name: 'University Supplies Kiosk', dist: '0.1 km', status: 'Open until 6 PM', address: 'Sproul Plaza Central', hours: '9:00 AM – 6:00 PM', contact: '+1 (510) 55*-****', highlights: 'Blue books, calculators, exam supplies', offset: { lat: 0.0005, lng: 0.0008 } },
    { id: 'stat-s7', name: 'Draft & Design Supplies', dist: '0.5 km', status: 'Open until 7 PM', address: '1800 Euclid Ave', hours: '9:30 AM – 7:00 PM', contact: '+1 (510) 55*-****', highlights: 'Engineering paper, model making boards', offset: { lat: 0.0035, lng: 0.0018 } }
  ],
  atm: [
    { id: 'atm-s1', name: 'Chase ATM Campus Kiosk', dist: '0.1 km', status: 'Open 24/7', address: 'MLK Student Union Lobby', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Deposit & cash withdrawal • Zero student fee', offset: { lat: 0.0005, lng: -0.0009 } },
    { id: 'atm-s2', name: 'Bank of America ATM', dist: '0.3 km', status: 'Open 24/7', address: '2400 Telegraph Ave', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Full-service ATM with cardless access', offset: { lat: -0.0022, lng: -0.0015 } },
    { id: 'atm-s3', name: 'Wells Fargo Campus ATM', dist: '0.2 km', status: 'Open 24/7', address: '2300 Bancroft Way', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Instant cash & balance inquiries', offset: { lat: -0.0012, lng: -0.0018 } },
    { id: 'atm-s4', name: 'Citibank Express ATM', dist: '0.4 km', status: 'Open 24/7', address: '2150 Shattuck Ave', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Global ATM network with multilingual screen', offset: { lat: -0.0028, lng: -0.0039 } },
    { id: 'atm-s5', name: 'Golden 1 Credit Union ATM', dist: '0.1 km', status: 'Open 24/7', address: 'Upper Sproul Entrance', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Surcharge-free for student credit union members', offset: { lat: 0.0009, lng: 0.0005 } },
    { id: 'atm-s6', name: 'US Bank ATM Center', dist: '0.5 km', status: 'Open 24/7', address: '2500 Durant Ave', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Dual ATM kiosks with deposit drop', offset: { lat: -0.0034, lng: 0.0026 } },
    { id: 'atm-s7', name: 'Cal Coast Credit Union ATM', dist: '0.3 km', status: 'Open 24/7', address: '2545 Channing Way', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Co-op network ATM with no transaction charge', offset: { lat: -0.0026, lng: 0.0022 } }
  ],
  laundry: [
    { id: 'laund-s1', name: 'Sparkle Student Wash & Fold', dist: '0.4 km', status: 'Open until 10 PM', address: '2530 Channing Way', hours: '7:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Same-day wash & fold service • App payments', offset: { lat: -0.0031, lng: -0.0025 } },
    { id: 'laund-s2', name: 'Campus Laundromat Express', dist: '0.3 km', status: 'Open until 11 PM', address: '2512 Durant Ave', hours: '6:30 AM – 11:00 PM', contact: '+1 (510) 55*-****', highlights: 'High-capacity speed washers • Free Wi-Fi study zone', offset: { lat: 0.0025, lng: 0.0022 } },
    { id: 'laund-s3', name: 'EcoClean Smart Wash', dist: '0.5 km', status: 'Open until 9 PM', address: '2640 Telegraph Ave', hours: '7:00 AM – 9:00 PM', contact: '+1 (510) 55*-****', highlights: 'Eco-friendly detergents & gentle cycle machines', offset: { lat: -0.0039, lng: 0.0018 } },
    { id: 'laund-s4', name: 'SpeedQueen 24/7 Laundry', dist: '0.6 km', status: 'Open 24/7', address: '2130 Shattuck Ave', hours: 'Open 24 Hours', contact: '+1 (510) 55*-****', highlights: 'Night-owl card payment laundromat with security', offset: { lat: -0.0032, lng: -0.0042 } },
    { id: 'laund-s5', name: 'Suds & Spin Student Lounge', dist: '0.4 km', status: 'Open until 10 PM', address: '2418 Bancroft Way', hours: '7:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Coffee bar, desks & charging stations inside', offset: { lat: -0.0018, lng: 0.0024 } },
    { id: 'laund-s6', name: 'QuickDry Self-Service', dist: '0.5 km', status: 'Open until 10 PM', address: '2210 Fulton St', hours: '8:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Affordable 20-min dryers • Card & coin accepted', offset: { lat: -0.0015, lng: -0.0035 } },
    { id: 'laund-s7', name: 'University Dry Cleaners', dist: '0.7 km', status: 'Open until 7 PM', address: '2050 Center St', hours: '8:00 AM – 7:00 PM', contact: '+1 (510) 55*-****', highlights: 'Formal wear, suits, jacket & bedding cleaning', offset: { lat: 0.0028, lng: -0.0038 } }
  ],
  transport: [
    { id: 'trans-s1', name: 'Downtown BART Station', dist: '0.6 km', status: 'Active (Trains every 10m)', address: '2160 Shattuck Ave', hours: '5:00 AM – 1:00 AM', contact: '+1 (510) 55*-****', highlights: 'Direct subway connection to San Francisco & Oakland', offset: { lat: -0.0025, lng: -0.0075 } },
    { id: 'trans-s2', name: 'AC Transit Bus Stop Line 51B', dist: '0.1 km', status: 'Active (Buses every 8m)', address: 'Bancroft Way & Telegraph Ave', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Direct route to Amtrak station & dorm residences', offset: { lat: -0.0008, lng: 0.0015 } },
    { id: 'trans-s3', name: 'Campus Bear Transit Shuttle', dist: '0.1 km', status: 'Active (Shuttles every 12m)', address: 'Mining Circle Central Loop', hours: '7:00 AM – 11:00 PM', contact: '+1 (510) 55*-****', highlights: 'Free for all students with student ID card', offset: { lat: 0.0012, lng: 0.0008 } },
    { id: 'trans-s4', name: 'Zipcar Campus Hub', dist: '0.3 km', status: 'Active 24/7', address: '2500 Durant Ave Garage', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Hourly student car rental with gas and insurance included', offset: { lat: -0.0029, lng: 0.0021 } },
    { id: 'trans-s5', name: 'Bay Wheels Bike Share Kiosk', dist: '0.2 km', status: 'Active 24/7', address: 'Telegraph Ave & Bancroft Way', hours: '24 Hours', contact: '+1 (510) 55*-****', highlights: 'Classic & electric bikes with student annual pass', offset: { lat: -0.0014, lng: 0.0016 } },
    { id: 'trans-s6', name: 'Lime / Bird Scooter Dock', dist: '0.1 km', status: 'Active 24/7', address: 'Sproul Plaza North Gate', hours: '24 Hours', contact: 'In-app unlocking', highlights: 'Electric scooters for quick cross-campus transit', offset: { lat: 0.0006, lng: 0.0012 } },
    { id: 'trans-s7', name: 'North Gate Bus Terminal', dist: '0.4 km', status: 'Active', address: 'Hearst Ave & Euclid Ave', hours: '6:00 AM – 11:30 PM', contact: '+1 (510) 55*-****', highlights: 'Lines 65, 67, and F express buses', offset: { lat: 0.0034, lng: 0.0015 } },
    { id: 'trans-s8', name: 'Amtrak Berkeley Connector', dist: '0.9 km', status: 'Active', address: '700 University Ave', hours: '6:00 AM – 10:00 PM', contact: '+1 (510) 55*-****', highlights: 'Capitol Corridor train service across Northern California', offset: { lat: 0.0045, lng: -0.0085 } }
  ]
};
