export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-indicator" role="status" aria-live="polite">
        <span className="loading-spinner" aria-hidden="true" />
        <span className="loading-text">Загрузка фильмов...</span>
      </div>
    </div>
  );
}
