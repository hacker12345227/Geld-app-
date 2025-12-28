let user = null;
let barChart, pieChart;

const months = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];

window.onload = () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');

    const savedUser = sessionStorage.getItem('zykon_user');
    if (savedUser) {
      user = savedUser;
      startApp();
    } else {
      document.getElementById('login-screen').classList.remove('hidden');
    }
  }, 3000);

  const select = document.getElementById('month-select');
  months.forEach((m,i)=> {
    const o = document.createElement('option');
    o.value = i;
    o.text = m;
    select.add(o);
  });
};

function login() {
  const u = document.getElementById('username').value.trim();
  if (!u) return alert('Naam invullen');
  user = u;
  sessionStorage.setItem('zykon_user', u);
  startApp();
}

function startApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  showPage('dashboard');
  loadMonth();
}

function logout() {
  sessionStorage.clear();
  location.reload();
}

function toggleMenu() {
  document.getElementById('side-menu').classList.toggle('hidden');
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.getElementById('side-menu').classList.add('hidden');
}

function getData() {
  return JSON.parse(localStorage.getItem('zykon_'+user)) || {};
}

function saveData(data) {
  localStorage.setItem('zykon_'+user, JSON.stringify(data));
}

function calculate() {
  const m = month-select.value;
  const d = getData();

  const income = +income.value || 0;
  const rent = +rent.value || 0;
  const insurance = +insurance.value || 0;
  const subscriptions = +subscriptions.value || 0;
  const food = +food.value || 0;
  const other = +other.value || 0;

  const result = income - (rent+insurance+subscriptions+food+other);
  document.getElementById('result').innerText = '€'+result;

  d[m] = {income,rent,insurance,subscriptions,food,other,result};
  saveData(d);

  renderCharts(d);
}

function loadMonth() {
  const d = getData();
  const m = month-select.value;
  const x = d[m] || {};

  income.value = x.income || '';
  rent.value = x.rent || '';
  insurance.value = x.insurance || '';
  subscriptions.value = x.subscriptions || '';
  food.value = x.food || '';
  other.value = x.other || '';
  result.innerText = '€'+(x.result||0);

  renderCharts(d);
}

function renderCharts(data) {
  const incomes = months.map((_,i)=>data[i]?.income||0);
  const results = months.map((_,i)=>data[i]?.result||0);

  if (barChart) barChart.destroy();
  barChart = new Chart(barChart?.ctx||document.getElementById('barChart'),{
    type:'bar',
    data:{labels:months,datasets:[
      {label:'Inkomen',data:incomes},
      {label:'Over',data:results}
    ]}
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById('pieChart'),{
    type:'pie',
    data:{
      labels:['Over','Uitgaven'],
      datasets:[{data:[results[month-select.value]||0, incomes[month-select.value]||0]}]
    }
  });
}
