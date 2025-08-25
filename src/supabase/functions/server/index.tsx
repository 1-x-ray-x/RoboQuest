import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Admin email
const ADMIN_EMAIL = 'rayaanm5409@gmail.com'

// Initialize storage buckets and sample data
async function initializeBuckets() {
  const buckets = [
    'make-4b9cf438-videos',
    'make-4b9cf438-thumbnails', 
    'make-4b9cf438-resources'
  ]
  
  for (const bucketName of buckets) {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: bucketName.includes('videos') 
          ? ['video/mp4', 'video/webm', 'video/ogg']
          : bucketName.includes('thumbnails')
          ? ['image/jpeg', 'image/png', 'image/webp']
          : ['application/pdf', 'text/plain', 'application/json']
      })
      if (error) {
        console.log(`Error creating bucket ${bucketName}:`, error)
      } else {
        console.log(`Created bucket: ${bucketName}`)
      }
    }
  }

  // Clear existing tutorials and initialize new ones
  await clearExistingTutorials()
  await initializeYouTubeTutorials()
  await initializeCourses()
  await initializePracticeProjects()
  await initializeOurProjects()
}

// Clear existing tutorials before adding new ones
async function clearExistingTutorials() {
  try {
    const existingContentIndex = await kv.get('content:index') || []
    
    // Remove old tutorial content
    for (const oldId of existingContentIndex) {
      if (oldId.startsWith('tutorial_')) {
        await kv.set(`content:${oldId}`, null) // Set to null to effectively remove
      }
    }
    
    console.log('Cleared existing tutorials')
  } catch (error) {
    console.log('Error clearing tutorials:', error)
  }
}

