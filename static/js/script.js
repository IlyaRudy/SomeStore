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



// swiper another product on product page
const swiperProducts = new Swiper('.swiper', {
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
  
const swiperImage = new Swiper('#swiperImages', {

  loop: true,
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

// swiper another product on product page


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
let handleMouseEvents = () => {
  let icon_hearts = document.querySelectorAll('#icon-heart');
  icon_hearts.forEach(icon_heart => {
    icon_heart.addEventListener('mouseenter', () => {
      icon_heart.classList.remove('bi-heart');
      icon_heart.classList.add('bi-heart-fill');
    });

    icon_heart.addEventListener('mouseleave', () => {
      icon_heart.classList.remove('bi-heart-fill');
      icon_heart.classList.add('bi-heart');
    });
  });
};
handleMouseEvents();

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
  handleMouseEvents();
});

$(document).ajaxStop(function() {
  ajaxPagination();
  handleMouseEvents(); 
});

//Ajax add to cart on OTHER PAGES
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
        // Change cart notify on icon
        if (!$('.navbar-pc__notify').length) {
          $(`<span class="navbar-pc__notify">${data.cart_length}</span>`).appendTo('#dropdownCart');
          $(`<span class="navbar-pc__notify">${data.cart_length}</span>`).appendTo('#cartNavIconMob');

        }
        else {
          $('.navbar-pc__notify').text(data.cart_length);
        }
        let quantityBlock = currentElement.next(".quantity");
        

        currentElement.prop("hidden", true);
        quantityBlock.removeAttr("hidden");
        quantityBlock.find(".product_quantity").text('1')

        if (currentElement.closest('.product-card').length > 0) {
          // Change the quick view
          let quickViewProductBottomDetails = currentElement.closest('.product-card').next().find('.product-bottom-details');
          let quickViewQuantityBlock = quickViewProductBottomDetails.find(".quantity");

          quickViewProductBottomDetails.find(".card-add").prop("hidden", true);
          quickViewQuantityBlock.removeAttr("hidden");
          quickViewQuantityBlock.find(".product_quantity").text('1'); 
        } else {
          // Change the product card
          let productBottomDetails = currentElement.closest('.modal').prev('.product-card').find('.product-bottom-details');
          let quantityBlock = productBottomDetails.find(".quantity");

          productBottomDetails.find(".card-add").prop("hidden", true);
          quantityBlock.removeAttr("hidden");
          quantityBlock.find(".product_quantity").text('1'); 
        }
        
      }
    });
  });
}



//Ajax add quntity to cart on OTHER PAGES
const ajaxQuantityMinusAddToCart = () => {
  $(document).off("click", ".quantity__minus").on("click", ".quantity__minus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let quantityBlock = currentElement.parent(".quantity");
    let bottomDetailsBlock = quantityBlock.closest(".product-bottom-details");
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

          if (currentElement.closest('.product-card').length > 0) {
            // Change the quick view
            let quickViewProductBottomDetails = currentElement.closest('.product-card').next().find('.product-bottom-details');
  
            quickViewProductBottomDetails.find(".quantity").prop("hidden", true);
            quickViewProductBottomDetails.find(".card-add").removeAttr("hidden");
          } else {
            // Change the product card
            let productBottomDetails = currentElement.closest('.modal').prev().find('.product-bottom-details');

            productBottomDetails.find(".quantity").prop("hidden", true);
            productBottomDetails.find(".card-add").removeAttr("hidden");
          }
          
          
        }
        else {
          let productQuantity = quantityBlock.find(".product_quantity");

          productQuantity.text(`${data.product_quantity}`);

          if (currentElement.closest('.product-card').length > 0) {
            // Change the quick view
            let quickViewProductBottomDetails = currentElement.closest('.product-card').next().find('.product-bottom-details');
  
            quickViewProductBottomDetails.find('.product_quantity').text(`${data.product_quantity}`);
          } else {
            // Change the product card
            let productBottomDetails = currentElement.closest('.modal').prev().find('.product-bottom-details');

            productBottomDetails.find('.product_quantity').text(`${data.product_quantity}`);
          }
          
          
        }
        if (data.cart_length < 1) {
          $('.navbar-pc__notify').remove();
        }
        else {
          $('.navbar-pc__notify').text(data.cart_length);
        }
      }
    });
  });
}

