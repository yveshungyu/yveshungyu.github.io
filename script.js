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

    // Place in Cart Button - 优化版
    if (placeInCartBtn) {
        placeInCartBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            // 防止重复点击
            if (this.classList.contains('loading')) return;
            
            // 添加优化的涟漪效果
            addEnhancedRippleEffect(this, event);
            
            // 添加加载状态
            this.classList.add('loading');
            this.style.transform = 'scale(0.98)';
            
            // 优化的加载时间
            setTimeout(() => {
                // 移除加载状态
                this.classList.remove('loading');
                this.style.transform = '';
                
                // 增加購物車數量
                cartItemCount++;
                
                // 显示购物车飞入动画
                showCartFlyAnimation(this);
                
                // 更新購物車徽章
                setTimeout(() => {
                    updateCartBadge();
                }, 300);
                
                // 获取當前選中的顏色名稱
                const colorName = currentColorGroup.charAt(0).toUpperCase() + currentColorGroup.slice(1);
                
                // 显示优化的成功动画
                showEnhancedSuccessAnimation(this);
                
                // 显示优雅的成功通知
                setTimeout(() => {
                    showSuccessNotification(`${colorName} DIFFUSER added to cart!`, cartItemCount);
                }, 200);
                
            }, 800); // 优化为0.8秒加载时间
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

    // --- Interactive Effects Functions ---
    
    // 添加涟漪效果
    function addRippleEffect(button, event) {
        // 移除之前的涟漪
        button.classList.remove('ripple');
        
        // 强制重新计算样式
        button.offsetHeight;
        
        // 添加新的涟漪
        button.classList.add('ripple');
        
        // 清理涟漪效果
        setTimeout(() => {
            button.classList.remove('ripple');
        }, 600);
    }
    
    // 显示成功动画
    function showSuccessAnimation(button) {
        const originalText = button.innerHTML;
        
        // 显示成功图标
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = '#28a745';
        button.style.transform = 'scale(1.05)';
        
        // 1秒后恢复原状
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.transform = '';
        }, 1000);
    }

    // --- 优化的动画函数 ---
    
    // 增强的涟漪效果
    function addEnhancedRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'enhanced-ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x - 10}px;
            top: ${y - 10}px;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: enhancedRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // 购物车飞入动画
    function showCartFlyAnimation(button) {
        const cartIcon = document.querySelector('.cart-icon-wrapper');
        if (!cartIcon) return;
        
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        const flyingIcon = document.createElement('div');
        flyingIcon.innerHTML = '<i class="fas fa-shopping-bag"></i>';
        flyingIcon.style.cssText = `
            position: fixed;
            left: ${buttonRect.left + buttonRect.width / 2}px;
            top: ${buttonRect.top + buttonRect.height / 2}px;
            font-size: 20px;
            color: #4a90e2;
            z-index: 10000;
            pointer-events: none;
            animation: flyToCart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        `;
        
        document.body.appendChild(flyingIcon);
        
        // 动态设置飞行终点
        const deltaX = cartRect.left + cartRect.width / 2 - (buttonRect.left + buttonRect.width / 2);
        const deltaY = cartRect.top + cartRect.height / 2 - (buttonRect.top + buttonRect.height / 2);
        
        flyingIcon.style.setProperty('--delta-x', `${deltaX}px`);
        flyingIcon.style.setProperty('--delta-y', `${deltaY}px`);
        
        setTimeout(() => {
            if (flyingIcon && flyingIcon.parentNode) {
                flyingIcon.parentNode.removeChild(flyingIcon);
            }
            
            // 购物车图标跳动效果
            cartIcon.style.animation = 'cartBounce 0.4s ease';
            setTimeout(() => {
                cartIcon.style.animation = '';
            }, 400);
        }, 800);
    }
    
    // 增强的成功动画
    function showEnhancedSuccessAnimation(button) {
        const originalText = button.innerHTML;
        const originalColor = button.style.backgroundColor;
        
        // 第一阶段：显示check图标
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.backgroundColor = '#10b981';
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
        
        // 第二阶段：脉动效果
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // 第三阶段：显示"Added!"文字
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check" style="margin-right: 8px;"></i>Added!';
            button.style.transform = 'scale(1.02)';
        }, 300);
        
        // 第四阶段：恢复原状
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = originalColor;
            button.style.boxShadow = '';
            button.innerHTML = originalText;
        }, 1500);
    }
    
    // 优雅的成功通知
    function showSuccessNotification(message, cartCount) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            z-index: 10003;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="
                    width: 32px; 
                    height: 32px; 
                    background: rgba(255, 255, 255, 0.2); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    <i class="fas fa-check" style="font-size: 14px;"></i>
                </div>
                <div>
                    <div style="font-size: 14px; margin-bottom: 2px;">${message}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Cart: ${cartCount} item${cartCount > 1 ? 's' : ''}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 50);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3500);
        
        // 点击关闭
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        });
    }
    
    // 通用按钮交互增强
    function enhanceButtons() {
        const allButtons = document.querySelectorAll('.btn, .color-swatch, .info-header, .section-header');
        
        allButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // 添加点击反馈
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // 初始化按钮增强
    enhanceButtons();

    // --- Parallax and Scroll Effects ---
    
    // 滚动进度条
    function updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        if (!scrollProgress) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }
    
    // 视差滚动效果
    function updateParallaxElements() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1); // 不同元素不同速度
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // 滚动触发动画
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in-on-scroll');
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollTop;
            const elementVisible = (elementTop < (scrollTop + windowHeight - 100));
            
            if (elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // 防抖滚动处理
    let scrollTimeout;
    let isParallaxScrolling = false;
    
    function handleScroll() {
        if (!isParallaxScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                updateParallaxElements();
                handleScrollAnimations();
                isParallaxScrolling = false;
            });
            isParallaxScrolling = true;
        }
        
        // 清除之前的超时
        clearTimeout(scrollTimeout);
        
        // 设置新的超时
        scrollTimeout = setTimeout(() => {
            // 滚动停止后的处理
            document.body.classList.remove('scrolling');
        }, 150);
        
        // 滚动中的状态
        document.body.classList.add('scrolling');
    }
    
    // 鼠标跟随效果
    function createMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(74, 144, 226, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.1s ease;
            mix-blend-mode: multiply;
        `;
        document.body.appendChild(follower);
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            follower.style.left = `${mouseX - 10}px`;
            follower.style.top = `${mouseY - 10}px`;
        });
        
        // 鼠标悬停交互元素时放大
        const interactiveElements = document.querySelectorAll('button, .btn, .color-swatch, .info-header, a');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(2)';
                follower.style.background = 'radial-gradient(circle, rgba(74, 144, 226, 0.5), transparent)';
            });
            
            element.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.background = 'radial-gradient(circle, rgba(74, 144, 226, 0.3), transparent)';
            });
        });
    }
    
    // 页面加载完成后的初始化
    function initParallaxEffects() {
        // 添加滚动监听器
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 初始化鼠标跟随效果（仅桌面端）
        if (window.innerWidth > 992) {
            createMouseFollower();
        }
        
        // 初始化动画元素
        const infoSections = document.querySelectorAll('.info-sections .info-item');
        infoSections.forEach(item => {
            item.classList.add('fade-in-on-scroll');
        });
        
        // 初始调用以设置初始状态
        updateScrollProgress();
        updateParallaxElements();
        handleScrollAnimations();
    }
    
    // 当页面完全加载后初始化视差效果
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallaxEffects);
    } else {
        initParallaxEffects();
    }

    // --- Particle System ---
    
    let particleCount = 0;
    let maxParticles = 50;
    
    function createParticle() {
        if (particleCount >= maxParticles) return;
        
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机粒子类型
        const types = ['', 'medium', 'large'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        if (randomType) particle.classList.add(randomType);
        
        // 随机位置和动画属性
        const startX = Math.random() * window.innerWidth;
        const randomX = (Math.random() - 0.5) * 200; // -100px to 100px
        const duration = 8 + Math.random() * 12; // 8-20秒
        
        particle.style.left = `${startX}px`;
        particle.style.setProperty('--random-x', `${randomX}px`);
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
        particleCount++;
        
        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
                particleCount--;
            }
        }, duration * 1000);
    }
    
    function startParticleSystem() {
        // 初始创建一些粒子
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createParticle(), i * 200);
        }
        
        // 持续创建新粒子
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% 几率创建新粒子
                createParticle();
            }
        }, 1000);
    }
    
    // 鼠标交互粒子效果
    function createInteractionParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'interaction-particle';
        particle.style.left = `${x - 3}px`;
        particle.style.top = `${y - 3}px`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
    
    // 点击波纹效果
    function createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${x - 100}px`;
        ripple.style.top = `${y - 100}px`;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // 增强鼠标交互
    function enhanceMouseInteractions() {
        let lastParticleTime = 0;
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            // 节流：每100ms最多创建一个交互粒子
            if (now - lastParticleTime > 100) {
                // 随机创建交互粒子
                if (Math.random() < 0.3) {
                    createInteractionParticle(e.clientX, e.clientY);
                    lastParticleTime = now;
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            createClickRipple(e.clientX, e.clientY);
            
            // 创建多个爆发粒子
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 40;
                    const offsetY = (Math.random() - 0.5) * 40;
                    createInteractionParticle(
                        e.clientX + offsetX, 
                        e.clientY + offsetY
                    );
                }, i * 50);
            }
        });
    }
    
    // 性能优化：根据设备性能调整粒子数量
    function adjustParticlePerformance() {
        const isMobile = window.innerWidth <= 992;
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (isMobile || isLowEnd) {
            // 移动设备或低端设备减少粒子数量
            maxParticles = 20;
        }
    }
    
    // 初始化粒子系统
    function initParticleSystem() {
        adjustParticlePerformance();
        
        // 延迟启动粒子系统，确保页面完全加载
        setTimeout(() => {
            startParticleSystem();
            enhanceMouseInteractions();
        }, 1000);
    }
    
    // 启动粒子系统
    initParticleSystem();

    // --- Real-time User Feedback System ---
    
    // 高级鼠标跟随效果
    function createAdvancedMouseFollower() {
        const primaryFollower = document.createElement('div');
        const secondaryFollower = document.createElement('div');
        
        primaryFollower.className = 'mouse-follower-primary';
        secondaryFollower.className = 'mouse-follower-secondary';
        
        const followerStyles = {
            primary: `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #4a90e2;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
                mix-blend-mode: difference;
            `,
            secondary: `
                position: fixed;
                width: 30px;
                height: 30px;
                border: 2px solid rgba(74, 144, 226, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.3s ease;
                background: transparent;
            `
        };
        
        primaryFollower.style.cssText = followerStyles.primary;
        secondaryFollower.style.cssText = followerStyles.secondary;
        
        document.body.appendChild(primaryFollower);
        document.body.appendChild(secondaryFollower);
        
        let mouseX = 0, mouseY = 0;
        let secondaryX = 0, secondaryY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            primaryFollower.style.left = `${mouseX - 4}px`;
            primaryFollower.style.top = `${mouseY - 4}px`;
        });
        
        // 延迟跟随效果
        function updateSecondaryFollower() {
            secondaryX += (mouseX - secondaryX) * 0.1;
            secondaryY += (mouseY - secondaryY) * 0.1;
            
            secondaryFollower.style.left = `${secondaryX - 15}px`;
            secondaryFollower.style.top = `${secondaryY - 15}px`;
            
            requestAnimationFrame(updateSecondaryFollower);
        }
        updateSecondaryFollower();
        
        // 交互状态变化
        const interactiveElements = document.querySelectorAll('button, .btn, .color-swatch, .info-header, a, .cart-icon-wrapper');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                primaryFollower.style.transform = 'scale(2)';
                primaryFollower.style.background = '#ff6b6b';
                secondaryFollower.style.transform = 'scale(1.5)';
                secondaryFollower.style.borderColor = 'rgba(255, 107, 107, 0.8)';
            });
            
            element.addEventListener('mouseleave', () => {
                primaryFollower.style.transform = 'scale(1)';
                primaryFollower.style.background = '#4a90e2';
                secondaryFollower.style.transform = 'scale(1)';
                secondaryFollower.style.borderColor = 'rgba(74, 144, 226, 0.3)';
            });
        });
    }
    
    // 实时状态指示器
    function createStatusIndicator() {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-indicator';
        statusContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(statusContainer);
        
        let statusTimeout;
        
        function showStatus(message, duration = 2000) {
            statusContainer.textContent = message;
            statusContainer.style.opacity = '1';
            statusContainer.style.transform = 'translateY(0)';
            
            clearTimeout(statusTimeout);
            statusTimeout = setTimeout(() => {
                statusContainer.style.opacity = '0';
                statusContainer.style.transform = 'translateY(20px)';
            }, duration);
        }
        
        // 监听各种用户行为
        document.addEventListener('click', () => {
            showStatus('✨ Click detected');
        });
        
        // 监听颜色变化
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const colorName = swatch.dataset.colorName;
                showStatus(`🎨 Switched to ${colorName}`, 3000);
            });
        });
        
        // 监听购物车更新
        const cartBtn = document.getElementById('place-in-cart');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                setTimeout(() => {
                    showStatus('🛒 Added to cart successfully!', 3000);
                }, 1500);
            });
        }
        
        return { showStatus };
    }
    
    // 动态提示系统
    function createDynamicTooltips() {
        const tooltip = document.createElement('div');
        tooltip.className = 'dynamic-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            z-index: 10000;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
            max-width: 200px;
            text-align: center;
        `;
        
        document.body.appendChild(tooltip);
        
        const tooltipMessages = {
            '.color-swatch': 'Click to change diffuser color',
            '.btn-primary': 'Add this diffuser to your cart',
            '.fa-heart': 'Add to wishlist',
            '.info-header': 'Click to view details',
            '.cart-icon-wrapper': 'View your cart items',
            '.mobile-search-input': 'Search for products',
        };
        
        Object.keys(tooltipMessages).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('mouseenter', (e) => {
                    const rect = element.getBoundingClientRect();
                    tooltip.textContent = tooltipMessages[selector];
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.top - 40}px`;
                    tooltip.style.transform = 'translateX(-50%) translateY(0)';
                    tooltip.style.opacity = '1';
                });
                
                element.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateX(-50%) translateY(10px)';
                });
            });
        });
    }
    
    // 键盘交互增强
    function enhanceKeyboardInteractions() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    // 关闭所有弹出元素
                    hideAllSidebars();
                    break;
                case 'Tab':
                    // 增强Tab导航视觉反馈
                    e.target.style.outline = '2px solid #4a90e2';
                    setTimeout(() => {
                        if (e.target.style) e.target.style.outline = '';
                    }, 2000);
                    break;
                case 'Enter':
                    if (e.target.classList.contains('color-swatch')) {
                        e.target.click();
                    }
                    break;
            }
        });
    }
    
    // 初始化用户反馈系统
    function initUserFeedbackSystem() {
        if (window.innerWidth > 992) {
            createAdvancedMouseFollower();
        }
        
        const statusIndicator = createStatusIndicator();
        createDynamicTooltips();
        enhanceKeyboardInteractions();
        
        // 页面加载完成提示
        setTimeout(() => {
            statusIndicator.showStatus('🎉 Page loaded successfully!', 3000);
        }, 2000);
    }
    
    // 启动用户反馈系统
    initUserFeedbackSystem();

    // --- Smart Interactive System & User Behavior Tracking ---
    
    class UserBehaviorTracker {
        constructor() {
            this.actions = [];
            this.preferences = {
                favoriteColors: {},
                timeSpent: 0,
                interactions: 0,
                mostViewedSections: {}
            };
            this.sessionStart = Date.now();
            this.init();
        }
        
        init() {
            this.startTimeTracking();
            this.trackColorPreferences();
            this.trackSectionViews();
            this.trackInteractions();
            this.generateRecommendations();
        }
        
        logAction(action, data = {}) {
            this.actions.push({
                action,
                data,
                timestamp: Date.now(),
                timeFromStart: Date.now() - this.sessionStart
            });
            this.preferences.interactions++;
            this.updateRecommendations();
        }
        
        startTimeTracking() {
            let pageVisible = true;
            
            document.addEventListener('visibilitychange', () => {
                pageVisible = !document.hidden;
            });
            
            setInterval(() => {
                if (pageVisible) {
                    this.preferences.timeSpent += 1000; // 1 second
                }
            }, 1000);
        }
        
        trackColorPreferences() {
            const colorSwatches = document.querySelectorAll('.color-swatch');
            colorSwatches.forEach(swatch => {
                swatch.addEventListener('click', () => {
                    const colorName = swatch.dataset.colorName;
                    this.preferences.favoriteColors[colorName] = 
                        (this.preferences.favoriteColors[colorName] || 0) + 1;
                    
                    this.logAction('color_selection', { color: colorName });
                });
                
                swatch.addEventListener('mouseenter', () => {
                    const colorName = swatch.dataset.colorName;
                    this.logAction('color_hover', { color: colorName });
                });
            });
        }
        
        trackSectionViews() {
            const sections = document.querySelectorAll('.info-item, .product-description, .action-buttons');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionName = entry.target.textContent.split(' ')[0] || 'unknown';
                        this.preferences.mostViewedSections[sectionName] = 
                            (this.preferences.mostViewedSections[sectionName] || 0) + 1;
                        
                        this.logAction('section_view', { section: sectionName });
                    }
                });
            }, { threshold: 0.5 });
            
            sections.forEach(section => observer.observe(section));
        }
        
        trackInteractions() {
            // 追踪购物车交互
            const cartBtn = document.getElementById('place-in-cart');
            if (cartBtn) {
                cartBtn.addEventListener('click', () => {
                    this.logAction('add_to_cart', { 
                        color: currentColorGroup,
                        price: document.getElementById('product-price')?.textContent 
                    });
                });
            }
            
            // 追踪愿望清单交互
            const wishlistBtn = document.getElementById('wishlist-heart');
            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', () => {
                    this.logAction('wishlist_toggle', { color: currentColorGroup });
                });
            }
            
            // 追踪信息部分展开
            const infoHeaders = document.querySelectorAll('.info-header');
            infoHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    this.logAction('info_expand', { 
                        section: header.querySelector('span')?.textContent 
                    });
                });
            });
        }
        
        generateRecommendations() {
            setTimeout(() => {
                this.showPersonalizedRecommendations();
            }, 30000); // 30秒后开始显示推荐
        }
        
        updateRecommendations() {
            // 基于用户行为动态更新推荐
            // SUPER USER 弹窗已移除
        }
        
        showPersonalizedRecommendations() {
            const recommendationPanel = this.createRecommendationPanel();
            
            // 分析用户偏好
            const mostViewedColor = Object.keys(this.preferences.favoriteColors)
                .reduce((a, b) => 
                    this.preferences.favoriteColors[a] > this.preferences.favoriteColors[b] ? a : b, 
                    'origin'
                );
            
            const recommendations = this.getSmartRecommendations(mostViewedColor);
            this.displayRecommendations(recommendationPanel, recommendations);
        }
        
        createRecommendationPanel() {
            const panel = document.createElement('div');
            panel.className = 'smart-recommendation-panel';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 280px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                font-family: 'Inter', sans-serif;
                border: 1px solid rgba(255, 255, 255, 0.3);
                opacity: 0;
                transform: translateY(-50%) translateX(300px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            document.body.appendChild(panel);
            
            // 显示动画
            setTimeout(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(-50%) translateX(0)';
            }, 100);
            
            // 自动隐藏
            setTimeout(() => {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(-50%) translateX(300px)';
                setTimeout(() => panel.remove(), 500);
            }, 10000);
            
            return panel;
        }
        
        getSmartRecommendations(preferredColor) {
            const recommendations = [];
            
            // 基于颜色偏好的推荐
            if (this.preferences.favoriteColors[preferredColor] > 2) {
                recommendations.push({
                    type: 'color_match',
                    title: `Perfect for ${preferredColor} lovers!`,
                    description: `Based on your interest in ${preferredColor}, you might love our complementary scent collection.`,
                    action: 'View Collection',
                    icon: '🎨'
                });
            }
            
            // 基于浏览时间的推荐
            if (this.preferences.timeSpent > 60000) { // 1分钟
                recommendations.push({
                    type: 'engagement',
                    title: 'Exclusive Offer!',
                    description: 'You\'ve been exploring for a while. Enjoy 10% off your first purchase!',
                    action: 'Get Discount',
                    icon: '💝'
                });
            }
            
            // 基于交互次数的推荐
            if (this.preferences.interactions > 15) {
                recommendations.push({
                    type: 'personalization',
                    title: 'Custom Scent Profile',
                    description: 'Create a personalized aromatherapy experience based on your preferences.',
                    action: 'Start Quiz',
                    icon: '🌟'
                });
            }
            
            return recommendations.slice(0, 2); // 最多显示2个推荐
        }
        
        displayRecommendations(panel, recommendations) {
            if (recommendations.length === 0) return;
            
            const html = `
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 20px; margin-right: 10px;">🤖</span>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">Smart Recommendations</h3>
                </div>
                ${recommendations.map(rec => `
                    <div style="background: rgba(74, 144, 226, 0.1); border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 3px solid #4a90e2;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 18px; margin-right: 8px;">${rec.icon}</span>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #333;">${rec.title}</h4>
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; line-height: 1.4;">${rec.description}</p>
                        <button style="
                            background: #4a90e2; 
                            color: white; 
                            border: none; 
                            padding: 6px 12px; 
                            border-radius: 15px; 
                            font-size: 11px; 
                            cursor: pointer;
                            font-weight: 500;
                            transition: background 0.3s ease;
                        " onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4a90e2'">
                            ${rec.action}
                        </button>
                    </div>
                `).join('')}
                <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #999;">
                    Powered by AI · Based on your browsing behavior
                </div>
            `;
            
            panel.innerHTML = html;
        }
        
        // showEngagementReward 函数已移除
        
        getAnalytics() {
            return {
                sessionDuration: Date.now() - this.sessionStart,
                totalActions: this.actions.length,
                preferences: this.preferences,
                actionsHistory: this.actions
            };
        }
    }
    
    // 初始化智能行为追踪系统
    const behaviorTracker = new UserBehaviorTracker();
    
    // 暴露分析数据到控制台（开发用）
    window.getBehaviorAnalytics = () => {
        console.log('🤖 User Behavior Analytics:', behaviorTracker.getAnalytics());
        return behaviorTracker.getAnalytics();
    };
    
    // 页面离开时保存数据
    window.addEventListener('beforeunload', () => {
        const analytics = behaviorTracker.getAnalytics();
        localStorage.setItem('odorai_user_behavior', JSON.stringify(analytics));
    });

});