const months=["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"]
let user=null,barChart,pieChart

window.onload=()=>{
  setTimeout(()=>{
    document.getElementById("splash").remove()

    const s=sessionStorage.getItem("zykon_user")
    if(s){user=s;start()}
    else document.getElementById("login-screen").classList.remove("hidden")
  },5000)

  months.forEach((m,i)=>{
    month.innerHTML+=`<option value="${i}">${m}</option>`
  })

  if("serviceWorker"in navigator)
    navigator.serviceWorker.register("sw.js")
}

function doLogin(){
  const u=username.value.trim()
  const p=pin.value.trim()

  const account=USERS.find(x=>x.username===u && x.password===p)
  if(!account) return alert("Foute login")

  sessionStorage.setItem("zykon_user",u)
  user=u

  login-screen?.remove()
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

function data(){
  return JSON.parse(localStorage.getItem("zykon_"+user))||{}
}

function save(){
  const d=data(), m=month.value
  const incomeV=+income.value||0
  const total=+rent.value+ +insurance.value+ +subs.value+ +food.value+ +other.value
  const resultV=incomeV-total
  result.innerText="€"+resultV
  d[m]={incomeV,resultV}
  localStorage.setItem("zykon_"+user,JSON.stringify(d))
}

function loadMonth(){
  const d=data()[month.value]||{}
  income.value=d.incomeV||""
  result.innerText="€"+(d.resultV||0)
}

function renderCharts(){
  const d=data()
  const inc=months.map((_,i)=>d[i]?.incomeV||0)
  const res=months.map((_,i)=>d[i]?.resultV||0)

  barChart&&barChart.destroy()
  barChart=new Chart(barChart||barChart,{
    type:"bar",
    data:{labels:months,datasets:[
      {label:"Inkomen",data:inc},
      {label:"Over",data:res}
    ]}
  })
}
