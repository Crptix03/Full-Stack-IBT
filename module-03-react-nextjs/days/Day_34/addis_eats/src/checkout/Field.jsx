function Field({
  name,
  label,
  type = "text",
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  as = "input",
  options,
  inputRef,
}) {
  const showError = touched && !!error;
  const errorId = `${name}-error`;

  const sharedProps = {
    id: name,
    name,
    value,
    onChange,
    onBlur,
    "aria-invalid": showError,
    "aria-describedby": showError ? errorId : undefined,
    ref: inputRef,
  };

  return (
    <label htmlFor={name} className="field">
      <span className="field-label">{label}</span>

      {as === "select" ? (
        <select {...sharedProps}>
          <option value="">Select an area</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} {...sharedProps} />
      )}

      {showError && (
        <span id={errorId} role="alert" className="field-error">
          {error}
        </span>
      )}
    </label>
  );
}

export default Field;