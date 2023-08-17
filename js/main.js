const Action1 = document.getElementById('signUp');
const Action2 = document.getElementById('signIn');
const cur = document.getElementById('container');

Action1.addEventListener('click', () => {
    cur.classList.add('right-panel-active');
});

Action2.addEventListener('click', () => {
    cur.classList.remove('right-panel-active');
});

const registerForm = document.querySelector('.form-container.sign-up-container form');
const loginForm = document.querySelector('.form-container.sign-in-container form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('input[name="username"]').value;
    const phone = registerForm.querySelector('input[name="phone"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;

    const data = {
        username: username,
        phone: phone,
        email: email,
        password: password
    };

    fetch('http://localhost:3000/register', { // Sửa đường dẫn của fetch thành http://localhost:3000/register
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        // Xử lý thông báo đăng ký thành công hoặc lỗi
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
    });
});


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    const data = {
        email: email,
        password: password
    };

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        // Xử lý thông báo đăng nhập thành công hoặc lỗi
        window.location.href = '/user.html';
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
    });
});