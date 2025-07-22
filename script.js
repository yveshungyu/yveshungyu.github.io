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
    
    // Mobile search elements
    const mobileSearchInput = document.querySelector('.mobile-search-input');
    const searchClearBtn = document.getElementById('search-clear');
    
    // Mobile image navigation
    let currentImageIndex = 0;

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
                
                // 重置圖片索引（移動端）
                if (typeof resetImageIndex === 'function') {
                    resetImageIndex();
                }
                
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
        
        // 生成移動端指示器
        generateMobileIndicators(images.length);
    }
    
    // 生成移動端指示器
    function generateMobileIndicators(imageCount) {
        const indicatorsContainer = document.getElementById('mobile-indicators');
        if (!indicatorsContainer || !isMobileDevice()) return;
        
        // 清空現有指示器
        indicatorsContainer.innerHTML = '';
        
        // 為每張圖片創建指示器
        for (let i = 0; i < imageCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            if (i === 0) dot.classList.add('active');
            
            // 點擊指示器跳轉到對應圖片
            dot.addEventListener('click', () => {
                scrollToImageIndex(i);
                updateIndicators(i);
            });
            
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // 更新指示器狀態
    function updateIndicators(activeIndex) {
        const indicators = document.querySelectorAll('.indicator-dot');
        indicators.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    

    
    // 初始化圖片堆疊
    function initializeImages() {
        generateImageStack(currentColorGroup);
        updateWishlistHeart(currentColorGroup); // 初始化愛心狀態
        updateCartBadge(); // 初始化購物車徽章
        
        // 確保移動端從第一張圖片開始
        if (isMobileDevice()) {
            setTimeout(() => {
                resetImageIndex();
            }, 200);
        }
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

    // --- Accordion Logic for Info Sections ---
    const infoItems = document.querySelectorAll('.info-item.expandable');
    
    infoItems.forEach(item => {
        const header = item.querySelector('.info-header');
        
        if (header) {
            header.addEventListener('click', function(event) {
                event.preventDefault();
                
                // 如果當前item已經展開，直接收起
                if (item.classList.contains('expanded')) {
                    item.classList.remove('expanded');
                    return;
                }
                
                // 收起所有其他已展開的item
                infoItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('expanded');
                    }
                });
                
                // 展開當前點擊的item
                item.classList.add('expanded');
            });
        }
    });

    // --- Delivery Sidebar Logic ---
    const deliveryTrigger = document.getElementById('delivery-returns-trigger');
    const deliverySidebar = document.getElementById('delivery-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    // --- Gifting Sidebar Logic ---
    const giftingTrigger = document.getElementById('gifting-trigger');
    const giftingSidebar = document.getElementById('gifting-sidebar');
    const closeGiftingSidebarBtn = document.getElementById('close-gifting-sidebar');

    // 顯示配送側邊欄
    function showDeliverySidebar() {
        hideGiftingSidebar(); // 先關閉其他側邊欄
        deliverySidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 隱藏配送側邊欄
    function hideDeliverySidebar() {
        deliverySidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 顯示禮品側邊欄
    function showGiftingSidebar() {
        hideDeliverySidebar(); // 先關閉其他側邊欄
        giftingSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 隱藏禮品側邊欄
    function hideGiftingSidebar() {
        giftingSidebar.classList.remove('active');
        if (!deliverySidebar.classList.contains('active')) {
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // 隱藏所有側邊欄
    function hideAllSidebars() {
        hideDeliverySidebar();
        hideGiftingSidebar();
    }

    // 點擊 Delivery & Returns 觸發側邊欄
    if (deliveryTrigger) {
        deliveryTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            showDeliverySidebar();
        });
    }

    // 點擊 Gifting 觸發側邊欄
    if (giftingTrigger) {
        giftingTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            showGiftingSidebar();
        });
    }

    // 點擊關閉配送側邊欄按鈕
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', function(event) {
            event.preventDefault();
            hideDeliverySidebar();
        });
    }

    // 點擊關閉禮品側邊欄按鈕
    if (closeGiftingSidebarBtn) {
        closeGiftingSidebarBtn.addEventListener('click', function(event) {
            event.preventDefault();
            hideGiftingSidebar();
        });
    }

    // 點擊遮罩關閉所有側邊欄
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            hideAllSidebars();
        });
    }

    // ESC 鍵關閉所有側邊欄
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAllSidebars();
        }
    });

    // --- Sidebar Section Expansion Logic ---
    const expandableSections = document.querySelectorAll('.expandable-section');
    
    expandableSections.forEach(section => {
        const header = section.querySelector('.section-header');
        
        if (header) {
            header.addEventListener('click', function(event) {
                event.preventDefault();
                
                // 找出當前section所屬的側邊欄
                const parentSidebar = section.closest('.delivery-sidebar, .gifting-sidebar');
                
                // 切換當前section的展開狀態
                if (section.classList.contains('expanded')) {
                    section.classList.remove('expanded');
                } else {
                    // 只收起同一個側邊欄中的其他已展開的sections
                    if (parentSidebar) {
                        const siblingExpandableSections = parentSidebar.querySelectorAll('.expandable-section');
                        siblingExpandableSections.forEach(otherSection => {
                            if (otherSection !== section) {
                                otherSection.classList.remove('expanded');
                            }
                        });
                    }
                    
                    // 展開當前點擊的section
                    section.classList.add('expanded');
                }
            });
        }
    });

    // --- Mobile Search Functionality ---
    if (mobileSearchInput && searchClearBtn) {
        // 顯示/隱藏清除按鈕
        mobileSearchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                searchClearBtn.classList.add('show');
            } else {
                searchClearBtn.classList.remove('show');
            }
        });

        // 點擊清除按鈕
        searchClearBtn.addEventListener('click', function() {
            mobileSearchInput.value = '';
            searchClearBtn.classList.remove('show');
            mobileSearchInput.focus();
        });

        // 按 Enter 鍵搜索
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    // 這裡可以添加實際的搜索邏輯
                    alert(`Searching for: "${searchTerm}"`);
                }
            }
        });
    }

    // 點擊 header 中的搜索按鈕，聚焦到移動搜索欄
    const headerSearchBtn = document.querySelector('.header-nav [class*="search"]');
    if (headerSearchBtn && mobileSearchInput) {
        headerSearchBtn.closest('.header-nav').addEventListener('click', function(e) {
            e.preventDefault();
            if (window.innerWidth <= 992) {
                mobileSearchInput.focus();
            }
        });
    }

    // --- Mobile Image Swipe Navigation ---
    function isMobileDevice() {
        return window.innerWidth <= 992;
    }

    function scrollToImageIndex(index) {
        if (!imageStack || !isMobileDevice()) return;
        
        const images = imageStack.querySelectorAll('img');
        if (images.length === 0 || index < 0 || index >= images.length) return;
        
        const container = imageStack.parentElement;
        const containerWidth = container.offsetWidth;
        const scrollLeft = index * containerWidth; // 精確計算每張圖片的位置
        
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        currentImageIndex = index;
        updateIndicators(index);
    }

    // 觸摸滑動功能
    let touchStartX = 0;
    let touchEndX = 0;
    let isScrolling = false;

    function handleTouchStart(e) {
        if (!isMobileDevice()) return;
        touchStartX = e.touches[0].clientX;
        isScrolling = false;
    }

    function handleTouchMove(e) {
        if (!isMobileDevice()) return;
        touchEndX = e.touches[0].clientX;
        
        // 檢測是否在水平滑動
        const touchDiffX = Math.abs(touchEndX - touchStartX);
        
        if (touchDiffX > 10) {
            isScrolling = true;
            // 阻止默認滾動行為，完全由我們控制
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isMobileDevice() || !isScrolling) return;
        
        const swipeThreshold = 30; // 降低滑動閾值，讓滑動更敏感
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            const currentImages = imageGroups[currentColorGroup];
            if (!currentImages) return;
            
            let newIndex = currentImageIndex;
            
            if (swipeDistance > 0 && currentImageIndex > 0) {
                // 向右滑動 - 上一張
                newIndex = currentImageIndex - 1;
            } else if (swipeDistance < 0 && currentImageIndex < currentImages.length - 1) {
                // 向左滑動 - 下一張
                newIndex = currentImageIndex + 1;
            }
            
            // 確保只滑動一張圖片
            if (newIndex !== currentImageIndex) {
                scrollToImageIndex(newIndex);
            }
        } else {
            // 如果滑動距離不夠，回彈到當前圖片
            scrollToImageIndex(currentImageIndex);
        }
        
        isScrolling = false;
    }

    // 添加觸摸事件監聽器
    if (imageStack) {
        imageStack.addEventListener('touchstart', handleTouchStart, { passive: false });
        imageStack.addEventListener('touchmove', handleTouchMove, { passive: false });
        imageStack.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // 監聽滾動事件以更新當前圖片索引
        const imageContainer = imageStack.parentElement;
        if (imageContainer) {
            let scrollTimeout;
            imageContainer.addEventListener('scroll', function() {
                if (!isMobileDevice()) return;
                
                // 使用防抖來避免頻繁觸發
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollLeft = this.scrollLeft;
                    const containerWidth = this.offsetWidth;
                    const newIndex = Math.round(scrollLeft / containerWidth);
                    const maxIndex = imageGroups[currentColorGroup] ? imageGroups[currentColorGroup].length - 1 : 0;
                    
                    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex <= maxIndex) {
                        currentImageIndex = newIndex;
                        updateIndicators(newIndex);
                    }
                }, 100);
            });
        }
    }

    // 當切換顏色時重置圖片索引
    function resetImageIndex() {
        currentImageIndex = 0;
        if (isMobileDevice()) {
            setTimeout(() => {
                // 確保滾動到第一張圖片
                const container = imageStack.parentElement;
                if (container) {
                    container.scrollLeft = 0;
                }
                updateIndicators(0);
            }, 100);
        }
    }

});