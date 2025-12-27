function getValue(id) {
  return Number(document.getElementById(id).value) || 0;
}

function calculate() {
  const income = getValue("income");
  const expenses =
    getValue("rent") +
    getValue("insurance") +
    getValue("subscriptions") +
    getValue("food") +
    getValue("other");

  const result = income - expenses;
  document.getElementById("result").innerText =
    "€" + result.toFixed(2);

  localStorage.setItem("budgetData", JSON.stringify({
    income, expenses
  }));
}

window.onload = () => {
  const data = JSON.parse(localStorage.getItem("budgetData"));
  if (!data) return;
  document.getElementById("income").value = data.income || "";
};
