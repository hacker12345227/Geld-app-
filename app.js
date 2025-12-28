const months=["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"]
let user=null,barChart,pieChart

window.onload=()=>{
  setTimeout(()=>{
    splash.style.display="none"
    const u=sessionStorage.getItem("zykon_user")
    if(u){user=u;start()}else login.classList.remove("hidden")
  },3000)

  months.forEach((m,i)=>{
    month.innerHTML+=`<option value="${i}">${m}</option>`
  })
}

function login(){
  if(!username.value)return alert("Naam invullen")
  user=username.value
  sessionStorage.setItem("zykon_user",user)
  start()
}

function start(){
  login.classList.add("hidden")
  app.classList.remove("hidden")
  loadMonth()
}

function logout(){
  sessionStorage.clear()
  location.reload()
}

function toggleMenu(){menu.classList.toggle("hidden")}

function show(p){
  dashboard.classList.add("hidden")
  charts.classList.add("hidden")
  document.getElementById(p).classList.remove("hidden")
  menu.classList.add("hidden")
  renderCharts()
}

function data(){
  return JSON.parse(localStorage.getItem("zykon_"+user))||{}
}

function save(){
  const d=data()
  const m=month.value

  const incomeV=+income.value||0
  const rentV=+rent.value||0
  const insV=+insurance.value||0
  const subsV=+subs.value||0
  const foodV=+food.value||0
  const otherV=+other.value||0

  const resultV=incomeV-(rentV+insV+subsV+foodV+otherV)
  result.innerText="€"+resultV

  d[m]={incomeV,rentV,insV,subsV,foodV,otherV,resultV}
  localStorage.setItem("zykon_"+user,JSON.stringify(d))
  renderCharts()
}

function loadMonth(){
  const d=data()[month.value]||{}
  income.value=d.incomeV||""
  rent.value=d.rentV||""
  insurance.value=d.insV||""
  subs.value=d.subsV||""
  food.value=d.foodV||""
  other.value=d.otherV||""
  result.innerText="€"+(d.resultV||0)
}

function renderCharts(){
  const d=data()
  const inc=months.map((_,i)=>d[i]?.incomeV||0)
  const res=months.map((_,i)=>d[i]?.resultV||0)

  if(barChart)barChart.destroy()
  barChart=new Chart(bar,{
    type:"bar",
    data:{labels:months,datasets:[
      {label:"Inkomen",data:inc},
      {label:"Over",data:res}
    ]}
  })

  if(pieChart)pieChart.destroy()
  pieChart=new Chart(pie,{
    type:"pie",
    data:{labels:["Over","Uitgaven"],
    datasets:[{data:[res[month.value]||0,inc[month.value]||0]}]}
  })
}
