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