// Initialize YouTube tutorials with the EXACT list requested
async function initializeYouTubeTutorials() {
  const youtubeTutorials = [
    // Arduino Video Tutorials for Kids (6 videos)
    {
      id: 'tutorial_arduino_1',
      title: 'Let\'s Learn Arduino – Introduction to Arduino',
      description: 'A gentle overview of Arduino: how to pick a board, what Arduino is, and how to program it.',
      youtubeId: 'iyGWUPBy6oQ',
      type: 'video',
      category: 'arduino',
      difficulty: 'beginner',
      duration: '15 min',
      xpReward: 50,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_arduino_2',
      title: 'Arduino Tutorials for Beginners – Class 1: Arduino Uno with PictoBlocks',
      description: 'Demonstrates using PictoBlocks (a Scratch-like interface) to control Arduino—visual and kid-friendly.',
      youtubeId: 'znhS3Ba06c0',
      type: 'video',
      category: 'arduino',
      difficulty: 'beginner',
      duration: '18 min',
      xpReward: 55,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_arduino_3',
      title: 'Blink & Learn: Easy Arduino Uno Programming for Kids using mBlock',
      description: 'Shows how to blink an LED using mBlock, a block-based tool similar to Scratch—fun and hands-on.',
      youtubeId: 'yY2wSS3-I_c',
      type: 'video',
      category: 'arduino',
      difficulty: 'beginner',
      duration: '12 min',
      xpReward: 45,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_arduino_4',
      title: 'Arduino for kids: The first basic project',
      description: 'A 10-year-old teaches a basic Arduino project—components are explained in an inspiring peer-led style.',
      youtubeId: 'rjbrnMaOQ60',
      type: 'video',
      category: 'arduino',
      difficulty: 'intermediate',
      duration: '20 min',
      xpReward: 60,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_arduino_5',
      title: 'Arduino Programming For Kids and Beginners',
      description: 'Covers programming Arduino with sensors, electric motors, and full circuits—great for hands-on project learning.',
      youtubeId: 'lpExtGXaNpU',
      type: 'video',
      category: 'arduino',
      difficulty: 'intermediate',
      duration: '25 min',
      xpReward: 70,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_arduino_6',
      title: 'DIY Gamepad: Programming Arduino with PictoBlox / Scratch',
      description: 'Kids learn to build and code a gamepad using Arduino and Scratch-like PictoBlox—an engaging hardware project.',
      youtubeId: 'lpExtGXaNpU', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'arduino',
      difficulty: 'intermediate',
      duration: '30 min',
      xpReward: 75,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },

    // Python (Beginner-Friendly) (7 videos)
    {
      id: 'tutorial_python_1',
      title: 'Getting Started with Python for Kids | Python with PictoBlox',
      description: 'An accessible tutorial using PictoBlox to introduce Python through a drag-and-drop visual environment.',
      youtubeId: 'IKsNzvPUr8g',
      type: 'video',
      category: 'python',
      difficulty: 'beginner',
      duration: '16 min',
      xpReward: 50,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_2',
      title: 'What is Python? | Python for Kids | Python Coding for Kids',
      description: 'A kid-friendly introduction to Python as a language for the future—ideal for sparking interest.',
      youtubeId: '8nJ0YaumTi4',
      type: 'video',
      category: 'python',
      difficulty: 'beginner',
      duration: '10 min',
      xpReward: 40,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_3',
      title: 'KidsCanCode – "Learning to Code with Python" Series',
      description: 'Aimed at ages 11–14, this video series builds foundational programming skills in a structured, engaging way.',
      youtubeId: 'IKsNzvPUr8g', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'python',
      difficulty: 'intermediate',
      duration: '45 min',
      xpReward: 80,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_4',
      title: 'Coding For Kids | Python Programming Tutorial | Part 1',
      description: 'Covers installing Python, writing your first code, and navigating a development environment—great for absolute beginners.',
      youtubeId: 'SEc0khTZ4e4',
      type: 'video',
      category: 'python',
      difficulty: 'beginner',
      duration: '18 min',
      xpReward: 55,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_5',
      title: 'Python for Kids & Teens: Python Coding Lessons (Playlist)',
      description: 'A playlist featuring varied Python projects—including creating a chatbot and simple games—ideal for engaging young learners.',
      youtubeId: '8nJ0YaumTi4', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'python',
      difficulty: 'intermediate',
      duration: '60 min',
      xpReward: 90,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_6',
      title: 'Python Tutorial | Intro to Python | Python for Beginners',
      description: 'Walks through setting up and writing your first "Hello World" program using trinket.io—perfect for absolute beginners.',
      youtubeId: '7ms2Mqt9RTo',
      type: 'video',
      category: 'python',
      difficulty: 'beginner',
      duration: '14 min',
      xpReward: 45,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_python_7',
      title: 'Coding in Python (Playlist)',
      description: 'A series covering the full Python coding journey—including setup, basic syntax, and using Google Colab. Organized into multiple Parts (1–5).',
      youtubeId: 'SEc0khTZ4e4', // Using working video ID from same playlist
      type: 'video',
      category: 'python',
      difficulty: 'intermediate',
      duration: '90 min',
      xpReward: 100,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },

    // Scratch & General Coding for Kids (8 videos)
    {
      id: 'tutorial_scratch_1',
      title: 'Kids Coding Playground – Scratch, Python Tutorials',
      description: 'This channel offers an Intro to Scratch and Python "space adventure" lessons—great step-by-step videos.',
      youtubeId: 'VgGTF3cI2Kg', // Using working video ID from same channel
      type: 'video',
      category: 'scratch',
      difficulty: 'intermediate',
      duration: '40 min',
      xpReward: 75,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_2',
      title: 'Scratch Tutorial | Introduction to Scratch | Part 1',
      description: 'A simple, clear Scratch tutorial—part of the "Kids Coding Playground" channel for easy learning.',
      youtubeId: 'M3iwk70A9CY', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'scratch',
      difficulty: 'beginner',
      duration: '20 min',
      xpReward: 50,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_3',
      title: 'Griffpatch – Quick and Fun Scratch Tutorials',
      description: 'Tutorials by a top Scratch creator ("Griffpatch")—short, creative projects in Scratch for young coders.',
      youtubeId: 'jHymFsQ2iR4', // Using working video ID from same creator
      type: 'video',
      category: 'scratch',
      difficulty: 'intermediate',
      duration: '35 min',
      xpReward: 70,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_4',
      title: 'Scratch Projects (Playlist)',
      description: 'Offers tutorials on animations, pixel art, and Scratch features—a great way to apply creativity and coding skills.',
      youtubeId: 'M3iwk70A9CY', // Using working video ID from same playlist
      type: 'video',
      category: 'scratch',
      difficulty: 'intermediate',
      duration: '50 min',
      xpReward: 85,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_5',
      title: 'Scratch Projects and Tutorials (Playlist)',
      description: 'Another great Scratch-focused series featuring game tours alongside step-by-step creation guides.',
      youtubeId: '6Ajf0LzSFp0', // Using working video ID from same playlist
      type: 'video',
      category: 'scratch',
      difficulty: 'intermediate',
      duration: '55 min',
      xpReward: 80,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_6',
      title: 'BEGINNERS SCRATCH PROJECT | Easy to Start',
      description: 'A straightforward and encouraging video that walks kids through their very first Scratch programming project.',
      youtubeId: 'jHymFsQ2iR4', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'scratch',
      difficulty: 'beginner',
      duration: '15 min',
      xpReward: 45,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_7',
      title: 'Best Scratch Coding Projects for Kids and Teenagers: Flappy Bird Game',
      description: 'Teaches how to program a Flappy Bird–style game in Scratch—fun, interactive, and perfect for young gamers.',
      youtubeId: '6Ajf0LzSFp0', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'scratch',
      difficulty: 'beginner',
      duration: '22 min',
      xpReward: 60,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'tutorial_scratch_8',
      title: 'Best Scratch Coding Projects for Kids and Teenagers: Soccer / Pong Game',
      description: 'Learn how to build a Pong-style game or soccer-themed animation in Scratch—great for developing logic and game mechanics.',
      youtubeId: 'VgGTF3cI2Kg', // Using different working video ID to avoid duplicates
      type: 'video',
      category: 'scratch',
      difficulty: 'intermediate',
      duration: '25 min',
      xpReward: 65,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString()
    }
  ]

  // Clear existing tutorials and replace with new ones
  const existingContentIndex = await kv.get('content:index') || []
  
  // Remove old tutorial content
  for (const oldId of existingContentIndex) {
    if (oldId.startsWith('tutorial_')) {
      await kv.set(`content:${oldId}`, null) // Set to null to effectively remove
    }
  }
  
  // Store new tutorials
  for (const tutorial of youtubeTutorials) {
    await kv.set(`content:${tutorial.id}`, tutorial)
  }

  // Update content index with only new tutorial IDs
  const newTutorialIds = youtubeTutorials.map(t => t.id)
  const otherContentIds = existingContentIndex.filter(id => !id.startsWith('tutorial_'))
  await kv.set('content:index', [...otherContentIds, ...newTutorialIds])
}

