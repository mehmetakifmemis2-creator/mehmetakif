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

document.addEventListener("DOMContentLoaded", function () {
  const difficultyEl = document.getElementById("mg-difficulty");
  const startBtn = document.getElementById("mg-start");
  const restartBtn = document.getElementById("mg-restart");
  const boardEl = document.getElementById("mg-board");
  const movesEl = document.getElementById("mg-moves");
  const matchesEl = document.getElementById("mg-matches");
  const winEl = document.getElementById("mg-win");

  // Optional UI
  const timerEl = document.getElementById("mg-timer");
  const bestEasyEl = document.getElementById("mg-best-easy");
  const bestHardEl = document.getElementById("mg-best-hard");

  console.log("MG init:", {
    difficultyEl, startBtn, restartBtn, boardEl,
    timerEl, bestEasyEl, bestHardEl
  });

  if (!difficultyEl || !startBtn || !restartBtn || !boardEl) return;

  const DATA = ["🍕", "⚽", "🚗", "🎧", "🎮", "📚", "⭐", "🎲", "🚀", "🧠", "🧩", "🌍"];

  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;

  // ===== Optional: Timer =====
  let timerId = null;
  let seconds = 0;

  function formatTime(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function resetTimer() {
    stopTimer();
    seconds = 0;
    if (timerEl) timerEl.textContent = "00:00";
  }

  function startTimer() {
    // Start is clicked => timer starts (stopwatch)
    resetTimer();
    if (!timerEl) return;
    timerId = setInterval(() => {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  // ===== Optional: Best score per difficulty =====
  function bestKey(diff) {
    return diff === "easy" ? "mg_best_easy_moves" : "mg_best_hard_moves";
  }

  function loadBestScores() {
    if (!bestEasyEl || !bestHardEl) return;

    const e = localStorage.getItem(bestKey("easy"));
    const h = localStorage.getItem(bestKey("hard"));

    bestEasyEl.textContent = e ? `${e} moves` : "—";
    bestHardEl.textContent = h ? `${h} moves` : "—";
  }

  function updateBestScoreIfBetter() {
    const diff = difficultyEl.value;
    const key = bestKey(diff);

    const current = moves; // fewest moves wins
    const prevStr = localStorage.getItem(key);
    const prev = prevStr ? Number(prevStr) : null;

    if (prev === null || Number.isNaN(prev) || current < prev) {
      localStorage.setItem(key, String(current));
    }
    loadBestScores(); // update display
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function resetStats() {
    moves = 0;
    matches = 0;
    movesEl.textContent = "0";
    matchesEl.textContent = "0";
    winEl.textContent = "";
  }

  function createBoard() {
    boardEl.innerHTML = "";
    resetStats();

    firstCard = null;
    secondCard = null;
    lock = false;

    const diff = difficultyEl.value;
    const cols = diff === "easy" ? 4 : 6;
    const rows = diff === "easy" ? 3 : 4;

    boardEl.style.display = "grid";
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boardEl.style.gap = "12px";

    const pairCount = (cols * rows) / 2;
    totalPairs = pairCount;

    const symbols = DATA.slice(0, pairCount);
    const deck = shuffle([...symbols, ...symbols]);

    deck.forEach(symbol => {
      const card = document.createElement("div");
      card.className = "mg-card";
      card.textContent = "?";
      card.dataset.symbol = symbol;

      // inline styles to avoid template conflicts
      card.style.height = "80px";
      card.style.background = "#222";
      card.style.color = "#00ffcc";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.justifyContent = "center";
      card.style.fontSize = "28px";
      card.style.cursor = "pointer";
      card.style.borderRadius = "10px";
      card.style.userSelect = "none";

      card.addEventListener("click", () => flipCard(card));
      boardEl.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lock) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.textContent = card.dataset.symbol;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lock = true;

    moves++;
    movesEl.textContent = String(moves);

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      matches++;
      matchesEl.textContent = String(matches);

      resetTurn();

      if (matches === totalPairs) {
        winEl.textContent = `🎉 You win! Moves: ${moves} Time: ${timerEl ? timerEl.textContent : "—"}`;
        stopTimer();                 // must stop on win
        updateBestScoreIfBetter();    // best per difficulty
      }
    } else {
      setTimeout(() => {
        firstCard.textContent = "?";
        secondCard.textContent = "?";
        resetTurn();
      }, 800);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lock = false;
  }

  // Events
  startBtn.addEventListener("click", () => {
    createBoard();
    startTimer();               // timer must start on Start
    restartBtn.disabled = false;
  });

  restartBtn.addEventListener("click", () => {
    createBoard();
    startTimer();               // resets on Restart (reset+start)
  });

  difficultyEl.addEventListener("change", () => {
    // required: reset when difficulty changes
    createBoard();
    resetTimer();
    restartBtn.disabled = true;
  });

  // Init
  loadBestScores();  // must read on page load
  resetTimer();      // show 00:00 on load
});
