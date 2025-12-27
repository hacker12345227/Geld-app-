let currentUser=null;
let barChart=null;
let pieChart=null;
const months=['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];

window.onload=()=>{ 
  const select=document.getElementById('month-select');
  months.forEach((m,i)=>{ 
    const option=document.createElement('option'); 
    option.value=i; 
    option.text=m; 
    select.add(option); 
  });

  // Splash 5s → login
  setTimeout(()=>{
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
  },5000);
};

function login(){
  const username=document.getElementById('username').value.trim();
  if(!username){ alert('Vul een gebruikersnaam in'); return; }
  currentUser=username;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadMonth();
}

function logout(){ 
  currentUser=null; 
  document.getElementById('login-screen').classList.remove('hidden'); 
  document.getElementById('dashboard').classList.add('hidden'); 
}

function getValue(id){ return Number(document.getElementById(id).value)||0; }

function calculate(){
  const month=document.getElementById('month-select').value;
  if(month===''){ alert('Selecteer een maand'); return; }

  const income=getValue('income');
  const rent=getValue('rent');
  const insurance=getValue('insurance');
  const subscriptions=getValue('subscriptions');
  const food=getValue('food');
  const other=getValue('other');

  const expenses=rent+insurance+subscriptions+food+other;
  const result=income-expenses;
  document.getElementById('result').innerText='€'+result.toFixed(2);

  let userData=JSON.parse(localStorage.getItem('budget_'+currentUser))||{};
  userData[month]={income,rent,insurance,subscriptions,food,other,result};
  localStorage.setItem('budget_'+currentUser,JSON.stringify(userData));

  renderCharts(userData, month);
}

function loadMonth(){
  const month=document.getElementById('month-select').value;
  let userData=JSON.parse(localStorage.getItem('budget_'+currentUser))||{};
  if(month!=='' && userData[month]){
    const data=userData[month];
    ['income','rent','insurance','subscriptions','food','other'].forEach(k=>document.getElementById(k).value=data[k]||0);
    document.getElementById('result').innerText='€'+(data.result||0).toFixed(2);
  }else{
    ['income','rent','insurance','subscriptions','food','other'].forEach(k=>document.getElementById(k).value='');
    document.getElementById('result').innerText='€0';
  }
  renderCharts(userData, month);
}

function renderCharts(userData, selectedMonth){
  const barCtx=document.getElementById('barChart').getContext('2d');
  const pieCtx=document.getElementById('pieChart').getContext('2d');

  // Bar chart: alle maanden
  const expensesData=months.map((m,i)=>{ const d=userData[i]; return d?d.rent+d.insurance+d.subscriptions+d.food+d.other:0; });
  const incomeData=months.map((m,i)=>{ const d=userData[i]; return d?d.income:0; });
  const resultData=months.map((m,i)=>{ const d=userData[i]; return d?d.result:0; });

  const barData={ labels:months, datasets:[
    {label:'Inkomsten', data:incomeData, backgroundColor:'#4f46e5'},
    {label:'Uitgaven', data:expensesData, backgroundColor:'#ef4444'},
    {label:'Over', data:resultData, backgroundColor:'#10b981'}
  ]};

  if(barChart) barChart.destroy();
  barChart=new Chart(barCtx,{type:'bar', data:barData, options:{responsive:true, plugins:{legend:{position:'bottom'}}, scales:{y:{beginAtZero:true}}}});

  // Pie chart: geselecteerde maand
  if(selectedMonth!==''){
    const selData=userData[selectedMonth]||{income:0,rent:0,insurance:0,subscriptions:0,food:0,other:0};
    const pieData={ labels:['Vaste lasten','Variabele kosten','Over'], datasets:[{
      data:[selData.rent+selData.insurance+selData.subscriptions, selData.food+selData.other, selData.result],
      backgroundColor:['#ef4444','#facc15','#10b981']
    }]};

    if(pieChart) pieChart.destroy();
    pieChart=new Chart(pieCtx,{type:'pie', data:pieData, options:{responsive:true, plugins:{legend:{position:'bottom'}}}});
  }
}
