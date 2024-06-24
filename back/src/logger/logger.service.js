import chalk from "chalk";

export class LoggerService {
    constructor() {
        this.logger;
        this.optionsTime = {
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric', 
            hour: "numeric", 
            minute: "numeric", 
            second: "numeric"
        }
    }

    _formatString(type, string) {
        const time = new Date().toLocaleDateString('en-US', this.optionsTime);
        switch (type) {
            case "log": {
                return chalk.grey(time) + chalk.blue.bold("  INFO    ") + string;
            }
            case "error": {
                return chalk.grey(time) + chalk.red.bold("  ERROR   ") + string;
            }
            case "warn": {
                return chalk.grey(time) + chalk.yellow.bold("  WARNING ") + string;
            }
        }
    }

    log(...arg) {
        arg.forEach(string => {
            console.log(this._formatString("log", string))
        })
    }

    error(...arg) {
        arg.forEach(string => {
            console.log(this._formatString("error", string))
        })
    }

    warn(...arg) {
        arg.forEach(string => {
            console.log(this._formatString("warn", string))
        })
    }
}