

function openProductDetails(productId) {
    // Chuyển hướng đến trang chi tiết sản phẩm và truyền tham số productId qua URL
    window.location.href = `product-details.html?id=${productId}`;
}
// Lắng nghe sự kiện click trên dòng chữ "Điện thoại"
document.getElementById('home-phone').addEventListener('click', function (event) {
// Ngăn chặn hành vi mặc định của thẻ <a> để không load lại trang
event.preventDefault();
window.location.href = 'page_phone.html';});

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