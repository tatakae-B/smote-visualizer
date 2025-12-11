import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">ML demo</p>
          <h1>SMOTE class balancing</h1>
          <p className="lede">
            Compare an imbalanced dataset with a SMOTE-balanced version, see
            how synthetic samples are generated, and tune the parameters.
          </p>
    </div>
      </header>
      <main id="page-content">{children}</main>
      <footer className="app-footer">
        Built with React + Vite (Vike) · SMOTE implemented client-side for
        illustration only.
      </footer>
    </div>
  );
}
