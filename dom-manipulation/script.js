let quotes = [];
const quoteDisplay = document.getElementById('quoteDisplay');

// === Load Quotes from Local Storage ===
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
    { text: "Simplicity is the soul of efficiency.", category: "Work" },
    { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  ];
  saveQuotes();
}

// === Save Quotes to Local Storage ===
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// === Display Random Quote Based on Filter ===
function displayRandomQuote() {
  const selectedCategory = localStorage.getItem('selectedCategory') || "all";
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p>"${random.text}"</p><small>(${random.category})</small>`;
}

// === Add New Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Both fields are required.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  sendQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
}

// === Send Quote to Mock Server ===
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (err) {
    console.error("POST failed:", err);
  }
}

// === Fetch Quotes from Server ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    let newQuotesCount = 0;
    const localTextSet = new Set(quotes.map(q => q.text));
    serverQuotes.forEach(q => {
      if (!localTextSet.has(q.text)) {
        quotes.push(q);
        newQuotesCount++;
      }
    });

    if (newQuotesCount > 0) {
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      showNotification("Quotes synced with server!");
    }

  } catch (err) {
    console.error("Error syncing:", err);
  }
}

// === Show Notification ===
function showNotification(message) {
  const note = document.createElement('div');
  note.textContent = message;
  note.style.background = '#4caf50';
  note.style.color = '#fff';
  note.style.padding = '10px';
  note.style.margin = '10px 0';
  note.style.textAlign = 'center';
  note.style.borderRadius = '4px';
  document.body.prepend(note);

  setTimeout(() => note.remove(), 4000);
}

// === Populate Category Filter ===
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) select.value = saved;
}

// === Filter Function ===
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  displayRandomQuote();
}

// === Export Quotes ===
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quotes.json';
  link.click();
}

// === Import Quotes ===
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      const localTextSet = new Set(quotes.map(q => q.text));
      let count = 0;

      imported.forEach(q => {
        if (!localTextSet.has(q.text)) {
          quotes.push(q);
          count++;
        }
      });

      saveQuotes();
      populateCategories();
      displayRandomQuote();
      showNotification(`${count} new quotes imported`);
    } catch (error) {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// === Periodic Server Sync (every 60s) ===
function syncQuotes() {
  fetchQuotesFromServer();
}
setInterval(syncQuotes, 60000); // sync every 60 seconds

// === Initialize ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  displayRandomQuote();
  fetchQuotesFromServer();

  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
});
