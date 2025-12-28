const months = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
let currentUser = null;
let barChart, pieChart;

window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";

    const saved = sessionStorage.getItem("zykon_user");
    if (saved) {
      currentUser = saved;
      startApp();
    } else {
      document.getElementById("login-screen").classList.remove("hidden");
    }
  }, 5000);

  const monthSelect = document.getElementById("month");
  months.forEach((m, i) => {
    monthSelect.innerHTML += `<option value="${i}">${m}</option>`;
  });
};

function doLogin() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Gebruikersnaam invullen");

  currentUser = name;
  sessionStorage.setItem("zykon_user", name);
  startApp();
}

function startApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  loadMonth();
}

function logout() {
  sessionStorage.clear();
  location.reload();
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("hidden");
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  document.getElementById("menu").classList.add("hidden");
  if (page === "charts") renderCharts();
}

function getData() {
  return JSON.parse(localStorage.getItem("zykon_" + currentUser)) || {};
}

function saveData() {
  const data = getData();
  const m = document.getElementById("month").value;

  const income = +income.value || 0;
  const rent = +rent.value || 0;
  const insurance = +insurance.value || 0;
  const subs = +subs.value || 0;
  const food = +food.value || 0;
  const other = +other.value || 0;

  const result = income - (rent + insurance + subs + food + other);
  document.getElementById("result").innerText = "€" + result;

  data[m] = { income, rent, insurance, subs, food, other, result };
  localStorage.setItem("zykon_" + currentUser, JSON.stringify(data));
}

function loadMonth() {
  const data = getData();
  const m = document.getElementById("month").value;
  const d = data[m] || {};

  income.value = d.income || "";
  rent.value = d.rent || "";
  insurance.value = d.insurance || "";
  subs.value = d.subs || "";
  food.value = d.food || "";
  other.value = d.other || "";
  result.innerText = "€" + (d.result || 0);
}

function renderCharts() {
  const data = getData();
  const incomes = months.map((_, i) => data[i]?.income || 0);
  const results = months.map((_, i) => data[i]?.result || 0);

  if (barChart) barChart.destroy();
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Inkomen", data: incomes },
        { label: "Over", data: results }
      ]
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Over", "Uitgaven"],
      datasets: [
        { data: [results[month.value] || 0, incomes[month.value] || 0] }
      ]
    }
  });
}
