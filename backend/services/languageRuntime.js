const LANGUAGE_SPECS = {
  c: {
    file: "main.c",
    image: process.env.JUDGE_IMAGE_C || "judge-gcc:13",
    compile: "gcc -std=c11 -O2 -pipe /workspace/main.c -o /workspace/main",
    run: "/workspace/main",
  },
  cpp: {
    file: "main.cpp",
    image: process.env.JUDGE_IMAGE_CPP || "judge-gcc:13",
    compile: "g++ -std=c++17 -O2 -pipe /workspace/main.cpp -o /workspace/main",
    run: "/workspace/main",
  },
  java: {
    file: "Main.java",
    image: process.env.JUDGE_IMAGE_JAVA || "judge-java:17",
    compile: "javac /workspace/Main.java",
    run: "java -cp /workspace Main",
  },
  javascript: {
    file: "main.js",
    image: process.env.JUDGE_IMAGE_JAVASCRIPT || "judge-node:18",
    run: "node /workspace/main.js",
  },
  python: {
    file: "main.py",
    image: process.env.JUDGE_IMAGE_PYTHON || "judge-python:3.10",
    run: "python3 /workspace/main.py",
  },
};

module.exports = {
  LANGUAGE_SPECS,
};
