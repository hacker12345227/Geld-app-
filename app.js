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
  const u=document.getElementById("username").value.trim()
  const p=document.getElementById("pin").value.trim()
  const acc=USERS.find(x=>x.username===u && x.password===p)
  if(!acc){alert("Fout");return}
  user=u
  document.getElementById("login-screen").remove()
  document.getElementById("app").classList.remove("hidden")
  loadMonth()
}

function logout(){location.reload()}

function toggleMenu(){document.getElementById("menu").classList.toggle("hidden")}

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"))
  document.getElementById(p).classList.remove("hidden")
  document.getElementById("menu").classList.add("hidden")
  if(p==="charts")setTimeout(renderCharts,100)
}

function data(){return JSON.parse(localStorage.getItem("zykon_"+user))||{}}

function save(){
  const d=data(),m=document.getElementById("month").value
  const inc=+document.getElementById("income").value||0
  const out=+document.getElementById("rent").value+ +document.getElementById("insurance").value
          + +document.getElementById("subs").value + +document.getElementById("food").value
          + +document.getElementById("other").value
  const res=inc-out
  document.getElementById("result").innerText="€"+res
  d[m]={inc,res}
  localStorage.setItem("zykon_"+user,JSON.stringify(d))
}

function loadMonth(){
  const d=data()[document.getElementById("month").value]||{}
  document.getElementById("income").value=d.inc||""
  document.getElementById("rent").value=d.rent||""
  document.getElementById("insurance").value=d.insurance||""
  document.getElementById("subs").value=d.subs||""
  document.getElementById("food").value=d.food||""
  document.getElementById("other").value=d.other||""
  document.getElementById("result").innerText="€"+(d.res||0)
}

function renderCharts(){
  const d=data()
  const inc=months.map((_,i)=>d[i]?.inc||0)
  const res=months.map((_,i)=>d[i]?.res||0)
  const bar=document.getElementById("barChart")
  const pie=document.getElementById("pieChart")
  if(barChart)barChart.destroy()
  barChart=new Chart(bar,{type:"bar",data:{labels:months,datasets:[{label:"Inkomen",data:inc},{label:"Over",data:res}]}})
  if(pieChart)pieChart.destroy()
  pieChart=new Chart(pie,{type:"pie",data:{labels:["Over","Uitgaven"],datasets:[{data:[res[document.getElementById("month").value]||0,inc[document.getElementById("month").value]||0]}]}})
}
