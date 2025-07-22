document.addEventListener('DOMContentLoaded', function() {
    
    // --- Element Selection ---
    const imageStack = document.getElementById('image-stack');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const colorNameDisplay = document.getElementById('color-name');
    const priceDisplay = document.getElementById('product-price');

    const wishlistHeart = document.getElementById('wishlist-heart');
    const placeInCartBtn = document.getElementById('place-in-cart');
    const contactAdvisorBtn = document.querySelector('.contact-advisor');
    const cartBadge = document.getElementById('cart-badge');

    // --- Color Selection Logic ---
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const newColorName = this.dataset.colorName;
            const newPrice = this.dataset.price;

            // 切換到對應的圖片組
            if (imageGroups[newColorName]) {
                currentColorGroup = newColorName;
                
                // 重新生成圖片堆疊
                generateImageStack(currentColorGroup);

                // 更新顯示文字
                if (colorNameDisplay) colorNameDisplay.textContent = newColorName;
                if (priceDisplay) priceDisplay.textContent = newPrice;

                // 更新 Wishlist 愛心狀態
                updateWishlistHeart(currentColorGroup);

                // 更新選中樣式
                colorSwatches.forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                
                // 滾動回頂部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // --- Button Click Logic ---

    // Wishlist Heart Button
    if (wishlistHeart) {
        wishlistHeart.addEventListener('click', function() {
            // 切換當前顏色的 wishlist 狀態
            wishlistStates[currentColorGroup] = !wishlistStates[currentColorGroup];
            
            // 更新愛心顯示
            updateWishlistHeart(currentColorGroup);
            
            // 顯示對應的提示訊息
            const colorName = currentColorGroup.charAt(0).toUpperCase() + currentColorGroup.slice(1);
            if (wishlistStates[currentColorGroup]) {
                alert(`Added ${colorName} to your wishlist!`);
            } else {
                alert(`Removed ${colorName} from your wishlist.`);
            }
        });
    }

    // Place in Cart Button
    if (placeInCartBtn) {
        placeInCartBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            // 增加購物車數量
            cartItemCount++;
            
            // 更新購物車徽章
            updateCartBadge();
            
            // 獲取當前選中的顏色名稱
            const colorName = currentColorGroup.charAt(0).toUpperCase() + currentColorGroup.slice(1);
            
            // 顯示添加成功訊息
            alert(`Added ${colorName} DIFFUSER to cart! (${cartItemCount} items)`);
        });
    }

    // Contact Advisor Button
    if (contactAdvisorBtn) {
        contactAdvisorBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            alert('Contacting an Advisor...');
        });
    }


    // --- Image Stack Logic ---
    const imageGroups = {
        origin: [
            'images/diffuser-main.png',
            'images/diffuser-main1.png',
            'images/diffuser-main2.png',
            'images/diffuser-main3.png'
        ],
        aether: [
            'images/diffuser-aether.png',
            'images/diffuser-aether1.png', 
            'images/diffuser-aether2.png',
            'images/diffuser-aether3.png'
        ],
        prism: [
            'images/diffuser-prism.png',
            'images/diffuser-prism1.png',
            'images/diffuser-prism2.png', 
            'images/diffuser-prism3.png'
        ]
    };
    
    let currentColorGroup = 'origin';
    
    // Wishlist 狀態管理
    const wishlistStates = {
        origin: false,
        aether: false,
        prism: false
    };
    
    // 更新愛心圖標狀態
    function updateWishlistHeart(colorGroup) {
        if (!wishlistHeart) return;
        
        const isWishlisted = wishlistStates[colorGroup];
        if (isWishlisted) {
            wishlistHeart.classList.remove('far');
            wishlistHeart.classList.add('fas');
            wishlistHeart.style.color = '#ff6b6b';
        } else {
            wishlistHeart.classList.remove('fas');
            wishlistHeart.classList.add('far');
            wishlistHeart.style.color = '#333';
        }
    }
    
    // 購物車狀態管理
    let cartItemCount = 0;
    
    // 更新購物車徽章
    function updateCartBadge() {
        if (!cartBadge) return;
        
        cartBadge.textContent = cartItemCount;
        
        if (cartItemCount > 0) {
            cartBadge.classList.add('show');
            cartBadge.classList.remove('empty');
        } else {
            cartBadge.classList.remove('show');
            cartBadge.classList.add('empty');
        }
    }
    
    // 生成圖片堆疊
    function generateImageStack(colorGroup) {
        if (!imageStack) return;
        
        // 清空現有圖片
        imageStack.innerHTML = '';
        
        // 獲取對應顏色組的圖片
        const images = imageGroups[colorGroup];
        if (!images) return;
        
        // 為每張圖片創建img元素
        images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `ÔDÔRAI AI Diffuser ${colorGroup} ${index + 1}`;
            img.loading = 'lazy'; // 延遲載入優化性能
            imageStack.appendChild(img);
        });
    }
    

    
    // 初始化圖片堆疊
    function initializeImages() {
        generateImageStack(currentColorGroup);
        updateWishlistHeart(currentColorGroup); // 初始化愛心狀態
        updateCartBadge(); // 初始化購物車徽章
    }
    
    // 延遲初始化
    setTimeout(initializeImages, 100);



    // --- Read More/Less Logic ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const productDescription = document.querySelector('.product-description');

    if (readMoreBtn && productDescription) {
        readMoreBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (productDescription.classList.contains('collapsed')) {
                productDescription.classList.remove('collapsed');
                productDescription.classList.add('expanded');
                this.textContent = 'Read less';
            } else {
                productDescription.classList.remove('expanded');
                productDescription.classList.add('collapsed');
                this.textContent = 'Read more';
            }
        });
    }

    // --- Accordion Logic (remains the same) ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('i');

        header.addEventListener('click', () => {
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingBottom = "0px";
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.paddingBottom = "20px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

});