const ajaxQuantityPlusAddToCart = () => {
  $(document).off("click", ".quantity__plus").on("click", ".quantity__plus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let productQuantity = currentElement.parent(".quantity").find(".product_quantity");
    let quickViewProductBottomDetails = currentElement.closest('.product-card').next().find('.product-bottom-details');
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

        if (currentElement.closest('.product-card').length > 0) {
          // Change the quick view
          let quickViewProductBottomDetails = currentElement.closest('.product-card').next().find('.product-bottom-details');

          quickViewProductBottomDetails.find('.product_quantity').text(`${data.product_quantity}`);
        } else {
          // Change the product card
          let productBottomDetails = currentElement.closest('.modal').prev().find('.product-bottom-details');

          productBottomDetails.find('.product_quantity').text(`${data.product_quantity}`);
        }
        
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

// Ajax delete product on CART PAGE

const deleteFromCart = () => {
  $(document).off("click", ".delete_product_button").on("click", ".delete_product_button", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.attr('href');

    let totalPriceCartBlock = $('.total_price_cart');
    let totalPriceCart = totalPriceCartBlock.data("cart-total-price");

    let totalPriceItemBlock = currentElement.closest(".product-card-at-cart").find(".total_price_item");
    let totalPriceItem = totalPriceItemBlock.data("item-total-price")
    console.log("Total-price", totalPriceItem)

    // update total cart price
    let oldPriceTotalCart = parseFloat(totalPriceCart);
    let newPriceTotalCart = parseFloat(totalPriceCart) - parseFloat(totalPriceItem);
    console.log(oldPriceTotalCart, newPriceTotalCart)
    updatePrice(totalPriceCartBlock, "cart-total-price", parseFloat(oldPriceTotalCart), parseFloat(newPriceTotalCart)); 
    if (totalPriceCartBlock.data("cart-total-price") < 0.01) {
      $("#cart-main-row").prop("hidden", true);
      $("#cart-main").find(".empty-cart").removeAttr("hidden");
    };
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url,
      method: "DELETE",
      type: "DELETE",
      error: err => {
        console.log(err);
      },
      success: (data) => {
        currentElement.closest('.product-card-at-cart').remove();
        if (data.cart_length < 1) {
          $('.navbar-pc__notify').remove();
        }
        else {
          $('.navbar-pc__notify').text(data.cart_length);
        }
      }
    });
  });
}

const updateMinusButtonCart = () => {
  let cartQuantityMinus = $(".cart_quantity__minus");
  cartQuantityMinus.each(function() {
    let currentElement = $(this);
    let cartProductQuantityBlock = currentElement.parent(".cart_product_quantity");
    let productQuantity = cartProductQuantityBlock.find(".product_quantity");
    if (productQuantity.text().trim() == "1") {
      currentElement.prop("disabled", true);
    }
    else {
      currentElement.removeAttr("disabled");
    }
  });
};

const updatePrice = (element, data, oldPrice, newPrice) => {
  let duration = 800; // Продолжительность анимации в миллисекундах
  let interval = 20; // Интервал обновления цены в миллисекундах
  let steps = duration / interval; // Количество шагов анимации

  let direction = (newPrice - oldPrice) >= 0 ? 1 : -1; // Направление изменения цены

  let step = Math.abs(newPrice - oldPrice) / steps * direction; // Величина изменения цены на каждом шаге

  let currentPrice = oldPrice; // Текущая цена

  let priceElement = element;

  // Запуск анимации
  let timer = setInterval(function() {
    currentPrice += step; // Обновление текущей цены

    // Округление до двух знаков после запятой
    let roundedPrice = currentPrice.toFixed(2);

    // Отображение текущей цены
    priceElement.text(roundedPrice + ' zł');

    // Остановка анимации, когда достигнута новая цена
    if ((direction === 1 && currentPrice >= newPrice) || (direction === -1 && currentPrice <= newPrice)) {
      clearInterval(timer);
      priceElement.text(newPrice.toFixed(2) + ' zł');
    }
  }, interval);
  element.data(data, newPrice.toFixed(2)); 
}

