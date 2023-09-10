async function fetchAndRenderProducts() {
    try {
        const mainProductContainer = document.getElementById('product-container');
        
        for (let containerIndex = 1; containerIndex <= 9; containerIndex++) {
            // Create a div for each product container
            const productContainer = document.createElement('div');
            productContainer.classList.add('slider-product-one-content-items');

            for (let productId = (containerIndex - 1) * 5 + 1; productId <= containerIndex * 5; productId++) {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`); 
                const product = await response.json();
                
                const productItem = document.createElement('div');
                productItem.classList.add('slider-product-one-content-item');
                
                productItem.innerHTML = `
                    <img src="${product.image_url}" alt="">
                    <div class="slider-product-one-content-item-text">
                        <li>${product.name}</li>
                        <li><b>${product.price} <sup>đ</sup></b></li>
                        <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
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
    productListContainer.style.display = 'block';
    
    const sliderProductOneSection = document.querySelector('.slider-product-one');
    sliderProductOneSection.style.display = 'none'; // Ẩn thẻ slider-product-one

    const listProduct = document.getElementById("list-product"); // Ẩn thẻ list-product
    listProduct.style.display = "none";
    
    productListContainer.innerHTML = ''; // Xóa nội dung cũ của productListContainer
    
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>Giá: ${product.price} đồng</p>
            <img src="${product.image_url}" alt="${product.name}" width="200 px">
            <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
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
        const listProduct = document.getElementById("list-product"); // Ẩn thẻ list-product
        listProduct.style.display = "none";
        
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

    const listProduct = document.getElementById("list-product"); // Ẩn thẻ list-product
    listProduct.style.display = "none";
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>Giá: ${product.price} đồng</p>
            <img src="${product.image_url}" alt="${product.name}" width="200 px">
            <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>
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

const sliderProductOneSection = document.querySelector('.slider-product-one');
sliderProductOneSection.style.display = 'none'; // Ẩn thẻ slider-product-one
// Xử lý thay đổi kiểu xem dưới dạng List hoặc Grid

const listView = document.getElementById('listView');
const gridView = document.getElementById('gridView');
const listProduct = document.getElementById('list-product');
const sliderProductOne = document.querySelector('.slider-product-one');

listView.addEventListener('change', () => {
    listProduct.style.display = 'block';
    sliderProductOne.style.display = 'none';
    document.getElementById("productList").style.display = "none";
    document.getElementById("searchProduct").style.display = "none";
});

gridView.addEventListener('change', () => {
    listProduct.style.display = 'none';
    sliderProductOne.style.display = 'block';
    document.getElementById("productList").style.display = "none";
    document.getElementById("searchProduct").style.display = "none";
});

// Kiểu xem list

const listProductContainer = document.getElementById('list-product');

    async function fetchAndDisplayProducts() {
        try {
            let productListHTML = '';

            for (let productId = 1; productId <= 46; productId++) {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`);
                const product = await response.json();

                const { name, image_url, price } = product;

                productListHTML += `
                    <li class="product-item">
                        <img src="${image_url}" alt="${name}">
                        <h3>${name}</h3>
                        <p> Giá: ${price} đồng</p>
                        <button class="detail-button" onclick="openProductDetails(${productId})">Chi tiết</button>
                    </li>
                `;
            }

            listProductContainer.querySelector('.product-list').innerHTML = productListHTML;
        } catch (error) {
            console.error('Error fetching and displaying products:', error);
        }
    }

fetchAndDisplayProducts();
