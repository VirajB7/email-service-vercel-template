export class CircuitBreaker {
  private failureCount = 0;
  private readonly threshold = 3;
  private timeout = 10000;
  private lastFailure = 0;

  canAttempt(): boolean {
    return Date.now() - this.lastFailure > this.timeout || this.failureCount < this.threshold;
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailure = Date.now();
  }

  reset() {
    this.failureCount = 0;
  }
}