// Ajax minus quntity or delete product on CART PAGE
const quantityMinusCart = () => {
  $(document).off("click", ".cart_quantity__minus").on("click", ".cart_quantity__minus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let cartProductQuantityBlock = currentElement.parent(".cart_product_quantity");
    let productCardAtCart = cartProductQuantityBlock.parent().parent(".product-card-at-cart");
    let totalPriceCartBlock = $('.total_price_cart')
    let totalPriceCart = totalPriceCartBlock.data("cart-total-price")

    let totalPriceItemBlock = productCardAtCart.find(".total_price_item");
    let totalPriceItem = totalPriceItemBlock.data("item-total-price")

    let priceItemBlock = productCardAtCart.find(".item_price");
    let itemPrice = priceItemBlock.data("item-price");

    let productQuantity = cartProductQuantityBlock.find(".product_quantity");

    // update total product price
    let oldPriceTotalItem = parseFloat(totalPriceItem);
    let newPriceTotalItem = parseFloat(totalPriceItem) - parseFloat(itemPrice);
    updatePrice(totalPriceItemBlock, "item-total-price", parseFloat(oldPriceTotalItem), parseFloat(newPriceTotalItem));

    // update total cart price
    let oldPriceTotalCart = parseFloat(totalPriceCart);
    let newPriceTotalCart = parseFloat(totalPriceCart) - parseFloat(itemPrice);
    updatePrice(totalPriceCartBlock, "cart-total-price", parseFloat(oldPriceTotalCart), parseFloat(newPriceTotalCart));

    if (totalPriceCartBlock.data("cart-total-price") < 0.01) {
      $("#cart-main-row").prop("hidden", true);
      $("#cart-main").find(".empty-cart").removeAttr("hidden");
    }
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
        productQuantity.text(`${data.product_quantity}`);
        updateMinusButtonCart();

        

        if (data.cart_length < 1) {
          $('.navbar-pc__notify').remove();
        }
        else {
          $('.navbar-pc__notify').text(data.cart_length);
        }
      }
    });
    
  });
}

// Ajax plus quntity or delete product on CART PAGE
const quantityPlusCart = () => {
  $(document).off("click", ".cart_quantity__plus").on("click", ".cart_quantity__plus", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.data("url");
    let totalPriceCartBlock = $('.total_price_cart')
    let totalPriceCart = totalPriceCartBlock.data("cart-total-price")

    let cartProductQuantityBlock = currentElement.parent(".cart_product_quantity");
    let productCardAtCart = cartProductQuantityBlock.parent().parent(".product-card-at-cart");

    let totalPriceItemBlock = productCardAtCart.find(".total_price_item")
    let totalPriceItem = totalPriceItemBlock.data("item-total-price")

    let priceItemBlock = productCardAtCart.find(".item_price")
    let itemPrice = priceItemBlock.data("item-price");

    let productQuantity = cartProductQuantityBlock.find(".product_quantity");

    // update total product price
    let oldPriceTotalItem = parseFloat(totalPriceItem);
    let newPriceTotalItem = parseFloat(totalPriceItem) + parseFloat(itemPrice);
    updatePrice(totalPriceItemBlock, "item-total-price", parseFloat(oldPriceTotalItem), parseFloat(newPriceTotalItem)); 

    // update total cart price
    let oldPriceTotalCart = parseFloat(totalPriceCart);
    let newPriceTotalCart = parseFloat(totalPriceCart) + parseFloat(itemPrice);
    updatePrice(totalPriceCartBlock, "cart-total-price", parseFloat(oldPriceTotalCart), parseFloat(newPriceTotalCart)); 
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

        

        updateMinusButtonCart();
        $('.navbar-pc__notify').text(data.cart_length);
      }
    });
  });
}

$(document).ready(() => {
  deleteFromCart();
  updateMinusButtonCart();
  quantityMinusCart();
  quantityPlusCart();
});

