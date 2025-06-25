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

// Populate categories dropdown
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

  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    filter.value = saved;
  }
}

// Filter by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  displayRandomQuote();
}

// Export quotes to JSON file
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

// 🟢 FINAL REQUIREMENT — Fetch from mock server (JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    // Merge without duplicates
    const localTexts = new Set(quotes.map(q => q.text));
    serverQuotes.forEach(q => {
      if (!localTexts.has(q.text)) {
        quotes.push(q);
      }
    });

    saveQuotes();
    populateCategories();
    displayRandomQuote();
    console.log("Quotes synced from server.");

  } catch (error) {
    console.error('Error syncing quotes from server:', error);
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  fetchQuotesFromServer(); // simulate remote sync
  populateCategories();
  displayRandomQuote();

  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
});
