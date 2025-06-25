let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
      { text: "Simplicity is the soul of efficiency.", category: "Work" },
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function displayRandomQuote() {
  const category = localStorage.getItem('selectedCategory') || 'all';
  const filtered = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes available in this category.';
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerText = `${random.text} (${random.category})`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Populate category filter
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const unique = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>`;
  unique.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
  // Restore previous selection
  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    filter.value = saved;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  displayRandomQuote();
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    alert('Quotes imported successfully!');
  };
  reader.readAsText(event.target.files[0]);
}

// Simulate server sync
function fetchQuotesFromServer() {
  const serverQuotes = [
    { text: "A journey of a thousand miles begins with a single step.", category: "Wisdom" },
    { text: "The only true wisdom is in knowing you know nothing.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];

  setTimeout(() => {
    const existing = JSON.parse(localStorage.getItem("quotes")) || [];
    const merged = mergeQuotes(existing, serverQuotes);
    localStorage.setItem("quotes", JSON.stringify(merged));
    quotes = merged;
    populateCategories();
    displayRandomQuote();
    console.log("Quotes synced from server.");
  }, 1000);
}

// Merge server quotes with local ones
function mergeQuotes(local, server) {
  const texts = new Set(local.map(q => q.text));
  server.forEach(q => {
    if (!texts.has(q.text)) local.push(q);
  });
  return local;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  fetchQuotesFromServer();
  populateCategories();
  displayRandomQuote();

  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
});
