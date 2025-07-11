import { EmailProvider } from "./EmailProvider";
import { EmailRequest } from "../types/Email";

export class MockProviderB implements EmailProvider {
  name = "MockProviderB";
  async sendEmail(email: EmailRequest): Promise<void> {
    if (Math.random() < 0.5) throw new Error("MockProviderB failed");
    console.log(`[MockProviderB] Sent: ${email.subject}`);
  }
}