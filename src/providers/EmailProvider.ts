import { EmailRequest } from "../types/Email";

export interface EmailProvider {
  name: string;
  sendEmail(email: EmailRequest): Promise<void>;
}