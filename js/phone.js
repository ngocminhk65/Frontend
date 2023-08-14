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

// Hàm để lọc sản phẩm theo thuộc tính giá và hãng sản xuất rồi hiển thị chúng 
function displayFilteredProducts(priceThreshold, selectedType) {
    const filteredProducts = dataProduct.filter(product => 
        product.price <= priceThreshold && (!selectedType || product.type === selectedType)
    );
    const productListContainer = document.getElementById('product-container');
    productListContainer.innerHTML = ''; 
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>Giá: ${product.price} đồng</p>
            <img src="${product.image_url}" alt="${product.name}" width="100">
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
A
document.getElementById('typeFilter').addEventListener('change', function(event) {
    const selectedType = event.target.value;
    const selectedPrice = parseInt(document.getElementById('priceFilter').value);
    displayFilteredProducts(selectedPrice, selectedType);
});