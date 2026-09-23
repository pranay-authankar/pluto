/**
 * STUDENT RELOCATION PLATFORM - ROOM PARTNER FINDER CONTROLLER
 * Supports:
 * - College-specific filtering based on active campus context
 * - Two choices: 'I Have a Room' (students seeking room) & 'I Need a Room' (vacant shared rooms)
 * - Persistent choice on refresh via sessionStorage
 * - Select college first state when no college is chosen
 */

(function () {
  'use strict';

  // Helper to normalize college ID
  function getCollegeId(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // Dataset: Students Looking for a Room (Indian Campuses)
  const roommatesData = [
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
      contact: '+91 98231 44550'
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
      contact: '+91 98450 67890'
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
      contact: '+91 98123 76543'
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
      contact: '+91 98901 23456'
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
      contact: '+91 98345 67890'
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
      contact: '+91 97654 32109'
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
      contact: '+91 98112 34567'
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
      contact: '+91 98220 11223'
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
      contact: '+91 98330 44556'
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
      contact: '+91 98401 55667'
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
      contact: '+91 98402 77889'
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
      contact: '+91 98101 22334'
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
      contact: '+91 98102 44556'
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
      contact: '+91 98411 99887'
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
      contact: '+91 98412 11223'
    },

    // Fallbacks for other Indian Campuses
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
      contact: '+91 98451 22334'
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
      contact: '+91 98321 44556'
    }
  ];

  // Dataset: Vacant Shared Rooms (Indian Campuses)
  const vacantSharedRooms = [
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
      image: 'assets/dorm_main.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98765 21098',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
      contact: '+91 98450 12345',
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
      image: 'assets/dorm_main.jpg',
      tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
      contact: '+91 98112 34567',
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
      image: 'assets/dorm_main.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98101 55667',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
      contact: '+91 98102 66778',
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
      image: 'assets/dorm_main.jpg',
      tags: ['Study Desks', 'Cook Available', 'Washing Machine'],
      contact: '+91 98103 77889',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98290 12345',
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
      image: 'assets/dorm_main.jpg',
      tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
      contact: '+91 98291 23456',
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
      image: 'assets/dorm_main.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98401 34567',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Quiet Flat', 'Kitchen Access', 'Power Backup'],
      contact: '+91 98402 45678',
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
      image: 'assets/dorm_main.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98111 67890',
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
      image: 'assets/dorm_study.jpg',
      tags: ['AC Room', 'Balcony', 'High-Speed Wi-Fi'],
      contact: '+91 98112 78901',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Furnished', 'Attached Bath', 'Wi-Fi'],
      contact: '+91 98415 89012',
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
      image: 'assets/dorm_main.jpg',
      tags: ['AC Room', 'Power Backup', 'Study Desk'],
      contact: '+91 98416 90123',
      college: 'VIT Vellore',
      collegeId: 'vit-vellore'
    },

    // Fallbacks
    {
      id: 'vr-iisc-1',
      room: 'Malleswaram Scholar Shared Flat',
      rent: '₹7,500/mo',
      rentValue: 7500,
      location: '8th Main, Malleswaram (0.5 km from IISc Bangalore)',
      distance: '0.5 km from Campus',
      currentOccupant: 'Chinmay (PhD Physics)',
      sharingType: '2-Sharing (1 Bed Open)',
      image: 'assets/dorm_main.jpg',
      tags: ['Quiet Flat', 'High-Speed Wi-Fi', 'Library Access'],
      contact: '+91 98452 34567',
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
      image: 'assets/dorm_study.jpg',
      tags: ['Furnished', 'Cook Available', 'Wi-Fi'],
      contact: '+91 98322 55667',
      college: 'IIT Kharagpur',
      collegeId: 'iit-kharagpur'
    }
  ];

  // Load college and active choice from sessionStorage
  let currentCollege = '';
  try {
    const stored = sessionStorage.getItem('relocmate_student_requirements');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.college && parsed.college !== 'UC Berkeley') {
        currentCollege = parsed.college;
      }
    }
    const directCollege = sessionStorage.getItem('relocmate_selected_college');
    if (directCollege && directCollege !== 'UC Berkeley') {
      currentCollege = directCollege;
    }
  } catch (e) {}

  let activeChoice = 'have-room';
  try {
    const savedChoice = sessionStorage.getItem('roommates_active_choice');
    if (savedChoice === 'have-room' || savedChoice === 'need-room') {
      activeChoice = savedChoice;
    }
  } catch (e) {}

  let filterBudget = 'all';

  // DOM Elements
  const choiceHaveRoom = document.getElementById('choiceHaveRoom');
  const choiceNeedRoom = document.getElementById('choiceNeedRoom');
  const activeSectionTitle = document.getElementById('activeSectionTitle');
  const activeCountBadge = document.getElementById('activeCountBadge');
  const quickFiltersBar = document.getElementById('quickFiltersBar');
  const roommatesGrid = document.getElementById('roommatesGrid');
  const partnerModal = document.getElementById('partnerModal');
  const modalCardContent = document.getElementById('modalCardContent');
  const campusSubtitle = document.getElementById('roommatesCampusSubtitle');
  const badgeCollege = document.getElementById('badgeCollege');
  const choicesContainer = document.querySelector('.roommate-choices-container');
  const roommatesShell = document.querySelector('.roommates-page-shell');

  function setCampus(collegeName) {
    currentCollege = collegeName;
    try {
      sessionStorage.setItem('relocmate_selected_college', collegeName);
      const stored = sessionStorage.getItem('relocmate_student_requirements');
      const parsed = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem('relocmate_student_requirements', JSON.stringify({ ...parsed, college: collegeName }));
    } catch (e) {}
    updateHeaderUI();
    updateChoiceUI();
  }

  function updateHeaderUI() {
    const hasCollege = Boolean(currentCollege && currentCollege.trim());
    if (badgeCollege) {
      if (hasCollege) {
        badgeCollege.innerHTML = `🎓 ${currentCollege}`;
        badgeCollege.title = 'Click to change college';
      } else {
        badgeCollege.textContent = '🎓 Select College';
        badgeCollege.title = 'Click to choose college';
      }
      badgeCollege.style.cursor = 'pointer';
      badgeCollege.onclick = () => window.location.href = 'index.html';
    }

    if (campusSubtitle) {
      if (hasCollege) {
        campusSubtitle.innerHTML = `Connect with verified student peers and vacant shared room openings near <strong style="color:var(--slate-800);">${currentCollege}</strong>`;
      } else {
        campusSubtitle.textContent = 'Find verified student peers and vacant shared room openings near your campus';
      }
    }
  }

  updateHeaderUI();

  function updateChoiceUI() {
    if (choiceHaveRoom && choiceNeedRoom) {
      if (activeChoice === 'have-room') {
        choiceHaveRoom.classList.add('selected');
        choiceNeedRoom.classList.remove('selected');
      } else {
        choiceNeedRoom.classList.add('selected');
        choiceHaveRoom.classList.remove('selected');
      }
    }

    try {
      sessionStorage.setItem('roommates_active_choice', activeChoice);
    } catch (e) {}

    renderQuickFilters();
    renderCards();
  }

  function renderQuickFilters() {
    if (!quickFiltersBar) return;
    quickFiltersBar.innerHTML = `
      <button type="button" class="food-filter-btn ${filterBudget === 'all' ? 'active' : ''}" data-budget="all" style="font-size:0.75rem;padding:0.35rem 0.8rem;">All Budgets</button>
      <button type="button" class="food-filter-btn ${filterBudget === '7500' ? 'active' : ''}" data-budget="7500" style="font-size:0.75rem;padding:0.35rem 0.8rem;">Under ₹7,500</button>
      <button type="button" class="food-filter-btn ${filterBudget === '9000' ? 'active' : ''}" data-budget="9000" style="font-size:0.75rem;padding:0.35rem 0.8rem;">Under ₹9,000</button>
      ${currentCollege ? `<span class="badge badge-primary" style="font-size:0.72rem;padding:3px 8px;">📍 ${currentCollege}</span>` : ''}
    `;

    quickFiltersBar.querySelectorAll('button[data-budget]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBudget = btn.getAttribute('data-budget');
        renderQuickFilters();
        renderCards();
      });
    });
  }

  function renderCards() {
    if (!roommatesGrid) return;
    roommatesGrid.innerHTML = '';

    const isCollegeSelected = Boolean(currentCollege && currentCollege.trim());
    const currentCollegeId = getCollegeId(currentCollege);

    if (!isCollegeSelected) {
      if (activeSectionTitle) activeSectionTitle.textContent = 'Room Partner Finder';
      if (activeCountBadge) activeCountBadge.textContent = 'College selection required';
      roommatesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; max-width: 680px; margin: var(--space-6) auto; text-align: center; background: var(--color-white); border: 1.5px solid var(--slate-200); border-radius: var(--radius-2xl); padding: var(--space-8) var(--space-6); box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.08);">
          <div style="font-size: 2.2rem; margin-bottom: var(--space-2);">🎓</div>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--slate-900); margin-bottom: var(--space-2);">Select your college first</h2>
          <p style="font-size: var(--font-size-sm); color: var(--slate-500); line-height: 1.6; max-width: 480px; margin: 0 auto var(--space-5);">
            Please select your college to view verified room partner matches and shared rooms near your campus.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: var(--space-5);">
            <button type="button" class="campus-pill-btn" data-campus="IIT Bombay" style="cursor:pointer;">🎓 IIT Bombay</button>
            <button type="button" class="campus-pill-btn" data-campus="IIT Delhi" style="cursor:pointer;">🎓 IIT Delhi</button>
            <button type="button" class="campus-pill-btn" data-campus="BITS Pilani" style="cursor:pointer;">🎓 BITS Pilani</button>
            <button type="button" class="campus-pill-btn" data-campus="IIT Madras" style="cursor:pointer;">🎓 IIT Madras</button>
            <button type="button" class="campus-pill-btn" data-campus="Delhi University (DU)" style="cursor:pointer;">🎓 DU</button>
            <button type="button" class="campus-pill-btn" data-campus="VIT Vellore" style="cursor:pointer;">🎓 VIT Vellore</button>
          </div>
          <a href="index.html" class="btn btn-primary btn-md" style="padding: 0.65rem 1.6rem; font-weight: 700; border-radius: var(--radius-xl); text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <span>Or Select from Home Page</span> <span>→</span>
          </a>
        </div>
      `;
      roommatesGrid.querySelectorAll('button[data-campus]').forEach(btn => {
        btn.addEventListener('click', () => setCampus(btn.getAttribute('data-campus')));
      });
      return;
    }

    if (activeChoice === 'have-room') {
      if (activeSectionTitle) activeSectionTitle.textContent = `Students Seeking a Room Near ${currentCollege}`;
      
      // Filter strictly by selected college
      const filtered = roommatesData.filter(student => {
        const studentCollegeId = student.collegeId || getCollegeId(student.college);
        const matchesCollege = (currentCollegeId && studentCollegeId === currentCollegeId) || student.college === currentCollege;
        if (!matchesCollege) return false;

        if (filterBudget !== 'all' && student.budgetValue > parseInt(filterBudget, 10)) return false;
        return true;
      });

      if (activeCountBadge) activeCountBadge.textContent = `${filtered.length} near ${currentCollege}`;

      if (filtered.length === 0) {
        roommatesGrid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:var(--space-12);color:var(--slate-500);background:var(--color-white);border-radius:var(--radius-xl);border:1px solid var(--slate-200);">
            <div style="font-size:1.8rem;margin-bottom:var(--space-2);">🔍</div>
            <div style="font-weight:700;color:var(--slate-800);margin-bottom:4px;">No student profiles found near ${currentCollege} matching this filter</div>
            <div style="font-size:var(--font-size-xs);color:var(--slate-400);">Try selecting "All Budgets" or check back as more students join.</div>
          </div>
        `;
        return;
      }

      filtered.forEach(student => {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div class="partner-card-header">
            <div class="partner-identity">
              <div class="partner-avatar" style="background:${student.avatarBg};">
                ${student.initials}
                <span class="partner-avatar-dot" title="Verified Student"></span>
              </div>
              <div>
                <h2 class="partner-name">${student.name}</h2>
                <span class="partner-college">🎓 ${student.college}</span>
              </div>
            </div>
          </div>

          <div class="partner-meta-row" style="background:var(--slate-50);padding:var(--space-3) var(--space-4);border-radius:var(--radius-xl);border:1px solid var(--slate-100);">
            <div class="partner-meta-item">
              <span class="meta-label" style="font-size:0.65rem;">Budget</span>
              <span class="meta-val" style="color:var(--primary-700);font-weight:800;font-size:1.1rem;">${student.budgetINR}</span>
            </div>
            <div class="partner-meta-item">
              <span class="meta-label" style="font-size:0.65rem;">Preferred Distance</span>
              <span class="meta-val" style="font-weight:600;font-size:0.9rem;color:var(--slate-700);">${student.distance}</span>
            </div>
          </div>

          <div class="partner-tags-row">
            ${student.tags.map(t => {
              let tagClass = 'partner-tag';
              let icon = '';
              const lower = t.toLowerCase();
              if (lower.includes('non-veg')) { tagClass += ' tag-nonveg'; icon = '🍗 '; }
              else if (lower.includes('veg')) { tagClass += ' tag-veg'; icon = '🌱 '; }
              else if (lower.includes('quiet')) { tagClass += ' tag-quiet'; icon = '🤫 '; }
              else if (lower.includes('early')) { tagClass += ' tag-early'; icon = '🌅 '; }
              else if (lower.includes('shared')) { tagClass += ' tag-shared'; icon = '👥 '; }
              else if (lower.includes('night')) { tagClass += ' tag-night'; icon = '🌙 '; }
              else if (lower.includes('smoker')) { tagClass += ' tag-veg'; icon = '🚭 '; }
              else if (lower.includes('food')) { tagClass += ' tag-early'; icon = '🍽️ '; }
              return `<span class="${tagClass}"><span>${icon}</span><span>${t}</span></span>`;
            }).join('')}
          </div>

          <button type="button" class="btn-partner-view">
            <span>View</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        `;

        card.addEventListener('click', () => openDetailModal(student, false));
        roommatesGrid.appendChild(card);
      });

    } else {
      if (activeSectionTitle) activeSectionTitle.textContent = `Available Vacant Shared Rooms Near ${currentCollege}`;
      
      // Filter strictly by selected college
      const filtered = vacantSharedRooms.filter(room => {
        const roomCollegeId = room.collegeId || getCollegeId(room.college);
        const matchesCollege = (currentCollegeId && roomCollegeId === currentCollegeId) || room.college === currentCollege;
        if (!matchesCollege) return false;

        if (filterBudget !== 'all' && room.rentValue > parseInt(filterBudget, 10)) return false;
        return true;
      });

      if (activeCountBadge) activeCountBadge.textContent = `${filtered.length} near ${currentCollege}`;

      if (filtered.length === 0) {
        roommatesGrid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:var(--space-12);color:var(--slate-500);background:var(--color-white);border-radius:var(--radius-xl);border:1px solid var(--slate-200);">
            <div style="font-size:1.8rem;margin-bottom:var(--space-2);">🛏️</div>
            <div style="font-weight:700;color:var(--slate-800);margin-bottom:4px;">No vacant shared rooms found near ${currentCollege} matching this filter</div>
            <div style="font-size:var(--font-size-xs);color:var(--slate-400);">Try selecting "All Budgets" or check back as more rooms become vacant.</div>
          </div>
        `;
        return;
      }

      filtered.forEach(room => {
        const card = document.createElement('div');
        card.className = 'vacant-room-card';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div class="vacant-room-img-wrap">
            <img src="${room.image}" alt="${room.room}" class="vacant-room-img" />
            <div style="position:absolute;top:var(--space-2-5);left:var(--space-2-5);">
              <span class="badge badge-primary" style="font-size:0.7rem;backdrop-filter:blur(4px);background:rgba(37,99,235,0.92);">${room.sharingType}</span>
            </div>
            <div style="position:absolute;bottom:var(--space-2);right:var(--space-2-5);background:rgba(15,23,42,0.82);color:#fff;padding:3px 8px;border-radius:var(--radius-full);font-size:0.72rem;font-weight:700;">
              ${room.rent}
            </div>
          </div>

          <div class="vacant-room-body">
            <h2 class="vacant-room-title">${room.room}</h2>

            <div class="vacant-room-detail-grid">
              <div>
                <span class="vacant-room-detail-label">Monthly Rent</span>
                <span class="vacant-room-detail-val" style="color:var(--primary-700);font-size:1.05rem;font-weight:800;">${room.rent}</span>
              </div>
              <div>
                <span class="vacant-room-detail-label">Sharing Type</span>
                <span class="vacant-room-detail-val" style="font-size:0.85rem;">${room.sharingType}</span>
              </div>
              <div style="grid-column:span 2;">
                <span class="vacant-room-detail-label">Current Occupant</span>
                <span class="vacant-room-detail-val" style="color:var(--slate-900);font-size:0.88rem;">👤 ${room.currentOccupant}</span>
              </div>
              <div style="grid-column:span 2;">
                <span class="vacant-room-detail-label">Location</span>
                <span class="vacant-room-detail-val" style="font-size:0.8rem;color:var(--slate-600);font-weight:500;">📍 ${room.location}</span>
              </div>
            </div>

            <div class="partner-tags-row">
              ${room.tags.map(t => {
                let icon = '✓';
                const lower = t.toLowerCase();
                if (lower.includes('bath') || lower.includes('washroom')) icon = '🚿';
                else if (lower.includes('wi-fi') || lower.includes('wifi')) icon = '📶';
                else if (lower.includes('furnish')) icon = '🛋️';
                else if (lower.includes('balcony') || lower.includes('garden')) icon = '🌿';
                else if (lower.includes('ac')) icon = '❄️';
                else if (lower.includes('cook') || lower.includes('kitchen')) icon = '🍳';
                else if (lower.includes('backup') || lower.includes('power')) icon = '⚡';
                else if (lower.includes('desk') || lower.includes('study')) icon = '📚';
                return `<span class="partner-tag tag-amenity"><span>${icon}</span><span>${t}</span></span>`;
              }).join('')}
            </div>

            <button type="button" class="btn-partner-view">
              <span>View</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        `;

        card.addEventListener('click', () => openDetailModal(room, true));
        roommatesGrid.appendChild(card);
      });
    }
  }

  function openDetailModal(data, isRoom) {
    if (!partnerModal || !modalCardContent) return;

    if (isRoom) {
      modalCardContent.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">
          <span class="badge badge-primary" style="font-size:0.75rem;">${data.sharingType}</span>
          <button type="button" class="btn-modal-close" id="closeModalBtn" style="background:var(--slate-100);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <img src="${data.image}" alt="${data.room}" style="width:100%;height:180px;object-fit:cover;border-radius:var(--radius-xl);margin-bottom:var(--space-4);" />
        <h2 style="font-size:1.25rem;font-weight:800;color:var(--slate-900);margin-bottom:2px;">${data.room}</h2>
        <div style="font-size:var(--font-size-xs);color:var(--slate-500);margin-bottom:var(--space-4);">📍 Near ${data.college} • ${data.location}</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);background:var(--slate-50);padding:var(--space-4);border-radius:var(--radius-xl);margin-bottom:var(--space-4);">
          <div>
            <div style="font-size:0.65rem;text-transform:uppercase;color:var(--slate-400);font-weight:700;">Rent</div>
            <div style="font-size:1.15rem;font-weight:800;color:var(--primary-700);">${data.rent}</div>
          </div>
          <div>
            <div style="font-size:0.65rem;text-transform:uppercase;color:var(--slate-400);font-weight:700;">Current Occupant</div>
            <div style="font-size:0.9rem;font-weight:700;color:var(--slate-800);">${data.currentOccupant}</div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="btnContactOccupant" style="width:100%;justify-content:center;padding:0.75rem;font-weight:700;border-radius:var(--radius-xl);">
          Contact Occupant (${data.contact})
        </button>
      `;
    } else {
      modalCardContent.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">
          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <div class="partner-avatar" style="background:${data.avatarBg};width:44px;height:44px;font-size:1.1rem;">
              ${data.initials}
            </div>
            <div>
              <h2 style="font-size:1.2rem;font-weight:800;margin:0;color:var(--slate-900);">${data.name}</h2>
              <span style="font-size:var(--font-size-xs);color:var(--slate-500);font-weight:600;">🎓 ${data.college}</span>
            </div>
          </div>
          <button type="button" class="btn-modal-close" id="closeModalBtn" style="background:var(--slate-100);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);background:var(--slate-50);padding:var(--space-4);border-radius:var(--radius-xl);margin-bottom:var(--space-4);">
          <div>
            <div style="font-size:0.65rem;text-transform:uppercase;color:var(--slate-400);font-weight:700;">Budget</div>
            <div style="font-size:1.15rem;font-weight:800;color:var(--primary-700);">${data.budgetINR}</div>
          </div>
          <div>
            <div style="font-size:0.65rem;text-transform:uppercase;color:var(--slate-400);font-weight:700;">Distance Preference</div>
            <div style="font-size:0.95rem;font-weight:700;color:var(--slate-800);">${data.distance}</div>
          </div>
        </div>

        <div style="margin-bottom:var(--space-5);">
          <div style="font-size:0.7rem;text-transform:uppercase;color:var(--slate-400);font-weight:700;margin-bottom:var(--space-2);">Preferences</div>
          <div class="partner-tags-row">
            ${data.tags.map(t => `<span class="partner-tag"><span>${t}</span></span>`).join('')}
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="btnConnectStudent" style="width:100%;justify-content:center;padding:0.75rem;font-weight:700;border-radius:var(--radius-xl);">
          Send Connection Request (${data.contact})
        </button>
      `;
    }

    partnerModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const btnContactOccupant = document.getElementById('btnContactOccupant');
    if (btnContactOccupant) {
      btnContactOccupant.addEventListener('click', () => {
        alert(`Inquiry sent to ${data.currentOccupant}! Contact: ${data.contact}`);
        closeModal();
      });
    }

    const btnConnectStudent = document.getElementById('btnConnectStudent');
    if (btnConnectStudent) {
      btnConnectStudent.addEventListener('click', () => {
        alert(`Connection request sent to ${data.name}! Contact: ${data.contact}`);
        closeModal();
      });
    }
  }

  function closeModal() {
    if (!partnerModal) return;
    partnerModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (partnerModal) {
    partnerModal.addEventListener('click', (e) => {
      if (e.target === partnerModal) closeModal();
    });
  }

  // Event Listeners for Choices
  if (choiceHaveRoom) {
    choiceHaveRoom.addEventListener('click', () => {
      activeChoice = 'have-room';
      updateChoiceUI();
    });
  }

  if (choiceNeedRoom) {
    choiceNeedRoom.addEventListener('click', () => {
      activeChoice = 'need-room';
      updateChoiceUI();
    });
  }

  // Initialize
  updateChoiceUI();
})();
