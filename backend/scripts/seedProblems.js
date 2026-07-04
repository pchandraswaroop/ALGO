const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("../model/Problem");

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    statement:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. Assume exactly one solution exists and you may not use the same element twice.",
    difficulty: "Easy",
    timeLimit: 1,
    memoryLimit: 128,
    inputFormat:
      "The first line contains an integer n. The second line contains n integers. The third line contains the target integer.",
    outputFormat:
      "Return the indices of the two numbers that add up to target.",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    tags: ["Array", "Hash Table"],
  },
  {
    title: "Valid Parentheses",
    statement:
      "Given a string containing just the characters (), {}, and [], determine if the input string is valid. A string is valid if open brackets are closed by the same type of brackets in the correct order.",
    difficulty: "Easy",
    timeLimit: 1,
    memoryLimit: 128,
    inputFormat: "A single line containing a string s.",
    outputFormat: "Print true if the string is valid, otherwise false.",
    sampleInput: "()[]{}",
    sampleOutput: "true",
    tags: ["Stack", "String"],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    statement:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    timeLimit: 2,
    memoryLimit: 256,
    inputFormat: "A single line containing the string s.",
    outputFormat:
      "Print the length of the longest substring without repeating characters.",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    tags: ["Sliding Window", "Hash Map"],
  },
  {
    title: "Merge Intervals",
    statement:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "Medium",
    timeLimit: 2,
    memoryLimit: 256,
    inputFormat:
      "The first line contains an integer n followed by n lines of start and end values.",
    outputFormat: "Print the merged intervals in increasing order.",
    sampleInput: "4\n1 3\n2 6\n8 10\n15 18",
    sampleOutput: "1 6\n8 10\n15 18",
    tags: ["Sorting", "Intervals"],
  },
  {
    title: "Median of Two Sorted Arrays",
    statement:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    difficulty: "Hard",
    timeLimit: 3,
    memoryLimit: 256,
    inputFormat: "Two sorted arrays of integers are provided, one per line.",
    outputFormat: "Print the median value as a decimal number when needed.",
    sampleInput: "2 4\n1 3 5",
    sampleOutput: "3",
    tags: ["Binary Search", "Arrays"],
  },
];

const testCasesData = {
  "Two Sum": [
    { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: true },
    { input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: true },
    { input: "2\n3 3\n6", expectedOutput: "0 1", isHidden: true }
  ],
  "Valid Parentheses": [
    { input: "()[]{}", expectedOutput: "true", isHidden: true },
    { input: "(]", expectedOutput: "false", isHidden: true },
    { input: "([)]", expectedOutput: "false", isHidden: true },
    { input: "{[]}", expectedOutput: "true", isHidden: true }
  ],
  "Longest Substring Without Repeating Characters": [
    { input: "abcabcbb", expectedOutput: "3", isHidden: true },
    { input: "bbbbb", expectedOutput: "1", isHidden: true },
    { input: "pwwkew", expectedOutput: "3", isHidden: true }
  ],
  "Merge Intervals": [
    { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18", isHidden: true },
    { input: "2\n1 4\n4 5", expectedOutput: "1 5", isHidden: true }
  ],
  "Median of Two Sorted Arrays": [
    { input: "2 4\n1 3 5", expectedOutput: "3", isHidden: true },
    { input: "1 2\n3 4", expectedOutput: "2.5", isHidden: true }
  ]
};

const seedProblems = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  await mongoose.connect(mongoUri);

  const TestCase = require("../model/TestCase");

  // Clean up existing test cases first
  await TestCase.deleteMany({});

  for (const problemData of problems) {
    const problem = await Problem.findOneAndUpdate(
      { title: problemData.title },
      { $set: problemData },
      { upsert: true, new: true }
    );

    const tcs = testCasesData[problem.title] || [];
    if (tcs.length > 0) {
      const tcOperations = tcs.map(tc => ({
        ...tc,
        problemId: problem._id
      }));
      await TestCase.insertMany(tcOperations);
      console.log(`Seeded ${tcs.length} test cases for problem: ${problem.title}`);
    }
  }

  console.log("Database seeding completed successfully.");
  await mongoose.connection.close();
};

seedProblems().catch(async (error) => {
  console.error("Problem seeding failed:", error.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
