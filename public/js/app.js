const buttons = document.querySelectorAll(".js-filter-nav__btn");
const cards = document.querySelectorAll(".card");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-filter");
    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      if (category === cardCategory || category === "all") {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    // Laden van winkelwagentje uit lokale opslag, indien beschikbaar
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const addToCartBtn = document.querySelectorAll(".addToCartBtn");
    addToCartBtn.forEach(function (button){
        button.addEventListener("click", function (){
            // Verzamelen productgegevens wanneer een product wordt toegevoegd aan het winkelwagentje
            const card = button.parentElement;
            const productId = card.querySelector(".productId").value;
            const productName = card.querySelector(".productname").value;
            const productPrice = card.querySelector(".productPrice").value;
            const productPath = card.querySelector(".productPath").value;

            openToast(productName);
            addToCart(productId, productName, productPrice, productPath);
            updateSelectedOrder();
        })
    });

    // Functie om een product aan het winkelwagentje toe te voegen
    function addToCart(productId, productName, productPrice, productPath) {
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                path: productPath,
            });
        }
        saveCartToLocalStorage();
        updateCartCount();
    }

    // Functie om het winkelwagentje op te slaan in de lokale opslag
    function saveCartToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Functie om het aantal producten in het winkelwagentje bij te werken
    function updateCartCount() {
        const totalProductsInCart = cart.reduce((total, item) => total + item.quantity, 0);
        const cartTitle = document.getElementById("cartcount");
        cartTitle.textContent = `Cart (${totalProductsInCart})`;
    }

    // Functie om de geselecteerde bestelling weer te geven
    function updateSelectedOrder() {
        // ... (Code om de geselecteerde producten en totale prijs weer te geven)
    }

    // Initialisatie van het winkelwagentje en aantallen bij het laden van de pagina
    updateSelectedOrder();
    updateCartCount();
});
document.getElementById("reviewEntity").addEventListener("change", function () {
    var productDropdown = document.getElementById("productDropdown");
    var orderDropdown = document.getElementById("orderDropdown");
    var storeDropdown = document.getElementById("storeDropdown");
    if (this.value === "product") {
      productDropdown.style.display = "block";
      orderDropdown.style.display = "none";
      storeDropdown.style.display = "none";
    } else if (this.value === "order") {
      productDropdown.style.display = "none";
      orderDropdown.style.display = "block";
      storeDropdown.style.display = "none";
    } else if (this.value === "store") {
      productDropdown.style.display = "none";
      orderDropdown.style.display = "none";
      storeDropdown.style.display = "block";
    }
  });

