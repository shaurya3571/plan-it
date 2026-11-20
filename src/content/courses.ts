export type Course = {
  slug: string;
  title: string;
  creator: string;
  /** total video length in minutes */
  minutes: number;
  lessonCount: number;
  addedBy: string;
  learning: number;
  youtubeId: string;
};

export type Lesson = {
  n: number;
  title: string;
  summary: string;
  minutes: number;
};

export type CourseDetail = Course & {
  minutesPerDay: number;
  /** pre-split because the original packs lessons greedily, not evenly */
  days: { lessons: Lesson[] }[];
};

export const popularCourses: Course[] = [
  {
    slug: "python-tutorial-for-beginners-complete-python-3dcv",
    title: "Python Tutorial For Beginners | Complete Python Course 🔥",
    creator: "CodeWithHarry",
    minutes: 654,
    lessonCount: 62,
    addedBy: "Phonk",
    learning: 66,
    youtubeId: "UrsmFxEIp5k",
  },
  {
    slug: "python-for-ai-full-beginner-course-np4k",
    title: "Python for AI - Full Beginner Course",
    creator: "Dave Ebbelaar",
    minutes: 316,
    lessonCount: 37,
    addedBy: "ABHISHEK",
    learning: 34,
    youtubeId: "ygXn5nV5qFc",
  },
  {
    slug: "advanced-backend-ai-full-course-docker-redis-system-design-jdt4",
    title:
      "Advanced Backend + AI Full Course 🚀 | Docker, Redis, System Design, AWS, RAG, LangChain",
    creator: "VIRTUAL CODE",
    minutes: 577,
    lessonCount: 58,
    addedBy: "ABHISHEK",
    learning: 32,
    youtubeId: "_itqpLVS660",
  },
  {
    slug: "learn-full-excel-course-from-basic-to-advanced-with-ai-we33",
    title:
      "Learn Full Excel Course from Basic to Advanced with AI | Excel AI Masterclass 2026",
    creator: "Satish Dhawale",
    minutes: 907,
    lessonCount: 74,
    addedBy: "Ramu",
    learning: 23,
    youtubeId: "wGBKI6B945w",
  },
  {
    slug: "ai-engineering-full-course-build-and-deploy-a-real-ai-app-vfdj",
    title: "AI Engineering Full Course - Build and Deploy a Real AI App",
    creator: "Dave Ebbelaar",
    minutes: 190,
    lessonCount: 24,
    addedBy: "Manish",
    learning: 21,
    youtubeId: "XzjSx7u9mGw",
  },
  {
    slug: "complete-agentic-ai-course-in-10-hours-langchain-langgraph-vm72",
    title:
      "Complete Agentic AI Course In 10 Hours - Langchain, Langgraph, RAG, Guardrails, Evals",
    creator: "Krish Naik",
    minutes: 673,
    lessonCount: 68,
    addedBy: "Bhanuranjan",
    learning: 16,
    youtubeId: "rV3HJ4LEZ7k",
  },
];

