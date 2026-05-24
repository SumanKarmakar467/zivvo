import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-6 text-center text-[var(--cream)]">
        <section className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#A78BFA]">Zivvo</p>
          <h1 className="mt-3 font-head text-3xl font-black">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The page hit an unexpected error. Reloading usually gets you back on track.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-6 text-sm font-bold text-white"
          >
            Reload
          </button>
        </section>
      </main>
    );
  }
}
