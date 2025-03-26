const API_KEY = "SSRBD3JH3PL8FIEF";
const years = ["2019", "2020", "2021", "2022", "2023"];
const indicators = ["EBITDA", "Net Income", "ROE", "P/E Ratio"];

function toggleManualForm() {
  const form = document.getElementById("manualForm");
  const container = document.getElementById("manualInputs");
  form.style.display = form.style.display === "none" ? "block" : "none";
  if (container.innerHTML === "") {
    indicators.forEach(indicator => {
      const row = document.createElement("div");
      row.innerHTML = `<strong>${indicator}</strong><br>` +
        years.map(year =>
          `<input type="number" placeholder="${year}" id="${indicator}_${year}" />`
        ).join("");
      container.appendChild(row);
    });
  }
}

function generateManualAnalysis() {
  const userData = {};
  indicators.forEach(indicator => {
    userData[indicator] = years.map(year => {
      const val = document.getElementById(`${indicator}_${year}`).value;
      return parseFloat(val) || 0;
    });
  });

  renderAnalysis(userData);
}

function analyzeStock() {
  const symbol = document.getElementById("stockSymbol").value.toUpperCase();
  if (!symbol) return alert("Please enter a stock symbol.");

  fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const reports = data.annualReports;
      if (!reports || reports.length === 0) {
        alert("No data found for this symbol.");
        return;
      }

      const financials = {
        "EBITDA": [],
        "Net Income": []
      };

      for (let y of years) {
        const report = reports.find(r => r.fiscalDateEnding.startsWith(y));
        if (report) {
          financials["EBITDA"].push(parseFloat(report.ebitda) / 1e9); // in B
          financials["Net Income"].push(parseFloat(report.netIncome) / 1e9);
        } else {
          financials["EBITDA"].push(0);
          financials["Net Income"].push(0);
        }
      }

      renderAnalysis(financials);
    })
    .catch(error => {
      console.error("API Error:", error);
      alert("Error fetching data.");
    });
}

function renderAnalysis(data) {
  document.getElementById("results").style.display = "block";
  const tbody = document.getElementById("indicatorTable");
  tbody.innerHTML = "";

  for (let key in data) {
    const row = `<tr>
      <td>${key}</td>
      ${data[key].map(val => `<td>${val.toFixed(2)}</td>`).join("")}
    </tr>`;
    tbody.innerHTML += row;
  }

  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: Object.keys(data).map((key) => ({
        label: key,
        data: data[key],
        borderWidth: 2,
        fill: false,
      }))
    },
    options: {
      responsive: true
    }
  });
}

function downloadPDF() {
  const element = document.querySelector(".container");
  html2pdf().from(element).save("Financial_Report.pdf");
}function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<div class="chat-message user">${msg}</div>`;

  // Simulate AI reply based on message (simple logic for demo)
  let reply = "I'll analyze your question based on available data.";
  if (msg.toLowerCase().includes("ebitda")) {
    reply = "EBITDA has steadily increased from 2.1B in 2019 to 8.3B in 2023, showing strong operational growth.";
  }

  setTimeout(() => {
    chatBox.innerHTML += `<div class="chat-message bot">${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);

  input.value = "";
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<div class="chat-message user">${msg}</div>`;
  input.value = "";

  fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: msg })
  })
    .then(response => response.json())
    .then(data => {
      const reply = data.reply || "Sorry, I couldn't process your request.";
      chatBox.innerHTML += `<div class="chat-message bot">${reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(err => {
      chatBox.innerHTML += `<div class="chat-message bot">Error: ${err.message}</div>`;
    });
}