export function thumbnailUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export const pythonForAiLessons: Lesson[][] = [
  [
    {
      n: 1,
      title: "Course Introduction & Overview",
      summary:
        "Understand the course goals, structure, and why this Python course focuses on practical AI development skills.",
      minutes: 12,
    },
    {
      n: 2,
      title: "Creating Projects and Workspaces",
      summary:
        "Create a structured project folder using kebab-case naming, open it in VS Code, and save it as a workspace for persistent sessions.",
      minutes: 6,
    },
    {
      n: 3,
      title: "Creating and Running Your First Python File",
      summary:
        "Create a hello.py file, write a print statement, select the correct Python interpreter, and run the script via the play button and terminal.",
      minutes: 15,
    },
    {
      n: 4,
      title: "Creating and Using Virtual Environments",
      summary:
        "Create a venv virtual environment in VS Code, select it as the interpreter, and understand environment activation in terminals.",
      minutes: 4,
    },
    {
      n: 5,
      title: "Installing and Importing Python Packages",
      summary:
        "Install the requests package with pip, locate installed package files, and import the library in a Python script.",
      minutes: 5,
    },
    {
      n: 6,
      title: "Interactive Python with Jupyter in VS Code",
      summary:
        "Install ipykernel, configure Jupyter interactive window settings, and run code sections interactively with Shift+Enter.",
      minutes: 11,
    },
    {
      n: 7,
      title: "Python Syntax, PEP 8, and Debugging Errors",
      summary:
        "Learn Python syntax rules, PEP 8 style guidelines, and how to read and fix common syntax and runtime errors.",
      minutes: 6,
    },
    {
      n: 8,
      title: "Variables and Comments",
      summary:
        "Create variables to store data, overwrite values, and add single-line and multi-line comments to document code.",
      minutes: 12,
    },
    {
      n: 9,
      title: "Data Types: Booleans and Comparison Operators",
      summary:
        "Use True/False boolean values, perform comparisons with ==, !=, >, <, and combine conditions with and, or, not.",
      minutes: 6,
    },
    {
      n: 10,
      title: "Control Flow: Conditional Statements",
      summary:
        "Write if, elif, and else statements to branch program logic based on boolean conditions.",
      minutes: 7,
    },
    {
      n: 11,
      title: "Control Flow: For Loops and range()",
      summary:
        "Use for loops with range() to repeat actions, customize start/stop/step values, and understand zero-based indexing.",
      minutes: 7,
    },
    {
      n: 12,
      title: "Data Structures: Lists",
      summary:
        "Create lists with mixed data types, access elements by index, slice lists, and use append, insert, remove and sort.",
      minutes: 8,
    },
    {
      n: 13,
      title: "Data Structures: Tuples and Sets",
      summary:
        "Create immutable tuples for fixed data like coordinates, and use sets to store unique values with automatic deduplication.",
      minutes: 6,
    },
  ],
  [
    {
      n: 14,
      title: "Data Structures: Dictionaries",
      summary:
        "Store key-value pairs, read and update values by key, and iterate over keys, values and items.",
      minutes: 9,
    },
    {
      n: 15,
      title: "Functions and Return Values",
      summary:
        "Define functions with def, pass positional and keyword arguments, and return single or multiple values.",
      minutes: 13,
    },
    {
      n: 16,
      title: "Type Hints and Docstrings",
      summary:
        "Annotate parameters and return types, and document a function so editors and teammates can read its contract.",
      minutes: 8,
    },
    {
      n: 17,
      title: "Error Handling with try/except",
      summary:
        "Catch specific exceptions, use else and finally, and raise your own errors with useful messages.",
      minutes: 10,
    },
    {
      n: 18,
      title: "Working with Files and Paths",
      summary:
        "Read and write text and JSON files, and use pathlib to build paths that work on every operating system.",
      minutes: 11,
    },
    {
      n: 19,
      title: "Classes and Dataclasses",
      summary:
        "Model data with classes, add methods, and cut boilerplate using dataclasses for plain data containers.",
      minutes: 14,
    },
    {
      n: 20,
      title: "Modules, Packages and Imports",
      summary:
        "Split code across files, import across a package, and understand what __init__.py actually does.",
      minutes: 9,
    },
    {
      n: 21,
      title: "Virtual Environments in Real Projects",
      summary:
        "Pin dependencies in requirements.txt, reproduce an environment, and keep project installs isolated.",
      minutes: 7,
    },
    {
      n: 22,
      title: "Calling HTTP APIs with requests",
      summary:
        "Send GET and POST requests, read status codes, parse JSON responses, and handle timeouts.",
      minutes: 12,
    },
    {
      n: 23,
      title: "Environment Variables and Secrets",
      summary:
        "Load API keys from a .env file with python-dotenv and keep credentials out of source control.",
      minutes: 6,
    },
    {
      n: 24,
      title: "Your First LLM Call",
      summary:
        "Send a prompt to a chat completion endpoint, read the response, and handle rate limits.",
      minutes: 13,
    },
  ],
  [
    {
      n: 25,
      title: "Structured Output with Pydantic",
      summary:
        "Define a schema, validate model output against it, and recover when the response does not fit.",
      minutes: 14,
    },
    {
      n: 26,
      title: "Prompt Templates and Reuse",
      summary:
        "Build prompts from templates, inject variables safely, and version prompts alongside code.",
      minutes: 9,
    },
    {
      n: 27,
      title: "Embeddings and Similarity",
      summary:
        "Turn text into vectors, measure cosine similarity, and understand what embeddings can and cannot tell you.",
      minutes: 12,
    },
    {
      n: 28,
      title: "Chunking Documents",
      summary:
        "Split long documents into overlapping chunks and pick a size that keeps context intact.",
      minutes: 8,
    },
    {
      n: 29,
      title: "Building a Minimal RAG Pipeline",
      summary:
        "Index chunks, retrieve the closest matches for a question, and pass them to the model as context.",
      minutes: 16,
    },
    {
      n: 30,
      title: "Tool Calling Basics",
      summary:
        "Describe a function to the model, parse the call it returns, and run it safely.",
      minutes: 13,
    },
    {
      n: 31,
      title: "Async Python for API Work",
      summary:
        "Use async/await and asyncio.gather to run many API calls concurrently instead of one at a time.",
      minutes: 15,
    },
    {
      n: 32,
      title: "Logging Instead of print()",
      summary:
        "Configure the logging module, pick levels, and get output you can actually debug from.",
      minutes: 7,
    },
    {
      n: 33,
      title: "Testing with pytest",
      summary:
        "Write assertions, use fixtures, and fake an API so tests stay fast and deterministic.",
      minutes: 14,
    },
    {
      n: 34,
      title: "Serving a Model with FastAPI",
      summary:
        "Expose an endpoint, validate the request body, and return a typed JSON response.",
      minutes: 15,
    },
    {
      n: 35,
      title: "Caching and Retries",
      summary:
        "Cache repeated calls, add exponential backoff, and stop one flaky request from failing a job.",
      minutes: 10,
    },
    {
      n: 36,
      title: "Packaging and Deploying a Script",
      summary:
        "Add a console entry point, containerize the app, and run it somewhere other than your laptop.",
      minutes: 12,
    },
    {
      n: 37,
      title: "Where to Go Next",
      summary:
        "Pick the next thing to build, and the parts of the ecosystem worth learning in what order.",
      minutes: 5,
    },
  ],
];

export const courseDetails: Record<string, CourseDetail> = {
  "python-for-ai-full-beginner-course-np4k": {
    ...popularCourses[1],
    minutesPerDay: 90,
    days: pythonForAiLessons.map((lessons) => ({ lessons })),
  },
};

export function getCourse(slug: string) {
  return courseDetails[slug] ?? null;
}
