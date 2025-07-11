import { EmailProvider } from "./EmailProvider";
import { EmailRequest } from "../types/Email";

export class MockProviderA implements EmailProvider {
  name = "MockProviderA";
  async sendEmail(email: EmailRequest): Promise<void> {
    if (Math.random() < 0.7) throw new Error("MockProviderA failed");
    console.log(`[MockProviderA] Sent: ${email.subject}`);
  }
}