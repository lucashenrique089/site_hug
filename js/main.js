(function () {
  'use strict';

  /* ---------------------------------------------------------
     menu mobile
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     revelar elementos ao rolar a página
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    document.documentElement.classList.add('js-reveal');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------------------------------------------------------
     ano dinâmico no rodapé
  --------------------------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     toast de feedback
  --------------------------------------------------------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------------------------------------------------------
     newsletter (front-end apenas, sem backend)
  --------------------------------------------------------- */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = newsletterForm.querySelector('input[type="email"]');
      if (!email || !email.value) return;

      if (newsletterFeedback) {
        newsletterFeedback.textContent = 'Prontinho! Você vai receber nossas novidades em ' + email.value + '.';
      }
      newsletterForm.reset();
    });
  }

  /* ---------------------------------------------------------
     troca de imagem do produto (mesma peça, corpos diferentes)
  --------------------------------------------------------- */
  document.querySelectorAll('.product-card__swatches').forEach(function (group) {
    var card = group.closest('.product-card');
    var img = card ? card.querySelector('.product-card__img') : null;

    group.querySelectorAll('.swatch').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        if (!img) return;
        img.src = swatch.dataset.img;
        group.querySelectorAll('.swatch').forEach(function (s) {
          s.classList.remove('is-active');
        });
        swatch.classList.add('is-active');
      });
    });
  });

  /* ---------------------------------------------------------
     filtro de categorias na loja
  --------------------------------------------------------- */
  var filterChips = document.querySelectorAll('.filter-chip');
  var productCards = document.querySelectorAll('.product-card');

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) {
        c.classList.remove('is-active');
      });
      chip.classList.add('is-active');

      var filter = chip.dataset.filter;

      productCards.forEach(function (card) {
        var matches = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !matches;
      });
    });
  });

  /* ---------------------------------------------------------
     sacola de compras (contador salvo no navegador)
  --------------------------------------------------------- */
  var cartCountEl = document.getElementById('cartCount');

  function getCartCount() {
    return parseInt(localStorage.getItem('hug-cart-count') || '0', 10);
  }

  function setCartCount(value) {
    try {
      localStorage.setItem('hug-cart-count', String(value));
    } catch (err) {
      /* localStorage indisponível: segue só na memória da página */
    }
    if (cartCountEl) {
      cartCountEl.textContent = String(value);
    }
  }

  if (cartCountEl) {
    setCartCount(getCartCount());
  }

  document.querySelectorAll('.add-to-cart').forEach(function (button) {
    button.addEventListener('click', function () {
      var name = button.dataset.name || 'Produto';
      setCartCount(getCartCount() + 1);
      showToast(name + ' adicionado à sacola!');
    });
  });
})();
