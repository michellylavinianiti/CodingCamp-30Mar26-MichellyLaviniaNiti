const form = document.getElementById("form");
const list = document.getElementById("list");
const balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("data")) || [];

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!name || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    name,
    amount: Number(amount),
    category
  };

  transactions.push(transaction);
  update();
});

function update() {
  localStorage.setItem("data", JSON.stringify(transactions));

  list.innerHTML = "";

  let total = 0;

  transactions.forEach(t => {
    total += t.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.name} - Rp ${t.amount.toLocaleString("id-ID")}
      <button onclick="deleteItem(${t.id})">X</button>
    `;

    list.appendChild(li);
  });

  balance.innerText = total.toLocaleString("id-ID");

  updateChart();
}

function deleteItem(id) {
  transactions = transactions.filter(t => t.id !== id);
  update();
}

let chart;

function updateChart() {
  const categories = {
    Food: 0,
    Transport: 0,
    Fun: 0
  };

  transactions.forEach(t => {
    categories[t.category] += t.amount;
  });

  const data = {
    labels: ["Food", "Transport", "Fun"],
    datasets: [{
      data: [
        categories.Food,
        categories.Transport,
        categories.Fun
      ]
    }]
  };

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: data
  });
}

update();