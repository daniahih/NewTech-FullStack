const tshirtContainer = document.getElementById("tshirtContainer");
const loadingMessage = document.getElementById("loadingMessage");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const tshirtForm = document.getElementById("tshirtForm");

const API_URL = "https://6a37f28fc105017aa6397b14.mockapi.io/tshirts";
async function getShirts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("failed to fetch data becouse of invalied url");
    }
    const tshirts = await response.json();
    displayShirt(tshirts);
  } catch (error) {
    console.log(error);
  }
}
getShirts();

function displayShirt(tshirts) {
  loadingMessage.textContent = "";
  if (tshirts.length === 0) {
    loadingMessage.textContent = "no Tshirt avalible yet ";
    return;
  }

  tshirts.forEach((tshirt) => {
    const card = document.createElement("section");
    card.classList.add("tshirt-card");
    card.innerHTML = `
    <img src="${tshirt.image}" alt ="${tshirt.name}"
    <section>
    <h3>${tshirt.name}</h3>
    <p> Color :${tshirt.color} </p>
    <p> size :${tshirt.size} </p>
    <p> Price : $ ${tshirt.price} </p>

    </section>
    `;
    tshirtContainer.appendChild(card);
  });
}

async function addTshirt(event) {
  event.preventDefault();
  const newTshirt = {
    name: nameInput.value,
    price: Number(priceInput.value),
    image: imageInput.value,
    color: colorInput.value,
    size: sizeInput.value,
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTshirt),
    });
    const createdTshirt = await response.json();
    console.log("createed tshirt ", createdTshirt);

    getShirts();
  } catch (error) {
    console.log(error);
  }
}
tshirtForm.addEventListener("submit", addTshirt);
