// Production-ready logging utility
// In production, integrate with services like Sentry, LogRocket, or custom backend

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
    this.enableConsole = this.isDevelopment || import.meta.env.VITE_ENABLE_CONSOLE === 'true';
  }

  // Log levels
  LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  };

  // Format log message
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };
  }

  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Send to backend logging endpoint
  async sendToBackend(logData) {
    if (this.isDevelopment) return; // Don't send in dev

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Failed to send log to backend:', error);
    }
  }

  // Error logging
  error(message, error, additionalData = {}) {
    const logData = this.formatMessage(this.LEVELS.ERROR, message, {
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      },
      ...additionalData
    });

    if (this.enableConsole) {
      console.error(`[ERROR] ${message}`, error, additionalData);
    }

    this.sendToBackend(logData);

    // In production, send to error tracking service (Sentry, etc.)
    if (!this.isDevelopment && window.Sentry) {
      window.Sentry.captureException(error, {
        extra: additionalData,
        tags: { customMessage: message }
      });
    }

    return logData;
  }

  // Warning logging
  warn(message, data = {}) {
    const logData = this.formatMessage(this.LEVELS.WARN, message, data);

    if (this.enableConsole) {
      console.warn(`[WARN] ${message}`, data);
    }

    this.sendToBackend(logData);
    return logData;
  }

  // Info logging
  info(message, data = {}) {
    const logData = this.formatMessage(this.LEVELS.INFO, message, data);

    if (this.enableConsole) {
      console.info(`[INFO] ${message}`, data);
    }

    this.sendToBackend(logData);
    return logData;
  }

  // Debug logging (only in development)
  debug(message, data = {}) {
    if (!this.isDevelopment) return;

    const logData = this.formatMessage(this.LEVELS.DEBUG, message, data);

    if (this.enableConsole) {
      console.log(`[DEBUG] ${message}`, data);
    }

    return logData;
  }

  // API call logging
  logApiCall(method, url, requestData, responseData, duration, error = null) {
    const logData = {
      type: 'api_call',
      method,
      url,
      duration,
      requestData,
      responseData,
      error,
      status: error ? 'failed' : 'success'
    };

    if (error) {
      this.error(`API call failed: ${method} ${url}`, error, logData);
    } else {
      this.debug(`API call: ${method} ${url}`, logData);
    }
  }

  // User action logging
  logUserAction(action, details = {}) {
    this.info(`User action: ${action}`, {
      type: 'user_action',
      action,
      ...details
    });
  }

  // Performance logging
  logPerformance(metric, value, details = {}) {
    this.info(`Performance: ${metric}`, {
      type: 'performance',
      metric,
      value,
      ...details
    });

    // Send to analytics service if configured
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metric,
        value: value,
        event_category: 'Performance'
      });
    }
  }

  // Navigation logging
  logNavigation(from, to) {
    this.debug('Navigation', {
      type: 'navigation',
      from,
      to,
      timestamp: Date.now()
    });
  }

  // Auth events
  logAuthEvent(event, details = {}) {
    this.info(`Auth: ${event}`, {
      type: 'auth',
      event,
      ...details
    });
  }

  // Custom event logging
  logEvent(eventName, details = {}) {
    this.info(`Event: ${eventName}`, {
      type: 'custom_event',
      eventName,
      ...details
    });

    // Send to analytics if configured
    if (window.gtag) {
      window.gtag('event', eventName, details);
    }
  }

  // Group logs for better debugging
  group(label) {
    if (this.enableConsole) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.enableConsole) {
      console.groupEnd();
    }
  }

  // Table for structured data
  table(data) {
    if (this.enableConsole) {
      console.table(data);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export convenience methods
export const logError = (message, error, data) => logger.error(message, error, data);
export const logWarn = (message, data) => logger.warn(message, data);
export const logInfo = (message, data) => logger.info(message, data);
export const logDebug = (message, data) => logger.debug(message, data);
export const logApiCall = (...args) => logger.logApiCall(...args);
export const logUserAction = (action, details) => logger.logUserAction(action, details);
export const logPerformance = (metric, value, details) => logger.logPerformance(metric, value, details);
export const logNavigation = (from, to) => logger.logNavigation(from, to);
export const logAuthEvent = (event, details) => logger.logAuthEvent(event, details);
export const logEvent = (eventName, details) => logger.logEvent(eventName, details);

export default logger;
