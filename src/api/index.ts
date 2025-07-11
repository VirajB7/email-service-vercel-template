import express from "express";
import { EmailService } from "../EmailService";
import { MockProviderA } from "../providers/MockProviderA";
import { MockProviderB } from "../providers/MockProviderB";
import { EmailRequest } from "../types/Email";

const app = express();
const emailService = new EmailService([new MockProviderA(), new MockProviderB()]);

app.use(express.json());

app.post("/api/send-email", async (req, res) => {
  const email: EmailRequest = req.body;
  if (!email.to || !email.subject || !email.body || !email.idempotencyKey) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  await emailService.enqueue(email);
  const status = await emailService.send(email);
  res.json(status);
});

app.get("/", (_, res) => res.send("🚀 Resilient Email Service is live"));
export default app;