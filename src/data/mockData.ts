import { Institution, JobDrive, AptitudeQuestion } from '../types/placement';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst_iitb',
    name: 'Indian Institute of Technology, Bombay',
    code: 'IIT-B',
    badge: 'Premier Institute',
    location: 'Powai, Mumbai',
    deanPlacement: 'Prof. Rajesh K. Saraf',
    contactEmail: 'placement@iitb.ac.in',
    accentColor: 'indigo',
    accentBg: 'from-blue-600 to-indigo-700',
    tagline: 'Excellence in Engineering, Innovation & Leadership',
    studentCount: 3450,
    placementRate: 98.4,
    highestPackage: '₹1.85 Cr PA',
    averagePackage: '₹24.8 LPA'
  },
  {
    id: 'inst_bits',
    name: 'BITS Pilani - Pilani Campus',
    code: 'BITS',
    badge: 'Institute of Eminence',
    location: 'Pilani, Rajasthan',
    deanPlacement: 'Dr. Anuradha Sharma',
    contactEmail: 'placements@pilani.bits-pilani.ac.in',
    accentColor: 'amber',
    accentBg: 'from-amber-600 to-orange-700',
    tagline: 'Innovate, Achieve, Lead across Global Industries',
    studentCount: 2890,
    placementRate: 96.8,
    highestPackage: '₹1.42 Cr PA',
    averagePackage: '₹21.2 LPA'
  },
  {
    id: 'inst_nitk',
    name: 'National Institute of Technology Karnataka',
    code: 'NIT-Surathkal',
    badge: 'Centrally Funded',
    location: 'Mangalore, Karnataka',
    deanPlacement: 'Prof. V. Ramanathan',
    contactEmail: 'cdc@nitk.edu.in',
    accentColor: 'emerald',
    accentBg: 'from-emerald-600 to-teal-700',
    tagline: 'Catalyzing Top Engineering Careers Worldwide',
    studentCount: 2420,
    placementRate: 94.6,
    highestPackage: '₹68 LPA',
    averagePackage: '₹18.4 LPA'
  },
  {
    id: 'inst_mit',
    name: 'Manipal Institute of Technology',
    code: 'MIT-Manipal',
    badge: 'Global Recognized',
    location: 'Manipal, Karnataka',
    deanPlacement: 'Dr. Harish Kumar',
    contactEmail: 'placement.mit@manipal.edu',
    accentColor: 'purple',
    accentBg: 'from-purple-600 to-pink-700',
    tagline: 'Inspiring Minds, Building Tech Pioneers',
    studentCount: 4100,
    placementRate: 91.2,
    highestPackage: '₹54 LPA',
    averagePackage: '₹14.6 LPA'
  }
];

