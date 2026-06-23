/* global module */

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/**": [
      "../../packages/database-prisma/src/generated/dubai-client/**/*.node",
    ],
  },
};

module.exports = nextConfig;
