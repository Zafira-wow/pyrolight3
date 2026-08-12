const toggleAdmin = document.getElementById('toggle-admin');
const modal = document.getElementById('admin-modal');
const closeModal = document.getElementById('close-modal');
const productForm = document.getElementById('product-form');
const productGrid = document.getElementById('product-grid');
const showGrid = document.getElementById('show-grid');
const galleryGrid = document.getElementById('gallery-grid');
function applyTheme(theme) {
  document.body.classList.remove('theme-classic', 'theme-festive', 'theme-third', 'theme-fourth');
  document.body.classList.add(`theme-${theme}`);
  try {
    localStorage.setItem('pyrolight-theme', theme);
  } catch (e) {
    // Ignore storage errors (e.g., incognito)
  }
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('pyrolight-theme');
    if (savedTheme) {
      // Only accept known, supported themes. Map removed/legacy themes to the current default.
      const allowed = ['classic', 'festive', 'fourth'];
      if (allowed.includes(savedTheme)) return savedTheme;
      // Map legacy 'third' (removed) to 'fourth' and persist the change.
      try { localStorage.setItem('pyrolight-theme', 'fourth'); } catch (e) {}
      return 'fourth';
    }
  } catch (e) {
    // ignore
  }

  // If body already has a theme class, respect it; otherwise default to 'classic'
  if (document.body.classList.contains('theme-fourth')) return 'fourth';
  return 'classic';
}

applyTheme(getInitialTheme());

function openModal() {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModalHandler() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  productForm.reset();
}

if (toggleAdmin) {
  toggleAdmin.addEventListener('click', openModal);
}

if (closeModal) {
  closeModal.addEventListener('click', closeModalHandler);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModalHandler();
    }
  });
}

if (productForm && productGrid) {
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const tag = document.getElementById('product-tag').value.trim() || 'Nový produkt';
    const target = document.getElementById('product-target').value;
    const imageInput = document.getElementById('product-image');

    if (!name || !description || !price) {
      return;
    }

    const imageSrc = await new Promise((resolve) => {
      const file = imageInput?.files?.[0];
      if (!file) {
        resolve('images/fireworks-red.svg');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || 'images/fireworks-red.svg');
      reader.onerror = () => resolve('images/fireworks-red.svg');
      reader.readAsDataURL(file);
    });

    if (target === 'galeria' && galleryGrid) {
      const figure = document.createElement('figure');
      figure.innerHTML = `
        <img src="${imageSrc}" alt="${name}" />
        <figcaption>${description}</figcaption>
      `;
      galleryGrid.appendChild(figure);
    } else {
      const article = document.createElement('article');
      article.className = 'card';
      article.innerHTML = `
        <img src="${imageSrc}" alt="${name}" />
        <div class="card-body">
          <h3>${name}</h3>
          <p>${description}</p>
          <div class="card-meta">
            <span class="price">${price}</span>
            <span class="tag">${tag}</span>
          </div>
        </div>
      `;

      if (target === 'show' && showGrid) {
        article.classList.add('caution');
        showGrid.appendChild(article);
      } else if (productGrid) {
        productGrid.appendChild(article);
      }
    }

    closeModalHandler();
  });
}