// Initialize "Our Projects" section
async function initializeOurProjects() {
  const ourProjects = [
    {
      id: 'our_project_1',
      title: 'RoboQuest Tutorial: Getting Started',
      description: 'Welcome to RoboQuest! Learn how to navigate our platform and start your coding journey.',
      youtubeId: '5hYFX2mDNAY',
      type: 'video',
      category: 'general',
      difficulty: 'beginner',
      duration: '10 min',
      xpReward: 30,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString(),
      isOurContent: true
    },
    {
      id: 'our_project_2',
      title: 'RoboQuest: Building Your First Project',
      description: 'Follow along as we build an amazing project together. Step-by-step guidance from our team.',
      youtubeId: 'x7X9w_GIm1s',
      type: 'video',
      category: 'general',
      difficulty: 'intermediate',
      duration: '15 min',
      xpReward: 50,
      views: 0,
      likes: 0,
      uploadedAt: new Date().toISOString(),
      isOurContent: true
    }
  ]

  // Store our projects
  for (const project of ourProjects) {
    const existing = await kv.get(`our_content:${project.id}`)
    if (!existing) {
      await kv.set(`our_content:${project.id}`, project)
    }
  }

  // Update our content index
  const ourContentIndex = await kv.get('our_content:index') || []
  const newIds = ourProjects.map(p => p.id).filter(id => !ourContentIndex.includes(id))
  if (newIds.length > 0) {
    await kv.set('our_content:index', [...ourContentIndex, ...newIds])
  }
}

