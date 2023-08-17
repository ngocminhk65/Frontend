async function fetchAndRenderProducts() {
    try {
        const mainProductContainer = document.getElementById('product-container');
        
        for (let containerIndex = 1; containerIndex <= 5; containerIndex++) {
            // Create a div for each product container
            const productContainer = document.createElement('div');
            productContainer.classList.add('slider-product-one-content-items');

            for (let productId = (containerIndex - 1) * 5 + 1; productId <= containerIndex * 5; productId++) {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`); 
                const product = await response.json();
                
                const productItem = document.createElement('div');
                productItem.classList.add('slider-product-one-content-item');
                
                productItem.innerHTML = `
                    <img src="${product.image_url}" alt="" class="product-image">
                    <div class="slider-product-one-content-item-text">
                        <li class = "product-name" style="font-size: 16px;">${product.name}</li>
                        <li class = "product-price"><b>${product.price} <sup>đ</sup></b></li>
                        <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
                        <button class="detail-button" onclick="addToCart(this.parentElement.parentElement)">Mua</button>
                    </div>
                `;  
                productContainer.appendChild(productItem);
            }

            // Add the product container to the main product container
            mainProductContainer.appendChild(productContainer);
        }
    } catch (error) {
        console.error('Error fetching and rendering products:', error);
    }
}

fetchAndRenderProducts();

function openProductDetails(productId) {
    // Chuyển hướng đến trang chi tiết sản phẩm và truyền tham số productId qua URL
    window.location.href = `product-details.html?id=${productId}`;
}

// convert str -> int

function convertPriceToInt(priceStr) {
    // Remove commas and dots (thousands separators)
    const priceWithoutSeparators = priceStr.replace(/[,.]/g, '');
    // Convert to integer
    return parseInt(priceWithoutSeparators);
}

// Đặt hàng

function addToCart(product) {
    // Lấy thông tin sản phẩm
    const productName = product.querySelector('.product-name').textContent;
    let price = product.querySelector('.product-price').textContent;
    const productPrice = convertPriceToInt(price);
    const productImageElement = product.querySelector('.product-image');
    const imageUrl = productImageElement.getAttribute('src');
    console.log(imageUrl)
    // Tạo hoặc lấy thông tin giỏ hàng từ localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1; // Cập nhật số lượng
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        const newItem = {
            name: productName,
            quantity: 1,
            price: productPrice,
            image: imageUrl
        };
        cartItems.push(newItem);
    }

    // Lưu thông tin giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Thông báo cho người dùng
    alert(`Sản phẩm ${productName} đã được thêm vào giỏ hàng.`);
}

// Lấy phần tử nút "Giỏ hàng" bằng ID
const cartButton = document.getElementById('cart-button');

// Xử lý sự kiện khi nút "Giỏ hàng" được nhấn
cartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

document.getElementById('home-phone').addEventListener('click', function (event) {
    // Ngăn chặn hành vi mặc định của thẻ <a> để không load lại trang
    event.preventDefault();
    window.location.href = 'user.html';});

function convertPriceToInt(priceStr) {
    // Remove commas and dots (thousands separators)
    const priceWithoutSeparators = priceStr.replace(/[,.]/g, '');
    // Convert to integer
    return parseInt(priceWithoutSeparators);
}

// Khởi tạo một mảng để lưu danh sách sản phẩm
const dataProduct = [];

// Hàm fetch API để lấy dữ liệu của sản phẩm từ phía bên sever để lưu vào mảng dataProduct
function fetchProducts() {
    fetch('http://localhost:3000/api/products/')
        .then(response => response.json())
        .then(products => {
            // Lưu danh sách sản phẩm vào mảng dataProduct
            dataProduct.length = 0; // Xóa các phần tử cũ trong mảng
            dataProduct.push(...products.map(product => ({
                name: product.name,
                price: convertPriceToInt(product.price),
                image_url: product.image_url,
                type: product.type,
                id: product.id
            })));
            console.log(dataProduct);
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Gọi hàm fetchProducts để lấy danh sách sản phẩm khi trang được tải lần đầu
fetchProducts();

function openProductDetails(productId) {
    // Chuyển hướng đến trang chi tiết sản phẩm và truyền tham số productId qua URL
    window.location.href = `product-details.html?id=${productId}`;
}

// Lọc sản phẩm theo thuộc tính

const productFilter = document.getElementById("productList");
productFilter.style.display = "none"; // Ẩn thẻ div ban đầu

// Hàm để lọc sản phẩm theo thuộc tính giá và hãng sản xuất rồi hiển thị chúng 
// Function to display filtered products based on price and type
function displayFilteredProducts(priceThreshold, selectedType) {
    const filteredProducts = dataProduct.filter(product => 
        product.price <= priceThreshold && (!selectedType || product.type === selectedType)
    );
    
    const productListContainer = document.getElementById('productList');
    productListContainer.innerHTML = '';
    productListContainer.style.display = 'block'; // Hiển thị thẻ productListContainer
    
    const sliderProductOneSection = document.querySelector('.slider-product-one');
    sliderProductOneSection.style.display = 'none'; // Ẩn thẻ slider-product-one
    
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>Giá: ${product.price} đồng</p>
            <img src="${product.image_url}" alt="${product.name}" width="200 px">
            <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
            <button class="detail-button" onclick="addToCart(this.parentElement.parentElement)">Mua</button>
        `;
        productListContainer.appendChild(productItem);
    });
}

document.getElementById('priceFilter').addEventListener('change', function(event) {
    const selectedPrice = parseInt(event.target.value);
    const selectedType = document.getElementById('typeFilter').value;
    displayFilteredProducts(selectedPrice, selectedType);
});

document.getElementById('typeFilter').addEventListener('change', function(event) {
    const selectedType = event.target.value;
    const selectedPrice = parseInt(document.getElementById('priceFilter').value);
    displayFilteredProducts(selectedPrice, selectedType);
});

// Search product

document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById("searchProduct");
    productList.style.display = "none"; // Ẩn thẻ div ban đầu
  
    document.getElementById("searchIcon").addEventListener("click", function() {
      performSearch();
    });
  
    document.getElementById("searchInput").addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        performSearch();
      }
    });
  });
  
  function performSearch() {
    const searchTerm = document.getElementById("searchInput").value;
    fetch(`http://localhost:3000/api/search?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        const productList = document.getElementById("searchProduct");
        productList.style.display = "block"; // Hiển thị thẻ div khi có dữ liệu
        const sliderProductOneSection = document.querySelector('.slider-product-one');
        sliderProductOneSection.style.display = 'none'; // Ẩn thẻ slider-product-one
        handleProducts(data);
      }); 
  }
  
  function handleProducts(products) {
    const productList = document.getElementById("searchProduct");
    productList.innerHTML = ""; // Xóa nội dung cũ
    products.forEach(product => {
      const productItem = document.createElement("div");
      productItem.innerHTML = `
        <h2>${product.name}</h2>
        <p>Giá: ${product.price} đồng</p>
        <img src="${product.image_url}" alt="${product.name}" width="200 px">
        <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
        <button class="detail-button" onclick="addToCart(this.parentElement.parentElement)">Mua</button>
      `;
      productList.appendChild(productItem);
    });
  }

  // Sort product

const sortPriceHighToLowButton = document.getElementById("sortPriceHighToLow");
const sortPriceLowToHighButton = document.getElementById("sortPriceLowToHigh");


function renderProducts(products) {
    const productListContainer = document.getElementById('productList');
    productListContainer.innerHTML = '';
    productListContainer.style.display = 'block'; // Hiển thị thẻ productListContainer
    
    const sliderProductOneSection = document.querySelector('.slider-product-one');
    sliderProductOneSection.style.display = 'none'; // Ẩn thẻ slider-product-one
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>Giá: ${product.price} đồng</p>
            <img src="${product.image_url}" alt="${product.name}" width="200 px">
            <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
            <button class="detail-button" onclick="addToCart(this.parentElement.parentElement)">Mua</button>
        `;
        productListContainer.appendChild(productItem);
    });
}

sortPriceHighToLowButton.addEventListener("click", function () {
    const sortedProducts = dataProduct.slice().sort((a, b) => b.price - a.price);
    renderProducts(sortedProducts);
});

sortPriceLowToHighButton.addEventListener("click", function () {
    const sortedProducts = dataProduct.slice().sort((a, b) => a.price - b.price);
    renderProducts(sortedProducts);
});