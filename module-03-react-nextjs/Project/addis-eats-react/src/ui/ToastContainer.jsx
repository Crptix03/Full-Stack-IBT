import { useToastStore } from "../stores/useToastStore";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === "success" && <span className="toast-icon">♥</span>}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}