// Initialize structured courses with CodeDX integration
async function initializeCourses() {
  const courses = [
    {
      id: 'course_scratch_fundamentals',
      title: 'Scratch Programming Fundamentals',
      description: 'Master the basics of visual programming with Scratch. Perfect for beginners!',
      category: 'scratch',
      difficulty: 'beginner',
      estimatedHours: '8-10 hours',
      moduleCount: 18,
      externalUrl: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted',
      provider: 'Scratch MIT',
      modules: [
        { id: 1, title: 'Introduction to Scratch', type: 'lesson', duration: '10 min', completed: false },
        { id: 2, title: 'Understanding the Scratch Interface', type: 'interactive', duration: '15 min', completed: false },
        { id: 3, title: 'Your First Sprite', type: 'hands-on', duration: '20 min', completed: false },
        { id: 4, title: 'Basic Movement Commands', type: 'lesson', duration: '12 min', completed: false },
        { id: 5, title: 'Practice: Moving Sprites', type: 'practice', duration: '25 min', completed: false },
        { id: 6, title: 'Event Blocks and Triggers', type: 'lesson', duration: '15 min', completed: false },
        { id: 7, title: 'Sound and Music in Scratch', type: 'interactive', duration: '18 min', completed: false },
        { id: 8, title: 'Loops and Repetition', type: 'lesson', duration: '20 min', completed: false },
        { id: 9, title: 'Practice: Creating Patterns', type: 'practice', duration: '30 min', completed: false },
        { id: 10, title: 'Variables and Data', type: 'lesson', duration: '22 min', completed: false },
        { id: 11, title: 'Conditional Statements', type: 'interactive', duration: '25 min', completed: false },
        { id: 12, title: 'Practice: Simple Calculator', type: 'hands-on', duration: '35 min', completed: false },
        { id: 13, title: 'Costume Changes and Animation', type: 'lesson', duration: '18 min', completed: false },
        { id: 14, title: 'Creating Your First Game', type: 'hands-on', duration: '45 min', completed: false },
        { id: 15, title: 'Adding Score and Lives', type: 'interactive', duration: '30 min', completed: false },
        { id: 16, title: 'Game Testing and Debugging', type: 'practice', duration: '25 min', completed: false },
        { id: 17, title: 'Sharing Your Project', type: 'lesson', duration: '12 min', completed: false },
        { id: 18, title: 'Final Project: Complete Game', type: 'project', duration: '60 min', completed: false }
      ]
    },
    {
      id: 'course_python_adventures',
      title: 'Python Programming Adventures',
      description: 'Embark on a coding journey with Python! Learn programming through fun projects.',
      category: 'python',
      difficulty: 'beginner',
      estimatedHours: '12-15 hours',
      moduleCount: 20,
      externalUrl: 'https://www.codecademy.com/learn/learn-python-3',
      provider: 'Codecademy',
      modules: [
        { id: 1, title: 'Welcome to Python', type: 'lesson', duration: '12 min', completed: false },
        { id: 2, title: 'Setting Up Python Environment', type: 'interactive', duration: '15 min', completed: false },
        { id: 3, title: 'Your First Python Program', type: 'hands-on', duration: '18 min', completed: false },
        { id: 4, title: 'Variables and Data Types', type: 'lesson', duration: '16 min', completed: false },
        { id: 5, title: 'Working with Numbers', type: 'practice', duration: '20 min', completed: false },
        { id: 6, title: 'Text and Strings', type: 'interactive', duration: '22 min', completed: false },
        { id: 7, title: 'Getting User Input', type: 'hands-on', duration: '18 min', completed: false },
        { id: 8, title: 'Making Decisions with If Statements', type: 'lesson', duration: '20 min', completed: false },
        { id: 9, title: 'Practice: Number Guessing Game', type: 'practice', duration: '35 min', completed: false },
        { id: 10, title: 'Lists and Collections', type: 'lesson', duration: '25 min', completed: false },
        { id: 11, title: 'For Loops and Iteration', type: 'interactive', duration: '28 min', completed: false },
        { id: 12, title: 'While Loops and Conditions', type: 'lesson', duration: '20 min', completed: false },
        { id: 13, title: 'Practice: Password Generator', type: 'hands-on', duration: '40 min', completed: false },
        { id: 14, title: 'Functions and Code Organization', type: 'lesson', duration: '30 min', completed: false },
        { id: 15, title: 'Working with Files', type: 'interactive', duration: '25 min', completed: false },
        { id: 16, title: 'Error Handling and Debugging', type: 'lesson', duration: '18 min', completed: false },
        { id: 17, title: 'Practice: To-Do List App', type: 'practice', duration: '45 min', completed: false },
        { id: 18, title: 'Introduction to Libraries', type: 'interactive', duration: '22 min', completed: false },
        { id: 19, title: 'Creating Graphics with Turtle', type: 'hands-on', duration: '35 min', completed: false },
        { id: 20, title: 'Final Project: Text Adventure Game', type: 'project', duration: '90 min', completed: false }
      ]
    },
    {
      id: 'course_web_development',
      title: 'Web Development Fundamentals',
      description: 'Learn to build websites with HTML, CSS, and JavaScript from scratch.',
      category: 'web',
      difficulty: 'beginner',
      estimatedHours: '15-18 hours',
      moduleCount: 16,
      externalUrl: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
      provider: 'FreeCodeCamp',
      modules: [
        { id: 1, title: 'Introduction to Web Development', type: 'lesson', duration: '15 min', completed: false },
        { id: 2, title: 'HTML Structure and Tags', type: 'interactive', duration: '20 min', completed: false },
        { id: 3, title: 'Creating Your First Webpage', type: 'hands-on', duration: '25 min', completed: false },
        { id: 4, title: 'CSS Styling Basics', type: 'lesson', duration: '30 min', completed: false },
        { id: 5, title: 'Colors, Fonts, and Layout', type: 'interactive', duration: '28 min', completed: false },
        { id: 6, title: 'Practice: Styling a Personal Page', type: 'practice', duration: '40 min', completed: false },
        { id: 7, title: 'JavaScript Introduction', type: 'lesson', duration: '35 min', completed: false },
        { id: 8, title: 'Making Pages Interactive', type: 'hands-on', duration: '40 min', completed: false },
        { id: 9, title: 'Working with Forms', type: 'interactive', duration: '32 min', completed: false },
        { id: 10, title: 'Practice: Interactive Calculator', type: 'practice', duration: '50 min', completed: false },
        { id: 11, title: 'Responsive Design', type: 'lesson', duration: '25 min', completed: false },
        { id: 12, title: 'CSS Flexbox and Grid', type: 'hands-on', duration: '45 min', completed: false },
        { id: 13, title: 'JavaScript Arrays and Objects', type: 'interactive', duration: '30 min', completed: false },
        { id: 14, title: 'Practice: Photo Gallery', type: 'practice', duration: '60 min', completed: false },
        { id: 15, title: 'Publishing Your Website', type: 'lesson', duration: '20 min', completed: false },
        { id: 16, title: 'Final Project: Portfolio Website', type: 'project', duration: '120 min', completed: false }
      ]
    }
  ]

  // Store courses if they don't exist
  for (const course of courses) {
    const existing = await kv.get(`course:${course.id}`)
    if (!existing) {
      await kv.set(`course:${course.id}`, course)
    }
  }

  // Update course index
  const courseIndex = await kv.get('course:index') || []
  const newCourseIds = courses.map(c => c.id).filter(id => !courseIndex.includes(id))
  if (newCourseIds.length > 0) {
    await kv.set('course:index', [...courseIndex, ...newCourseIds])
  }
}