//Ajax add to favorite on OTHER PAGES
const addToFavorite = () => {
  $(document).off("click", ".a-icon-heart").on("click", ".a-icon-heart", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.attr('href');
    let alreadyAdd = currentElement.data('already-add');
    let iconHeart = '';
    let productAddToFavorite = ''
    let productAddToFavoriteQuickView = '';
    let iconHeartQuickView = '';
    let place = currentElement.data('place');

    if (place === 'card') {
      productAddToFavorite = currentElement.find('.product-add-to-favorite');
      iconHeart = currentElement.find('#icon-heart');
      let modal = currentElement.closest('.product-card').next('.modal');
      let rsHeart = modal.find('.rs-heart');
      productAddToFavoriteQuickView = rsHeart.find('.product-add-to-favorite-quick-view');
      iconHeartQuickView = rsHeart.find('#icon-heart');
      console.log('IF')
    }
    else {
      productAddToFavoriteQuickView = currentElement.find('.product-add-to-favorite-quick-view');
      iconHeartQuickView = productAddToFavoriteQuickView.next('#icon-heart');
      let productCard = currentElement.closest('.modal').prev('.product-card');
      iconHeart = productCard.find('#icon-heart');

      productAddToFavorite = productCard.find('.product-add-to-favorite');
      console.log('ELSE')
    }

    if (!alreadyAdd) {
      currentElement.data('already-add', true)
      productAddToFavorite.removeAttr("hidden");
      iconHeart.prop("hidden", true);

      productAddToFavoriteQuickView.removeAttr("hidden");
      iconHeartQuickView.prop("hidden", true);
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
          // Change cart notify on icon
          if (!$('.navbar-heart__notify').length) {
            $(`<span class="navbar-heart__notify">${data.favorite_length}</span>`).appendTo('#favoriteNavIcon');
            $(`<span class="navbar-heart__notify">${data.favorite_length}</span>`).appendTo('#favoriteNavIconMob');
          }
          else {
            $('.navbar-heart__notify').text(data.favorite_length);
          }
        }
      
      });
    }
    else {
      currentElement.data('already-add', false);
      productAddToFavorite.prop("hidden", true);
      iconHeart.removeAttr("hidden");

      productAddToFavoriteQuickView.prop("hidden", true);
      iconHeartQuickView.removeAttr("hidden");
      let urlDelete = currentElement.data('url-delete');
      $.ajax({
        headers: {
          "X-CSRFToken": csrfToken
        },
        url: urlDelete,
        method: "DELETE",
        type: "DELETE",
        error: err => {
          console.log(err);
        },
        success: (data) => {
          if (data.favorite_length < 1) {
            $('.navbar-heart__notify').remove();
          }
          else {
            $('.navbar-heart__notify').text(data.favorite_length);
          }
        }
      });
    }
  });
}

//Ajax delete from favorite
const deleteFromFavorite = () => {
  $(document).off("click", ".fav-delete_product_button").on("click", ".fav-delete_product_button", function(e) {
    e.preventDefault();
    let currentElement = $(this);
    let url = currentElement.attr('href');
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url,
      method: "DELETE",
      type: "DELETE",
      error: err => {
        console.log(err);
      },
      success: (data) => {
        currentElement.closest('.row').remove();
        if (data.favorite_length < 1) {
          $('.navbar-heart__notify').remove();
          $('.favorite-empty').removeAttr("hidden");
        }
        else {
          $('.navbar-heart__notify').text(data.favorite_length);
        }
      }
    });
  });
}

//Ajax add to cart from FavoritePage
const ajaxAddToCartFromFavoritePage = () => {
    $(document).off("click", ".card-add-fp").on("click", ".card-add-fp", function(e) {
      e.preventDefault();
      let currentElement = $(this);
      let url = currentElement.data("url");

      currentElement.prop("hidden", true);
      currentElement.next('a').removeAttr("hidden");
      console.log(".card-add-fp")

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
          // Change cart notify on icon
          if (!$('.navbar-pc__notify').length) {
            $(`<span class="navbar-pc__notify">${data.cart_length}</span>`).appendTo('#dropdownCart');
          }
          else {
            $('.navbar-pc__notify').text(data.cart_length);
          }
        }
      });
    });
  }


$(document).ready(() => {
  addToFavorite();
  deleteFromFavorite();
  ajaxAddToCartFromFavoritePage();
});

// typeahead suggestions
$(document).ready(() => {
  const searchInput = $('#search');

  const typeaheadInstance = searchInput.typeahead({
    minLength: 0,
    highlight: true,
  }, {
    name: 'text-input-prompts',
    source: (query, syncResults, asyncResults) => {
      $.ajax({
        url: '/search/text-input-prompts/',
        data: {
          query: query
        },
        success: function(data) {
          asyncResults(data);
        }
      });
    },
    display: 'title',
    templates: {
        suggestion: Handlebars.compile(`
        <div>{{title}}{{query}}</div>
      `)
    }
  });
});

