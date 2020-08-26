// navbar
const nav = document.querySelector('.navbar');
const home = document.querySelector('.nav-icon');
const cartBtn = document.querySelector('.cart-btn');
const cartItemAmount = document.querySelector('.cart-amount');
const show = document.querySelector('.show');
// navbar end
// content
const contentDOM = document.querySelector('.content-cell');
const basketBtn = document.querySelector('.basket-button');
// content end
// cart
const closeBtn = document.querySelector('.close-btn');
const remove = document.querySelector('.remove');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartTotalPrice = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-item');
const clearCart = document.querySelector('.cart-clear');
// cart end

let inCart = [];
let buttons = [];

// PRODUCT CLASS
class Products {
  async getProducts() {
    let result = await fetch('ayakkabi.json');
    let sonuc = await result.json();
    let products = sonuc.items;
    return products;
  }
}

// UI CLASS
class UI {
  // ------------------------------ FUNCTIONS ------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  scrollDown(e) {
    e.preventDefault();
    const offsetTop = contentDOM.offsetTop;
    scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
  scrollTop(e) {
    e.preventDefault();
    const offsetTop = nav.offsetTop;
    scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  reload() {
    inCart = Storage.getCart(inCart);
    this.populateCart(inCart);
    this.totalPrice(inCart);
    cartBtn.addEventListener('click', () => {
      this.showCart();
    });
    closeBtn.addEventListener('click', () => this.hideCart());
  }

  populateCart(cart) {
    cart.forEach((element) => {
      this.addCartItem(element);
    });
  }
  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('show-cart');
  }
  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('show-cart');
  }
  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('show-cart');
  }
  totalPrice(beklenen) {
    let tempTotal = 0;
    let itemTotal = 0;
    beklenen.map((gelen) => {
      tempTotal += gelen.price * gelen.piece;
      itemTotal += gelen.piece;
    });
    cartTotalPrice.innerText = parseFloat(tempTotal.toFixed(2));
    cartItemAmount.innerText = itemTotal;
  }
  removeItem(id) {
    inCart = inCart.filter((gelenItem) => gelenItem.id !== id);
    this.totalPrice(inCart);
    Storage.saveCart(inCart);

    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Cart`;
  }
  getSingleButton(id) {
    return buttons.find((gelenButon) => gelenButon.dataset.id === id);
  }
  cartClear() {
    let actual = inCart.map((e) => e.id);
    actual.forEach((element) => this.removeItem(element));
    while (cartItems.children.length > 0) {
      cartItems.removeChild(cartItems.children[0]);
      this.hideCart;
    }
  }
  cartLogic() {
    clearCart.addEventListener('click', () => this.cartClear());
    cartItems.addEventListener('click', (point) => {
      if (point.target.classList.contains('remove')) {
        let thisElement = point.target;
        let thisID = thisElement.dataset.id;
        cartItems.removeChild(thisElement.parentElement.parentElement);
        this.removeItem(thisID);
      } else if (point.target.classList.contains('fa-chevron-up')) {
        let thisElement = point.target;
        let thisID = thisElement.dataset.id;
        let tempItem = inCart.find((e) => e.id === thisID);
        tempItem.piece = tempItem.piece + 1;
        Storage.saveCart(inCart);
        this.totalPrice(inCart);
        thisElement.nextElementSibling.innerText = tempItem.piece;
      } else if (point.target.classList.contains('fa-chevron-down')) {
        let thisElement = point.target;
        let thisID = thisElement.dataset.id;
        let tempItem = inCart.find((e) => e.id === thisID);
        if (tempItem.piece > 1) {
          tempItem.piece = tempItem.piece - 1;
          Storage.saveCart(inCart);
          this.totalPrice(inCart);
          thisElement.previousElementSibling.innerText = tempItem.piece;
        } else {
          cartItems.removeChild(thisElement.parentElement.parentElement);
          this.removeItem(thisID);
        }
      }
    });
  }
  addCartItem(product) {
    const div = document.createElement('div');
    div.classList.add('cart-content');
    div.innerHTML = `<img src=${product.image} alt="" />
          <div class="cart-product">
            <h4>${product.title} </h4>
            <h5>$${product.price} </h5>
            <span class="remove" data-id=${product.id} >remove</span>
          </div>
          <div>
            <i class="i fas fa-chevron-up" data-id=${product.id} ></i>
            <p class="amount">${product.piece} </p>
            <i class="fas fa-chevron-down" data-id=${product.id}></i>
          </div>`;
    cartItems.appendChild(div);
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  placeProduct(product) {
    let fillContent = '';
    product.forEach((element) => {
      fillContent += `
            <!-- article start -->
        <article class="products">
          <div class="image-container">
            <img class="shoe-image" src=${element.image} alt="" />
            <button class="basket-button" data-id=${element.id}>
              <i class="fas fa-shopping-basket" > Add to Cart</i>
            </button>
          </div>
          <h3>${element.title}</h3>
          <h4>$${element.price}</h4>
        </article>
        <!-- article end -->
            `;
    });
    contentDOM.innerHTML = fillContent;
  }

  getBasketButtons() {
    const btns = [...document.querySelectorAll('.basket-button')];
    buttons = btns;

    btns.forEach((gelenButon) => {
      let id = gelenButon.dataset.id;
      let yeniCart = inCart.find((e) => e.id === id);
      if (yeniCart) {
        gelenButon.innerHTML = 'In Cart';
        gelenButon.disabled = true;
      }
      gelenButon.addEventListener('click', (event) => {
        event.target.innerHTML = 'In Cart';

        if (!event.target.disabled) {
          // Get Product from Products
          let cartRow = { ...Storage.downloadProducts(id), piece: 1 };
          // Add product to the cart
          inCart = [...inCart, cartRow];
          // Save cart in local storage
          Storage.saveCart(inCart);
          // set cart values
          this.totalPrice(inCart);
          // display cart items
          this.addCartItem(cartRow);
          // show the cart
          this.showCart();
        }
        event.target.disabled = true;
      });
    });
  }
}

// STORAGE CLASS
class Storage {
  static uploadProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static downloadProducts(id) {
    let item = JSON.parse(localStorage.getItem('products'));
    return item.find((e) => e.id === id);
  }
  static saveCart(products) {
    localStorage.setItem('inCart', JSON.stringify(products));
  }
  static getCart() {
    return localStorage.getItem('inCart')
      ? JSON.parse(localStorage.getItem('inCart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pr = new Products();
  const ui = new UI();

  pr.getProducts()
    .then((came) => {
      ui.placeProduct(came);
      Storage.uploadProducts(came);
    })
    .then(() => {
      ui.getBasketButtons();
      ui.cartLogic();
    });

  ui.reload();
  show.addEventListener('click', (e) => {
    ui.scrollDown(e);
  });
  home.addEventListener('click', (e) => {
    ui.scrollTop(e);
  });
});