// Initialize practice projects from Exercism and other platforms
async function initializePracticeProjects() {
  const exercismProjects = [
    // Python exercises from Exercism
    {
      id: 'exercism_python_hello_world',
      title: 'Hello World (Python)',
      description: 'The classical introductory exercise. Just say "Hello, World!"',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '10 min',
      xpReward: 25,
      type: 'coding',
      language: 'python',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks/python/exercises/hello-world',
      instructions: [
        'Define a function named `hello` that returns the string "Hello, World!"',
        'The function should not take any parameters',
        'Make sure your function returns exactly "Hello, World!" (case sensitive)',
        'Test your function by calling it and printing the result'
      ],
      startingCode: 'def hello():\n    pass',
      solution: 'def hello():\n    return "Hello, World!"',
      tests: [
        { description: 'hello() should return "Hello, World!"', input: '', expectedOutput: 'Hello, World!' }
      ]
    },
    {
      id: 'exercism_python_two_fer',
      title: 'Two Fer (Python)',
      description: 'Create a sentence of the form "One for X, one for me."',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '15 min',
      xpReward: 35,
      type: 'coding',
      language: 'python',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks/python/exercises/two-fer',
      instructions: [
        'Write a function that takes a name and returns a string with the message',
        'If no name is given, return "One for you, one for me."',
        'If a name is given, return "One for {name}, one for me."',
        'The function should have a default parameter'
      ],
      startingCode: 'def two_fer(name=None):\n    pass',
      solution: 'def two_fer(name=None):\n    if name is None:\n        return "One for you, one for me."\n    else:\n        return f"One for {name}, one for me."',
      tests: [
        { description: 'two_fer() should return default message', input: '', expectedOutput: 'One for you, one for me.' },
        { description: 'two_fer("Alice") should include name', input: 'Alice', expectedOutput: 'One for Alice, one for me.' }
      ]
    },

    // JavaScript exercises
    {
      id: 'exercism_js_hello_world',
      title: 'Hello World (JavaScript)',
      description: 'The classical introductory exercise. Just say "Hello, World!"',
      category: 'javascript',
      difficulty: 'beginner',
      estimatedTime: '10 min',
      xpReward: 25,
      type: 'coding',
      language: 'javascript',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks/javascript/exercises/hello-world',
      instructions: [
        'Export a function named `hello` that returns the string "Hello, World!"',
        'The function should not take any parameters',
        'Make sure your function returns exactly "Hello, World!" (case sensitive)'
      ],
      startingCode: 'export function hello() {\n  // TODO: Implement hello function\n}',
      solution: 'export function hello() {\n  return "Hello, World!";\n}',
      tests: [
        { description: 'hello() should return "Hello, World!"', input: '', expectedOutput: 'Hello, World!' }
      ]
    },

    // Robotics projects
    {
      id: 'robotics_line_follower',
      title: 'Line Following Robot',
      description: 'Build a robot that can follow a black line on the ground using sensors.',
      category: 'robotics',
      difficulty: 'intermediate',
      estimatedTime: '90 min',
      xpReward: 120,
      type: 'hardware',
      source: 'youtube',
      externalUrl: 'https://www.tinkercad.com/circuits',
      youtubeId: 'TlB_eWDSMt4',
      instructions: [
        'Set up infrared sensors to detect the line',
        'Program basic movement controls (forward, left, right)',
        'Implement line detection algorithm',
        'Add course correction when robot drifts off line',
        'Test and calibrate on different line thicknesses'
      ]
    }
  ]

  // Store projects if they don't exist
  for (const project of exercismProjects) {
    const existing = await kv.get(`project:${project.id}`)
    if (!existing) {
      await kv.set(`project:${project.id}`, project)
    }
  }

  // Update project index
  const projectIndex = await kv.get('project:index') || []
  const newProjectIds = exercismProjects.map(p => p.id).filter(id => !projectIndex.includes(id))
  if (newProjectIds.length > 0) {
    await kv.set('project:index', [...projectIndex, ...newProjectIds])
  }
}

// Initialize buckets and sample data on startup
await initializeBuckets()

// User Registration - Initialize with 0 progress and streak tracking
app.post('/make-server-4b9cf438/auth/signup', async (c) => {
  try {
    const { email, password, firstName, lastName, birthDate, parentEmail } = await c.req.json()
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName, 
        lastName, 
        birthDate, 
        parentEmail,
        level: 0,
        totalXP: 0,
        isAdmin: email === ADMIN_EMAIL
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log('Registration error during user creation:', error)
      return c.json({ error: 'Registration failed: ' + error.message }, 400)
    }
    
    // Initialize user progress with streak tracking
    const userId = data.user.id
    const today = new Date().toDateString()
    await kv.set(`user:${userId}:progress`, {
      level: 0,
      totalXP: 0,
      streakDays: 0,
      lastLoginDate: today,
      loginDates: [today],
      coursesCompleted: [],
      coursesInProgress: {},
      lessonsCompleted: 0,
      projectsBuilt: 0,
      achievements: [],
      completedTutorials: [],
      completedProjects: [],
      dailyGoal: 2,
      dailyProgress: 0,
      lastActiveDate: today,
      createdAt: new Date().toISOString()
    })
    
    await kv.set(`user:${userId}:settings`, {
      language: 'en',
      theme: 'light',
      soundEffects: true,
      backgroundMusic: false,
      notifications: true,
      emailUpdates: false,
      parentalNotifications: true
    })
    
    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        isAdmin: email === ADMIN_EMAIL,
        ...data.user.user_metadata
      }
    })
    
  } catch (error) {
    console.log('Registration error in signup flow:', error)
    return c.json({ error: 'Registration failed: ' + error }, 500)
  }
})

// Login - Update streak tracking
app.post('/make-server-4b9cf438/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // Update login streak
    const userId = data.user.id
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    const progress = await kv.get(`user:${userId}:progress`) || {}
    const loginDates = progress.loginDates || []
    const lastLoginDate = progress.lastLoginDate || ''
    
    let newStreakDays = progress.streakDays || 0
    
    // Check if user logged in today already
    if (!loginDates.includes(today)) {
      loginDates.push(today)
      
      // Calculate streak
      if (lastLoginDate === yesterday) {
        // Continuing streak
        newStreakDays += 1
      } else if (lastLoginDate !== today) {
        // Starting new streak
        newStreakDays = 1
      }
      
      // Update progress
      const updatedProgress = {
        ...progress,
        lastLoginDate: today,
        loginDates: loginDates.slice(-30), // Keep last 30 days
        streakDays: newStreakDays,
        lastActiveDate: today
      }
      
      await kv.set(`user:${userId}:progress`, updatedProgress)
    }
    
    return c.json({
      session: data.session,
      user: {
        ...data.user,
        isAdmin: email === ADMIN_EMAIL
      }
    })
    
  } catch (error) {
    console.log('Login error:', error)
    return c.json({ error: 'Login failed: ' + error }, 500)
  }
})

