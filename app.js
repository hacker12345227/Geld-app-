const months = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"]
let user = null
let barChart = null
let pieChart = null

window.onload = () => {

  // SPLASH 5 sec
  setTimeout(() => {
    const splash = document.getElementById("splash")
    if (splash) splash.remove()

    // 👉 NOOIT automatisch inloggen
    document.getElementById("login-screen").classList.remove("hidden")

  }, 5000)

  // Maanden vullen
  const m = document.getElementById("month")
  months.forEach((x, i) => {
    const opt = document.createElement("option")
    opt.value = i
    opt.textContent = x
    m.appendChild(opt)
  })

  // PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
  }
}

/* 🔐 LOGIN */
function doLogin() {
  const u = document.getElementById("username").value.trim()
  const p = document.getElementById("pin").value.trim()

  if (!u || !p) {
    alert("Vul gebruikersnaam en wachtwoord in")
    return
  }

  const account = USERS.find(
    acc => acc.username === u && acc.password === p
  )

  if (!account) {
    alert("Gebruikersnaam of wachtwoord onjuist")
    return
  }

  // Login OK
  user = u
  sessionStorage.setItem("zykon_user", u)

  const login = document.getElementById("login-screen")
  login.style.opacity = "0"

  setTimeout(() => {
    login.remove()
    document.getElementById("app").classList.remove("hidden")
    loadMonth()
  }, 300)
}

/* 🚪 LOGOUT */
function logout() {
  sessionStorage.clear()
  location.reload()
}

/* 🍔 MENU */
function toggleMenu() {
  document.getElementById("menu").classList.toggle("hidden")
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"))
  document.getElementById(page).classList.remove("hidden")
  document.getElementById("menu").classList.add("hidden")

  if (page === "charts") renderCharts()
}

/* 💾 DATA */
function getData() {
  return JSON.parse(localStorage.getItem("zykon_" + user)) || {}
}

function save() {
  const d = getData()
  const m = document.getElementById("month").value

  const income = +document.getElementById("income").value || 0
  const rent = +document.getElementById("rent").value || 0
  const insurance = +document.getElementById("insurance").value || 0
  const subs = +document.getElementById("subs").value || 0
  const food = +document.getElementById("food").value || 0
  const other = +document.getElementById("other").value || 0

  const result = income - (rent + insurance + subs + food + other)

  document.getElementById("result").innerText = "€" + result

  d[m] = { income, rent, insurance, subs, food, other, result }
  localStorage.setItem("zykon_" + user, JSON.stringify(d))
}

function loadMonth() {
  const d = getData()[document.getElementById("month").value] || {}

  document.getElementById("income").value = d.income || ""
  document.getElementById("rent").value = d.rent || ""
  document.getElementById("insurance").value = d.insurance || ""
  document.getElementById("subs").value = d.subs || ""
  document.getElementById("food").value = d.food || ""
  document.getElementById("other").value = d.other || ""

  document.getElementById("result").innerText = "€" + (d.result || 0)
}

/* 📊 GRAFIEKEN */
function renderCharts() {
  const d = getData()
  const inc = months.map((_, i) => d[i]?.income || 0)
  const res = months.map((_, i) => d[i]?.result || 0)

  if (barChart) barChart.destroy()
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Inkomen", data: inc },
        { label: "Over", data: res }
      ]
    }
  })

  if (pieChart) pieChart.destroy()
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Over", "Uitgaven"],
      datasets: [{
        data: [
          res[document.getElementById("month").value] || 0,
          inc[document.getElementById("month").value] || 0
        ]
      }]
    }
  })
}
