// Quotes array
let quotes = [];

// Load quotes from local storage on initialization
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Initial sample quotes
    quotes = [
      { text: 'The best way to get started is to quit talking and begin doing.', category: 'Motivation' },
      { text: 'Don’t let yesterday take up too much of today.', category: 'Motivation' },
      { text: 'Be yourself; everyone else is already taken.', category: 'Humor' }
    ];
    saveQuotes();
  }
  populateCategories();
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const category = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  display.innerHTML = randomQuote ? `${randomQuote.text} <em>[${randomQuote.category}]</em>` : 'No quotes available.';
}

// Populate categories dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore selected category
  const saved = localStorage.getItem('selectedCategory');
  if (saved) select.value = saved;
}

// Filter quotes by category
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', category);
  displayRandomQuote();
}

// Add a new quote from form
function addQuote() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;

  if (!text || !category) {
    alert('Please fill both quote and category.');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        displayRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid format');
      }
    } catch (err) {
      alert('Error parsing JSON');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Init on load
document.addEventListener('DOMContentLoaded', function () {
  loadQuotes();
  displayRandomQuote();
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
});