// Get User Progress with admin check
app.get('/make-server-4b9cf438/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      console.log('Authorization error while getting user progress:', error)
      return c.json({ error: 'Unauthorized access to user progress' }, 401)
    }
    
    const progress = await kv.get(`user:${user.id}:progress`)
    const settings = await kv.get(`user:${user.id}:settings`)
    
    // Update daily progress if it's a new day
    const today = new Date().toDateString()
    const updatedProgress = progress || {
      level: 0,
      totalXP: 0,
      streakDays: 0,
      lastLoginDate: today,
      loginDates: [today],
      coursesCompleted: [],
      coursesInProgress: {},
      lessonsCompleted: 0,
      projectsBuilt: 0,
      achievements: [],
      completedTutorials: [],
      completedProjects: [],
      dailyGoal: 2,
      dailyProgress: 0,
      lastActiveDate: today,
      createdAt: new Date().toISOString()
    }
    
    if (updatedProgress.lastActiveDate !== today) {
      updatedProgress.dailyProgress = 0
      updatedProgress.lastActiveDate = today
      await kv.set(`user:${user.id}:progress`, updatedProgress)
    }
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.email === ADMIN_EMAIL,
        ...user.user_metadata
      },
      progress: updatedProgress,
      settings: settings || {
        language: 'en',
        theme: 'light',
        soundEffects: true,
        backgroundMusic: false,
        notifications: true,
        emailUpdates: false,
        parentalNotifications: true
      }
    })
    
  } catch (error) {
    console.log('Error fetching user progress:', error)
    return c.json({ error: 'Failed to fetch progress: ' + error }, 500)
  }
})

// Update user profile (firstName, lastName, parentEmail)
app.put('/make-server-4b9cf438/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { firstName, lastName, parentEmail } = await c.req.json()

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        firstName: firstName ?? user.user_metadata?.firstName,
        lastName: lastName ?? user.user_metadata?.lastName,
        parentEmail: parentEmail ?? user.user_metadata?.parentEmail
      }
    })

    if (updateError) {
      return c.json({ error: 'Failed to update profile: ' + updateError.message }, 400)
    }

    return c.json({ message: 'Profile updated' })
  } catch (error) {
    console.log('Error updating profile:', error)
    return c.json({ error: 'Failed to update profile: ' + error }, 500)
  }
})

// Update user settings (language, theme, toggles, dailyGoal)
app.put('/make-server-4b9cf438/user/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const updates = await c.req.json()
    const current = await kv.get(`user:${user.id}:settings`) || {}
    const newSettings = { ...current, ...updates, updatedAt: new Date().toISOString() }
    await kv.set(`user:${user.id}:settings`, newSettings)

    // dailyGoal lives in progress
    if (typeof updates.dailyGoal === 'number') {
      const progress = await kv.get(`user:${user.id}:progress`) || {}
      await kv.set(`user:${user.id}:progress`, { ...progress, dailyGoal: updates.dailyGoal, updatedAt: new Date().toISOString() })
    }

    return c.json({ message: 'Settings updated', settings: newSettings })
  } catch (error) {
    console.log('Error updating settings:', error)
    return c.json({ error: 'Failed to update settings: ' + error }, 500)
  }
})