export const INITIAL_JOB_DRIVES: JobDrive[] = [
  {
    id: 'drive_google_01',
    institutionId: 'inst_iitb',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    role: 'Software Development Engineer - I',
    ctc: '₹44.5 LPA',
    stipend: '₹1,25,000 / mo',
    location: 'Bengaluru / Hyderabad',
    jobType: 'Full-time',
    category: 'Super Dream',
    eligibilityCgpa: 8.0,
    eligibleBranches: ['Computer Science', 'Information Tech', 'Electrical & Electronics', 'Data Science'],
    batch: '2025',
    deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), // 2 days from now
    driveDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Join Google core infrastructure and cloud platforms engineering teams. You will design, build, and deploy hyper-scale distributed computing systems.',
    skillsRequired: ['Data Structures & Algorithms', 'C++/Java/Go', 'System Design', 'Distributed Systems'],
    rounds: [
      { roundNumber: 1, name: 'Online Coding Challenge (HackerEarth)', type: 'Online Aptitude', scheduledDate: 'Oct 02, 2026' },
      { roundNumber: 2, name: 'Technical Problem Solving 1', type: 'Technical Round 1', scheduledDate: 'Oct 05, 2026' },
      { roundNumber: 3, name: 'System Architecture & Algorithmic Rigor', type: 'System Design', scheduledDate: 'Oct 06, 2026' },
      { roundNumber: 4, name: 'Googleyness & Leadership Values', type: 'HR Round', scheduledDate: 'Oct 07, 2026' }
    ],
    status: 'Closing Soon',
    applicantCount: 284,
    hiredCount: 14
  },
  {
    id: 'drive_msft_01',
    institutionId: 'inst_iitb',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1642132652809-8c73812739eb?w=100&auto=format&fit=crop&q=80',
    role: 'Cloud Solutions & AI Engineer',
    ctc: '₹42.0 LPA',
    location: 'Hyderabad / Noida',
    jobType: 'Full-time',
    category: 'Super Dream',
    eligibilityCgpa: 7.8,
    eligibleBranches: ['Computer Science', 'Electronics & Comm', 'Information Tech', 'Mathematics & Computing'],
    batch: '2025',
    deadline: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Work alongside Azure Cognitive Services and generative AI platform teams building resilient cloud computing backends.',
    skillsRequired: ['C#', 'Python', 'Azure / AWS', 'Kubernetes', 'Machine Learning pipelines'],
    rounds: [
      { roundNumber: 1, name: 'Microsoft Codility OA', type: 'Online Aptitude', scheduledDate: 'Oct 04, 2026' },
      { roundNumber: 2, name: 'Technical DSA & Code Quality', type: 'Technical Round 1', scheduledDate: 'Oct 08, 2026' },
      { roundNumber: 3, name: 'Cloud Design & Cultural Fit', type: 'HR Round', scheduledDate: 'Oct 09, 2026' }
    ],
    status: 'Open',
    applicantCount: 312
  },
  {
    id: 'drive_goldman_01',
    institutionId: 'inst_bits',
    companyName: 'Goldman Sachs',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
    role: 'Quantitative Financial Analyst & SWE',
    ctc: '₹36.0 LPA',
    location: 'Bengaluru',
    jobType: 'Full-time',
    category: 'Super Dream',
    eligibilityCgpa: 8.2,
    eligibleBranches: ['Computer Science', 'Electrical', 'Economics', 'Mechanical', 'Math'],
    batch: '2025',
    deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 1 day
    driveDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Develop low latency trading algorithms, real-time risk assessment telemetry, and high-frequency analytical engines.',
    skillsRequired: ['Quantitative Aptitude', 'Probability & Stats', 'C++', 'Python', 'Algorithmic Trading'],
    rounds: [
      { roundNumber: 1, name: 'Goldman Quant & Coding Aptitude Assessment', type: 'Online Aptitude', scheduledDate: 'Oct 01, 2026' },
      { roundNumber: 2, name: 'Technical Problem Solving & DSA', type: 'Technical Round 1', scheduledDate: 'Oct 04, 2026' },
      { roundNumber: 3, name: 'Trading Math & Behavioural Interview', type: 'HR Round', scheduledDate: 'Oct 05, 2026' }
    ],
    status: 'Closing Soon',
    applicantCount: 198
  },
  {
    id: 'drive_uber_01',
    institutionId: 'inst_bits',
    companyName: 'Uber',
    companyLogo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80',
    role: 'Software Engineer II - Mobility',
    ctc: '₹38.5 LPA',
    location: 'Bengaluru / Hyderabad',
    jobType: 'Full-time',
    category: 'Super Dream',
    eligibilityCgpa: 7.5,
    eligibleBranches: ['Computer Science', 'Information Tech'],
    batch: '2025',
    deadline: new Date(Date.now() + 120 * 3600 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Design dynamic pricing, geolocation mapping, and high-throughput dispatch algorithms powering billions of trips.',
    skillsRequired: ['Go / Java', 'Microservices', 'Kafka', 'Redis', 'High Concurrency'],
    rounds: [
      { roundNumber: 1, name: 'Uber CodeSignal Assessment', type: 'Online Aptitude', scheduledDate: 'Oct 10, 2026' },
      { roundNumber: 2, name: 'Algorithms & Architecture', type: 'Technical Round 1', scheduledDate: 'Oct 12, 2026' },
      { roundNumber: 3, name: 'System Scaling & Leadership', type: 'HR Round', scheduledDate: 'Oct 14, 2026' }
    ],
    status: 'Open',
    applicantCount: 220
  },
  {
    id: 'drive_cisco_01',
    institutionId: 'inst_nitk',
    companyName: 'Cisco Systems',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    role: 'Network Software Engineer',
    ctc: '₹22.5 LPA',
    location: 'Bengaluru / Chennai',
    jobType: 'Full-time',
    category: 'Dream',
    eligibilityCgpa: 7.0,
    eligibleBranches: ['Computer Science', 'Electronics & Comm', 'Information Tech', 'Telecommunication'],
    batch: '2025',
    deadline: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Work on programmable SDN switches, edge routing software, cybersecurity kernels, and 5G network telemetry.',
    skillsRequired: ['Computer Networks (TCP/IP)', 'C / C++', 'Linux Internals', 'Python Scripting'],
    rounds: [
      { roundNumber: 1, name: 'Networking & CS Fundamentals Test', type: 'Online Aptitude', scheduledDate: 'Oct 03, 2026' },
      { roundNumber: 2, name: 'Socket Programming & Data Structures', type: 'Technical Round 1', scheduledDate: 'Oct 06, 2026' },
      { roundNumber: 3, name: 'Managerial & HR Round', type: 'HR Round', scheduledDate: 'Oct 07, 2026' }
    ],
    status: 'Open',
    applicantCount: 340
  },
  {
    id: 'drive_qualcomm_01',
    institutionId: 'inst_nitk',
    companyName: 'Qualcomm',
    companyLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    role: 'Embedded Systems & ASIC Design Engineer',
    ctc: '₹26.0 LPA',
    location: 'Hyderabad / Bengaluru / Chennai',
    jobType: 'Full-time',
    category: 'Dream',
    eligibilityCgpa: 7.5,
    eligibleBranches: ['Electronics & Comm', 'Electrical', 'Computer Science'],
    batch: '2025',
    deadline: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Design next-gen Snapdragon compute engines, embedded DSP firmware, and neural processing units.',
    skillsRequired: ['Verilog / VHDL', 'C Programming', 'Digital Electronics', 'Computer Architecture'],
    rounds: [
      { roundNumber: 1, name: 'Qualcomm Hardware & C Test', type: 'Online Aptitude', scheduledDate: 'Oct 02, 2026' },
      { roundNumber: 2, name: 'Logic Design & Memory Architecture', type: 'Technical Round 1', scheduledDate: 'Oct 05, 2026' },
      { roundNumber: 3, name: 'Technical Director & Culture Fit', type: 'HR Round', scheduledDate: 'Oct 06, 2026' }
    ],
    status: 'Closing Soon',
    applicantCount: 185
  },
  {
    id: 'drive_adobe_01',
    institutionId: 'inst_mit',
    companyName: 'Adobe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Product Development Engineer (Creative Cloud)',
    ctc: '₹28.0 LPA',
    location: 'Noida / Bengaluru',
    jobType: 'Full-time',
    category: 'Dream',
    eligibilityCgpa: 7.2,
    eligibleBranches: ['Computer Science', 'Information Tech', 'Electronics'],
    batch: '2025',
    deadline: new Date(Date.now() + 60 * 3600 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: 'Innovate digital media experiences, vector rendering algorithms, and AI creative tools inside Adobe Firefly.',
    skillsRequired: ['C++', 'React / TypeScript', 'Computer Graphics / WebGL', 'Algorithms'],
    rounds: [
      { roundNumber: 1, name: 'Adobe OA (HackerRank)', type: 'Online Aptitude', scheduledDate: 'Oct 03, 2026' },
      { roundNumber: 2, name: 'Object Oriented Design & DSA', type: 'Technical Round 1', scheduledDate: 'Oct 07, 2026' },
      { roundNumber: 3, name: 'System Design & HR', type: 'HR Round', scheduledDate: 'Oct 08, 2026' }
    ],
    status: 'Open',
    applicantCount: 260
  }
];

export const INITIAL_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q_quant_1',
    category: 'Quantitative',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
    correctIndex: 1,
    explanation: 'Speed = 240m / 24s = 10 m/s. Total distance to pass platform = 240 + 650 = 890m. Time = 890 / 10 = 89 seconds.',
    difficulty: 'Easy'
  },
  {
    id: 'q_quant_2',
    category: 'Quantitative',
    question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:',
    options: ['50 minutes', '12 minutes', '25 minutes', '15 minutes'],
    correctIndex: 1,
    explanation: 'Part filled in 1 min = (1/20 + 1/30) = 5/60 = 1/12. Hence the tank is filled in 12 minutes.',
    difficulty: 'Easy'
  },
  {
    id: 'q_quant_3',
    category: 'Quantitative',
    question: 'A shopkeeper sells two items for ₹990 each, making a profit of 10% on one and a loss of 10% on the other. What is the net overall gain or loss percentage?',
    options: ['No profit, no loss', '1% loss', '1% gain', '2.5% loss'],
    correctIndex: 1,
    explanation: 'When two articles are sold at the same selling price with x% gain and x% loss, net result is always a loss of (x/10)^2 % = (10/10)^2 % = 1% loss.',
    difficulty: 'Medium'
  },
  {
    id: 'q_logic_1',
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph, a woman says: "He is the son of the only daughter of my paternal grandfather." How is the man in the photograph related to the woman?',
    options: ['Brother', 'Cousin', 'Uncle', 'Father'],
    correctIndex: 1,
    explanation: 'Paternal grandfather\'s only daughter is her aunt (bua). The son of her aunt is her cousin.',
    difficulty: 'Medium'
  },
  {
    id: 'q_logic_2',
    category: 'Logical Reasoning',
    question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['95', '127', '128', '111'],
    correctIndex: 1,
    explanation: 'Each number is 2 * previous + 1. (63 * 2) + 1 = 126 + 1 = 127. Alternatively, pattern is +4, +8, +16, +32, +64.',
    difficulty: 'Easy'
  },
  {
    id: 'q_cs_1',
    category: 'Core CS & Data Structures',
    question: 'What is the worst-case time complexity of searching for a key in a standard unbalanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 2,
    explanation: 'In the worst case (skewed tree, like inserting sorted elements), a BST degrades into a linked list with search complexity O(N).',
    difficulty: 'Easy'
  },
  {
    id: 'q_cs_2',
    category: 'Core CS & Data Structures',
    question: 'In relational databases, which ACID property guarantees that a transaction once committed will remain committed even in the event of a system crash?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctIndex: 3,
    explanation: 'Durability guarantees that once a transaction has been committed, it will persist in the non-volatile database storage even after a system crash.',
    difficulty: 'Easy'
  },
  {
    id: 'q_cs_3',
    category: 'Core CS & Data Structures',
    question: 'What will be the output of the following C code snippet?\nint x = 5;\nprintf("%d %d", x++, ++x);',
    options: ['5 7', '6 6', 'Undefined behavior (order of evaluation unspecified)', '5 6'],
    correctIndex: 2,
    explanation: 'In C and C++, modifying a variable multiple times without an intervening sequence point or having unsequenced side-effects results in Undefined Behavior.',
    difficulty: 'Medium'
  },
  {
    id: 'q_cs_4',
    category: 'Core CS & Data Structures',
    question: 'Which of the following scheduling algorithms can cause starvation (indefinite postponement) of lower-priority processes?',
    options: ['First Come First Served (FCFS)', 'Round Robin', 'Shortest Job First (SJF) / Priority Scheduling', 'Aging Round Robin'],
    correctIndex: 2,
    explanation: 'Shortest Job First or static Priority Scheduling can indefinitely postpone longer or lower priority jobs if shorter/higher priority jobs keep arriving.',
    difficulty: 'Medium'
  },
  {
    id: 'q_verbal_1',
    category: 'Verbal',
    question: 'Choose the word that is closest in meaning (synonym) to: "EPHEMERAL"',
    options: ['Eternal', 'Transitory', 'Volatile', 'Resilient'],
    correctIndex: 1,
    explanation: '"Ephemeral" means lasting for a very short time, which is synonymous with "Transitory".',
    difficulty: 'Easy'
  }
];
