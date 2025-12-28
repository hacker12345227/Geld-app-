const months=["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"]
let user=null,barChart,pieChart

window.onload=()=>{
  setTimeout(()=>{
    document.getElementById("splash").remove()
    document.getElementById("login-screen").classList.remove("hidden")
  },5000)

  const m=document.getElementById("month")
  months.forEach((x,i)=>{
    const o=document.createElement("option")
    o.value=i;o.textContent=x;m.appendChild(o)
  })
}

function doLogin(){
  const u=username.value.trim()
  const p=pin.value.trim()
  const acc=USERS.find(x=>x.username===u&&x.password===p)
  if(!acc) return alert("Fout")

  user=u
  document.getElementById("login-screen").remove()
  document.getElementById("app").classList.remove("hidden")
  loadMonth()
}

function logout(){location.reload()}

function toggleMenu(){menu.classList.toggle("hidden")}

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"))
  document.getElementById(p).classList.remove("hidden")
  menu.classList.add("hidden")
  if(p==="charts")setTimeout(renderCharts,100)
}

function data(){
  return JSON.parse(localStorage.getItem("zykon_"+user))||{}
}

function save(){
  const d=data(),m=month.value
  const inc=+income.value||0
  const out=+rent.value+ +insurance.value+ +subs.value+ +food.value+ +other.value
  const res=inc-out
  result.innerText="€"+res
  d[m]={inc,res}
  localStorage.setItem("zykon_"+user,JSON.stringify(d))
}

function loadMonth(){
  const d=data()[month.value]||{}
  income.value=d.inc||""
  result.innerText="€"+(d.res||0)
}

function renderCharts(){
  const d=data()
  const inc=months.map((_,i)=>d[i]?.inc||0)
  const res=months.map((_,i)=>d[i]?.res||0)

  if(barChart)barChart.destroy()
  barChart=new Chart(barChartCtx={
    type:"bar",
    data:{labels:months,datasets:[
      {label:"Inkomen",data:inc},
      {label:"Over",data:res}
    ]}
  })

  if(pieChart)pieChart.destroy()
  pieChart=new Chart(pieChartCtx={
    type:"pie",
    data:{labels:["Over","Uitgaven"],
    datasets:[{data:[res[month.value]||0,inc[month.value]||0]}]}
  })
}
