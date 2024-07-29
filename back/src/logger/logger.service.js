import chalk from "chalk";

export class LoggerService {
  constructor(loggerRepository) {
    this.logger;
    this.loggerRepository = loggerRepository;
    this.optionsTime = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
  }

  _formatString(type, context, string) {
    const time = new Date().toLocaleDateString("en-US", this.optionsTime);
    switch (type) {
      case "log": {
        return (
          chalk.grey(time) +
          chalk.blue.bold("  INFO    ") +
          `[${context}] ${string}`
        );
      }
      case "error": {
        return (
          chalk.grey(time) +
          chalk.red.bold("  ERROR   ") +
          `[${context}] ${string}`
        );
      }
      case "warn": {
        return (
          chalk.grey(time) +
          chalk.yellow.bold("  WARNING ") +
          `[${context}] ${string}`
        );
      }
    }
  }

  async log({ context, desc, isAudit, ip }) {
    console.log(this._formatString("log", context, desc));
    if (isAudit) {
      await this.loggerRepository.create({
        type: "log",
        context,
        desc,
        ip: ip || global.IP,
      });
    }
  }

  async error({ context, desc, isAudit, ip }) {
    console.log(this._formatString("error", context, desc));
    if (isAudit) {
      await this.loggerRepository.create({
        type: "error",
        context,
        desc,
        ip: ip || global.IP,
      });
    }
  }

  async warn({ context, desc, isAudit, ip }) {
    console.log(this._formatString("error", context, desc));
    if (isAudit) {
      await this.loggerRepository.create({
        type: "warn",
        context,
        desc,
        ip: ip || global.IP,
      });
    }
  }

  async getRCEvents() {
    return await this.loggerRepository.getRCEvents();
  }
}
