const months=["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"]
let user=null,barChart,pieChart

window.onload=()=>{
  setTimeout(()=>{
    const splash=document.getElementById("splash");
    splash.style.opacity=0;
    setTimeout(()=>splash.remove(),300)

    const s=sessionStorage.getItem("zykon_user")
    if(s){user=s;start()} 
    else document.getElementById("login-screen").classList.remove("hidden")
  },5000)

  const m=document.getElementById("month")
  months.forEach((x,i)=>m.innerHTML+=`<option value="${i}">${x}</option>`)

  if("serviceWorker"in navigator)
    navigator.serviceWorker.register("sw.js")
}

function doLogin(){
  const u=username.value.trim()
  const p=pin.value.trim()
  if(!u||!p)return alert("Alles invullen")

  sessionStorage.setItem("zykon_user",u)
  localStorage.setItem("zykon_pin_"+u,p)
  user=u

  const login=document.getElementById("login-screen")
  login.style.opacity=0
  setTimeout(()=>login.remove(),300)

  document.getElementById("app").classList.remove("hidden")
  loadMonth()
}

function logout(){
  sessionStorage.clear()
  location.reload()
}

function toggleMenu(){menu.classList.toggle("hidden")}

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"))
  document.getElementById(p).classList.remove("hidden")
  menu.classList.add("hidden")
  if(p==="charts")renderCharts()
}

function data(){return JSON.parse(localStorage.getItem("zykon_"+user))||{}}

function save(){
  const d=data(), m=month.value
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
  barChart=new Chart(barChart||document.getElementById("barChart"),{
    type:"bar",
    data:{labels:months,datasets:[
      {label:"Inkomen",data:inc},
      {label:"Over",data:res}
    ]}
  })

  if(pieChart)pieChart.destroy()
  pieChart=new Chart(document.getElementById("pieChart"),{
    type:"pie",
    data:{labels:["Over","Uitgaven"],datasets:[{data:[res[month.value]||0,inc[month.value]||0]}]}
  })
}