// mob search
$(document).ready(() => {
  const mobSearchInput = $('#mob-search');

  const typeaheadInstance = mobSearchInput.typeahead({
    minLength: 0,
    highlight: true,
  }, {
    name: 'text-input-prompts',
    source: (query, syncResults, asyncResults) => {
      $.ajax({
        url: '/search/text-input-prompts/',
        data: {
          query: query
        },
        success: function(data) {
          asyncResults(data);
        }
      });
    },
    display: 'title',
    templates: {
        suggestion: Handlebars.compile(`
        <div>{{title}}{{query}}</div>
      `)
    }
  });
});


// active class to search
$(document).ready(() => {
  const form = $('.search-form');

  const isClickedInsideForm = event => {
    let targetElement = $(event.target);
    return targetElement.is(form) || targetElement.parents().is(form);
  };

  const activateForm = () => {
    form.addClass('active');
  };

  const deactivateForm = () => {
    form.removeClass('active');
  };

  $(document).click(event => {
    if (isClickedInsideForm(event)) {
      activateForm();
    } else {
      deactivateForm();
    }
  });
});

// cropper avatar image
$(document).ready(function() {
  const imageInput = $('#inputphoto');
  const previewImage = $('#previewImage');
  const cropButton = $('#updatePhoto');
  const deleteButton = $('#deleteImage');
  let cropper; 

  
  imageInput.on('change', function(e) {
    const file = e.target.files[0];
    const filename = file.name;
    imageInput.prev('label').prop("hidden", true);
    deleteButton.removeAttr("hidden");
    const url = $('#updatePhoto').data("url");

    
    const reader = new FileReader();
    
    reader.onload = function(event) {
      
      previewImage.attr('src', event.target.result);
      previewImage.removeAttr("hidden");
      
      cropper = new Cropper(previewImage[0], {
        aspectRatio: 1, 
        viewMode: 1, 
        autoCropArea: 1, 
      });
      
      
      cropButton.on('click', function() {
      
        cropper.getCroppedCanvas().toBlob(function(blob) {

          const croppedImageURL = URL.createObjectURL(blob);
          $('#avatar').attr('src', croppedImageURL);
          
          const formData = new FormData();
          formData.append('image', blob, filename);

          $.ajax({
            headers: {
              "X-CSRFToken": csrfToken
            },
            url: url, 
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
              $('#messageSuccess').fadeIn(1000);
              $('#messageSuccess').fadeOut(1000);
              console.log('Картинка успешно обновлена');
            },
            error: function(xhr, errmsg, err) {
              console.log('Ошибка при обновлении картинки');
            }
          });

          $('#modalUpdatePhoto').modal('hide');

          cropper.destroy();

          previewImage.attr('src', '');
          previewImage.prop("hidden", true);

          imageInput.val(''); 
          imageInput.prev('label').removeAttr("hidden");
          deleteButton.prop("hidden", true);
        });
      });
    };
    
    reader.readAsDataURL(file);
  });

  deleteButton.on('click', function() {

    cropper.destroy();
    cropper = null;

    previewImage.attr('src', '');
    previewImage.prop("hidden", true);

    imageInput.val(''); 
    imageInput.prev('label').removeAttr("hidden");
    deleteButton.prop("hidden", true);
  });
});

// Update profile
$(document).ready(() => {
  
  $('#updateProfile').on('click', (e) => {
    e.preventDefault();

    
    const firstname = $('#userFirstName').val();
    const lastname = $('#userLastName').val();
    const url = $('#updateProfile').data("url");
    
    $.ajax({
      headers: {
        "X-CSRFToken": csrfToken
      },
      url: url, 
      type: 'POST',
      data: {
        firstname,
        lastname
      },
      success: (response) => {
        $('#messageSuccess').fadeIn(1000);
        $('#messageSuccess').fadeOut(1000);
        console.log('Профиль успешно обновлен');
      },
      error: (xhr, errmsg, err) => {
        
        console.log('Ошибка при обновлении профиля');
      }
    });
  });
});