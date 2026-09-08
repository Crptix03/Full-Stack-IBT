const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
export function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Enter your full name.";
  }

  const phone = form.phone.trim();
  const phoneRegex = /^(?:\+251|0)(9\d{8}|7\d{8})$/;
  if (!phone) {
    errors.phone = "Enter your TeleBirr number.";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "Enter a valid TeleBirr number (e.g. 0912345678).";
  }

  if (!form.area) {
    errors.area = "Select a delivery area.";
  } else if (!AREAS.includes(form.area)) {
    errors.area = "Select a valid delivery area.";
  }

  return errors;
}

export { AREAS };