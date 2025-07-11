import { EmailRequest, EmailStatus } from "./types/Email";
import { EmailProvider } from "./providers/EmailProvider";
import { Logger } from "./utils/Logger";
import { CircuitBreaker } from "./utils/CircuitBreaker";

export class EmailService {
  private providers: { provider: EmailProvider; cb: CircuitBreaker }[] = [];
  private rateLimit = 5;
  private interval = 10000;
  private queue: EmailRequest[] = [];
  private lastSent = 0;
  private sentCache = new Set<string>();

  constructor(providers: EmailProvider[]) {
    this.providers = providers.map(p => ({ provider: p, cb: new CircuitBreaker() }));
    setInterval(() => this.processQueue(), 1000);
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processQueue() {
    if (!this.queue.length) return;
    const now = Date.now();
    if (now - this.lastSent < this.interval / this.rateLimit) return;
    const email = this.queue.shift();
    if (email) await this.send(email);
    this.lastSent = now;
  }

  async enqueue(email: EmailRequest) {
    if (this.sentCache.has(email.idempotencyKey)) {
      Logger.log("Duplicate email skipped.");
      return;
    }
    this.queue.push(email);
  }

  async send(email: EmailRequest): Promise<EmailStatus> {
    let attempt = 0;
    let status: EmailStatus = {
      status: "failed",
      provider: "",
      attempts: 0,
    };

    for (const { provider, cb } of this.providers) {
      if (!cb.canAttempt()) continue;

      attempt = 0;
      while (attempt < 3) {
        try {
          await provider.sendEmail(email);
          this.sentCache.add(email.idempotencyKey);
          cb.reset();
          status = {
            status: attempt > 0 ? "retrying" : "success",
            provider: provider.name,
            attempts: attempt + 1,
          };
          Logger.log(`Email sent via ${provider.name}`);
          return status;
        } catch (err) {
          cb.recordFailure();
          Logger.error(`Failed on ${provider.name}, attempt ${attempt + 1}`);
          attempt++;
          await this.sleep(2 ** attempt * 100);
        }
      }
      status = { status: "fallback", provider: provider.name, attempts: attempt };
    }

    return status;
  }
}