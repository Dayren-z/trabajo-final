// ============================================ //
// 1. ELEMENTOS DEL DOM (conexión con HTML)
// ============================================ //
const countryModal = document.getElementById("countryModal");
const modalClose = document.getElementById("modalClose");
const continueBtn = document.getElementById("continueBtn");
const header = document.getElementById("header");
const heroImage = document.querySelector(".hero-image");
const heroNavLinks = document.querySelectorAll(".hero-nav-link");
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("mobileMenu");
const cartBtn = document.querySelector(".cart-icon");
const cartCount = document.getElementById("cartCount");
// Submenú para cargar productos
const submenuLinks = document.querySelectorAll(".submenu a");
const container = document.getElementById("productsContainer");
// ============================================ //
// 2. VARIABLES GLOBALES (los almacenes)
// ============================================ //
const STORAGE_KEY = "zarahome_modal_dismissed"; // Clave para localStorage
let isMenuOpen = false; // Estado del menú móvil
let allProducts = [];//para guardar los productos cargados.
// ============================================ //
// 3. FUNCIÓN PARA MODAL (como tu ejercicio de producto)
// ============================================ //
function closeModal() {
  countryModal.classList.add("hidden"); // Ocultar modal
  localStorage.setItem(STORAGE_KEY, "true"); // GUARDAR en localStorage
  document.body.style.overflow = ""; // Restaurar scroll
}

