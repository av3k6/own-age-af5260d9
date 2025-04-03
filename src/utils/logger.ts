
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private log(level: LogLevel, message: string, ...data: any[]): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]:`;
    
    switch(level) {
      case 'debug':
        console.debug(prefix, message, ...data);
        break;
      case 'info':
        console.info(prefix, message, ...data);
        break;
      case 'warn':
        console.warn(prefix, message, ...data);
        break;
      case 'error':
        console.error(prefix, message, ...data);
        break;
    }
  }
  
  debug(message: string, ...data: any[]): void {
    this.log('debug', message, ...data);
  }
  
  info(message: string, ...data: any[]): void {
    this.log('info', message, ...data);
  }
  
  warn(message: string, ...data: any[]): void {
    this.log('warn', message, ...data);
  }
  
  error(message: string, ...data: any[]): void {
    this.log('error', message, ...data);
  }
}

export const createLogger = (context: string): Logger => {
  return new Logger(context);
};
