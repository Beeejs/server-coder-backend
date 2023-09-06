import pino from 'pino';
import pretty from 'pino-pretty';
/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

const stream = pretty({
  colorize: true
});

// unable to determine transport target for "pino-pretty" - VERCEL
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


export const Logger = pino(
  process.env.NODE_ENV === 'development'
  ? configPino
  : stream
);
