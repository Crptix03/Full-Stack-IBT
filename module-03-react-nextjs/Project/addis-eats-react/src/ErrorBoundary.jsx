import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("🛑 ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      // If a custom fallback was passed, use it
      if (this.props.fallback) return this.props.fallback;

      // Otherwise, render the polished default
      return (
        <section className="error-boundary-fallback">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h2 className="serif">
              Something went <em>wrong</em>
            </h2>
            <div className="rule" />

            <p className="error-boundary-message">
              This section couldn't load. The rest of the page still works —
              try again or head back to the menu.
            </p>

            <div className="error-boundary-actions">
              <button
                type="button"
                className="cart-place-order"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <a href="/menu" className="btn-outline">
                Back to Menu
              </a>
            </div>

            {import.meta.env.DEV && (
              <pre className="error-boundary-details">
                {this.state.error?.message || "Unknown error"}
              </pre>
            )}
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}