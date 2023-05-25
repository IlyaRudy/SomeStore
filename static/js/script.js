const navSearch = document.querySelector('#nav_search');
const navRow = document.querySelector('#nav_row');
const navLeft = document.querySelector('#nav_left');
const productThumbnail = document.querySelector('#product-image-thumbnail');
const productImage = document.querySelector('#product-main-image');
const imagePicker = document.querySelector('.img-picker');
const categoryNavName = document.querySelector('.category-nav-name');
const productBigName = document.querySelector('.product-big-name');
const brandName = document.querySelector('.brand-name');
const productLeftside = document.querySelector('.product-ls');
const productDescription = document.querySelector('.product-description');



// swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,
  speed: 800,
  slidesPerView: 2,
  spaceBetween: 20,
  // Responsive breakpoints
  breakpoints: {
    991: {
      slidesPerView: 4,
      spaceBetween: 10
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});
// rotate search
let nav_search_move = false;

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
function insertBefore(existingDiv, newDiv) {
  existingDiv.parentNode.insertBefore(newDiv, existingDiv);
}

function handleResize() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 992) {
    imagePicker.appendChild(productImage);
    imagePicker.appendChild(productThumbnail);
    insertBefore(productLeftside, categoryNavName);
    insertBefore(productLeftside, productBigName);
    insertBefore(productLeftside, brandName);
    if (!nav_search_move) {
      insertAfter(navSearch, navRow);
      nav_search_move = true;
    }
  } else {
    imagePicker.appendChild(productThumbnail);
    imagePicker.appendChild(productImage);
    insertBefore(productDescription, categoryNavName);
    insertBefore(productDescription, productBigName);
    insertBefore(productDescription, brandName);
    if (nav_search_move) {
      insertAfter(navSearch, navLeft);
      nav_search_move = false;
    }
  }
}
  
handleResize();
window.addEventListener("resize", handleResize);
// product-image clicker
$(document).ready(function() {
    
  const mainImage = $('.product-image img');
  const thumbnails = $('.thumbnails img');

  thumbnails.click(function() {
    const newImage = $(this).attr('src');

    mainImage.attr({
      src: newImage,
      alt: $(this).attr('alt')
    });

    thumbnails.removeClass('active');
    $(this).addClass('active');
  });
});

// icon-heart fill if hover
const icon_hearts = document.querySelectorAll('#icon-heart');
icon_hearts.forEach(function(icon_heart) {
  icon_heart.addEventListener('mouseenter', function() {
    this.classList.remove('bi-heart');
    this.classList.add('bi-heart-fill');
  });

  icon_heart.addEventListener('mouseleave', function() {
    this.classList.remove('bi-heart-fill');
    this.classList.add('bi-heart');
  });
});