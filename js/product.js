 // Hàm lấy tham số từ URL
 function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Lấy tham số productId từ URL
const productId = getParameterByName('id');
let type, index;
// Gọi API để lấy thông tin sản phẩm dựa trên productId
fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .then((data) => {
        // Hiển thị thông tin sản phẩm lên trang chi tiết
        type = data.type;
        index = data.id;
        document.getElementById('product-name').textContent = data.name;
        document.getElementById('product-image').src = data.image_url;
        document.getElementById('product-price').textContent = `Giá: ${data.price} đồng`;
        document.getElementById('product-code').textContent = `Mã sản phẩm: ${data.code}`;
        document.getElementById('product-short-description').textContent = `Mô tả ngắn: ${data.short_description}`;
        document.getElementById('product-long-description').textContent = `Mô tả dài: ${data.long_description}`;
        document.getElementById('product-screen').textContent = `Màn hình: ${data.screen}`;
        document.getElementById('product-system').textContent = `Hệ điều hành: ${data.system}`;
        document.getElementById('product-camera').textContent = `Camera: ${data.camera}`;
        document.getElementById('product-chip').textContent = `Chip: ${data.chip}`;
        document.getElementById('product-ram').textContent = `Ram: ${data.ram}`;
        document.getElementById('product-batery').textContent = `Pin: ${data.batery}`;
        // Hiển thị trang chi tiết sản phẩm
        document.querySelector('.product-details').style.display = 'block';
        const apiURL = `http://localhost:3000/api/reproducts/${type}`;
        // Hàm để tạo phần tử HTML cho từng sản phẩm liên quan
       function createRelatedProductElement(product) {
       const div = document.createElement('div');
       div.innerHTML = `
          <h3 class="reproduct-name">${product.name}</h3>
          <img class="reproduct-image" src="${product.image_url}" alt="Product Image">
          <p class="reproduct-price">Giá: ${product.price} VNĐ</p>
          <button class="detail-button" onclick="openProductDetails(${product.id})">Chi tiết</button>`;
    return div;
    }
let i;
if(type == "Samsung") i = 0;
if(type == "Apple") i = 10;
if(type == "Xiaomi") i = 17;
// Gửi yêu cầu API đến backend để nhận các sản phẩm liên quan
fetch(apiURL)
  .then((response) => response.json())
  .then((data) => {
    // Xử lý dữ liệu nhận được từ API
    const relatedProductsContainer = document.getElementById('related-products');
    data.forEach((product) => {
      i++;
      if(i != index){
      const productElement = createRelatedProductElement(product);
      relatedProductsContainer.appendChild(productElement);
      }
    });
  })
  .catch((error) => {
    console.error('Đã xảy ra lỗi khi gửi yêu cầu tới API:', error);
  });
        
    })
    .catch((error) => {
        console.error('Error fetching product:', error);
});

function openProductDetails(productId) {
  // Chuyển hướng đến trang chi tiết sản phẩm và truyền tham số productId qua URL
  window.location.href = `product-details.html?id=${productId}`;
}

console.log(123456789)

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
  const sliderProductOneSection1 = document.querySelector('.product-container');
  sliderProductOneSection1.style.display = 'none'; 
  const sliderProductOneSection2 = document.querySelector('.re-product');         
  sliderProductOneSection2.style.display = 'none';         
  console.log(data)                  
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