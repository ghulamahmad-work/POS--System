/* global module */

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "../../packages/database-prisma/src/generated/pakistan-client/libquery_engine-rhel-openssl-3.0.x.so.node",
    ],
  },
};

module.exports = nextConfig;
