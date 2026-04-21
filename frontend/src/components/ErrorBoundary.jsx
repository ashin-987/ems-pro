import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    this.logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1
    });
  }

  logErrorToService = (error, errorInfo) => {
    // In production, send to logging service (e.g., Sentry, LogRocket)
    const errorData = {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // For now, log to console. Replace with actual service in production
    console.error('Error logged:', errorData);
    
    // Example: Send to backend logging endpoint
    // fetch('/api/logs/error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // }).catch(console.error);
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 text-center mb-8">
              We're sorry for the inconvenience. The error has been logged and our team will investigate.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Error Details (Dev Mode):</h3>
                <p className="text-sm text-red-800 font-mono mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details className="text-xs text-red-700">
                    <summary className="cursor-pointer font-medium mb-1">Stack Trace</summary>
                    <pre className="whitespace-pre-wrap bg-red-100 p-2 rounded overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </button>
            </div>

            {/* Error Count Warning */}
            {this.state.errorCount > 3 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Multiple errors detected.</strong> Please refresh the page or contact support.
                </p>
              </div>
            )}

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>If this problem persists, please contact support:</p>
              <p className="mt-1 font-medium text-indigo-600">support@emspro.com</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
