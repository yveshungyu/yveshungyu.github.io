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
                
                // 立即重置圖片索引到第一張
                currentImageIndex = 0;
                
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
                
                // 強制重置到第一張圖片（所有設備）
                resetImageIndex();
                
                // 額外確保移動端位置正確
                if (isMobileDevice()) {
                    setTimeout(() => {
                        const container = imageStack?.parentElement;
                        if (container) {
                            container.scrollLeft = 0;
                            container.scrollTo({ left: 0, behavior: 'auto' });
                            updateIndicators(0);
                        }
                    }, 100);
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
            
            // 第一張圖片加載完成後確保位置正確
            if (index === 0 && isMobileDevice()) {
                img.onload = function() {
                    const container = imageStack.parentElement;
                    if (container) {
                        setTimeout(() => {
                            container.scrollLeft = 0;
                            container.scrollTo({ left: 0, behavior: 'auto' });
                            currentImageIndex = 0;
                            updateIndicators(0);
                        }, 50);
                    }
                };
            }
            
            imageStack.appendChild(img);
        });
        
        // 生成移動端指示器
        generateMobileIndicators(images.length);
        
        // 圖片生成後立即重置位置（特別是第一張圖片）
        if (isMobileDevice()) {
            const container = imageStack.parentElement;
            if (container) {
                // 確保圖片索引重置
                currentImageIndex = 0;
                
                // 強制重置到開始位置
                setTimeout(() => {
                    // 暫時設置為auto，確保初始位置正確
                    container.style.scrollBehavior = 'auto';
                    container.scrollLeft = 0;
                    container.scrollTo({ left: 0, behavior: 'auto' });
                    
                    // 更新指示器到第一個
                    updateIndicators(0);
                    
                    // 恢復smooth滑動動畫
                    setTimeout(() => {
                        container.style.scrollBehavior = 'smooth';
                    }, 100);
                }, 10);
            }
        }
    }
    
    // 生成移動端指示器
    function generateMobileIndicators(imageCount) {
        const indicatorsContainer = document.getElementById('mobile-indicators');
        if (!indicatorsContainer) return;
        
        // 清空現有指示器
        indicatorsContainer.innerHTML = '';
        
        // 只在移動端顯示指示器
        if (isMobileDevice()) {
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
            indicatorsContainer.style.display = 'flex';
        } else {
            indicatorsContainer.style.display = 'none';
        }
    }
    
    // 更新指示器狀態
    function updateIndicators(activeIndex) {
        if (!isMobileDevice()) return; // 只在移動端更新指示器
        
        const indicators = document.querySelectorAll('.indicator-dot');
        if (indicators.length === 0) return; // 如果沒有指示器就返回
        
        indicators.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 確保當前圖片索引與指示器同步
        currentImageIndex = activeIndex;
    }
    

    
    // 初始化圖片堆疊
    function initializeImages() {
        // 確保初始索引為0
        currentImageIndex = 0;
        
        generateImageStack(currentColorGroup);
        updateWishlistHeart(currentColorGroup); // 初始化愛心狀態
        updateCartBadge(); // 初始化購物車徽章
        
        // 確保移動端從第一張圖片開始
        if (isMobileDevice()) {
            // 立即重置位置
            const container = imageStack?.parentElement;
            if (container) {
                container.scrollLeft = 0;
                container.style.scrollBehavior = 'auto';
            }
            
            // 延遲確保位置正確
            setTimeout(() => {
                resetImageIndex();
            }, 100);
            
            // 額外確保位置穩定
            setTimeout(() => {
                if (container) {
                    container.scrollLeft = 0;
                    container.scrollTo({ left: 0, behavior: 'auto' });
                    updateIndicators(0);
                }
            }, 300);
        }
    }
    
    // 立即初始化位置（防止第一張圖片顯示問題）
    const immediateInit = () => {
        const container = document.querySelector('.product-image-container');
        if (container && isMobileDevice()) {
            container.scrollLeft = 0;
            container.style.scrollBehavior = 'auto';
        }
    };
    
    // 立即執行一次
    immediateInit();
    
    // 延遲初始化
    setTimeout(() => {
        immediateInit(); // 再次確保位置正確
        initializeImages();
    }, 100);
    
    // 窗口大小調整時重新初始化
    window.addEventListener('resize', function() {
        setTimeout(() => {
            if (imageStack) {
                const currentImages = imageGroups[currentColorGroup];
                if (currentImages) {
                    generateMobileIndicators(currentImages.length);
                    resetImageIndex();
                }
            }
        }, 100);
    });



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
    const expandableItems = document.querySelectorAll('.info-item.expandable');
    expandableItems.forEach(item => {
        const header = item.querySelector('.info-header');
        const content = item.querySelector('.info-content');
        
        header.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            
            // 關閉其他手風琴項目
            expandableItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('expanded');
                    const otherContent = otherItem.querySelector('.info-content');
                    if (otherContent) {
                        otherContent.classList.remove('expanded');
                    }
                }
            });
            
            // 切換當前項目
            if (isExpanded) {
                item.classList.remove('expanded');
                content.classList.remove('expanded');
            } else {
                item.classList.add('expanded');
                content.classList.add('expanded');
            }
        });
    });

    // --- Sidebar Logic ---
    const deliveryTrigger = document.getElementById('delivery-returns-trigger');
    const giftingTrigger = document.getElementById('gifting-trigger');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const deliverySidebar = document.getElementById('delivery-sidebar');
    const giftingSidebar = document.getElementById('gifting-sidebar');
    const deliveryClose = document.getElementById('delivery-close');
    const giftingClose = document.getElementById('gifting-close');

    // 顯示 Delivery & Returns 侧边栏
    function showDeliverySidebar() {
        hideAllSidebars(); // 確保其他侧边栏關閉
        sidebarOverlay.classList.add('show');
        deliverySidebar.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }

    // 顯示 Gifting 侧边栏
    function showGiftingSidebar() {
        hideAllSidebars(); // 確保其他侧边栏關閉
        sidebarOverlay.classList.add('show');
        giftingSidebar.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }

    // 隱藏所有侧边栏
    function hideAllSidebars() {
        sidebarOverlay.classList.remove('show');
        deliverySidebar.classList.remove('show');
        giftingSidebar.classList.remove('show');
        document.body.style.overflow = 'auto'; // 恢復背景滾動
    }

    // 事件監聽器
    if (deliveryTrigger) {
        deliveryTrigger.addEventListener('click', showDeliverySidebar);
    }

    if (giftingTrigger) {
        giftingTrigger.addEventListener('click', showGiftingSidebar);
    }

    if (deliveryClose) {
        deliveryClose.addEventListener('click', hideAllSidebars);
    }

    if (giftingClose) {
        giftingClose.addEventListener('click', hideAllSidebars);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', hideAllSidebars);
    }

    // ESC 鍵關閉侧边栏
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAllSidebars();
        }
    });

    // --- Sidebar Internal Accordion Logic ---
    const sectionItems = document.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        const header = item.querySelector('.section-header');
        const details = item.querySelector('.section-details');
        
        if (header && details) {
            header.addEventListener('click', () => {
                const isExpanded = item.classList.contains('expanded');
                const parentSidebar = item.closest('.sidebar');
                
                // 關閉同一个侧边栏中的其他項目
                if (parentSidebar) {
                    const siblingItems = parentSidebar.querySelectorAll('.section-item');
                    siblingItems.forEach(siblingItem => {
                        if (siblingItem !== item) {
                            siblingItem.classList.remove('expanded');
                            const siblingDetails = siblingItem.querySelector('.section-details');
                            if (siblingDetails) {
                                siblingDetails.classList.remove('expanded');
                            }
                        }
                    });
                }
                
                // 切換當前項目
                if (isExpanded) {
                    item.classList.remove('expanded');
                    details.classList.remove('expanded');
                } else {
                    item.classList.add('expanded');
                    details.classList.add('expanded');
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
        const containerWidth = container.offsetWidth; // 使用實際容器寬度
        const scrollLeft = index * containerWidth; // 每張圖片佔據一個容器寬度
        
        // 確保容器有滑動動畫
        container.style.scrollBehavior = 'smooth';
        
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
            
            // 限制滑動距離，防止一次滑動多張圖片
            const container = imageStack.parentElement;
            const maxSwipe = container.offsetWidth * 0.3; // 最多只能滑動30%的容器寬度
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > maxSwipe) {
                touchEndX = touchStartX + (swipeDistance > 0 ? maxSwipe : -maxSwipe);
            }
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
                // 向右滑動 - 上一張（不管滑動力度多大，只移動一張）
                newIndex = currentImageIndex - 1;
            } else if (swipeDistance < 0 && currentImageIndex < currentImages.length - 1) {
                // 向左滑動 - 下一張（不管滑動力度多大，只移動一張）
                newIndex = currentImageIndex + 1;
            }
            
            // 確保只滑動一張圖片，防止跳躍式滑動
            if (newIndex !== currentImageIndex) {
                e.preventDefault(); // 防止默認滑動行為
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
        
        // 禁用原生滑動行為，完全由我們控制
        imageStack.parentElement.addEventListener('scroll', function(e) {
            if (isMobileDevice() && isScrolling) {
                // 如果正在進行自定義滑動，暫時禁用原生滾動
                const container = this;
                const currentScroll = container.scrollLeft;
                const containerWidth = container.offsetWidth;
                const targetScroll = currentImageIndex * containerWidth;
                
                // 如果滾動位置偏離目標位置太多，強制回到正確位置
                if (Math.abs(currentScroll - targetScroll) > containerWidth * 0.5) {
                    container.scrollLeft = targetScroll;
                }
            }
        });
        
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
                    const containerWidth = this.offsetWidth; // 使用實際容器寬度
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
            const container = imageStack?.parentElement;
            if (container) {
                // 立即重置位置
                container.style.scrollBehavior = 'auto';
                container.scrollLeft = 0;
                container.scrollTo({ left: 0, behavior: 'auto' });
                
                // 更新指示器
                updateIndicators(0);
                
                // 延時恢復smooth滾動
                setTimeout(() => {
                    container.style.scrollBehavior = 'smooth';
                }, 50);
            }
        }
    }
    
    // 頁面完全加載後的最終檢查（確保第一張圖片正確顯示）
    window.addEventListener('load', function() {
        // 確保初始化時圖片索引為0
        currentImageIndex = 0;
        
        if (isMobileDevice()) {
            setTimeout(() => {
                const container = document.querySelector('.product-image-container');
                if (container) {
                    container.style.scrollBehavior = 'auto';
                    container.scrollLeft = 0;
                    container.scrollTo({ left: 0, behavior: 'auto' });
                    updateIndicators(0);
                    
                    // 恢復smooth滾動
                    setTimeout(() => {
                        container.style.scrollBehavior = 'smooth';
                    }, 50);
                }
            }, 100);
        }
    });

});