// Admin-only tutorial upload
app.post('/make-server-4b9cf438/content/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Check if user is admin
    if (user.email !== ADMIN_EMAIL) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const { title, description, type, category, difficulty, duration, youtubeId, xpReward, isOurContent } = await c.req.json()
    
    const contentId = `${isOurContent ? 'our_content' : 'content'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const contentData = {
      id: contentId,
      title,
      description,
      type,
      category,
      difficulty,
      duration,
      youtubeId,
      xpReward: xpReward || 50,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      isOurContent: isOurContent || false
    }
    
    const storeKey = isOurContent ? `our_content:${contentId}` : `content:${contentId}`
    await kv.set(storeKey, contentData)
    
    // Add to appropriate index
    const indexKey = isOurContent ? 'our_content:index' : 'content:index'
    const contentList = await kv.get(indexKey) || []
    contentList.push(contentId)
    await kv.set(indexKey, contentList)
    
    return c.json({ message: 'Content uploaded successfully', content: contentData })
    
  } catch (error) {
    console.log('Error uploading content:', error)
    return c.json({ error: 'Failed to upload content: ' + error }, 500)
  }
})

// Admin-only video edit
app.put('/make-server-4b9cf438/content/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Check if user is admin
    if (user.email !== ADMIN_EMAIL) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const contentId = c.req.param('id')
    const updates = await c.req.json()
    
    // Check if it's our content or regular content
    const isOurContent = updates.isOurContent || contentId.startsWith('our_content')
    const storeKey = isOurContent ? `our_content:${contentId}` : `content:${contentId}`
    
    const existingContent = await kv.get(storeKey)
    if (!existingContent) {
      return c.json({ error: 'Content not found' }, 404)
    }
    
    const updatedContent = {
      ...existingContent,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(storeKey, updatedContent)
    
    return c.json({ message: 'Content updated successfully', content: updatedContent })
    
  } catch (error) {
    console.log('Error updating content:', error)
    return c.json({ error: 'Failed to update content: ' + error }, 500)
  }
})

// Admin-only video delete
app.delete('/make-server-4b9cf438/content/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    console.log('Delete request - Access token:', accessToken ? 'Present' : 'Missing')
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    console.log('Delete request - User data:', user ? `Email: ${user.email}` : 'No user')
    console.log('Delete request - Auth error:', error)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Check if user is admin
    console.log('Delete request - Checking admin access. User email:', user.email, 'Admin email:', ADMIN_EMAIL)
    if (user.email !== ADMIN_EMAIL) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const contentId = c.req.param('id')
    
    // Try to find the content in both regular and our content stores
    let existingContent = await kv.get(`content:${contentId}`)
    let isOurContent = false
    let storeKey = `content:${contentId}`
    let indexKey = 'content:index'
    
    if (!existingContent) {
      existingContent = await kv.get(`our_content:${contentId}`)
      if (existingContent) {
        isOurContent = true
        storeKey = `our_content:${contentId}`
        indexKey = 'our_content:index'
      }
    }
    
    if (!existingContent) {
      return c.json({ error: 'Content not found' }, 404)
    }
    
    // Remove from storage
    await kv.set(storeKey, null) // Set to null to effectively remove
    
    // Remove from index
    const contentIndex = await kv.get(indexKey) || []
    const updatedIndex = contentIndex.filter((id: string) => id !== contentId)
    await kv.set(indexKey, updatedIndex)
    
    return c.json({ message: 'Content deleted successfully' })
    
  } catch (error) {
    console.log('Error deleting content:', error)
    return c.json({ error: 'Failed to delete content: ' + error }, 500)
  }
})

// Get All Content (Tutorials)
app.get('/make-server-4b9cf438/content', async (c) => {
  try {
    const contentIndex = await kv.get('content:index') || []
    const contentList = await kv.mget(contentIndex.map((id: string) => `content:${id}`))
    
    return c.json({ content: contentList.filter(Boolean) })
    
  } catch (error) {
    console.log('Error fetching content:', error)
    return c.json({ error: 'Failed to fetch content: ' + error }, 500)
  }
})

// Get Our Projects Content
app.get('/make-server-4b9cf438/our-content', async (c) => {
  try {
    const contentIndex = await kv.get('our_content:index') || []
    const contentList = await kv.mget(contentIndex.map((id: string) => `our_content:${id}`))
    
    return c.json({ content: contentList.filter(Boolean) })
    
  } catch (error) {
    console.log('Error fetching our content:', error)
    return c.json({ error: 'Failed to fetch our content: ' + error }, 500)
  }
})

// Get All Courses
app.get('/make-server-4b9cf438/courses', async (c) => {
  try {
    const courseIndex = await kv.get('course:index') || []
    const courses = await kv.mget(courseIndex.map((id: string) => `course:${id}`))
    
    return c.json({ courses: courses.filter(Boolean) })
    
  } catch (error) {
    console.log('Error fetching courses:', error)
    return c.json({ error: 'Failed to fetch courses: ' + error }, 500)
  }
})

// Get Single Course
app.get('/make-server-4b9cf438/course/:id', async (c) => {
  try {
    const courseId = c.req.param('id')
    const course = await kv.get(`course:${courseId}`)
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }
    
    return c.json({ course })
    
  } catch (error) {
    console.log('Error fetching course:', error)
    return c.json({ error: 'Failed to fetch course: ' + error }, 500)
  }
})

// Complete Course Module (no XP/level awards)
app.post('/make-server-4b9cf438/course/:courseId/module/:moduleId/complete', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const courseId = c.req.param('courseId')
    const moduleId = parseInt(c.req.param('moduleId'))
    
    const course = await kv.get(`course:${courseId}`)
    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }
    
    const currentProgress = await kv.get(`user:${user.id}:progress`) || {}
    const coursesInProgress = currentProgress.coursesInProgress || {}
    const completedModules = coursesInProgress[courseId] || []
    
    // Don't add if already completed
    if (completedModules.includes(moduleId)) {
      return c.json({ message: 'Module already completed', progress: currentProgress })
    }
    
    // Add completed module
    completedModules.push(moduleId)
    coursesInProgress[courseId] = completedModules
    
    // No XP or level changes for courses. Only track local course progress.
    const isCompleted = completedModules.length >= course.moduleCount
    let coursesCompleted = currentProgress.coursesCompleted || []
    if (isCompleted && !coursesCompleted.includes(courseId)) {
      coursesCompleted = [...coursesCompleted, courseId]
    }

    const newProgress = {
      ...currentProgress,
      // Keep XP/level unchanged for courses
      coursesInProgress,
      coursesCompleted,
      lastActiveDate: new Date().toDateString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}:progress`, newProgress)
    
    return c.json({ 
      message: 'Module completion recorded (no XP awarded).', 
      progress: newProgress,
      courseCompleted: isCompleted
    })
    
  } catch (error) {
    console.log('Error completing module:', error)
    return c.json({ error: 'Failed to complete module: ' + error }, 500)
  }
})

