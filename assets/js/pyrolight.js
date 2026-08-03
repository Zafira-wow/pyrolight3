const toggleAdmin = document.getElementById('toggle-admin');
const modal = document.getElementById('admin-modal');
const closeModal = document.getElementById('close-modal');
const productForm = document.getElementById('product-form');
const productGrid = document.getElementById('product-grid');
const showGrid = document.getElementById('show-grid');
const galleryGrid = document.getElementById('gallery-grid');
const themeButtons = document.querySelectorAll('.theme-option');
const isMultipagePage = window.location.pathname.toLowerCase().includes('multipage.html');

function applyTheme(theme) {
  document.body.classList.remove('theme-classic', 'theme-festive', 'theme-third', 'theme-fourth');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('pyrolight-theme', theme);

  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.theme === theme);
  });
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem('pyrolight-theme');

  if (isMultipagePage) {
    return 'fourth';
  }

  if (savedTheme && savedTheme !== 'fourth') {
    return savedTheme;
  }

  return 'classic';
}

applyTheme(getInitialTheme());

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;

    if (theme === 'fourth' && button.dataset.page) {
      if (isMultipagePage) {
        applyTheme('fourth');
        return;
      }

      window.location.href = button.dataset.page;
      return;
    }

    applyTheme(theme);
  });
});

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