function openModal() {
  const modalDismissed = localStorage.getItem(STORAGE_KEY); // RECUPERAR de localStorage
  if (!modalDismissed) {
    // Si NO lo ha visto antes
    countryModal.classList.remove("hidden"); // Mostrar modal
    document.body.style.overflow = "hidden"; // Bloquear scroll
  }
}
//FETCH
async function loadProducts(category) {
  try {
    console.log("📦 Cargando productos de:", category);
    
    const response = await fetch("./data/toallas.json");
    if (!response.ok) throw new Error("No encuentra el JSON");
    
    const products = await response.json();  // ← 1º obtenemos los datos
    console.log("✅ Productos cargados:", products);
    
    allProducts = products;  // ← 2º guardamos en variable global (para el carrito)
    renderProducts(products);  // ← 3º pintamos en pantalla
    
  } catch (error) {
    console.error("❌ Error:", error);
    container.innerHTML = "<p>Error cargando productos</p>";
  }
}
//EVENTO DE CLICK EN SUBMENÚ
submenuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = link.dataset.category;
    loadProducts(category);
  });
});
// RENDERIZAR PRODUCTOS
function renderProducts(products) {
 if (!container) {
    console.error("No encuentro Container");
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="./img/${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.material}</p>
      <p class="price">${product.price} €</p>
      <div class="colors">
        ${product.color.map(c => `<span class="color-tag">${c}</span>`).join("")}
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        AÑADIR
      </button>
    </div>
  `).join("");
  
  // Cerrar menú después de seleccionar producto
   if (isMenuOpen) toggleMenu(false);
}
// ============================================ //
// FUNCIÓN PARA AÑADIR AL CARRITO
// ============================================ //
function addToCart(productId) {
  // Buscar el producto en allProducts (necesitas tener esta variable global)
  const producto = allProducts.find(p => p.id === productId);
  
  if (!producto) {
    console.error("Producto no encontrado");
    return;
  }
  
  // Recuperar carrito actual o crear uno nuevo
  let carrito = JSON.parse(localStorage.getItem("zarahome_cart") || "[]");
  
  // Añadir producto
  carrito.push({
    id: producto.id,
    name: producto.name,
    price: producto.price,
    quantity: 1
  });
  
  // Guardar en localStorage
  localStorage.setItem("zarahome_cart", JSON.stringify(carrito));
  
  // Actualizar contador del carrito
  updateCartCount();
  
  // Feedback opcional
  console.log(`✅ Añadido: ${producto.name}`);
  
  // O un pequeño feedback visual
  // alert(`✅ ${producto.name} añadido`);
}
// ============================================ //
// 4. FUNCIÓN PARA HEADER CON SCROLL
// ============================================ //
function updateHeader() {
  if (window.scrollY > 50) {
    // Si scroll > 50px
    header.classList.add("scrolled"); // Añadir clase
  } else {
    header.classList.remove("scrolled"); // Quitar clase
  }
}

// ============================================ //
// 5. FUNCIÓN PARA CAMBIAR IMAGEN HERO (como filtros)
// ============================================ //
function updateHeroImage(clickedLink) {
  // Quitar active de todos
  heroNavLinks.forEach((link) => link.classList.remove("active"));
  // Poner active al clickado
  clickedLink.classList.add("active");

  // Cambiar imagen con efecto fade
  const imgUrl = clickedLink.dataset.image;
  if (imgUrl && heroImage.src !== imgUrl) {
    heroImage.style.opacity = "0.5"; // Transparencia
    setTimeout(() => {
      // Esperar
      heroImage.src = imgUrl; // Cambiar imagen
      heroImage.style.opacity = "1"; // Restaurar opacidad
    }, 150);
  }
}

// ============================================ //
// 6. FUNCIÓN PARA MENÚ MÓVIL (hamburguesa)
// ============================================ //
function toggleMenu(open = !isMenuOpen) {
  isMenuOpen = open;
  mobileMenu.classList.toggle("show", isMenuOpen);
  menuBtn.classList.toggle("active", isMenuOpen);
  document.body.style.overflow = isMenuOpen ? "hidden" : "";
}

// ============================================ //
// 7. FUNCIÓN PARA ACTUALIZAR CONTADOR CARRITO
// ============================================ //
function updateCartCount() {
  let count = 0;
  try {
    const cartData = localStorage.getItem("zarahome_cart"); // RECUPERAR carrito
    if (cartData) {
      const cart = JSON.parse(cartData); // Convertir a objeto
      count = cart.length || 0;
    }
  } catch (e) {
    console.warn("Error al leer carrito");
  }

  // Mostrar contador
  cartCount.textContent = count > 0 ? `(${count})` : "";
}


// ============================================ //
// 8. FUNCIÓN PARA INICIALIZAR TODO (init CORREGIDA)
// ============================================ //
function init() {
  console.log("🚀 Iniciando aplicación...");
  
  // 8.0 Verificar elementos críticos
  if (!container) console.warn("⚠️ No hay productsContainer");
  if (!submenuLinks.length) console.warn("⚠️ No hay enlaces de submenú");
  
  // 8.1 Inicializar modal
  openModal();

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (continueBtn) continueBtn.addEventListener("click", closeModal);

  if (countryModal) {
    countryModal.addEventListener("click", (e) => {
      if (e.target === countryModal) closeModal();
    });
  }

  // 8.2 Header scroll
  if (header) {
    updateHeader();
    window.addEventListener("scroll", updateHeader);
  }

  // 8.3 Hero images
  if (heroNavLinks.length) {
    heroNavLinks.forEach((link) => {
      const imgUrl = link.dataset.image;
      if (imgUrl) {
        const preload = new Image();
        preload.src = imgUrl;
      }
    });

    heroNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        updateHeroImage(link);
      });
    });
  }

  // 8.4 Menú móvil - ¡CORREGIDO!
  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener("click", () => toggleMenu());

    document.addEventListener("click", (e) => {
      if (isMenuOpen && 
          !menuBtn.contains(e.target) && 
          !dropdownMenu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
  }

  // 8.5 Eventos del submenú - ¡CORREGIDO!
  if (submenuLinks.length > 0) {
    submenuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        console.log("🖱️ Clic en:", category);
        
        if (category === "toallas") {
          loadProducts(category);
        } else {
          alert(`Sección "${category}" en desarrollo`);
        }
      });
    });
  }

  // 8.6 Carrito
  if (cartBtn && cartCount) {
    updateCartCount();

    window.addEventListener("storage", (e) => {
      if (e.key === "zarahome_cart") {
        updateCartCount();
      }
    });
  }

  // 8.7 Utilidades
  if ("ontouchstart" in window) {
    document.documentElement.classList.add("touch");
  }

  console.log("✅ Aplicación iniciada correctamente");
}

// ============================================ //
// 9. ¡ARRANCA TODO!
// ============================================ //
document.addEventListener("DOMContentLoaded", init);
