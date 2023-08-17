// Lấy thông tin giỏ hàng từ localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Lấy phần tử để hiển thị danh sách sản phẩm trong trang
const cartListElement = document.getElementById('cart-list');
let totalAmount = 0;
// Tạo nội dung danh sách sản phẩm đã đặt
let cartListHtml = '';
cartItems.forEach(item => {
    totalAmount += item.price * item.quantity;
    cartListHtml += `
        <li class="cart-item">
            <img src="${item.image}" alt="">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}đ</div>
                <div class="cart-item-quantity">Số lượng: ${item.quantity}</div>
            </div>
        </li>`;
});
cartListHtml += `
    <li class="total-amount">
        <div class="total-amount-text">Tổng số tiền: ${totalAmount}đ</div>
    </li>`;
cartListElement.innerHTML = cartListHtml;

const placeOrderButton = document.getElementById('place-order-button');
placeOrderButton.addEventListener('click', () => {
    alert('Bạn đã đặt hàng thành công! Chúng tôi sẽ liên lạc với bạn qua SĐT bạn đăng kí để xác nhận đơn hàng');
    localStorage.removeItem('cart');
    window.location.href = 'user.html';
});

/*
// Xóa dữ liệu có khóa là 'cart' trong localStorage
localStorage.removeItem('cart');
*/


