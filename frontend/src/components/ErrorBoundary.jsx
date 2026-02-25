import React from 'react';
import { Navigate } from 'react-router-dom';

// simple error boundary that logs the error and sends user back to home
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Redirect to home when an uncaught error happens
      return <Navigate to="/" replace />;
    }

    return this.props.children;
  }
}
