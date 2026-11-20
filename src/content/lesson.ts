/** Sample study notes, quiz and pinned notes for the lesson player. */

export const lessonSample = {
  article: [
    {
      heading: "What this lesson covers",
      body: "Installing a package with pip, finding where it lands on disk, and importing it in a script. Everything here happens inside the virtual environment you created in the previous lesson.",
    },
    {
      heading: "Installing with pip",
      body: "With the environment active, `pip install requests` downloads the package and its dependencies into the environment's site-packages folder. Nothing is installed system-wide, so two projects can use two different versions.",
    },
    {
      heading: "Importing it",
      body: "`import requests` at the top of a file makes the library available. If the import fails, the usual cause is that the editor is still pointed at a different interpreter than the one you installed into.",
    },
  ],
  quiz: {
    question: "Where does pip install a package when a virtual environment is active?",
    options: [
      { text: "Into the environment's site-packages folder", correct: true },
      { text: "Into the system Python installation", correct: false },
      { text: "Into the folder the script lives in", correct: false },
    ],
    /** where the video explains the right answer */
    replayAt: "4:12",
    explanation:
      "An active environment puts its own site-packages first, so installs and imports both resolve there instead of system Python.",
  },
  notes: [
    { at: "0:42", text: "pip install goes into the active venv, not system Python." },
    { at: "2:08", text: "Check the interpreter in the status bar if an import fails." },
    { at: "4:12", text: "site-packages is where installed libraries actually live." },
  ],
} as const;
