import { Worker } from "bullmq";
import { getAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const worker = new Worker(
  "ai-analysis",

  async (job) => {
    const { id, title, description } = job.data;
    const ai= getAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
Analyze this incident.

Title:
${title}

Description:
${description}

Return in markdown:

## Root Cause:
...

## Impact:
...

## Recommendations:
• Recommendation 1
• Recommendation 2
• Recommendation 3

Keep response concise.
`,
    });

    const summary =
      response.text || "No analysis generated.";

    await prisma.incident.update({
      where: {
        id,
      },

      data: {
        aiRootCauseAnalysis: summary,
      },
    });

    await prisma.notification.create({
      data: {
        title: "AI Root Cause Ready",
        message: `${title} analysis completed.`,
      },
    });
  },

  {
    connection: {
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT!),
      password: process.env.REDIS_PASSWORD!,
      tls: {},
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});