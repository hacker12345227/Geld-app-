let currentUser = null;
let chart = null;

function login() {
  const username = document.getElementById('username').value.trim();
  if(!username) { alert('Vul een gebruikersnaam in'); return; }
  currentUser = username;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadData();
}

function logout() {
  currentUser = null;
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function getValue(id) { return Number(document.getElementById(id).value) || 0; }

function calculate() {
  const income = getValue('income');
  const rent = getValue('rent');
  const insurance = getValue('insurance');
  const subscriptions = getValue('subscriptions');
  const food = getValue('food');
  const other = getValue('other');

  const expenses = rent + insurance + subscriptions + food + other;
  const result = income - expenses;
  document.getElementById('result').innerText = '€' + result.toFixed(2);

  const data = { income, rent, insurance, subscriptions, food, other, result };
  localStorage.setItem('budget_' + currentUser, JSON.stringify(data));
  renderChart(data);
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('budget_' + currentUser));
  if(!data) return;
  for(const key of ['income','rent','insurance','subscriptions','food','other']) {
    document.getElementById(key).value = data[key] || 0;
  }
  document.getElementById('result').innerText = '€' + (data.result || 0).toFixed(2);
  renderChart(data);
}

function renderChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const chartData = {
    labels: ['Vaste lasten','Variabel','Over'],
    datasets:[{
      label:'Budget verdeling',
      data:[ data.rent+data.insurance+data.subscriptions, data.food+data.other, data.result],
      backgroundColor:['#4f46e5','#facc15','#10b981']
    }]
  };
  if(chart) chart.destroy();
  chart = new Chart(ctx, { type:'doughnut', data:chartData, options:{responsive:true, plugins:{legend:{position:'bottom'}}} });
}
