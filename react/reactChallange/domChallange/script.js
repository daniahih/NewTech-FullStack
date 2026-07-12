const countElement = document.getElementById("count");
const statusElement = document.getElementById("status");
const increaseBtn = document.getElementById("increaseBtn");

let count = 0;

increaseBtn.addEventListener("click", function () {
  count++;

  countElement.textContent = count;

  if (count >= 10) {
    statusElement.textContent = "High";
  } else {
    statusElement.textContent = "Normal";
  }

  if (count >= 20) {
    increaseBtn.disabled = true;
  }
});
