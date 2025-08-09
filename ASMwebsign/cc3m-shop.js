// cc3m-shop.js
// Dùng chung cho các trang sản phẩm, ShopForm, ...

function updateBagCount() {
    const bagBtn = document.getElementById('bag-btn');
    let bag = JSON.parse(localStorage.getItem('bag_items') || '[]');
    if (bagBtn) {
        bagBtn.textContent = 'BAG ' + bag.length;
    }
}

function setupBagBtn() {
    const bagBtn = document.getElementById('bag-btn');
    if (bagBtn) {
        bagBtn.addEventListener('click', function() {
            window.location.href = 'Bag.html';
        });
    }
}

function setupLoginBtn() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'LoginForm.html';
        });
    }
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function setLoggedIn(value) {
    localStorage.setItem('isLoggedIn', value ? 'true' : 'false');
}

function setupMenuDropdown() {
    const menuLogoBtn = document.getElementById('menuLogoBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    if (!menuLogoBtn || !menuDropdown) return;
    let menuOpen = false;
    function closeMenu() {
        menuOpen = false;
        menuLogoBtn.classList.remove('active');
        menuDropdown.classList.remove('active');
        setTimeout(() => {
            menuDropdown.style.display = 'none';
        }, 300);
    }
    function openMenu() {
        menuOpen = true;
        menuLogoBtn.classList.add('active');
        menuDropdown.style.display = 'flex';
        requestAnimationFrame(() => {
            menuDropdown.classList.add('active');
        });
    }
    menuLogoBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    document.addEventListener('click', function(e) {
        if (menuOpen && !menuDropdown.contains(e.target) && !menuLogoBtn.contains(e.target)) {
            closeMenu();
        }
    });
    updateMenuDropdownLinks();
}

function updateMenuDropdownLinks() {
    const menuDropdown = document.getElementById('menuDropdown');
    if (!menuDropdown) return;
    // Xóa các link cũ
    menuDropdown.innerHTML = '';
    // Thêm các link mặc định
    menuDropdown.innerHTML += '<a href="ShopForm.html" class="menu-dropdown-link">SHOP</a>';
    menuDropdown.innerHTML += '<a href="#" class="menu-dropdown-link">LOCATIONS</a>';
    menuDropdown.innerHTML += '<a href="#" class="menu-dropdown-link">MAGAZINE</a>';
    if (isLoggedIn()) {
        menuDropdown.innerHTML += '<a href="#" class="menu-dropdown-link" id="logout-link">LOGOUT</a>';
    } else {
        menuDropdown.innerHTML += '<a href="#" class="menu-dropdown-link" id="login-link">LOGIN</a>';
    }
    // Gán lại sự kiện
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'LoginForm.html';
        });
    }
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            setLoggedIn(false);
            location.reload();
        });
    }
}

// Dùng cho trang sản phẩm (Product1-4): thêm vào giỏ hàng
function setupAddToBag(productName) {
    const sizeSelect = document.querySelector('.product-size-select');
    const addToBagBtn = document.querySelector('.add-to-bag-btn');
    // Nếu là sản phẩm 1 (Double Floral) thì cần chọn size
    if (productName === 'Double Floral' && sizeSelect && addToBagBtn) {
        sizeSelect.addEventListener('change', function() {
            addToBagBtn.disabled = !this.value;
        });
        addToBagBtn.addEventListener('click', function() {
            if (!addToBagBtn.disabled) {
                const size = sizeSelect.value;
                let bag = JSON.parse(localStorage.getItem('bag_items') || '[]');
                bag.push({ name: productName, size: size, qty: 1 });
                localStorage.setItem('bag_items', JSON.stringify(bag));
                updateBagCount();
                sizeSelect.value = '';
                addToBagBtn.disabled = true;
            }
        });
        window.addEventListener('DOMContentLoaded', updateBagCount);
    } else if (addToBagBtn) {
        // Các sản phẩm khác không cần size, nút luôn bật
        addToBagBtn.disabled = false;
        addToBagBtn.addEventListener('click', function() {
            let bag = JSON.parse(localStorage.getItem('bag_items') || '[]');
            bag.push({ name: productName, qty: 1 });
            localStorage.setItem('bag_items', JSON.stringify(bag));
            updateBagCount();
        });
        window.addEventListener('DOMContentLoaded', updateBagCount);
    }
}

// Dùng cho mọi trang: gọi các hàm setup chung
function cc3mInit() {
    setupLoginBtn();
    setupBagBtn();
    setupMenuDropdown();
    updateBagCount();
    updateLoginBar();
}

// Ẩn/hiện nút LOGIN trên thanh loginbar
function updateLoginBar() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        if (isLoggedIn()) {
            loginBtn.style.display = 'none';
        } else {
            loginBtn.style.display = '';
        }
    }
}

// Khi đăng nhập thành công, gọi hàm này
function cc3mLoginSuccess() {
    setLoggedIn(true);
    updateMenuDropdownLinks();
    updateLoginBar();
}

document.addEventListener('DOMContentLoaded', cc3mInit);
