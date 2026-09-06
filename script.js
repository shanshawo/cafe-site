// Mud & Smoke — cart + WhatsApp order
(function () {
  "use strict";

  // The number orders go to (placeholder — owner swaps in real number)
  var WA_NUMBER = "919876543210";
  var CART_KEY = "mudsmoke_cart";

  // Item data: id -> { name, price }
  var MENU = {
    espresso: { name: "Espresso", price: 120 },
    americano: { name: "Americano", price: 150 },
    flatwhite: { name: "Flat white", price: 180 },
    pourover: { name: "Pour over (ask what's on)", price: 220 },
    coldbrew: { name: "Cold brew, 12 hr", price: 200 },
    avotoast: { name: "Avocado toast, seed mix", price: 280 },
    croissant: { name: "Egg & cheese croissant", price: 240 },
    toastie: { name: "Smoked butter chicken toastie", price: 260 },
    bananabread: { name: "Banana bread, salted butter", price: 180 },
    granola: { name: "Granola bowl, seasonal fruit", price: 250 },
    housered: { name: "House red / white", price: 350 },
    filternight: { name: "Friday filter night", price: 400 },
    kombucha: { name: "Kombucha (tap)", price: 190 },
    cheeseboard: { name: "Cheese board for two", price: 450 }
  };

  var cart = loadCart();

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      // private mode or storage blocked; cart still works in memory
    }
  }

  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) {
      return sum + cart[id];
    }, 0);
  }

  function cartTotal() {
    return Object.keys(cart).reduce(function (sum, id) {
      return sum + (MENU[id] ? MENU[id].price * cart[id] : 0);
    }, 0);
  }

  // ---- rendering ----
  var drawer = document.getElementById("cartDrawer");
  var overlay = document.getElementById("cartOverlay");
  var itemsEl = document.getElementById("cartItems");
  var totalEl = document.getElementById("cartTotal");
  var orderBtn = document.getElementById("cartOrderBtn");

  function openCart() {
    drawer.setAttribute("aria-hidden", "false");
    drawer.classList.add("open");
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    renderCart();
  }

  function closeCart() {
    drawer.setAttribute("aria-hidden", "true");
    drawer.classList.remove("open");
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function renderCart() {
    var ids = Object.keys(cart);
    if (ids.length === 0) {
      itemsEl.innerHTML =
        '<p class="cart-empty">Nothing here yet. Add something from the menu.</p>';
    } else {
      var html = "";
      ids.forEach(function (id) {
        var item = MENU[id];
        if (!item) return;
        html +=
          '<div class="cart-item">' +
          '<div class="cart-item-info">' +
          '<span class="cart-item-name">' + item.name + "</span>" +
          '<span class="cart-item-price">₹' + item.price + " each</span>" +
          "</div>" +
          '<div class="cart-item-qty">' +
          '<button class="qty-btn" data-id="' + id + '" data-delta="-1" aria-label="Remove one ' + item.name + '">−</button>' +
          '<span class="qty-num">' + cart[id] + "</span>" +
          '<button class="qty-btn" data-id="' + id + '" data-delta="1" aria-label="Add one ' + item.name + '">+</button>' +
          "</div>" +
          "</div>";
      });
      itemsEl.innerHTML = html;
    }
    totalEl.textContent = "₹" + cartTotal();
    orderBtn.disabled = ids.length === 0;
  }

  // Add from menu
  document.querySelectorAll(".add-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".menu-item");
      if (!li) return;
      var id = li.getAttribute("data-id");
      if (!MENU[id]) return;
      cart[id] = (cart[id] || 0) + 1;
      saveCart();
      flashAdded(btn);
      openCart();
    });
  });

  function flashAdded(btn) {
    btn.textContent = "✓";
    btn.classList.add("added");
    setTimeout(function () {
      btn.textContent = "+";
      btn.classList.remove("added");
    }, 900);
  }

  // Quantity buttons inside the cart
  itemsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".qty-btn");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var delta = parseInt(btn.getAttribute("data-delta"), 10);
    if (!id || !MENU[id]) return;
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  });

  // Open / close
  document.querySelectorAll(".add-btn").forEach(function () {});
  overlay.addEventListener("click", closeCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);

  // GitHub release note: this is where the cart opens on add
  // (kept open so people see their order build up)

  // WhatsApp order
  orderBtn.addEventListener("click", function () {
    var ids = Object.keys(cart);
    if (ids.length === 0) return;
    var lines = ids.map(function (id) {
      var item = MENU[id];
      var qty = cart[id];
      var lineTotal = item.price * qty;
      return qty + " x " + item.name + " = ₹" + lineTotal;
    });
    var total = "TOTAL: ₹" + cartTotal();
    var msg =
      "Hi Mud & Smoke! I'd like to order:\n\n" +
      lines.join("\n") +
      "\n\n" +
      total +
      "\n\nName: \nPhone: \nPickup or delivery?";
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  });

  // Map button (kept from before)
  var mapBtn = document.getElementById("map-btn");
  if (mapBtn) {
    mapBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(
        "https://www.google.com/maps/search/?api=1&query=Khanna+Market+Lodhi+Road+New+Delhi",
        "_blank"
      );
    });
  }
})();