// Get All Practice Projects
app.get('/make-server-4b9cf438/projects', async (c) => {
  try {
    const projectIndex = await kv.get('project:index') || []
    const projects = await kv.mget(projectIndex.map((id: string) => `project:${id}`))
    
    return c.json({ projects: projects.filter(Boolean) })
    
  } catch (error) {
    console.log('Error fetching projects:', error)
    return c.json({ error: 'Failed to fetch projects: ' + error }, 500)
  }
})

// Get Single Project
app.get('/make-server-4b9cf438/project/:id', async (c) => {
  try {
    const projectId = c.req.param('id')
    const project = await kv.get(`project:${projectId}`)
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    return c.json({ project })
    
  } catch (error) {
    console.log('Error fetching project:', error)
    return c.json({ error: 'Failed to fetch project: ' + error }, 500)
  }
})

// Complete Project (no XP awards)
app.post('/make-server-4b9cf438/project/:id/complete', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const projectId = c.req.param('id')
    const { timeSpent, userCode } = await c.req.json()
    
    const project = await kv.get(`project:${projectId}`)
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    const currentProgress = await kv.get(`user:${user.id}:progress`) || {}
    const completedProjects = currentProgress.completedProjects || []
    
    // Don't award XP if already completed
    if (completedProjects.includes(projectId)) {
      return c.json({ message: 'Project already completed', progress: currentProgress })
    }
    
    const newProjectsBuilt = (currentProgress.projectsBuilt || 0) + 1
    
    const newProgress = {
      ...currentProgress,
      // No XP for projects
      projectsBuilt: newProjectsBuilt,
      completedProjects: [...completedProjects, projectId],
      lastActiveDate: new Date().toDateString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}:progress`, newProgress)
    
    return c.json({ 
      message: 'Project completion recorded (no XP awarded).', 
      progress: newProgress,
      timeSpent
    })
    
  } catch (error) {
    console.log('Error completing project:', error)
    return c.json({ error: 'Failed to complete project: ' + error }, 500)
  }
})

// Complete Tutorial
app.post('/make-server-4b9cf438/tutorial/:id/complete', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token' }, 401)
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const tutorialId = c.req.param('id')
    const tutorial = await kv.get(`content:${tutorialId}`) || await kv.get(`our_content:${tutorialId}`)
    
    if (!tutorial) {
      return c.json({ error: 'Tutorial not found' }, 404)
    }
    
    const currentProgress = await kv.get(`user:${user.id}:progress`) || {}
    const completedTutorials = currentProgress.completedTutorials || []
    
    // Don't award XP if already completed
    if (completedTutorials.includes(tutorialId)) {
      return c.json({ message: 'Tutorial already completed', progress: currentProgress })
    }
    
    const newTotalXP = (currentProgress.totalXP || 0) + (tutorial.xpReward || 50)
    const newLessonsCompleted = (currentProgress.lessonsCompleted || 0) + 1
    const newDailyProgress = (currentProgress.dailyProgress || 0) + 1
    
    const newProgress = {
      ...currentProgress,
      totalXP: newTotalXP,
      lessonsCompleted: newLessonsCompleted,
      dailyProgress: newDailyProgress,
      completedTutorials: [...completedTutorials, tutorialId],
      lastActiveDate: new Date().toDateString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}:progress`, newProgress)
    
    return c.json({ 
      message: 'Tutorial completed successfully', 
      progress: newProgress,
      xpEarned: tutorial.xpReward || 50
    })
    
  } catch (error) {
    console.log('Error completing tutorial:', error)
    return c.json({ error: 'Failed to complete tutorial: ' + error }, 500)
  }
})

// Record Content View
app.post('/make-server-4b9cf438/content/:id/view', async (c) => {
  try {
    const contentId = c.req.param('id')
    const content = await kv.get(`content:${contentId}`) || await kv.get(`our_content:${contentId}`)
    
    if (!content) {
      return c.json({ error: 'Content not found' }, 404)
    }
    
    content.views = (content.views || 0) + 1
    
    const storeKey = content.isOurContent ? `our_content:${contentId}` : `content:${contentId}`
    await kv.set(storeKey, content)
    
    return c.json({ message: 'View recorded', views: content.views })
    
  } catch (error) {
    console.log('Error recording view:', error)
    return c.json({ error: 'Failed to record view: ' + error }, 500)
  }
})

// Get Leaderboard
app.get('/make-server-4b9cf438/leaderboard', async (c) => {
  try {
    // Get all user progress data
    const progressKeys = await kv.getByPrefix('user:') 
    const leaderboard = progressKeys
      .filter(item => item.key.includes(':progress'))
      .map(item => ({
        userId: item.key.split(':')[1],
        ...item.value
      }))
      .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
      .slice(0, 10)
    
    return c.json({ leaderboard })
    
  } catch (error) {
    console.log('Error fetching leaderboard:', error)
    return c.json({ error: 'Failed to fetch leaderboard: ' + error }, 500)
  }
})

// Health check
app.get('/make-server-4b9cf438/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)