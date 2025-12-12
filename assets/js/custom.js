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

/* ===== Memory Game (LAB6) ===== */
(function () {
  // Elements
  const difficultyEl = document.getElementById("mg-difficulty");
  const startBtn = document.getElementById("mg-start");
  const restartBtn = document.getElementById("mg-restart");
  const boardEl = document.getElementById("mg-board");
  const winEl = document.getElementById("mg-win");
  const movesEl = document.getElementById("mg-moves");
  const matchesEl = document.getElementById("mg-matches");

  // Optional elements
  const timerEl = document.getElementById("mg-timer");
  const bestEasyEl = document.getElementById("mg-best-easy");
  const bestHardEl = document.getElementById("mg-best-hard");

  if (!difficultyEl || !startBtn || !restartBtn || !boardEl) return; // section yoksa çalışmasın

  // Data set: at least 6 unique items (icons/emojis are acceptable as icons)
  const DATASET = ["🍕", "⚽", "🚗", "🎧", "🎮", "📚", "🌍", "⭐", "🎲", "🧠", "🧩", "🚀"];

  const DIFFICULTY = {
    easy: { cols: 4, rows: 3 }, // 12 cards = 6 pairs
    hard: { cols: 6, rows: 4 }  // 24 cards = 12 pairs
  };

  // Game state
  let gameStarted = false;
  let lockBoard = false;
  let firstCard = null;
  let secondCard = null;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;
  let currentDifficulty = difficultyEl.value;

  // Optional timer
  let timerInterval = null;
  let elapsedSeconds = 0;

  // Helpers
  function shuffle(array) {
    // Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setStats() {
    movesEl.textContent = String(moves);
    matchesEl.textContent = String(matches);
  }

  function setWinMessage(msg) {
    winEl.textContent = msg || "";
  }

  function formatTime(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function timerReset() {
    elapsedSeconds = 0;
    if (timerEl) timerEl.textContent = "00:00";
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function timerStart() {
    timerReset();
    if (!timerEl) return;
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
      timerEl.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function timerStop() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  // Optional best scores (fewest moves per difficulty)
  function bestKey(diff) {
    return `mg_best_moves_${diff}`;
  }

  function readBest() {
    if (!bestEasyEl || !bestHardEl) return;
    const e = localStorage.getItem(bestKey("easy"));
    const h = localStorage.getItem(bestKey("hard"));
    bestEasyEl.textContent = e ? `${e} moves` : "—";
    bestHardEl.textContent = h ? `${h} moves` : "—";
  }

  function maybeUpdateBest() {
    const key = bestKey(currentDifficulty);
    const existing = localStorage.getItem(key);
    const existingNum = existing ? Number(existing) : null;

    if (existingNum === null || Number.isNaN(existingNum) || moves < existingNum) {
      localStorage.setItem(key, String(moves));
    }
    readBest();
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function buildDeck(diff) {
    const { cols, rows } = DIFFICULTY[diff];
    const totalCards = cols * rows;
    totalPairs = totalCards / 2;

    // pick required number of unique items
    const picked = DATASET.slice(0, totalPairs);
    const pairs = shuffle([...picked, ...picked]); // duplicate to make pairs

    return { pairs, cols, rows };
  }

  function renderBoard(diff) {
    const { pairs, cols } = buildDeck(diff);

    // grid setup by JS (no separate HTML layout per difficulty)
    boardEl.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`;

    // clear board
    boardEl.innerHTML = "";

    pairs.forEach((symbol, idx) => {
      const card = document.createElement("div");
      card.className = "mg-card is-disabled";
      card.dataset.value = symbol;
      card.dataset.index = String(idx);

      // button for accessibility (click area)
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Memory card");
      btn.setAttribute("aria-pressed", "false");

      const inner = document.createElement("div");
      inner.className = "mg-card-inner";

      const front = document.createElement("div");
      front.className = "mg-face mg-front";
      front.textContent = "?";

      const back = document.createElement("div");
      back.className = "mg-face mg-back";
      back.textContent = symbol;

      inner.appendChild(front);
      inner.appendChild(back);

      card.appendChild(btn);
      card.appendChild(inner);

      boardEl.appendChild(card);
    });
  }

  function setPlayable(playable) {
    const cards = boardEl.querySelectorAll(".mg-card");
    cards.forEach(c => {
      c.classList.toggle("is-disabled", !playable);
    });
  }

  function fullReset(rebuild = true) {
    gameStarted = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    matches = 0;
    setStats();
    setWinMessage("");
    timerReset();

    startBtn.disabled = false;
    restartBtn.disabled = true;

    if (rebuild) renderBoard(currentDifficulty);
    setPlayable(false);
  }

  function startGame() {
    gameStarted = true;
    setWinMessage("");
    moves = 0;
    matches = 0;
    setStats();

    startBtn.disabled = true;
    restartBtn.disabled = false;

    setPlayable(true);
    timerStart();
  }

  function handleCardClick(card) {
    if (!gameStarted) return;
    if (lockBoard) return;
    if (card.classList.contains("is-matched")) return;
    if (card === firstCard) return;

    // flip
    card.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves += 1;
    setStats();

    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");

      matches += 1;
      setStats();
      resetTurn();

      if (matches === totalPairs) {
        timerStop();
        setWinMessage(`🎉 You win! Moves: ${moves} | Time: ${timerEl ? timerEl.textContent : "—"}`);
        maybeUpdateBest(); // optional best score
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        resetTurn();
      }, 1000);
    }
  }

  // Events
  difficultyEl.addEventListener("change", () => {
    currentDifficulty = difficultyEl.value;
    // On difficulty change: reshuffle, reset state, clear stats (required)
    fullReset(true);
  });

  startBtn.addEventListener("click", () => startGame());

  restartBtn.addEventListener("click", () => {
    // reset stats, reshuffle, hide all cards, start new game without reload (required)
    fullReset(true);
    startGame();
  });

  boardEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const card = btn.closest(".mg-card");
    if (!card) return;
    if (card.classList.contains("is-disabled")) return;
    handleCardClick(card);
  });

  // Init on page load
  readBest();               // optional best results
  currentDifficulty = difficultyEl.value;
  renderBoard(currentDifficulty);
  setPlayable(false);
  setStats();
})();
