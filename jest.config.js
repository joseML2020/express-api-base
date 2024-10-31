module.exports = {
    "preset": "@shelf/jest-mongodb",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "testEnvironment": "node",
   "testPathIgnorePatterns": [
    "/node_modules/"
  ],
    testMatch: [
        "**/test/auth/*.test.js",
        "**/test/employee/*.test.js",
        "**/test/post/*.test.js",
    ],
};
