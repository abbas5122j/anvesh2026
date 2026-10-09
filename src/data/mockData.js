// Comprehensive realistic mock data for AcademiPulse AI
export const INITIAL_DEPARTMENTS = [
  { id: 'dept-cse', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Vikramaditya Reddy' },
  { id: 'dept-ece', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Dr. Meenakshi Sundaram' },
  { id: 'dept-it', name: 'Information Technology', code: 'IT', hod: 'Dr. Rajeshwari Nair' }
];

export const INITIAL_CLASSES = [
  { id: 'class-cse-3a', departmentId: 'dept-cse', name: '3rd Year CSE - Section A', semester: 5, academicYear: '2025-2026', mentorId: 'fac-1' },
  { id: 'class-cse-3b', departmentId: 'dept-cse', name: '3rd Year CSE - Section B', semester: 5, academicYear: '2025-2026', mentorId: 'fac-2' },
  { id: 'class-ece-3a', departmentId: 'dept-ece', name: '3rd Year ECE - Section A', semester: 5, academicYear: '2025-2026', mentorId: 'fac-3' }
];

export const INITIAL_SUBJECTS = [
  { id: 'sub-dsa', code: 'CS501', name: 'Data Structures & Algorithms', credits: 4, facultyId: 'fac-1', departmentId: 'dept-cse', syllabusUnits: 5 },
  { id: 'sub-os', code: 'CS502', name: 'Operating Systems', credits: 4, facultyId: 'fac-2', departmentId: 'dept-cse', syllabusUnits: 5 },
  { id: 'sub-dbms', code: 'CS503', name: 'Database Management Systems', credits: 4, facultyId: 'fac-1', departmentId: 'dept-cse', syllabusUnits: 5 },
  { id: 'sub-cn', code: 'CS504', name: 'Computer Networks', credits: 3, facultyId: 'fac-2', departmentId: 'dept-cse', syllabusUnits: 4 },
  { id: 'sub-toc', code: 'CS505', name: 'Theory of Computation', credits: 3, facultyId: 'fac-3', departmentId: 'dept-cse', syllabusUnits: 4 }
];

export const INITIAL_FACULTY = [
  {
    id: 'fac-1',
    name: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@college.edu',
    role: 'faculty',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    assignedClasses: ['class-cse-3a'],
    subjects: ['sub-dsa', 'sub-dbms'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-2',
    name: 'Prof. Ananya Roy',
    email: 'ananya.roy@college.edu',
    role: 'faculty',
    designation: 'Assistant Professor & Mentor',
    department: 'Computer Science & Engineering',
    assignedClasses: ['class-cse-3a', 'class-cse-3b'],
    subjects: ['sub-os', 'sub-cn'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'admin-1',
    name: 'Dr. Vikramaditya Reddy',
    email: 'vikram.reddy@college.edu',
    role: 'admin',
    designation: 'Head of Department (HOD) - CSE',
    department: 'Computer Science & Engineering',
    assignedClasses: ['class-cse-3a', 'class-cse-3b', 'class-ece-3a'],
    subjects: ['sub-toc'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'stu-1',
    rollNo: '23CS101',
    name: 'Rahul Sharma',
    email: 'rahul.23cs101@college.edu',
    phone: '+91 98765 43210',
    parentContact: '+91 98765 43211 (Mr. K. Sharma - Father)',
    classId: 'class-cse-3a',
    targetCGPA: 8.5,
    currentCGPA: 7.2,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    attendance: {
      totalConducted: 42,
      totalAttended: 31,
      overallPercentage: 73.8,
      bySubject: {
        'sub-dsa': { conducted: 10, attended: 8, percentage: 80.0 },
        'sub-os': { conducted: 9, attended: 5, percentage: 55.5 }, // Critical alert
        'sub-dbms': { conducted: 8, attended: 7, percentage: 87.5 },
        'sub-cn': { conducted: 8, attended: 6, percentage: 75.0 },
        'sub-toc': { conducted: 7, attended: 5, percentage: 71.4 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 21, maxMarks: 25, weight: 15, date: '2025-08-20' },
        { assessment: 'Internal Exam 1', marks: 38, maxMarks: 50, weight: 35, date: '2025-09-15' },
        { assessment: 'Assignment 1', marks: 9, maxMarks: 10, weight: 10, date: '2025-09-25' }
      ],
      'sub-os': [
        { assessment: 'Unit Test 1', marks: 16, maxMarks: 25, weight: 15, date: '2025-08-22' },
        { assessment: 'Internal Exam 1', marks: 23, maxMarks: 50, weight: 35, date: '2025-09-17' }, // declining
        { assessment: 'Assignment 1', marks: 5, maxMarks: 10, weight: 10, date: '2025-09-26' }
      ],
      'sub-dbms': [
        { assessment: 'Unit Test 1', marks: 22, maxMarks: 25, weight: 15, date: '2025-08-24' },
        { assessment: 'Internal Exam 1', marks: 44, maxMarks: 50, weight: 35, date: '2025-09-19' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-28' }
      ],
      'sub-cn': [
        { assessment: 'Unit Test 1', marks: 18, maxMarks: 25, weight: 15, date: '2025-08-26' },
        { assessment: 'Internal Exam 1', marks: 34, maxMarks: 50, weight: 35, date: '2025-09-21' },
        { assessment: 'Assignment 1', marks: 8, maxMarks: 10, weight: 10, date: '2025-09-30' }
      ],
      'sub-toc': [
        { assessment: 'Unit Test 1', marks: 17, maxMarks: 25, weight: 15, date: '2025-08-28' },
        { assessment: 'Internal Exam 1', marks: 31, maxMarks: 50, weight: 35, date: '2025-09-23' },
        { assessment: 'Assignment 1', marks: 7, maxMarks: 10, weight: 10, date: '2025-10-02' }
      ]
    },
    submissions: {
      assigned: 6,
      submitted: 4,
      onTime: 3,
      late: 1,
      missed: 2
    },
    knownWeakTopics: ['OS: Concurrency & Semaphores', 'OS: Deadlock Avoidance', 'TOC: Pumping Lemma'],
    strengths: ['DBMS: Normalization & SQL Queries', 'DSA: Binary Search & Trees'],
    studyStreak: 4,
    studyHoursLogged: 18
  },
  {
    id: 'stu-2',
    rollNo: '23CS102',
    name: 'Priya Patel',
    email: 'priya.23cs102@college.edu',
    phone: '+91 98765 43220',
    parentContact: '+91 98765 43221 (Mrs. R. Patel - Mother)',
    classId: 'class-cse-3a',
    targetCGPA: 9.5,
    currentCGPA: 9.1,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    attendance: {
      totalConducted: 42,
      totalAttended: 39,
      overallPercentage: 92.8,
      bySubject: {
        'sub-dsa': { conducted: 10, attended: 10, percentage: 100.0 },
        'sub-os': { conducted: 9, attended: 8, percentage: 88.9 },
        'sub-dbms': { conducted: 8, attended: 8, percentage: 100.0 },
        'sub-cn': { conducted: 8, attended: 7, percentage: 87.5 },
        'sub-toc': { conducted: 7, attended: 6, percentage: 85.7 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 25, maxMarks: 25, weight: 15, date: '2025-08-20' },
        { assessment: 'Internal Exam 1', marks: 48, maxMarks: 50, weight: 35, date: '2025-09-15' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-25' }
      ],
      'sub-os': [
        { assessment: 'Unit Test 1', marks: 23, maxMarks: 25, weight: 15, date: '2025-08-22' },
        { assessment: 'Internal Exam 1', marks: 46, maxMarks: 50, weight: 35, date: '2025-09-17' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-26' }
      ],
      'sub-dbms': [
        { assessment: 'Unit Test 1', marks: 24, maxMarks: 25, weight: 15, date: '2025-08-24' },
        { assessment: 'Internal Exam 1', marks: 49, maxMarks: 50, weight: 35, date: '2025-09-19' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-28' }
      ],
      'sub-cn': [
        { assessment: 'Unit Test 1', marks: 22, maxMarks: 25, weight: 15, date: '2025-08-26' },
        { assessment: 'Internal Exam 1', marks: 45, maxMarks: 50, weight: 35, date: '2025-09-21' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-30' }
      ],
      'sub-toc': [
        { assessment: 'Unit Test 1', marks: 23, maxMarks: 25, weight: 15, date: '2025-08-28' },
        { assessment: 'Internal Exam 1', marks: 47, maxMarks: 50, weight: 35, date: '2025-09-23' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-10-02' }
      ]
    },
    submissions: {
      assigned: 6,
      submitted: 6,
      onTime: 6,
      late: 0,
      missed: 0
    },
    knownWeakTopics: ['CN: TCP Congestion Control window states'],
    strengths: ['DSA: Dynamic Programming', 'OS: Virtual Memory', 'DBMS: Indexing & B-Trees'],
    studyStreak: 19,
    studyHoursLogged: 34
  },
  {
    id: 'stu-3',
    rollNo: '23CS103',
    name: 'Aman Verma',
    email: 'aman.23cs103@college.edu',
    phone: '+91 98765 43230',
    parentContact: '+91 98765 43231 (Mr. S. Verma)',
    classId: 'class-cse-3a',
    targetCGPA: 7.0,
    currentCGPA: 5.9,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    attendance: {
      totalConducted: 42,
      totalAttended: 25,
      overallPercentage: 59.5, // Critical override < 65%
      bySubject: {
        'sub-dsa': { conducted: 10, attended: 6, percentage: 60.0 },
        'sub-os': { conducted: 9, attended: 4, percentage: 44.4 },
        'sub-dbms': { conducted: 8, attended: 6, percentage: 75.0 },
        'sub-cn': { conducted: 8, attended: 5, percentage: 62.5 },
        'sub-toc': { conducted: 7, attended: 4, percentage: 57.1 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 13, maxMarks: 25, weight: 15, date: '2025-08-20' },
        { assessment: 'Internal Exam 1', marks: 21, maxMarks: 50, weight: 35, date: '2025-09-15' },
        { assessment: 'Assignment 1', marks: 6, maxMarks: 10, weight: 10, date: '2025-09-25' }
      ],
      'sub-os': [
        { assessment: 'Unit Test 1', marks: 11, maxMarks: 25, weight: 15, date: '2025-08-22' },
        { assessment: 'Internal Exam 1', marks: 18, maxMarks: 50, weight: 35, date: '2025-09-17' }, // Fail < 40%
        { assessment: 'Assignment 1', marks: 0, maxMarks: 10, weight: 10, date: '2025-09-26' }
      ],
      'sub-dbms': [
        { assessment: 'Unit Test 1', marks: 17, maxMarks: 25, weight: 15, date: '2025-08-24' },
        { assessment: 'Internal Exam 1', marks: 28, maxMarks: 50, weight: 35, date: '2025-09-19' },
        { assessment: 'Assignment 1', marks: 7, maxMarks: 10, weight: 10, date: '2025-09-28' }
      ],
      'sub-cn': [
        { assessment: 'Unit Test 1', marks: 12, maxMarks: 25, weight: 15, date: '2025-08-26' },
        { assessment: 'Internal Exam 1', marks: 22, maxMarks: 50, weight: 35, date: '2025-09-21' },
        { assessment: 'Assignment 1', marks: 5, maxMarks: 10, weight: 10, date: '2025-09-30' }
      ],
      'sub-toc': [
        { assessment: 'Unit Test 1', marks: 10, maxMarks: 25, weight: 15, date: '2025-08-28' },
        { assessment: 'Internal Exam 1', marks: 16, maxMarks: 50, weight: 35, date: '2025-09-23' }, // Fail < 40%
        { assessment: 'Assignment 1', marks: 0, maxMarks: 10, weight: 10, date: '2025-10-02' }
      ]
    },
    submissions: {
      assigned: 6,
      submitted: 2,
      onTime: 1,
      late: 1,
      missed: 4
    },
    knownWeakTopics: ['OS: Scheduling Algorithms', 'TOC: DFA/NFA equivalence', 'DSA: Recursion & Backtracking'],
    strengths: ['DBMS: ER Modeling basics'],
    studyStreak: 1,
    studyHoursLogged: 6
  },
  {
    id: 'stu-4',
    rollNo: '23CS104',
    name: 'Sneha Gupta',
    email: 'sneha.23cs104@college.edu',
    phone: '+91 98765 43240',
    parentContact: '+91 98765 43241 (Dr. Anoop Gupta)',
    classId: 'class-cse-3a',
    targetCGPA: 8.0,
    currentCGPA: 7.4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    attendance: {
      totalConducted: 42,
      totalAttended: 32,
      overallPercentage: 76.2,
      bySubject: {
        'sub-dsa': { conducted: 10, attended: 8, percentage: 80.0 },
        'sub-os': { conducted: 9, attended: 7, percentage: 77.8 },
        'sub-dbms': { conducted: 8, attended: 6, percentage: 75.0 },
        'sub-cn': { conducted: 8, attended: 6, percentage: 75.0 },
        'sub-toc': { conducted: 7, attended: 5, percentage: 71.4 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 22, maxMarks: 25, weight: 15, date: '2025-08-20' },
        { assessment: 'Internal Exam 1', marks: 32, maxMarks: 50, weight: 35, date: '2025-09-15' }, // sharp drop
        { assessment: 'Assignment 1', marks: 8, maxMarks: 10, weight: 10, date: '2025-09-25' }
      ],
      'sub-os': [
        { assessment: 'Unit Test 1', marks: 21, maxMarks: 25, weight: 15, date: '2025-08-22' },
        { assessment: 'Internal Exam 1', marks: 33, maxMarks: 50, weight: 35, date: '2025-09-17' },
        { assessment: 'Assignment 1', marks: 8, maxMarks: 10, weight: 10, date: '2025-09-26' }
      ],
      'sub-dbms': [
        { assessment: 'Unit Test 1', marks: 20, maxMarks: 25, weight: 15, date: '2025-08-24' },
        { assessment: 'Internal Exam 1', marks: 37, maxMarks: 50, weight: 35, date: '2025-09-19' },
        { assessment: 'Assignment 1', marks: 9, maxMarks: 10, weight: 10, date: '2025-09-28' }
      ],
      'sub-cn': [
        { assessment: 'Unit Test 1', marks: 20, maxMarks: 25, weight: 15, date: '2025-08-26' },
        { assessment: 'Internal Exam 1', marks: 30, maxMarks: 50, weight: 35, date: '2025-09-21' },
        { assessment: 'Assignment 1', marks: 7, maxMarks: 10, weight: 10, date: '2025-09-30' }
      ],
      'sub-toc': [
        { assessment: 'Unit Test 1', marks: 19, maxMarks: 25, weight: 15, date: '2025-08-28' },
        { assessment: 'Internal Exam 1', marks: 29, maxMarks: 50, weight: 35, date: '2025-09-23' },
        { assessment: 'Assignment 1', marks: 8, maxMarks: 10, weight: 10, date: '2025-10-02' }
      ]
    },
    submissions: {
      assigned: 6,
      submitted: 5,
      onTime: 4,
      late: 1,
      missed: 1
    },
    knownWeakTopics: ['DSA: Graph Algorithms Dijkstra', 'TOC: Context Free Grammars'],
    strengths: ['DBMS: Relational Algebra', 'OS: Process States'],
    studyStreak: 3,
    studyHoursLogged: 15
  },
  {
    id: 'stu-5',
    rollNo: '23CS105',
    name: 'Rohan Das',
    email: 'rohan.23cs105@college.edu',
    phone: '+91 98765 43250',
    parentContact: '+91 98765 43251 (Mr. T. Das)',
    classId: 'class-cse-3a',
    targetCGPA: 7.5,
    currentCGPA: 6.8,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    // Insufficient data test case
    attendance: {
      totalConducted: 12,
      totalAttended: 10,
      overallPercentage: 83.3,
      bySubject: {
        'sub-dsa': { conducted: 3, attended: 3, percentage: 100.0 },
        'sub-os': { conducted: 3, attended: 2, percentage: 66.7 },
        'sub-dbms': { conducted: 2, attended: 2, percentage: 100.0 },
        'sub-cn': { conducted: 2, attended: 2, percentage: 100.0 },
        'sub-toc': { conducted: 2, attended: 1, percentage: 50.0 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 18, maxMarks: 25, weight: 15, date: '2025-08-20' }
      ],
      'sub-os': [],
      'sub-dbms': [],
      'sub-cn': [],
      'sub-toc': []
    },
    submissions: {
      assigned: 2,
      submitted: 1,
      onTime: 1,
      late: 0,
      missed: 1
    },
    knownWeakTopics: ['OS: Fundamentals'],
    strengths: ['DSA: Arrays'],
    studyStreak: 2,
    studyHoursLogged: 7
  },
  {
    id: 'stu-6',
    rollNo: '23CS106',
    name: 'Kavita Iyer',
    email: 'kavita.23cs106@college.edu',
    phone: '+91 98765 43260',
    parentContact: '+91 98765 43261 (Mrs. S. Iyer)',
    classId: 'class-cse-3a',
    targetCGPA: 9.0,
    currentCGPA: 8.6,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    attendance: {
      totalConducted: 42,
      totalAttended: 38,
      overallPercentage: 90.5,
      bySubject: {
        'sub-dsa': { conducted: 10, attended: 9, percentage: 90.0 },
        'sub-os': { conducted: 9, attended: 8, percentage: 88.9 },
        'sub-dbms': { conducted: 8, attended: 8, percentage: 100.0 },
        'sub-cn': { conducted: 8, attended: 7, percentage: 87.5 },
        'sub-toc': { conducted: 7, attended: 6, percentage: 85.7 }
      }
    },
    academicMarks: {
      'sub-dsa': [
        { assessment: 'Unit Test 1', marks: 23, maxMarks: 25, weight: 15, date: '2025-08-20' },
        { assessment: 'Internal Exam 1', marks: 45, maxMarks: 50, weight: 35, date: '2025-09-15' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-25' }
      ],
      'sub-os': [
        { assessment: 'Unit Test 1', marks: 22, maxMarks: 25, weight: 15, date: '2025-08-22' },
        { assessment: 'Internal Exam 1', marks: 44, maxMarks: 50, weight: 35, date: '2025-09-17' },
        { assessment: 'Assignment 1', marks: 9, maxMarks: 10, weight: 10, date: '2025-09-26' }
      ],
      'sub-dbms': [
        { assessment: 'Unit Test 1', marks: 24, maxMarks: 25, weight: 15, date: '2025-08-24' },
        { assessment: 'Internal Exam 1', marks: 46, maxMarks: 50, weight: 35, date: '2025-09-19' },
        { assessment: 'Assignment 1', marks: 10, maxMarks: 10, weight: 10, date: '2025-09-28' }
      ],
      'sub-cn': [
        { assessment: 'Unit Test 1', marks: 21, maxMarks: 25, weight: 15, date: '2025-08-26' },
        { assessment: 'Internal Exam 1', marks: 42, maxMarks: 50, weight: 35, date: '2025-09-21' },
        { assessment: 'Assignment 1', marks: 9, maxMarks: 10, weight: 10, date: '2025-09-30' }
      ],
      'sub-toc': [
        { assessment: 'Unit Test 1', marks: 22, maxMarks: 25, weight: 15, date: '2025-08-28' },
        { assessment: 'Internal Exam 1', marks: 43, maxMarks: 50, weight: 35, date: '2025-09-23' },
        { assessment: 'Assignment 1', marks: 9, maxMarks: 10, weight: 10, date: '2025-10-02' }
      ]
    },
    submissions: {
      assigned: 6,
      submitted: 6,
      onTime: 6,
      late: 0,
      missed: 0
    },
    knownWeakTopics: ['TOC: Turing Machine transitions'],
    strengths: ['DSA: AVL Trees & Heaps', 'DBMS: Transaction Concurrency'],
    studyStreak: 12,
    studyHoursLogged: 29
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'asmt-1',
    title: 'Operating Systems: Process Synchronization & Deadlocks',
    subjectId: 'sub-os',
    facultyId: 'fac-2',
    durationMinutes: 15,
    deadline: '2026-10-25T23:59:00',
    status: 'published', // draft, published, scheduled, closed
    passingScorePercent: 60,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What is the primary condition that is broken when using Banker\'s algorithm?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Circular Wait',
          'Safe State Violation Prevention'
        ],
        correctOptionIndex: 3,
        topicTag: 'Deadlock Avoidance',
        explanation: 'Banker\'s algorithm ensures that the system never enters an unsafe state, thus preventing deadlocks without arbitrarily preempting resources.',
        difficulty: 'medium'
      },
      {
        id: 'q2',
        type: 'mcq',
        text: 'A counting semaphore S is initialized to 7. Then 20 P (wait) operations and 15 V (signal) operations are executed on S. What is the current value of S?',
        options: ['2', '0', '12', '-2'],
        correctOptionIndex: 0,
        topicTag: 'Semaphores & Mutex',
        explanation: 'Initial = 7. 20 wait operations decrement by 20 -> 7 - 20 = -13. 15 signal operations increment by 15 -> -13 + 15 = 2.',
        difficulty: 'hard'
      },
      {
        id: 'q3',
        type: 'numeric',
        text: 'If there are 4 processes and each process needs 3 units of resource R, what is the minimum number of units of R needed to guarantee no deadlock?',
        correctNumeric: 9,
        tolerance: 0,
        topicTag: 'Deadlock Conditions',
        explanation: 'Minimum resources to avoid deadlock = N * (M - 1) + 1 = 4 * (3 - 1) + 1 = 4 * 2 + 1 = 9.',
        difficulty: 'medium'
      },
      {
        id: 'q4',
        type: 'mcq',
        text: 'Which of the following is NOT one of Coffman\'s four necessary conditions for deadlock?',
        options: [
          'Mutual Exclusion',
          'Preemption Allowed',
          'Hold and Wait',
          'Circular Wait'
        ],
        correctOptionIndex: 1,
        topicTag: 'Deadlock Conditions',
        explanation: 'The condition is NO PREEMPTION. If preemption is allowed, deadlocks cannot persist.',
        difficulty: 'easy'
      },
      {
        id: 'q5',
        type: 'mcq',
        text: 'In the Readers-Writers problem, what semaphore or lock prevents starvation of writers?',
        options: [
          'Fair Queue Mutex / Turnstile',
          'Binary Semaphore on reader count',
          'Spinlock without yield',
          'Peterson algorithm for writers'
        ],
        correctOptionIndex: 0,
        topicTag: 'Process Synchronization',
        explanation: 'A turnstile semaphore forces incoming readers to queue behind any waiting writer, preventing writer starvation.',
        difficulty: 'hard'
      }
    ],
    attempts: [
      {
        studentId: 'stu-1',
        studentName: 'Rahul Sharma',
        score: 60,
        totalPoints: 100,
        completedAt: '2026-10-08T16:20:00',
        timeTakenSeconds: 712,
        skippedCount: 0,
        answers: {
          q1: 2, // wrong (selected Circular Wait instead of Safe State)
          q2: 0, // correct (2)
          q3: '9', // correct (9)
          q4: 1, // correct
          q5: 1 // wrong (selected Binary semaphore)
        },
        topicBreakdown: {
          'Deadlock Avoidance': { correct: 0, total: 1, percentage: 0 },
          'Semaphores & Mutex': { correct: 1, total: 1, percentage: 100 },
          'Deadlock Conditions': { correct: 2, total: 2, percentage: 100 },
          'Process Synchronization': { correct: 0, total: 1, percentage: 0 }
        }
      },
      {
        studentId: 'stu-2',
        studentName: 'Priya Patel',
        score: 100,
        totalPoints: 100,
        completedAt: '2026-10-07T11:45:00',
        timeTakenSeconds: 410,
        skippedCount: 0,
        answers: {
          q1: 3, q2: 0, q3: '9', q4: 1, q5: 0
        },
        topicBreakdown: {
          'Deadlock Avoidance': { correct: 1, total: 1, percentage: 100 },
          'Semaphores & Mutex': { correct: 1, total: 1, percentage: 100 },
          'Deadlock Conditions': { correct: 2, total: 2, percentage: 100 },
          'Process Synchronization': { correct: 1, total: 1, percentage: 100 }
        }
      }
    ]
  },
  {
    id: 'asmt-2',
    title: 'Data Structures: Binary Trees & Graph Traversal',
    subjectId: 'sub-dsa',
    facultyId: 'fac-1',
    durationMinutes: 20,
    deadline: '2026-10-28T18:00:00',
    status: 'published',
    passingScorePercent: 65,
    questions: [
      {
        id: 'dsa-q1',
        type: 'mcq',
        text: 'What is the maximum number of nodes in a binary tree of depth K (where root is at depth 1)?',
        options: ['2^K', '2^K - 1', '2^(K-1)', '2^(K+1) - 1'],
        correctOptionIndex: 1,
        topicTag: 'Tree Properties',
        explanation: 'The maximum nodes formula is 2^0 + 2^1 + ... + 2^(K-1) = 2^K - 1.',
        difficulty: 'easy'
      },
      {
        id: 'dsa-q2',
        type: 'mcq',
        text: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure?',
        options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Topological Sort with stack', 'Dijkstra with priority queue'],
        correctOptionIndex: 1,
        topicTag: 'Graph Traversal',
        explanation: 'BFS systematically explores vertices level-by-level using a queue.',
        difficulty: 'easy'
      },
      {
        id: 'dsa-q3',
        type: 'numeric',
        text: 'An AVL tree has height 3. What is the MINIMUM number of nodes it can have? (Height of empty tree is 0, single node is 1)',
        correctNumeric: 7,
        tolerance: 0,
        topicTag: 'AVL Trees',
        explanation: 'N(h) = N(h-1) + N(h-2) + 1. N(1)=1, N(2)=2, N(3)=4, N(4)=7.',
        difficulty: 'hard'
      }
    ],
    attempts: []
  }
];

export const INITIAL_RISK_WEIGHTS = {
  attendanceWeight: 0.35,
  marksWeight: 0.35,
  trendWeight: 0.15,
  submissionWeight: 0.10,
  topicWeaknessWeight: 0.05,
  attendanceHardThreshold: 65.0, // below 65% forces High Risk
  subjectAttendanceHardThreshold: 55.0,
  passingMarksCutoff: 40.0
};

export const INITIAL_INTERVENTIONS = [
  {
    id: 'int-1',
    studentId: 'stu-3',
    studentName: 'Aman Verma',
    mentorId: 'fac-2',
    mentorName: 'Prof. Ananya Roy',
    type: '1-on-1 Academic Counseling',
    date: '2025-09-28',
    notes: 'Discussed severe absenteeism in Operating Systems (44%) and missed lab submissions. Aman committed to daily morning attendance and peer study sessions with Rahul Sharma.',
    actionPlan: 'Submit pending OS assignments by Oct 12; attend remedial lab on Saturdays.',
    followUpDate: '2025-10-15',
    status: 'In Progress',
    previousRisk: 'HIGH',
    currentRisk: 'HIGH'
  },
  {
    id: 'int-2',
    studentId: 'stu-1',
    studentName: 'Rahul Sharma',
    mentorId: 'fac-1',
    mentorName: 'Dr. Ramesh Sharma',
    type: 'Remedial Session & Doubt Clearing',
    date: '2025-09-30',
    notes: 'Reviewed Operating Systems concurrency and semaphore calculation pitfalls. Provided chapter 4 reference notes and solved 5 practice problems.',
    actionPlan: 'Retake module practice quiz on AcademiPulse portal and log at least 3 hours study timetable.',
    followUpDate: '2025-10-14',
    status: 'Completed',
    previousRisk: 'HIGH',
    currentRisk: 'MEDIUM'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-1',
    timestamp: '2026-10-09T09:15:20',
    actor: 'Dr. Ramesh Sharma (Faculty)',
    action: 'Manual Marks Entry',
    details: 'Updated Internal Exam 1 marks for 3rd Year CSE-A (Data Structures)',
    ip: '192.168.1.42'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-09T10:02:44',
    actor: 'Dr. Vikramaditya Reddy (HOD)',
    action: 'Risk Recalculation',
    details: 'Recalculated full department risk scores with updated 65% attendance rule threshold',
    ip: '192.168.1.10'
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-09T11:20:10',
    actor: 'Prof. Ananya Roy (Faculty)',
    action: 'Assessment Published',
    details: 'Published assessment "Operating Systems: Process Synchronization & Deadlocks" with 5 questions',
    ip: '192.168.1.55'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipientId: 'stu-1',
    type: 'attendance_warning',
    title: '⚠️ Subject Attendance Alert: Operating Systems',
    message: 'Your attendance in Operating Systems is currently 55.5%, below the mandatory 75% cutoff. You need to attend 7 consecutive classes to recover.',
    timestamp: '2026-10-09T08:30:00',
    read: false,
    severity: 'high',
    channels: ['in_app', 'email', 'sms']
  },
  {
    id: 'notif-2',
    recipientId: 'stu-1',
    type: 'assessment_due',
    title: '📝 New Assessment Published',
    message: 'Prof. Ananya Roy published "Operating Systems: Process Synchronization & Deadlocks". Duration: 15 mins. Due Oct 25.',
    timestamp: '2026-10-09T10:00:00',
    read: false,
    severity: 'medium',
    channels: ['in_app']
  },
  {
    id: 'notif-3',
    recipientId: 'fac-1',
    type: 'risk_escalation',
    title: '🚨 High Academic Risk Alert: Aman Verma (23CS103)',
    message: 'Aman Verma has breached the critical attendance threshold (59.5%) and failed 2 internal subjects. Urgent intervention recommended.',
    timestamp: '2026-10-09T11:05:00',
    read: false,
    severity: 'high',
    channels: ['in_app', 'email']
  }
];

// Rich PDF/Knowledge Base notes for the RAG Subject Chatbot with exact page and section citations
export const SUBJECT_KNOWLEDGE_BASE = {
  'sub-os': {
    title: 'Operating Systems Knowledge Base (Silberschatz, Galvin & Gagne, 10th Ed)',
    modules: [
      {
        unit: 'Unit 1: Process Management & CPU Scheduling',
        sourceBook: 'Operating System Concepts, 10th Edition (Silberschatz et al.)',
        pages: 'p. 104 - 158',
        content: `A process is a program in execution. Process control block (PCB) stores PID, state, program counter, CPU registers, and scheduling information.
CPU Scheduling algorithms:
1. First-Come, First-Served (FCFS): Simple FIFO, suffers from the convoy effect where short processes wait behind long CPU bursts.
2. Shortest-Job-First (SJF): Provably optimal average turnaround time, but requires predicting burst times via exponential averaging tau_(n+1) = alpha * t_n + (1 - alpha) * tau_n.
3. Round Robin (RR): Preemptive scheduling with a time quantum q. If q is too large, it degenerates to FCFS. If q is too small, context switch overhead dominates.
4. Priority Scheduling: Each process has a priority. Vulnerable to indefinite blocking (starvation). Solution: Aging, where process priority increases gradually over waiting time.`
      },
      {
        unit: 'Unit 2: Process Synchronization & Semaphores',
        sourceBook: 'Operating System Concepts, 10th Edition (Silberschatz et al.)',
        pages: 'p. 257 - 310',
        content: `The Critical Section Problem requires three conditions to be satisfied:
1. Mutual Exclusion: If process P is executing in its critical section, no other processes can execute in their critical sections.
2. Progress: If no process is executing in its critical section and some processes wish to enter, only those processes not in their remainder sections can participate in deciding who enters next.
3. Bounded Waiting: A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request.

Semaphores:
A semaphore S is an integer variable accessed only through two standard atomic operations: wait() (P) and signal() (V).
- wait(S): while (S <= 0); S--; (decrements S; blocks if S <= 0)
- signal(S): S++; (increments S; unblocks waiting process)
Counting Semaphores can range over an unrestricted domain, useful for controlling access to a resource pool with N instances.
Binary Semaphores (Mutexes) can range only between 0 and 1.
Classic Synchronization Problems: Bounded-Buffer (Producer-Consumer), Readers-Writers Problem, Dining Philosophers Problem.`
      },
      {
        unit: 'Unit 3: Deadlocks & Banker\'s Algorithm',
        sourceBook: 'Operating System Concepts, 10th Edition (Silberschatz et al.)',
        pages: 'p. 317 - 348',
        content: `Four Coffman conditions must hold simultaneously for a deadlock:
1. Mutual Exclusion: At least one resource is held in a nonshareable mode.
2. Hold and Wait: A process holds at least one resource and is waiting to acquire additional resources.
3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the holding process.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.

Banker's Algorithm for Deadlock Avoidance:
Maintains vectors Available, Max, Allocation, and Need = Max - Allocation.
Safety Algorithm:
1. Let Work = Available and Finish[i] = false for all i.
2. Find an index i such that Finish[i] == false and Need[i] <= Work. If no such i exists, go to step 4.
3. Work = Work + Allocation[i]; Finish[i] = true; go to step 2.
4. If Finish[i] == true for all i, the system is in a SAFE state; otherwise UNSAFE.`
      },
      {
        unit: 'Unit 4: Memory Management & Virtual Memory',
        sourceBook: 'Operating System Concepts, 10th Edition (Silberschatz et al.)',
        pages: 'p. 389 - 462',
        content: `Paging is a memory-management scheme that permits the physical address space of a process to be noncontiguous. Logical address is divided into page number (p) and page offset (d).
Page replacement algorithms:
1. FIFO: Replaces the oldest page. Suffers from Belady\'s Anomaly (more frames can lead to MORE page faults!).
2. Optimal (OPT): Replaces the page that will not be used for the longest period of time. Minimum page-fault rate; used as a theoretical benchmark.
3. LRU (Least Recently Used): Replaces the page that has not been used for the longest period of time. Approximated using reference bits and clock algorithms.
Thrashing occurs when a process spends more time paging than executing, caused by insufficient allocation of frames below its working-set size.`
      }
    ]
  },
  'sub-dsa': {
    title: 'Data Structures & Algorithms Knowledge Base (Cormen, Leiserson, Rivest & Stein - CLRS)',
    modules: [
      {
        unit: 'Unit 1: Asymptotic Analysis & Recurrences',
        sourceBook: 'Introduction to Algorithms, 3rd Edition (CLRS)',
        pages: 'p. 43 - 105',
        content: `Big-O represents asymptotic upper bound, Big-Omega represents lower bound, and Big-Theta represents tight bound.
Master Theorem for recurrences of form T(n) = a * T(n/b) + f(n):
Compare f(n) with n^(log_b(a)):
Case 1: If f(n) = O(n^(log_b(a) - epsilon)), then T(n) = Theta(n^(log_b(a))).
Case 2: If f(n) = Theta(n^(log_b(a)) * log^k(n)), then T(n) = Theta(n^(log_b(a)) * log^(k+1)(n)).
Case 3: If f(n) = Omega(n^(log_b(a) + epsilon)) and regularity condition holds, then T(n) = Theta(f(n)).`
      },
      {
        unit: 'Unit 2: Trees and Balanced Search Trees',
        sourceBook: 'Introduction to Algorithms, 3rd Edition (CLRS)',
        pages: 'p. 286 - 338',
        content: `Binary Search Tree (BST) property: For node x, keys in left subtree <= x.key <= keys in right subtree.
Inorder traversal visits keys in ascending sorted order.
AVL Tree: Height-balanced BST where balance factor = height(left) - height(right) is in {-1, 0, 1}.
Rotations: Left-Left (Single Right Rotation), Right-Right (Single Left Rotation), Left-Right (Left rotation on child then Right rotation on root), Right-Left (Right rotation on child then Left rotation on root).
Red-Black Tree: Guarantees search in O(log n) time by maintaining 5 color properties (root is black, no two consecutive red nodes, black-height is invariant).`
      },
      {
        unit: 'Unit 3: Graph Algorithms',
        sourceBook: 'Introduction to Algorithms, 3rd Edition (CLRS)',
        pages: 'p. 589 - 683',
        content: `Breadth-First Search (BFS): Computes shortest path on unweighted graphs in O(V + E) using a FIFO queue.
Depth-First Search (DFS): Discovers graph components and timestamps (discovery and finish times) using recursion/stack in O(V + E).
Dijkstra's Algorithm: Single-source shortest path for non-negative edge weights using Min-Priority Queue in O((V + E) log V).
Minimum Spanning Trees: Kruskal\'s Algorithm (Greedy, uses Disjoint-Set Union in O(E log V)) and Prim\'s Algorithm (Greedy, starts from root in O(E + V log V)).`
      }
    ]
  },
  'sub-dbms': {
    title: 'Database Systems Knowledge Base (Silberschatz, Korth & Sudarshan, 7th Ed)',
    modules: [
      {
        unit: 'Unit 1: Relational Model & SQL',
        sourceBook: 'Database System Concepts, 7th Edition (Korth et al.)',
        pages: 'p. 55 - 132',
        content: `Relational algebra fundamental operators: Selection (sigma), Projection (pi), Union (cup), Set Difference (-), Cartesian Product (times), Rename (rho).
SQL queries use SELECT-FROM-WHERE with GROUP BY and HAVING clauses.
Primary keys uniquely identify a tuple. Foreign keys enforce referential integrity between parent and child relations.`
      },
      {
        unit: 'Unit 2: Normalization & Functional Dependencies',
        sourceBook: 'Database System Concepts, 7th Edition (Korth et al.)',
        pages: 'p. 312 - 365',
        content: `Functional Dependency X -> Y holds if whenever two tuples agree on X, they must agree on Y.
Normal Forms:
1NF: All attribute values are atomic.
2NF: In 1NF and every non-prime attribute is fully functionally dependent on any candidate key (no partial dependency).
3NF: In 2NF and for every non-trivial FD X -> Y, either X is a superkey or Y is a prime attribute (no transitive dependency).
BCNF: For every non-trivial FD X -> Y, X MUST be a superkey.`
      },
      {
        unit: 'Unit 3: Transactions & ACID Properties',
        sourceBook: 'Database System Concepts, 7th Edition (Korth et al.)',
        pages: 'p. 627 - 710',
        content: `ACID Properties:
- Atomicity: All or nothing execution (enforced by Write-Ahead Logging WAL / undo log).
- Consistency: Preserves database invariants.
- Isolation: Concurrent transactions execute without interfering (enforced by 2-Phase Locking 2PL or MVCC).
- Durability: Committed updates persist even after system crashes (redo log).
Two-Phase Locking (2PL): Growing phase (acquire locks, release none) and Shrinking phase (release locks, acquire none). Strict 2PL prevents cascading rollbacks.`
      }
    ]
  },
  'sub-cn': {
    title: 'Computer Networks Knowledge Base (Tanenbaum & Wetherall, 5th Ed)',
    modules: [
      {
        unit: 'Unit 1: OSI & TCP/IP Layering',
        sourceBook: 'Computer Networks, 5th Edition (Tanenbaum)',
        pages: 'p. 32 - 75',
        content: `OSI 7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.
TCP/IP 4-5 Layers: Physical/Link, Internet (IP), Transport (TCP/UDP), Application (HTTP, DNS).`
      },
      {
        unit: 'Unit 2: Transport Layer & TCP Congestion Control',
        sourceBook: 'Computer Networks, 5th Edition (Tanenbaum)',
        pages: 'p. 495 - 560',
        content: `TCP is connection-oriented, reliable, byte-stream with 3-way handshake (SYN, SYN-ACK, ACK).
Congestion Control phases:
1. Slow Start: cwnd starts at 1 MSS, doubles every RTT (exponential growth) until ssthresh.
2. Congestion Avoidance: cwnd grows by 1 MSS per RTT (linear additive increase).
3. Fast Retransmit & Fast Recovery: On 3 duplicate ACKs, ssthresh = cwnd / 2, cwnd = ssthresh + 3 MSS without dropping to 1 MSS.`
      }
    ]
  },
  'sub-toc': {
    title: 'Theory of Computation Knowledge Base (Michael Sipser, 3rd Ed)',
    modules: [
      {
        unit: 'Unit 1: Regular Languages & Finite Automata',
        sourceBook: 'Introduction to the Theory of Computation (Sipser)',
        pages: 'p. 31 - 92',
        content: `Deterministic Finite Automaton (DFA) is a 5-tuple (Q, Sigma, delta, q0, F).
Non-deterministic Finite Automaton (NFA) allows epsilon transitions and multiple target states.
Equivalence: Every NFA can be converted to an equivalent DFA via powerset subset construction.
Pumping Lemma for Regular Languages: If L is regular, there exists pumping length p such that any string s in L of length >= p can be split into s = xyz where |xy| <= p, |y| > 0, and xy^i z is in L for all i >= 0.`
      }
    ]
  }
};
