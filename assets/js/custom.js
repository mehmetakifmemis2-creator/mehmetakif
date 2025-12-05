document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const resultsBox = document.getElementById("form-results");
  const popup = document.getElementById("form-popup");
  const submitBtn = document.getElementById("contact-submit");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const rating1Input = document.getElementById("rating1");
  const rating2Input = document.getElementById("rating2");
  const rating3Input = document.getElementById("rating3");

  function setError(input, message) {
    const errorEl = document.getElementById(input.id + "-error");
    if (!errorEl) return;
    if (message) {
      input.classList.add("is-invalid");
      errorEl.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      errorEl.textContent = "";
    }
  }

  function validateName(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "This field is required");
      return false;
    }
    if (!/^[A-Za-zÀ-ž\s'-]+$/.test(value)) {
      setError(input, "Letters only");
      return false;
    }
    setError(input, "");
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setError(emailInput, "This field is required");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) {
      setError(emailInput, "Invalid email");
      return false;
    }
    setError(emailInput, "");
    return true;
  }

  function validateAddress() {
    const value = addressInput.value.trim();
    if (!value) {
      setError(addressInput, "This field is required");
      return false;
    }
    if (value.length < 5) {
      setError(addressInput, "Address too short");
      return false;
    }
    setError(addressInput, "");
    return true;
  }

  function formatLtPhone(raw) {
    let digits = raw.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.startsWith("3706")) {
      digits = digits;
    } else if (digits.startsWith("86")) {
      digits = "370" + digits.slice(1);
    } else if (digits.startsWith("6")) {
      digits = "370" + digits;
    } else if (digits.startsWith("370")) {
      if (digits.length >= 4 && digits[3] !== "6") {
        digits = "3706" + digits.slice(4);
      }
    } else if (digits.startsWith("8")) {
      digits = "3706" + digits.slice(2);
    } else {
      if (!digits.startsWith("3706")) {
        digits = "3706" + digits;
      }
    }
    digits = digits.slice(0, 11);
    if (!digits.startsWith("3706")) return "+370 6";
    const after = digits.slice(4);
    const firstPart = after.slice(0, 2);
    const secondPart = after.slice(2);
    let result = "+370 6";
    if (firstPart) result += firstPart;
    if (secondPart) result += " " + secondPart;
    return result;
  }

  function isValidLtPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length === 11 && digits.startsWith("3706");
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    if (!value) {
      setError(phoneInput, "This field is required");
      return false;
    }
    if (!isValidLtPhone(value)) {
      setError(phoneInput, "Use format +370 6xx xxxxx");
      return false;
    }
    setError(phoneInput, "");
    return true;
  }

  function validateRating(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "Required");
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 1 || num > 10) {
      setError(input, "1–10 only");
      return false;
    }
    setError(input, "");
    return true;
  }

  function validateForm() {
    const v1 = validateName(nameInput);
    const v2 = validateName(surnameInput);
    const v3 = validateEmail();
    const v4 = validatePhone();
    const v5 = validateAddress();
    const v6 = validateRating(rating1Input);
    const v7 = validateRating(rating2Input);
    const v8 = validateRating(rating3Input);
    const valid = v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8;
    submitBtn.disabled = !valid;
    return valid;
  }

  nameInput.addEventListener("input", function () {
    validateName(nameInput);
    validateForm();
  });

  surnameInput.addEventListener("input", function () {
    validateName(surnameInput);
    validateForm();
  });

  emailInput.addEventListener("input", function () {
    validateEmail();
    validateForm();
  });

  addressInput.addEventListener("input", function () {
    validateAddress();
    validateForm();
  });

  rating1Input.addEventListener("input", function () {
    validateRating(rating1Input);
    validateForm();
  });

  rating2Input.addEventListener("input", function () {
    validateRating(rating2Input);
    validateForm();
  });

  rating3Input.addEventListener("input", function () {
    validateRating(rating3Input);
    validateForm();
  });

  phoneInput.addEventListener("input", function (e) {
    const formatted = formatLtPhone(e.target.value);
    e.target.value = formatted;
    validatePhone();
    validateForm();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const rating1 = parseFloat(rating1Input.value);
    const rating2 = parseFloat(rating2Input.value);
    const rating3 = parseFloat(rating3Input.value);

    const formData = {
      name,
      surname,
      email,
      phone,
      address,
      rating1,
      rating2,
      rating3
    };

    console.log("Form data:", formData);

    const average = ((rating1 + rating2 + rating3) / 3).toFixed(1);
    let avgClass = "avg-mid";
    if (average < 4) avgClass = "avg-low";
    else if (average >= 7) avgClass = "avg-high";

    const lines = [
      "Name: " + name,
      "Surname: " + surname,
      "Email: " + email,
      "Phone number: " + phone,
      "Address: " + address,
      "Interface: " + rating1,
      "Information: " + rating2,
      "User-Friendly " + rating3,
      "",
      '<span class="' + avgClass + '">' + name + " " + surname + ": " + average + "</span>"
    ];

    resultsBox.innerHTML = lines.join("\n");
    showPopup(popup);
  });

  function showPopup(popupElement) {
    if (!popupElement) return;
    popupElement.classList.add("show");
    setTimeout(function () {
      popupElement.classList.remove("show");
    }, 2500);
  }
});
