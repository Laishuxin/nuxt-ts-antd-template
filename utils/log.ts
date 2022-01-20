// @ts-nocheck

export const LOG_LEVEL_VERBOSE = 1
export const LOG_LEVEL_INFO = 2
export const LOG_LEVEL_HTTP = 3
export const LOG_LEVEL_WARN = 4
export const LOG_LEVEL_ERROR = 5

if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL =
    process.env.NODE_ENV === 'production' ? LOG_LEVEL_HTTP : LOG_LEVEL_VERBOSE
}

let color = '' // info by default
function _log(level, logger, prefix = '', message = '', ...args) {
  if (process && process.browser) {
    if (level >= LOG_LEVEL_ERROR) {
      color = `\x1B[31m%s\x1B[0m`
    } else if (level >= LOG_LEVEL_WARN) {
      color = `\x1B[33m%s\x1B[0m` // yellow
    } else if (level >= LOG_LEVEL_INFO) {
      color = `\x1B[32m%s\x1B[0m` // green
    }
  }

  if (level >= Number(process.env.LOG_LEVEL)) {
    logger(color, `${prefix}`, message, ...args)
  }
}

export const log = {
  verbose(prefix, message?, ...args) {
    _log(LOG_LEVEL_VERBOSE, console.info, prefix, message, ...args)
  },
  info(prefix, message, ...args) {
    _log(LOG_LEVEL_INFO, console.info, prefix, message, ...args)
  },
  http(prefix, message, ...args) {
    _log(LOG_LEVEL_HTTP, console.warn, prefix, message, ...args)
  },
  warn(prefix, message, ...args) {
    _log(LOG_LEVEL_WARN, console.warn, prefix, message, ...args)
  },
  error(prefix, message, ...args) {
    _log(LOG_LEVEL_ERROR, console.error, prefix, message, ...args)
  },
}
