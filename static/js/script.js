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
};

function insertBefore(existingDiv, newDiv) {
  existingDiv.parentNode.insertBefore(newDiv, existingDiv);
};

function handleResize() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 992) {
    if (productThumbnail != null ) {
    imagePicker.appendChild(productImage);
    imagePicker.appendChild(productThumbnail);
    insertBefore(productLeftside, categoryNavName);
    insertBefore(productLeftside, productBigName);
    insertBefore(productLeftside, brandName);
    };
    if (!nav_search_move) {
      insertAfter(navSearch, navRow);
      nav_search_move = true;
    };
  } else {
    if (productThumbnail != null ) {
    imagePicker.appendChild(productThumbnail);
    imagePicker.appendChild(productImage);
    insertBefore(productDescription, categoryNavName);
    insertBefore(productDescription, productBigName);
    insertBefore(productDescription, brandName);
    };
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

//Ajax pagination
function ajaxPagination() {
  $('#pagination a.page-link').each((index, el) => {
    $(el).click((e) => {
      e.preventDefault()
      let page_url = $(el).attr('href')
      $.ajax({
        headers: {
          "X-CSRFToken": '{{csrf_token}}'
        },
        url: page_url,
        type: 'GET',
        error: err => {
          console.log(err);
          console.log('плохо');
        },
        success: (data) => {
          $('.main_cards').empty()
          $('.main_cards').append ( $(data).find('.main_cards').html() )

          $('#pagination').empty()
          $('#pagination').append( $(data).find('#pagination').html() )
        }
      });
    });
  });
};

$(document).ready(function() {
  ajaxPagination();
});

$(document).ajaxStop(function() {
  ajaxPagination(); 
});

//Ajax add to cart
const ajaxAddToCart = () => {
  $(document).off("click", ".card-add").on("click", ".card-add", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url,
      method: 'POST',
      type: 'POST',
      error: err => {
        console.log(err);
      },
      success: (data) => {
        if (!$('.navbar-pc__notify').length) {
          $(`<span class="navbar-pc__notify">${data.cart_length}</span>`).appendTo('#dropdownCart');
        }
        else {
          $('.navbar-pc__notify').text(data.cart_length)
        }
        currentElement.prop("hidden", true);
        currentElement.next(".quantity").removeAttr("hidden");
        currentElement.next(".quantity").find(".product_quantity").text('1') 
      }
    });
  });
}



//Ajax add quntity to cart
const ajaxQuantityPlusAddToCart = () => {
  $(document).off("click", ".quantity__minus").on("click", ".quantity__minus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let quantityBlock = currentElement.parent(".quantity");
    let bottomDetailsBlock = quantityBlock.closest(".product-bottom-details")
    let quantity__minus = -1;
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url,
      method: 'POST',
      data: {
        'quantity': quantity__minus,
      },
      type: 'POST',
      error: err => {
        console.log(err);
      },
      success: (data) => {
        if (data.product_quantity < 1) {
          quantityBlock.prop("hidden", true);
          bottomDetailsBlock.find('.card-add').removeAttr("hidden");
        }
        else {
          productQuantity = quantityBlock.find(".product_quantity");
          productQuantity.text(`${data.product_quantity}`);
        }
        $('.navbar-pc__notify').text(data.cart_length);
      }
    });
  });
}

const ajaxQuantityMinusAddToCart = () => {
  $(document).off("click", ".quantity__plus").on("click", ".quantity__plus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let productQuantity = currentElement.parent(".quantity").find(".product_quantity");
    let quantity__plus = 1;
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url,
      method: 'POST',
      data: {
        'quantity': quantity__plus,
      },
      type: 'POST',
      error: err => {
        console.log(err);
      },
      success: (data) => {
        productQuantity.text(`${data.product_quantity}`);
        $('.navbar-pc__notify').text(data.cart_length);
      }
    });
  });
}

$(document).ready(() => {
  ajaxAddToCart();
  ajaxQuantityPlusAddToCart();
  ajaxQuantityMinusAddToCart();
});
