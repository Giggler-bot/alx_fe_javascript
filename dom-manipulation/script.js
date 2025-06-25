// Initial set of quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" }
];

function showRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" - [${quote.category}]`
}

function addQuote() {
    const textInput = document.getElementById('newQuoteText').value.trim();
    const categoryInput = document.getElementById('newQuoteCategory').value.trim();

    if (!textInput ||  !categoryInput) 
        return alert("Both fields are required.");
    
    quotes.push({
        text: textInput,
        category: categoryInput
    });
    alert("Quote added!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

}

document.getElementById('newQuote').addEventListener('click', showRandomQuote)
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  showRandomQuote(); // Optional: show quote on page load
});
