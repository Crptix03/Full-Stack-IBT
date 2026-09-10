export default function Button({ children, onClick, variant = "primary", ...rest }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}