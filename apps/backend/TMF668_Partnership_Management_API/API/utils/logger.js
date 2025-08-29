const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} [${level}]: ${message}${metaString}`;
});

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    // Add file transport in production
    ...(process.env.NODE_ENV === 'production' 
      ? [new transports.File({ filename: 'error.log', level: 'error' })]
      : []
    )
  ]
});

// Add stream for morgan (HTTP request logging)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
