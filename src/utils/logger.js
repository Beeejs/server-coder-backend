import pino from 'pino';
/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

const configPino = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: {
    targets: [
      {
        target: 'pino/file',
        level: 'error',
        options: {
          destination: './logs/app.log', mkdir: true
        }
      },
      {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname'
        }
      }
    ]
  }
};

export const Logger = pino(configPino);
