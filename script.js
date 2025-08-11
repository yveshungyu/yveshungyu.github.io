// --- Section 9 Background Image Cycling (Global Scope) ---
let section9CurrentImageIndex = 0;
const section9Images = [
    'images/section9.png',
    'images/section9-1.png', 
    'images/section9-2.png'
];

function updateSection9Background(imageIndex) {
    const section9 = document.getElementById('section-9');
    if (section9) {
        section9.style.backgroundImage = `url('${section9Images[imageIndex]}')`;
        console.log(`Section 9 background changed to: ${section9Images[imageIndex]}`);
        console.log(`Current image index: ${imageIndex}`);
    } else {
        console.error('Section 9 element not found!');
    }
}

// Global navigation functions for Section 9 image cycling
window.navigateRight = function() {
    console.log('Navigate Right clicked!');
    section9CurrentImageIndex = (section9CurrentImageIndex + 1) % section9Images.length;
    updateSection9Background(section9CurrentImageIndex);
    console.log(`Navigate Right: Image ${section9CurrentImageIndex + 1}/${section9Images.length}`);
};

window.navigateLeft = function() {
    console.log('Navigate Left clicked!');
    section9CurrentImageIndex = (section9CurrentImageIndex - 1 + section9Images.length) % section9Images.length;
    updateSection9Background(section9CurrentImageIndex);
    console.log(`Navigate Left: Image ${section9CurrentImageIndex + 1}/${section9Images.length}`);
};

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Detection (First Priority) ---
    function isMobileDevice() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    }
    
    // 手機端立即移除動畫元素
    if (isMobileDevice()) {
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) particlesContainer.remove();
        
        const breathingGlow = document.querySelector('.breathing-glow');
        if (breathingGlow) breathingGlow.remove();
        
        console.log('📱 Mobile device detected - animations disabled');
    }
    
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
            const newSku = this.dataset.sku;
            const newTitle = this.dataset.title;
            const newMaterial = this.dataset.material;

            // 切換到對應的圖片組
            const imageGroupKey = newColorName === 'RÜC' ? 'origin' : newColorName === 'BÜB' ? 'aether' : 'prism';
            if (imageGroups[imageGroupKey]) {
                currentColorGroup = imageGroupKey;
                
                // 立即重置圖片索引到第一張
                currentImageIndex = 0;
                
                // 重新生成圖片堆疊
                generateImageStack(currentColorGroup);

                // 更新顯示文字
                if (colorNameDisplay) colorNameDisplay.textContent = newMaterial;
                if (priceDisplay) priceDisplay.textContent = newPrice;
                
                // 更新產品編號
                const skuDisplay = document.getElementById('product-sku');
                if (skuDisplay) skuDisplay.textContent = newSku;
                
                // 更新產品標題
                const titleDisplay = document.getElementById('product-title');
                if (titleDisplay) titleDisplay.textContent = newTitle;

                // 更新 Wishlist 愛心狀態
                updateWishlistHeart(currentColorGroup);

                // 更新選中樣式
                colorSwatches.forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                
                // 統一重置到第一張圖片（避免競爭條件）
                resetImageIndex();
                
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
            
            // 添加优化的涟漪效果（僅桌面端）
            if (!isMobileDevice() && window.enableRipple) {
                addEnhancedRippleEffect(this, event);
            }
            
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
                
                // 显示购物车飞入动画（僅桌面端）
                if (!isMobileDevice()) {
                    showCartFlyAnimation(this);
                }
                
                // 更新購物車徽章
                setTimeout(() => {
                    updateCartBadge();
                }, 300);
                
                // 获取當前選中的產品代號
                const selectedSwatch = document.querySelector('.color-swatch.selected');
                const productCode = selectedSwatch ? selectedSwatch.dataset.colorName : 'PRODUCT';
                
                // 显示优化的成功动画（僅桌面端）
                if (!isMobileDevice()) {
                    showEnhancedSuccessAnimation(this);
                }
                
                // 显示成功通知（手機端簡化版）
                setTimeout(() => {
                    if (isMobileDevice()) {
                        alert(`ÔFFUSER ${productCode} added to cart!`);
                    } else {
                        showSuccessNotification(`ÔFFUSER ${productCode} added to cart!`, cartItemCount);
                    }
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
                    resetImageIndex();
                };
            }
            
            imageStack.appendChild(img);
        });
        
        // 生成移動端指示器（固定為4個）
        generateMobileIndicators(4);
        
        // 圖片生成後統一重置位置
        if (isMobileDevice()) {
            resetImageIndex();
            console.log('📱 Images generated - reset to first image');
        }
    }
    
    // 生成移動端指示器 - 始終生成4個點
    function generateMobileIndicators(imageCount) {
        if (!isMobileDevice()) return;
        
        const indicatorsContainer = document.getElementById('mobile-indicators');
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            
            for (let i = 0; i < imageCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'indicator-dot';
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    scrollToImageIndex(i);
                });
                
                indicatorsContainer.appendChild(dot);
            }
            
            console.log('📱 Generated', imageCount, 'indicators');
        }
    }
    
    // 更新指示器狀態
    function updateIndicators(activeIndex) {
        if (!isMobileDevice()) return;
        
        currentImageIndex = activeIndex;
        
        const indicators = document.querySelectorAll('.indicator-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
        
        console.log('📱 Updated indicators, current image:', activeIndex);
    }
    

    
    // 初始化圖片堆疊
    function initializeImages() {
        // 確保初始索引為0
        currentImageIndex = 0;
        
        generateImageStack(currentColorGroup);
        updateWishlistHeart(currentColorGroup); // 初始化愛心狀態
        updateCartBadge(); // 初始化購物車徽章
        
        // 確保移動端從第一張圖片開始（統一重置）
        if (isMobileDevice()) {
            resetImageIndex();
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
            if (imageStack && isMobileDevice()) {
                // 固定生成4個指示器
                generateMobileIndicators(4);
                resetImageIndex();
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
    // isMobileDevice函數已在頂部定義

    function scrollToImageIndex(index) {
        if (!imageStack || !isMobileDevice()) return;
        
        const images = imageStack.querySelectorAll('img');
        if (images.length === 0 || index < 0 || index >= images.length) return;
        
        const container = imageStack.parentElement;
        const containerWidth = container.offsetWidth;
        const scrollLeft = index * containerWidth;
        
        // 立即更新指示器狀態
        currentImageIndex = index;
        updateIndicators(index);
        
        // 確保容器有滑動動畫
        container.style.scrollBehavior = 'smooth';
        
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        console.log('📱 Scrolled to image:', index, 'ScrollLeft:', scrollLeft);
    }

    // 觸摸滑動功能
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let isScrolling = false;

    function handleTouchStart(e) {
        if (!isMobileDevice()) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isScrolling = false;
        
        console.log('📱 Touch start at:', touchStartX, touchStartY);
    }

    function handleTouchMove(e) {
        if (!isMobileDevice()) return;
        
        touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        // 檢測滑動方向 - 提高閾值以更準確判斷
        const touchDiffX = Math.abs(touchEndX - touchStartX);
        const touchDiffY = Math.abs(touchEndY - touchStartY);
        
        // 確保有足夠的滑動距離才判斷方向
        if (touchDiffX < 10 && touchDiffY < 10) {
            return; // 滑動距離太小，不做任何處理
        }
        
        // 判斷主要滑動方向 - 提高水平滑動的判斷標準
        const isHorizontalSwipe = touchDiffX > touchDiffY && touchDiffX > 30;
        const isVerticalSwipe = touchDiffY > touchDiffX && touchDiffY > 15;
        
        // 只有在明確的水平滑動且在圖片區域內時才處理
        if (isHorizontalSwipe && !isVerticalSwipe) {
            const rect = imageStack.getBoundingClientRect();
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            
            // 確保觸摸點在圖片容器內（包含一些邊距容錯）
            if (touchY >= (rect.top - 10) && touchY <= (rect.bottom + 10) && 
                touchX >= rect.left && touchX <= rect.right) {
                isScrolling = true;
                e.preventDefault(); // 只在圖片區域內阻止默認行為
                console.log('📱 Horizontal swipe detected in image area');
            }
        } else if (isVerticalSwipe || (touchDiffY > touchDiffX)) {
            // 垂直滑動時確保不阻礙頁面滾動
            isScrolling = false;
            console.log('📱 Vertical swipe detected - allowing page scroll');
            // 不調用preventDefault()，讓瀏覽器處理垂直滾動
        }
    }

    function handleTouchEnd(e) {
        if (!isMobileDevice()) return;
        
        // 只有當確實在進行圖片滑動時才處理
        if (!isScrolling) {
            console.log('📱 Touch end - no horizontal scrolling detected');
            return;
        }
        
        const swipeThreshold = 50;
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
            
            // 滑動到新圖片
            if (newIndex !== currentImageIndex) {
                scrollToImageIndex(newIndex);
            }
        } else {
            // 回彈到當前圖片，確保位置準確
            const container = imageStack.parentElement;
            const containerWidth = container.offsetWidth;
            const targetScrollLeft = currentImageIndex * containerWidth;
            
            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
            
            // 確保指示器正確
            setTimeout(() => {
                updateIndicators(currentImageIndex);
            }, 100);
        }
        
        isScrolling = false;
        console.log('📱 Touch end, final image index:', currentImageIndex);
    }

    // 添加觸摸事件監聽器（只在需要時）
    if (imageStack && isMobileDevice()) {
        // 使用passive: false只針對特定情況
        imageStack.addEventListener('touchstart', handleTouchStart, { passive: true });
        imageStack.addEventListener('touchmove', handleTouchMove, { passive: false });
        imageStack.addEventListener('touchend', handleTouchEnd, { passive: true });
        console.log('📱 Touch events added for image navigation');
        
        // 改進滾動事件處理，減少對頁面滾動的干擾
        imageStack.parentElement.addEventListener('scroll', function(e) {
            if (isMobileDevice() && isScrolling) {
                // 只在主動進行圖片滑動時才干預
                const container = this;
                const currentScroll = container.scrollLeft;
                const containerWidth = container.offsetWidth;
                const targetScroll = currentImageIndex * containerWidth;
                
                // 允許更大的偏差範圍
                if (Math.abs(currentScroll - targetScroll) > containerWidth * 0.8) {
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
                    const containerWidth = this.offsetWidth;
                    
                    // 更精確的索引計算
                    const rawIndex = scrollLeft / containerWidth;
                    const newIndex = Math.round(rawIndex);
                    
                    // 確保索引在有效範圍內
                    const maxIndex = Math.min(3, (imageGroups[currentColorGroup] ? imageGroups[currentColorGroup].length - 1 : 3));
                    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
                    
                    // 只有當索引真正改變時才更新
                    if (clampedIndex !== currentImageIndex) {
                        console.log('📱 Scroll detected - Raw:', rawIndex.toFixed(2), 'New:', clampedIndex, 'Current:', currentImageIndex);
                        currentImageIndex = clampedIndex;
                        updateIndicators(clampedIndex);
                    }
                }, 50); // 減少防抖時間讓反應更快
            });
        }
    }

    // 當切換顏色時重置圖片索引
    function resetImageIndex() {
        currentImageIndex = 0;
        console.log('📱 Resetting image index to 0');
        
        if (isMobileDevice()) {
            const container = imageStack?.parentElement;
            if (container) {
                // 統一的重置流程，避免競爭條件
                // 1. 暫停平滑滾動
                container.style.scrollBehavior = 'auto';
                
                // 2. 立即跳轉到位置0
                container.scrollLeft = 0;
                
                // 3. 更新指示器
                updateIndicators(0);
                
                // 4. 使用requestAnimationFrame確保DOM更新完成後再恢復smooth
                requestAnimationFrame(() => {
                    container.style.scrollBehavior = 'smooth';
                    console.log('📱 Image index reset completed');
                });
            }
        }
    }
    
    // 頁面完全加載後的最終檢查（確保第一張圖片正確顯示）
    window.addEventListener('load', function() {
        if (isMobileDevice()) {
            resetImageIndex();
            console.log('📱 Page loaded - Reset to first image');
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
    
    // 通用按钮交互增强 - 只在桌面端執行
    function enhanceButtons() {
        if (isMobileDevice()) {
            console.log('📱 Skipping button enhancement on mobile');
            return;
        }
        
        const allButtons = document.querySelectorAll('.btn, .color-swatch, .info-header, .section-header');
        
        allButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // 添加点击反馈（僅桌面端）
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // 初始化按钮增强（僅桌面端）
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
    
    // 页面加载完成后的初始化（只在桌面端）
    function initParallaxEffects() {
        if (isMobileDevice()) {
            console.log('📱 Skipping parallax effects on mobile');
            return;
        }
        
        // 添加滚动监听器
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 初始化鼠标跟随效果
        createMouseFollower();
        
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
    
    // 当页面完全加载后初始化视差效果（只在桌面端）
    if (!isMobileDevice()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initParallaxEffects);
        } else {
            initParallaxEffects();
        }
    }
    
    // Initialize Section 9 with first image when page loads
    console.log('DOM loaded, initializing Section 9...');
    setTimeout(() => {
        updateSection9Background(0);
        console.log('Section 9 initialized with first image');
    }, 100);

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
    
    // 增强鼠标交互（僅桌面端）
    function enhanceMouseInteractions() {
        if (isMobileDevice()) {
            console.log('📱 Skipping mouse interactions on mobile');
            return;
        }
        
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
    
    // 启动粒子系统（僅桌面端）
    if (!isMobileDevice()) {
        initParticleSystem();
    } else {
        console.log('📱 Particle system disabled on mobile');
    }

    // --- Real-time User Feedback System ---
    
    // 高级鼠标跟随效果（只在桌面端）
    function createAdvancedMouseFollower() {
        if (isMobileDevice()) {
            console.log('📱 Skipping advanced mouse follower on mobile');
            return;
        }
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
        
        // 监听各种用户行为（僅桌面端）
        if (!isMobileDevice()) {
            document.addEventListener('click', () => {
                showStatus('✨ Click detected');
            });
        }
        
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
            '.color-swatch': 'Click to change ÔFFUSER Materials',
            '.btn-primary': 'Add this ÔFFUSER to your cart',
            '.fa-heart': 'Add to wishlist',
            '.info-header': 'Click to view details',
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
    
    // 启动用户反馈系统（僅桌面端）
    if (!isMobileDevice()) {
        initUserFeedbackSystem();
    } else {
        console.log('📱 User feedback system disabled on mobile');
    }



    // --- Smart Interactive System & User Behavior Tracking ---
    
    class UserBehaviorTracker {
        constructor() {
            console.log('🤖 Initializing UserBehaviorTracker...');
            this.actions = [];
            this.preferences = {
                favoriteColors: {},
                timeSpent: 0,
                interactions: 0,
                mostViewedSections: {}
            };
            this.sessionStart = Date.now();
            this.init();
            console.log('✅ UserBehaviorTracker initialized successfully');
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
            console.log('🎯 Smart recommendations will show in 10 seconds...');
            setTimeout(() => {
                console.log('🚀 Showing personalized recommendations now!');
                this.showPersonalizedRecommendations();
            }, 10000); // 10秒后开始显示推荐
        }
        
        updateRecommendations() {
            // 基于用户行为动态更新推荐
            // SUPER USER 弹窗已移除
        }
        
        showPersonalizedRecommendations() {
            console.log('📋 Creating recommendation panel...');
            const recommendationPanel = this.createRecommendationPanel();
            
            // 分析用户偏好
            const mostViewedColor = Object.keys(this.preferences.favoriteColors)
                .reduce((a, b) => 
                    this.preferences.favoriteColors[a] > this.preferences.favoriteColors[b] ? a : b, 
                    'origin'
                );
            
            console.log('🎨 Most viewed color:', mostViewedColor);
            console.log('📊 User preferences:', this.preferences);
            
            const recommendations = this.getSmartRecommendations(mostViewedColor);
            console.log('💡 Generated recommendations:', recommendations);
            
            this.displayRecommendations(recommendationPanel, recommendations);
        }
        
        createRecommendationPanel() {
            const panel = document.createElement('div');
            panel.className = 'smart-recommendation-panel';
            // 檢查螢幕尺寸調整樣式
            const isMobile = window.innerWidth <= 768;
            const panelWidth = isMobile ? Math.min(320, window.innerWidth - 40) : 280;
            const panelRight = isMobile ? 10 : 20;
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                right: ${panelRight}px;
                width: ${panelWidth}px;
                max-height: 80vh;
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
                overflow-y: auto;
                box-sizing: border-box;
            `;
            document.body.appendChild(panel);
            setTimeout(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(-50%) translateX(0)';
            }, 100);
            // 30秒後自動隱藏（桌面）
            if (!isMobile) {
                setTimeout(() => {
                    if (panel.parentNode) {
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(-50%) translateX(300px)';
                        setTimeout(() => {
                            if (panel.parentNode) {
                                panel.remove();
                            }
                        }, 500);
                    }
                }, 30000);
            } else {
                // 手機端5秒自動隱藏，且點擊按鈕時清除
                let mobileTimer = setTimeout(() => {
                    if (panel.parentNode) {
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(-50%) translateX(300px)';
                        setTimeout(() => {
                            if (panel.parentNode) {
                                panel.remove();
                            }
                        }, 500);
                    }
                }, 5000);
                panel.addEventListener('click', function handler(e) {
                    if (e.target.classList.contains('quiz-trigger-btn')) {
                        clearTimeout(mobileTimer);
                        panel.removeEventListener('click', handler);
                    }
                });
            }
            return panel;
        }
        
        getSmartRecommendations(preferredColor) {
            const recommendations = [];
            
            // 總是顯示Custom Scent Profile作為主要推薦
            recommendations.push({
                type: 'personalization',
                title: 'Custom Scent Profile',
                description: 'Create a personalized aromatherapy experience based on your preferences.',
                action: 'Start Quiz',
                icon: '🌟'
            });
            
            // 基于浏览时间的推荐（降低門檻）
            if (this.preferences.timeSpent > 30000 && recommendations.length < 2) {
                recommendations.push({
                    type: 'engagement',
                    title: 'Exclusive Offer!',
                    description: 'You\'ve been exploring for a while. Enjoy 10% off your first purchase!',
                    action: 'Get Discount',
                    icon: '💝'
                });
            }
            
            return recommendations.slice(0, 2); // 最多显示2个推荐
        }
        
        displayRecommendations(panel, recommendations) {
            // 移除舊的事件監聽
            const oldBtns = document.querySelectorAll('.quiz-trigger-btn');
            oldBtns.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
            });
            // ... existing code ...
            const filtered = recommendations.filter(rec => rec.type !== 'add_to_cart');
            // ... existing code ...
            const html = `
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 20px; margin-right: 10px;">🤖</span>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">Smart Recommendations</h3>
                </div>
                ${filtered.map(rec => `
                    <div style="background: rgba(74, 144, 226, 0.1); border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 3px solid #4a90e2;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 18px; margin-right: 8px;">${rec.icon}</span>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #333;">${rec.title}</h4>
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; line-height: 1.4;">${rec.description}</p>
                        <button class="quiz-trigger-btn" data-quiz-type="${rec.type}" data-color-group="${rec.colorGroup || ''}" style="
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
            console.log('✅ Recommendation panel HTML content set');
            // Add event listeners for quiz buttons
            const quizButtons = panel.querySelectorAll('.quiz-trigger-btn');
            console.log('🔘 Found quiz buttons:', quizButtons.length);
            quizButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    if (button.textContent.includes('Start Quiz')) {
                        console.log('🎲 Starting scent quiz...');
                        this.startScentQuiz();
                    }
                });
            });
        }
        
        // Scent Profile Quiz System
        startScentQuiz() {
            // 隱藏推薦面板當用戶開始測驗
            this.hideRecommendationPanel();
            
            const quizModal = this.createQuizModal();
            document.body.appendChild(quizModal);
            this.showQuestion(1);
        }
        
        createQuizModal() {
            const modal = document.createElement('div');
            modal.id = 'scent-quiz-modal';
            const isMobile = isMobileDevice();
            
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1 !important;
                transition: none !important;
                animation: none !important;
            `;
            
            const quizContainer = document.createElement('div');
            quizContainer.id = 'quiz-container';
            const containerWidth = isMobile ? '95%' : '90%';
            const containerMaxWidth = isMobile ? '400px' : '600px';
            const containerPadding = isMobile ? '20px' : '40px';
            
            quizContainer.style.cssText = `
                background: white !important;
                border-radius: 20px;
                padding: ${containerPadding};
                max-width: ${containerMaxWidth};
                width: ${containerWidth};
                max-height: 90%;
                overflow-y: auto;
                position: relative;
                transform: scale(1) !important;
                transition: none !important;
                animation: none !important;
                font-family: 'Inter', sans-serif;
                opacity: 1 !important;
                visibility: visible !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            `;
            
            modal.appendChild(quizContainer);
            
            // 手機端不使用動畫
            if (isMobile) {
                modal.style.opacity = '1';
                quizContainer.style.transform = 'scale(1)';
                console.log('📱 Quiz modal created for mobile without animations');
            } else {
                // 桌面端使用動畫
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                quizContainer.style.transform = 'scale(0.9)';
                quizContainer.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    modal.style.opacity = '1';
                    quizContainer.style.transform = 'scale(1)';
                }, 10);
            }
            
            return modal;
        }
        
        quizData = {
            currentQuestion: 1,
            totalQuestions: 8,
            answers: {},
            questions: [
                {
                    id: 1,
                    question: "⏰🏠 When and where do you usually use aromatherapy diffusers?",
                    options: [
                        { id: 'home_relax', text: '🏠 After work at home relaxation', value: 'home_relax' },
                        { id: 'bedroom_sleep', text: '🛏️ Bedtime in bedroom for sleep aid', value: 'bedroom_sleep' },
                        { id: 'office_work', text: '💼 Work time in office/study room', value: 'office_work' },
                        { id: 'whole_home', text: '🏡 Throughout the entire home', value: 'whole_home' }
                    ]
                },
                {
                    id: 2,
                    question: "🎯 What effect do you most want to achieve through aromatherapy?",
                    options: [
                        { id: 'relax_stress', text: '💆 Relaxation / Stress relief', value: 'relax_stress' },
                        { id: 'focus_enhance', text: '🧠 Enhance focus', value: 'focus_enhance' },
                        { id: 'sleep_help', text: '😴 Help with sleep', value: 'sleep_help' },
                        { id: 'air_purify', text: '🌿 Air purification', value: 'air_purify' }
                    ]
                },
                {
                    id: 3,
                    question: "🌸 Which scent profile appeals to you most?",
                    options: [
                        { id: 'fresh', text: '🌿 Fresh & Natural (mint, eucalyptus, tea tree, lemon)', value: 'fresh' },
                        { id: 'floral', text: '🌸 Floral & Elegant (lavender, rose, jasmine, orange blossom)', value: 'floral' },
                        { id: 'woody', text: '🌲 Woody & Grounding (sandalwood, cedar, amber, patchouli)', value: 'woody' },
                        { id: 'citrus', text: '🍊 Citrus & Vibrant (sweet orange, bergamot, grapefruit, orange)', value: 'citrus' }
                    ]
                },
                {
                    id: 4,
                    question: "🎨 Which lifestyle best describes you?",
                    options: [
                        { id: 'natural', text: '🌱 Natural wellness advocate', value: 'natural' },
                        { id: 'remote', text: '💻 Remote work from home', value: 'remote' },
                        { id: 'efficient', text: '🎯 Efficiency expert', value: 'efficient' },
                        { id: 'aesthetic', text: '🎨 Aesthetic lifestyle enthusiast', value: 'aesthetic' },
                        { id: 'spiritual', text: '🧘 Mind‑body‑spirit explorer', value: 'spiritual' }
                    ]
                },
                {
                    id: 5,
                    question: "💨 What intensity of aromatherapy do you prefer?",
                    options: [
                        { id: 'light', text: '🪶 Light & Subtle', value: 'light' },
                        { id: 'medium', text: '🌼 Medium & Moderate', value: 'medium' },
                        { id: 'strong', text: '🌹 Rich & Intense', value: 'strong' },
                        { id: 'adjustable', text: '🎛️ Adjustable', value: 'adjustable' }
                    ]
                },
                {
                    id: 6,
                    question: "🎵 What type of music/playlist do you usually play?",
                    options: [
                        { id: 'lofi_chill', text: '🎧 Lo‑fi Chill / Relaxing vibes', value: 'lofi_chill' },
                        { id: 'upbeat_pop', text: '🚀 Upbeat Pop / Energizing tunes', value: 'upbeat_pop' },
                        { id: 'instrumental', text: '🎹 Instrumental Focus / Study music', value: 'instrumental' },
                        { id: 'ambient_meditation', text: '🌌 Ambient Meditation / Mindful sounds', value: 'ambient_meditation' },
                        { id: 'classical', text: '🎻 Classical / Orchestral music', value: 'classical' },
                        { id: 'jazz_soul', text: '🎷 Jazz & Soul / Smooth rhythms', value: 'jazz_soul' },
                        { id: 'electronic', text: '💽 Electronic / Digital beats', value: 'electronic' },
                        { id: 'nature_sounds', text: '🌿 Nature sounds (birds, ocean waves)', value: 'nature_sounds' },
                        { id: 'podcast', text: '🎙️ Podcast / Audio broadcasts', value: 'podcast' },
                        { id: 'silence', text: '🤫 Silence / No sound', value: 'silence' }
                    ]
                },
                {
                    id: 7,
                    question: "🍂 What is your favorite season?",
                    options: [
                        { id: 'spring', text: '🌸 Spring', value: 'spring' },
                        { id: 'summer', text: '☀️ Summer', value: 'summer' },
                        { id: 'autumn', text: '🍁 Autumn', value: 'autumn' },
                        { id: 'winter', text: '❄️ Winter', value: 'winter' }
                    ]
                },
                {
                    id: 8,
                    question: "🚫 Do you have any scents you dislike or are allergic to? (Optional)",
                    type: 'text',
                    placeholder: "lavender, citrus, woody, floral",
                    note: "Optional: Enter in English, separate multiple items with commas. Leave blank if none. Common allergens: eucalyptus, peppermint, sandalwood, rose"
                }
            ]
        };
        
        showQuestion(questionNumber) {
            const container = document.getElementById('quiz-container');
            const question = this.quizData.questions[questionNumber - 1];
            
            let html = `
                <div style="text-align: right; margin-bottom: 20px;">
                    <button id="close-quiz" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
                </div>
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #333;">Custom Scent Profile</h2>
                    <div style="background: #f0f0f0; border-radius: 10px; height: 6px; margin: 10px 0;">
                        <div style="background: #4a90e2; height: 100%; border-radius: 10px; width: ${(questionNumber / this.quizData.totalQuestions) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Question ${questionNumber} of ${this.quizData.totalQuestions}</p>
                </div>
                <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 18px; margin-bottom: 25px; color: #333; line-height: 1.4;">${question.question}</h3>
            `;
            
            if (question.type === 'text') {
                html += `
                    <div>
                        <input type="text" id="allergen-input" placeholder="${question.placeholder}" style="
                            width: 100%;
                            padding: 15px;
                            border: 2px solid #e0e0e0;
                            border-radius: 10px;
                            font-size: 16px;
                            font-family: 'Inter', sans-serif;
                            box-sizing: border-box;
                            margin-bottom: 10px;
                        ">
                        <p style="font-size: 12px; color: #666; margin: 0;">${question.note}</p>
                    </div>
                `;
            } else {
                html += '<div>';
                question.options.forEach(option => {
                    html += `
                        <button class="quiz-option" data-value="${option.value}" style="
                            display: block;
                            width: 100%;
                            padding: 15px 20px;
                            margin-bottom: 12px;
                            border: 2px solid #e0e0e0;
                            border-radius: 12px;
                            background: white !important;
                            text-align: left;
                            cursor: pointer;
                            font-size: ${isMobileDevice() ? '13px' : '14px'};
                            font-family: 'Inter', sans-serif;
                            transition: ${isMobileDevice() ? 'none' : 'all 0.3s ease'} !important;
                            animation: none !important;
                            line-height: 1.4;
                            position: relative;
                            opacity: 1 !important;
                            visibility: visible !important;
                        ">
                            ${option.text}
                        </button>
                    `;
                });
                html += '</div>';
            }
            
            html += `
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="prev-btn" style="
                        padding: 12px 24px;
                        border: 2px solid #e0e0e0;
                        border-radius: 25px;
                        background: white;
                        color: #666;
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        font-weight: 500;
                        display: ${questionNumber === 1 ? 'none' : 'block'};
                    ">Previous</button>
                    <button id="next-btn" style="
                        padding: 12px 24px;
                        border: none;
                        border-radius: 25px;
                        background: ${question.type === 'text' ? '#4a90e2' : '#ccc'};
                        color: white;
                        cursor: ${question.type === 'text' ? 'pointer' : 'not-allowed'};
                        font-family: 'Inter', sans-serif;
                        font-weight: 500;
                        margin-left: auto;
                    " ${question.type === 'text' ? '' : 'disabled'}>${questionNumber === this.quizData.totalQuestions ? 'Generate Profile' : 'Next'}</button>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Add event listeners
            document.getElementById('close-quiz').addEventListener('click', () => {
                this.closeQuiz();
            });
            
            if (question.type === 'text') {
                const input = document.getElementById('allergen-input');
                const nextBtn = document.getElementById('next-btn');
                
                // For allergen question (Q8), allow empty input
                nextBtn.style.background = '#4a90e2';
                nextBtn.style.cursor = 'pointer';
                nextBtn.disabled = false;
                
                input.addEventListener('input', () => {
                    // Keep button enabled regardless of input
                    nextBtn.style.background = '#4a90e2';
                    nextBtn.style.cursor = 'pointer';
                    nextBtn.disabled = false;
                });
                
                nextBtn.addEventListener('click', () => {
                    // Always allow proceeding, even with empty input
                    this.quizData.answers[question.id] = input.value.trim();
                    if (questionNumber === this.quizData.totalQuestions) {
                        this.generateScentProfile();
                    } else {
                        this.showQuestion(questionNumber + 1);
                    }
                });
            } else {
                const options = document.querySelectorAll('.quiz-option');
                const nextBtn = document.getElementById('next-btn');
                
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        // Remove selection from other options
                        options.forEach(opt => {
                            opt.classList.remove('selected');
                            opt.style.borderColor = '#e0e0e0';
                            opt.style.background = 'white';
                            // 手機端不使用陰影和變換效果
                            if (!isMobileDevice()) {
                                opt.style.boxShadow = 'none';
                                opt.style.transform = 'none';
                            }
                        });
                        
                        // Select current option with appropriate feedback
                        option.classList.add('selected');
                        option.style.borderColor = '#4a90e2';
                        option.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)';
                        
                        // 只在桌面端使用視覺效果
                        if (!isMobileDevice()) {
                            option.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                            option.style.transform = 'translateY(-2px)';
                        }
                        
                        // Add checkmark visual indicator
                        const existingCheck = option.querySelector('.checkmark');
                        if (!existingCheck) {
                            const checkmark = document.createElement('span');
                            checkmark.className = 'checkmark';
                            checkmark.innerHTML = '✓';
                            checkmark.style.cssText = `
                                position: absolute;
                                top: 15px;
                                right: 20px;
                                color: #4a90e2;
                                font-weight: bold;
                                font-size: 18px;
                                opacity: 1 !important;
                                visibility: visible !important;
                            `;
                            option.appendChild(checkmark);
                        }
                        
                        // Remove checkmarks from other options
                        options.forEach(opt => {
                            if (opt !== option) {
                                const check = opt.querySelector('.checkmark');
                                if (check) check.remove();
                            }
                        });
                        
                        // Enable next button
                        nextBtn.style.background = '#4a90e2';
                        nextBtn.style.cursor = 'pointer';
                        nextBtn.disabled = false;
                        
                        // Store answer
                        this.quizData.answers[question.id] = option.dataset.value;
                        
                        console.log('📱 Quiz option selected:', option.dataset.value);
                    });
                });
                
                nextBtn.addEventListener('click', () => {
                    if (!nextBtn.disabled) {
                        if (questionNumber === this.quizData.totalQuestions) {
                            this.generateScentProfile();
                        } else {
                            this.showQuestion(questionNumber + 1);
                        }
                    }
                });
            }
            
            if (questionNumber > 1) {
                document.getElementById('prev-btn').addEventListener('click', () => {
                    this.showQuestion(questionNumber - 1);
                });
            }
            
            // Restore previous answer if exists
            if (question.type !== 'text') {
                const previousAnswer = this.quizData.answers[question.id];
                if (previousAnswer) {
                    const selectedOption = document.querySelector(`[data-value="${previousAnswer}"]`);
                    if (selectedOption) {
                        // Trigger click to restore selection
                        selectedOption.click();
                    }
                }
            } else {
                // For text input, restore previous value
                const input = document.getElementById('allergen-input');
                const previousAnswer = this.quizData.answers[question.id];
                if (previousAnswer && input) {
                    input.value = previousAnswer;
                    // Enable next button if there's content
                    if (previousAnswer.trim()) {
                        const nextBtn = document.getElementById('next-btn');
                        nextBtn.style.background = '#4a90e2';
                        nextBtn.style.cursor = 'pointer';
                        nextBtn.disabled = false;
                    }
                }
            }
        }
        
        closeQuiz() {
            const modal = document.getElementById('scent-quiz-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        }
        
        // Complete ingredient database
        ingredientDatabase = {
            fresh: {
                'Lemon': { effect: 'Awakening & Refreshing', category: 'fresh' },
                'Peppermint': { effect: 'Cool & Focused', category: 'fresh' },
                'Eucalyptus': { effect: 'Air Purifying', category: 'fresh' },
                'Tea Tree': { effect: 'Antibacterial & Deodorizing', category: 'fresh' },
                'Lemongrass': { effect: 'Vitality Boost', category: 'fresh' },
                'Rosemary': { effect: 'Memory Enhancement', category: 'fresh' },
                'Thyme': { effect: 'Fresh Purification', category: 'fresh' },
                'Basil': { effect: 'Clear Focus', category: 'fresh' }
            },
            floral: {
                'Lavender': { effect: 'Relaxing & Sleep-inducing', category: 'floral' },
                'Jasmine': { effect: 'Warm & Joyful', category: 'floral' },
                'Neroli': { effect: 'Elegant & Tranquil', category: 'floral' },
                'Chamomile': { effect: 'Soothing & Calming', category: 'floral' },
                'White Chamomile': { effect: 'Deep Relaxation', category: 'floral' },
                'Rose': { effect: 'Emotional Balance', category: 'floral' },
                'Geranium': { effect: 'Harmonious & Soothing', category: 'floral' },
                'Ylang Ylang': { effect: 'Romantic & Relaxing', category: 'floral' },
                'Violet': { effect: 'Gentle & Peaceful', category: 'floral' }
            },
            woody: {
                'Sandalwood': { effect: 'Deep Meditation', category: 'woody' },
                'Cedarwood': { effect: 'Security & Stability', category: 'woody' },
                'Patchouli': { effect: 'Mysterious & Grounding', category: 'woody' },
                'Frankincense': { effect: 'Spiritual Purification', category: 'woody' },
                'Myrrh': { effect: 'Ancient Wisdom', category: 'woody' },
                'Pine': { effect: 'Forest Fresh', category: 'woody' },
                'Cypress': { effect: 'Resilient Balance', category: 'woody' },
                'Juniper': { effect: 'Purifying Protection', category: 'woody' }
            },
            citrus: {
                'Sweet Orange': { effect: 'Happy & Positive Energy', category: 'citrus' },
                'Grapefruit': { effect: 'Uplifting Spirit', category: 'citrus' },
                'Bergamot': { effect: 'Emotional Balance', category: 'citrus' },
                'Yuzu': { effect: 'Fresh Vitality', category: 'citrus' },
                'Lime': { effect: 'Refreshing & Awakening', category: 'citrus' },
                'Blood Orange': { effect: 'Warm Vitality', category: 'citrus' },
                'Mandarin': { effect: 'Gentle & Sweet', category: 'citrus' }
            },
            spice: {
                'Cinnamon': { effect: 'Warm Vitality', category: 'spice' },
                'Vanilla': { effect: 'Comfort & Sweetness', category: 'spice' },
                'Clove': { effect: 'Warm Embrace', category: 'spice' },
                'Ginger': { effect: 'Energizing Warmth', category: 'spice' },
                'Cardamom': { effect: 'Exotic Appeal', category: 'spice' },
                'Nutmeg': { effect: 'Cozy Comfort', category: 'spice' },
                'Black Pepper': { effect: 'Stimulating Energy', category: 'spice' },
                'Bay Leaf': { effect: 'Fresh Warmth', category: 'spice' }
            },
            herbal: {
                'Sage': { effect: 'Purifying Wisdom', category: 'herbal' },
                'Clary Sage': { effect: 'Hormonal Balance', category: 'herbal' },
                'Marjoram': { effect: 'Deep Relaxation', category: 'herbal' },
                'Hyssop': { effect: 'Respiratory Support', category: 'herbal' },
                'Mugwort': { effect: 'Intuition Enhancement', category: 'herbal' },
                'Menthol': { effect: 'Ultimate Cooling', category: 'herbal' }
            }
        };
        
        generateScentProfile() {
            const answers = this.quizData.answers;
            const allergens = this.parseAllergens(answers[8] || '');
            
            // Generate profile based on answers
            const profile = this.calculatePersonalizedProfile(answers, allergens);
            
            this.showScentProfile(profile);
        }
        
        parseAllergens(allergenString) {
            if (!allergenString) return [];
            
            const allergenMap = {
                'lavender': ['Lavender', 'Clary Sage'],
                'citrus': ['Lemon', 'Sweet Orange', 'Grapefruit', 'Bergamot', 'Yuzu', 'Lime', 'Blood Orange', 'Mandarin', 'Neroli'],
                'woody': ['Sandalwood', 'Cedarwood', 'Patchouli', 'Frankincense', 'Myrrh', 'Pine', 'Cypress', 'Juniper'],
                'floral': ['Lavender', 'Jasmine', 'Neroli', 'Chamomile', 'White Chamomile', 'Rose', 'Geranium', 'Ylang Ylang', 'Violet'],
                'mint': ['Peppermint', 'Menthol'],
                'eucalyptus': ['Eucalyptus'],
                'peppermint': ['Peppermint', 'Menthol'],
                'sandalwood': ['Sandalwood'],
                'rose': ['Rose'],
                'tea tree': ['Tea Tree'],
                'bergamot': ['Bergamot'],
                'lemon': ['Lemon'],
                'orange': ['Sweet Orange', 'Blood Orange'],
                'sweet orange': ['Sweet Orange', 'Blood Orange'],
                'jasmine': ['Jasmine'],
                'vanilla': ['Vanilla'],
                'cinnamon': ['Cinnamon'],
                'ginger': ['Ginger'],
                'cedar': ['Cedarwood'],
                'pine': ['Pine'],
                'sage': ['Sage', 'Clary Sage'],
                'chamomile': ['Chamomile', 'White Chamomile'],
                'neroli': ['Neroli'],
                'ylang ylang': ['Ylang Ylang'],
                'geranium': ['Geranium'],
                'frankincense': ['Frankincense'],
                'myrrh': ['Myrrh'],
                'patchouli': ['Patchouli'],
                'thyme': ['Thyme'],
                'basil': ['Basil'],
                'rosemary': ['Rosemary'],
                'cypress': ['Cypress'],
                'juniper': ['Juniper']
            };
            
            const excludedIngredients = [];
            const inputAllergens = allergenString.toLowerCase().split(',').map(s => s.trim());
            
            inputAllergens.forEach(allergen => {
                if (allergenMap[allergen]) {
                    excludedIngredients.push(...allergenMap[allergen]);
                } else {
                    // Check for partial keyword matches
                    Object.keys(allergenMap).forEach(key => {
                        if (allergen.includes(key) || key.includes(allergen)) {
                            excludedIngredients.push(...allergenMap[key]);
                        }
                    });
                }
            });
            
            return [...new Set(excludedIngredients)]; // Remove duplicates
        }
        
        calculatePersonalizedProfile(answers, allergens) {
            // New question mapping for 7-question structure
            const usageSpace = answers[1]; // Question 1: 使用時機和空間
            const targetEffect = answers[2]; // Question 2: 想達到的效果
            const scentProfile = answers[3]; // Question 3: 香調偏好
            const lifestyle = answers[4]; // Question 4: 生活風格
            const intensity = answers[5]; // Question 5: 香氛強度
            const musicStyle = answers[6]; // Question 6: 音樂偏好
            const season = answers[7]; // Question 7: 季節偏好
            
            // Get available ingredients (excluding allergens)
            const availableIngredients = this.getAvailableIngredients(allergens);
            
            // Calculate profile name based on effect and scent
            const profileName = this.generateProfileName(targetEffect, scentProfile);
            
            // Generate formula considering all factors
            const formula = this.generateFormula(answers, availableIngredients);
            
            return {
                name: profileName.name,
                subtitle: profileName.subtitle,
                description: profileName.description,
                formula: formula,
                answers: answers
            };
        }
        
        getAvailableIngredients(allergens) {
            const available = {};
            
            Object.keys(this.ingredientDatabase).forEach(category => {
                available[category] = {};
                Object.keys(this.ingredientDatabase[category]).forEach(ingredient => {
                    if (!allergens.includes(ingredient)) {
                        available[category][ingredient] = this.ingredientDatabase[category][ingredient];
                    }
                });
            });
            
            return available;
        }
        
        generateProfileName(effect, scent) {
            const profiles = {
                'focus_enhance_fresh': { 
                    name: 'FOCUS', 
                    subtitle: 'Ultra Focus Formula',
                    description: 'Cognitive Enhancement Complex'
                },
                'focus_enhance_floral': { 
                    name: 'BLOOM', 
                    subtitle: 'Floral Focus Formula',
                    description: 'Elegant Concentration Complex'
                },
                'focus_enhance_woody': { 
                    name: 'GROVE', 
                    subtitle: 'Grounded Focus Formula',
                    description: 'Forest Clarity Complex'
                },
                'focus_enhance_citrus': { 
                    name: 'BURST', 
                    subtitle: 'Citrus Focus Formula',
                    description: 'Energetic Concentration Complex'
                },
                'sleep_help_fresh': { 
                    name: 'DRIFT', 
                    subtitle: 'Fresh Sleep Formula',
                    description: 'Clean Rest Complex'
                },
                'sleep_help_floral': { 
                    name: 'DREAM', 
                    subtitle: 'Floral Sleep Formula',
                    description: 'Peaceful Slumber Complex'
                },
                'sleep_help_woody': { 
                    name: 'NEST', 
                    subtitle: 'Woody Sleep Formula',
                    description: 'Grounding Rest Complex'
                },
                'sleep_help_citrus': { 
                    name: 'SUNSET', 
                    subtitle: 'Citrus Sleep Formula',
                    description: 'Gentle Evening Complex'
                },
                'air_purify_fresh': { 
                    name: 'PURE', 
                    subtitle: 'Air Purification Formula',
                    description: 'Environmental Cleansing Complex'
                },
                'air_purify_floral': { 
                    name: 'BLOOM+', 
                    subtitle: 'Floral Purify Formula',
                    description: 'Elegant Purification Complex'
                },
                'air_purify_woody': { 
                    name: 'FOREST', 
                    subtitle: 'Woody Purify Formula',
                    description: 'Natural Cleansing Complex'
                },
                'air_purify_citrus': { 
                    name: 'FRESH', 
                    subtitle: 'Citrus Purify Formula',
                    description: 'Zesty Cleansing Complex'
                },
                'relax_stress_fresh': { 
                    name: 'CALM', 
                    subtitle: 'Fresh Relief Formula',
                    description: 'Stress Release Complex'
                },
                'relax_stress_floral': { 
                    name: 'PEACE', 
                    subtitle: 'Floral Relief Formula',
                    description: 'Tranquil Balance Complex'
                },
                'relax_stress_woody': { 
                    name: 'ZEN', 
                    subtitle: 'Woody Relief Formula',
                    description: 'Grounding Balance Complex'
                },
                'relax_stress_citrus': { 
                    name: 'JOY', 
                    subtitle: 'Citrus Relief Formula',
                    description: 'Uplifting Balance Complex'
                }
            };
            
            const key = `${effect}_${scent}`;
            return profiles[key] || { 
                name: 'CUSTOM', 
                subtitle: 'Personalized Formula',
                description: 'AI-Crafted Complex'
            };
        }
        
        generateFormula(answers, availableIngredients) {
            const usageSpace = answers[1]; // 使用時機和空間
            const targetEffect = answers[2]; // 想達到的效果
            const scentProfile = answers[3]; // 香調偏好
            const lifestyle = answers[4]; // 生活風格
            const intensity = answers[5]; // 香氛強度
            const musicStyle = answers[6]; // 音樂偏好
            const season = answers[7]; // 季節偏好
            
            // Start with base ingredients from primary scent category
            const baseIngredients = this.selectBaseIngredients(scentProfile, availableIngredients);
            
            // Add functional ingredients based on target effect
            const functionalIngredients = this.selectFunctionalIngredients(targetEffect, availableIngredients);
            
            // Add usage space modifiers
            const usageIngredients = this.selectUsageIngredients(usageSpace, availableIngredients);
            
            // Add lifestyle modifiers
            const lifestyleIngredients = this.selectLifestyleIngredients(lifestyle, availableIngredients);
            
            // Add music-based modifiers
            const musicIngredients = this.selectMusicIngredients(musicStyle, availableIngredients);
            
            // Add seasonal modifiers
            const seasonalIngredients = this.selectSeasonalIngredients(season, availableIngredients);
            
            // Combine and calculate percentages
            const combinedIngredients = this.combineIngredients([
                ...baseIngredients,
                ...functionalIngredients,
                ...usageIngredients,
                ...lifestyleIngredients,
                ...musicIngredients,
                ...seasonalIngredients
            ]);
            
            // Apply intensity modifier
            const intensityModifier = this.getIntensityModifier(intensity);
            
            // Calculate final percentages
            return this.calculateFinalPercentages(combinedIngredients, intensityModifier);
        }
        
        selectBaseIngredients(category, available) {
            const categoryMap = {
                'fresh': 'fresh',
                'floral': 'floral', 
                'woody': 'woody',
                'citrus': 'citrus'
            };
            
            const targetCategory = categoryMap[category] || 'fresh';
            const ingredients = available[targetCategory];
            
            // Select top 3-4 ingredients from primary category
            const selected = Object.keys(ingredients).slice(0, 4).map(name => ({
                name,
                effect: ingredients[name].effect,
                baseWeight: 15,
                source: 'primary'
            }));
            
            return selected;
        }
        
        selectFunctionalIngredients(targetEffect, available) {
            const effectMap = {
                'focus_enhance': ['Rosemary', 'Lemon', 'Peppermint', 'Basil'],
                'sleep_help': ['Lavender', 'Chamomile', 'Sandalwood', 'Marjoram'],
                'air_purify': ['Tea Tree', 'Eucalyptus', 'Lemon', 'Thyme', 'Sage'],
                'relax_stress': ['Bergamot', 'Lavender', 'Neroli', 'Ylang Ylang', 'Marjoram']
            };
            
            const targetIngredients = effectMap[targetEffect] || [];
            const selected = [];
            
            // Find available ingredients from the effect list
            Object.keys(available).forEach(category => {
                Object.keys(available[category]).forEach(ingredient => {
                    if (targetIngredients.includes(ingredient)) {
                        selected.push({
                            name: ingredient,
                            effect: available[category][ingredient].effect,
                            baseWeight: 12,
                            source: 'functional'
                        });
                    }
                });
            });
            
            return selected.slice(0, 3); // Limit to 3 functional ingredients
        }
        
        selectUsageIngredients(usageSpace, available) {
            const usageMap = {
                'home_relax': ['Chamomile', 'Bergamot', 'Sweet Orange', 'Geranium'],
                'bedroom_sleep': ['Lavender', 'Chamomile', 'Sandalwood', 'White Chamomile'],
                'office_work': ['Rosemary', 'Peppermint', 'Lemon', 'Basil'],
                'whole_home': ['Eucalyptus', 'Tea Tree', 'Sweet Orange', 'Lime']
            };
            
            const targetIngredients = usageMap[usageSpace] || [];
            const selected = [];
            
            Object.keys(available).forEach(category => {
                Object.keys(available[category]).forEach(ingredient => {
                    if (targetIngredients.includes(ingredient)) {
                        selected.push({
                            name: ingredient,
                            effect: available[category][ingredient].effect,
                            baseWeight: 8,
                            source: 'usage'
                        });
                    }
                });
            });
            
            return selected.slice(0, 2);
        }
        
        selectMusicIngredients(musicStyle, available) {
            const musicMap = {
                'lofi_chill': ['Lavender', 'Chamomile', 'Vanilla'],
                'upbeat_pop': ['Sweet Orange', 'Grapefruit', 'Lemon'],
                'instrumental': ['Frankincense', 'Sandalwood', 'Rosemary'],
                'ambient_meditation': ['Sage', 'Myrrh', 'White Chamomile'],
                'classical': ['Rose', 'Neroli', 'Bergamot'],
                'jazz_soul': ['Ylang Ylang', 'Jasmine', 'Cardamom'],
                'electronic': ['Peppermint', 'Eucalyptus', 'Lime'],
                'nature_sounds': ['Pine', 'Cypress', 'Tea Tree'],
                'podcast': ['Basil', 'Thyme', 'Lemongrass'],
                'silence': ['Marjoram', 'Violet', 'Clary Sage']
            };
            
            const targetIngredients = musicMap[musicStyle] || [];
            const selected = [];
            
            Object.keys(available).forEach(category => {
                Object.keys(available[category]).forEach(ingredient => {
                    if (targetIngredients.includes(ingredient)) {
                        selected.push({
                            name: ingredient,
                            effect: available[category][ingredient].effect,
                            baseWeight: 5,
                            source: 'music'
                        });
                    }
                });
            });
            
            return selected.slice(0, 1);
        }
        
        selectSeasonalIngredients(season, available) {
            const seasonMap = {
                'spring': ['Jasmine', 'Rose', 'Lemon', 'Neroli'],
                'summer': ['Sweet Orange', 'Lime', 'Grapefruit', 'Lemongrass'],
                'autumn': ['Cinnamon', 'Clove', 'Nutmeg', 'Ginger'],
                'winter': ['Pine', 'Frankincense', 'Myrrh', 'Cedarwood']
            };
            
            const targetIngredients = seasonMap[season] || [];
            const selected = [];
            
            Object.keys(available).forEach(category => {
                Object.keys(available[category]).forEach(ingredient => {
                    if (targetIngredients.includes(ingredient)) {
                        selected.push({
                            name: ingredient,
                            effect: available[category][ingredient].effect,
                            baseWeight: 6,
                            source: 'seasonal'
                        });
                    }
                });
            });
            
            return selected.slice(0, 2);
        }
        
        selectLifestyleIngredients(lifestyle, available) {
            const lifestyleMap = {
                'natural': ['Tea Tree', 'Eucalyptus', 'Sage', 'Thyme'],
                'remote': ['Rosemary', 'Chamomile'],
                'efficient': ['Menthol', 'Black Pepper', 'Ginger', 'Lemongrass'],
                'aesthetic': ['Yuzu', 'Ylang Ylang', 'Cardamom', 'Jasmine'],
                'spiritual': ['Frankincense', 'Myrrh', 'Sage', 'Mugwort']
            };
            
            const targetIngredients = lifestyleMap[lifestyle] || [];
            const selected = [];
            
            Object.keys(available).forEach(category => {
                Object.keys(available[category]).forEach(ingredient => {
                    if (targetIngredients.includes(ingredient)) {
                        selected.push({
                            name: ingredient,
                            effect: available[category][ingredient].effect,
                            baseWeight: 5,
                            source: 'lifestyle'
                        });
                    }
                });
            });
            
            return selected.slice(0, 2);
        }
        
        combineIngredients(ingredientArrays) {
            const combined = {};
            
            ingredientArrays.forEach(ingredient => {
                if (combined[ingredient.name]) {
                    combined[ingredient.name].baseWeight += ingredient.baseWeight;
                } else {
                    combined[ingredient.name] = { ...ingredient };
                }
            });
            
            return Object.values(combined);
        }
        
        getIntensityModifier(intensity) {
            const modifiers = {
                'light': 0.8,
                'medium': 1.0,
                'strong': 1.2,
                'adjustable': 1.0
            };
            
            return modifiers[intensity] || 1.0;
        }
        
        calculateFinalPercentages(ingredients, intensityModifier) {
            // Sort by weight descending
            ingredients.sort((a, b) => b.baseWeight - a.baseWeight);
            
            // Take top 6-8 ingredients
            const topIngredients = ingredients.slice(0, Math.min(8, ingredients.length));
            
            // Calculate total weight
            const totalWeight = topIngredients.reduce((sum, ing) => sum + ing.baseWeight, 0);
            
            // Reserve 10% for AI balance factor
            const reservedPercent = 10;
            const availablePercent = 100 - reservedPercent;
            
            // Calculate percentages
            const formula = topIngredients.map(ingredient => {
                const percentage = ((ingredient.baseWeight / totalWeight) * availablePercent * intensityModifier);
                return {
                    name: ingredient.name,
                    effect: ingredient.effect,
                    percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal place
                };
            });
            
            // Ensure total doesn't exceed 90%
            const currentTotal = formula.reduce((sum, ing) => sum + ing.percentage, 0);
            if (currentTotal > availablePercent) {
                const ratio = availablePercent / currentTotal;
                formula.forEach(ingredient => {
                    ingredient.percentage = Math.round(ingredient.percentage * ratio * 10) / 10;
                });
            }
            
            return formula;
        }
        
        showScentProfile(profile) {
            const container = document.getElementById('quiz-container');
            
            const formulaHtml = profile.formula.map(ingredient => 
                `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                    <div>
                        <span style="font-weight: 600; color: #333;">${ingredient.name}</span>
                        <span style="font-size: 12px; color: #666; margin-left: 8px;">${ingredient.percentage}%</span>
                    </div>
                    <span style="font-size: 11px; color: #888;">${ingredient.effect}</span>
                </div>`
            ).join('');
            
            const totalVisible = profile.formula.reduce((sum, ing) => sum + ing.percentage, 0);
            const aiBalanceFactor = Math.round((100 - totalVisible) * 10) / 10;
            
            const html = `
                <div style="text-align: right; margin-bottom: 20px;">
                    <button id="close-profile" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 32px; margin-bottom: 10px;">🌟</div>
                    <h2 style="margin: 0 0 5px 0; font-size: 24px; color: #333;">Your ÔDÔRAI Custom Scent Profile</h2>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%); border-radius: 15px; padding: 25px; margin-bottom: 25px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 5px 0; font-size: 20px; color: #333;">Main Function Formula - ${profile.name} ${profile.subtitle}</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">🧠 ${profile.description}</p>
                    </div>
                    
                    <div style="background: white; border-radius: 12px; padding: 20px;">
                        ${formulaHtml}
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 2px solid #4a90e2; margin-top: 10px;">
                            <div>
                                <span style="font-weight: 600; color: #4a90e2;">AI Intelligent Balance Factor</span>
                                <span style="font-size: 12px; color: #666; margin-left: 8px;">${aiBalanceFactor}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f8f8; border-radius: 10px; padding: 20px; text-align: center;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Monthly Optimization Promise</h4>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">✨ ÔDÔRAI will continuously learn and improve your exclusive formula</p>
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 25px;">
                    <button id="save-profile" style="
                        background: #4a90e2;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        transition: background 0.3s ease;
                    " onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4a90e2'">
                        Save My Profile
                    </button>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Add event listeners
            document.getElementById('close-profile').addEventListener('click', () => {
                this.closeQuiz();
            });
            
            document.getElementById('save-profile').addEventListener('click', () => {
                // Save profile to localStorage
                localStorage.setItem('odorai_scent_profile', JSON.stringify(profile));
                
                // Show success message
                alert('Your custom scent profile has been saved! ÔDÔRAI will use this to personalize your aromatherapy experience.');
                
                // Close quiz modal
                this.closeQuiz();
            });
        }
        
        // Hide recommendation panel
        hideRecommendationPanel() {
            const panel = document.querySelector('.smart-recommendation-panel');
            if (panel) {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(-50%) translateX(300px)';
                setTimeout(() => {
                    if (panel.parentNode) {
                        panel.remove();
                    }
                }, 500);
            }
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

    // 在全域window上掛一個addToCartFromPanel方法，複用主頁的加入購物車邏輯
    window.addToCartFromPanel = function(colorGroup, button, event) {
        // 切換顏色
        if (typeof colorGroup === 'string' && window.currentColorGroup !== colorGroup) {
            window.currentColorGroup = colorGroup;
            if (typeof generateImageStack === 'function') generateImageStack(colorGroup);
            if (typeof updateWishlistHeart === 'function') updateWishlistHeart(colorGroup);
            if (typeof updateCartBadge === 'function') updateCartBadge();
        }
        // 模擬主頁按鈕的動畫和邏輯（僅桌面端）
        if (button && !isMobileDevice()) {
            if (button.classList.contains('loading')) return;
            addEnhancedRippleEffect(button, event || { clientX: 0, clientY: 0 });
            button.classList.add('loading');
            button.style.transform = 'scale(0.98)';
            setTimeout(() => {
                button.classList.remove('loading');
                button.style.transform = '';
                window.cartItemCount = (window.cartItemCount || 0) + 1;
                showCartFlyAnimation(button);
                setTimeout(() => {
                    updateCartBadge();
                }, 300);
                // 获取當前選中的產品代號
                const selectedSwatch = document.querySelector('.color-swatch.selected');
                const productCode = selectedSwatch ? selectedSwatch.dataset.colorName : 'PRODUCT';
                showEnhancedSuccessAnimation(button);
                setTimeout(() => {
                    showSuccessNotification(`ÔFFUSER ${productCode} added to cart!`, window.cartItemCount);
                }, 200);
            }, 800);
        } else if (button && isMobileDevice()) {
            // 手機端簡化版，只更新數據
            window.cartItemCount = (window.cartItemCount || 0) + 1;
            updateCartBadge();
            // 获取當前選中的產品代號
            const selectedSwatch = document.querySelector('.color-swatch.selected');
            const productCode = selectedSwatch ? selectedSwatch.dataset.colorName : 'PRODUCT';
            alert(`ÔFFUSER ${productCode} added to cart!`);
        }
    }

    // 動畫效果初始化 - 只在桌面端執行
    if (!isMobileDevice()) {
        console.log('🖥️ Desktop device - enabling animations');
        // 啟動所有動畫效果
        if (typeof startParticleSystem === 'function') startParticleSystem();
        if (typeof createMouseFollower === 'function') createMouseFollower();
        if (typeof createAdvancedMouseFollower === 'function') createAdvancedMouseFollower();
        if (typeof createStatusIndicator === 'function') createStatusIndicator();
        if (typeof enhanceMouseInteractions === 'function') enhanceMouseInteractions();
        if (typeof createParallaxEffects === 'function') createParallaxEffects();
        if (typeof createDynamicTooltips === 'function') createDynamicTooltips();
        if (typeof initParallaxEffects === 'function') initParallaxEffects();
        if (typeof addRippleEffect === 'function') window.enableRipple = true;
    } else {
        console.log('📱 Mobile device - all animations disabled');
        // 手機端禁用所有動畫功能
        window.enableRipple = false;
        // 移除所有可能的動畫DOM元素
        const elementsToRemove = [
            '.particles-container',
            '.breathing-glow', 
            '.mouse-follower',
            '.mouse-follower-primary',
            '.mouse-follower-secondary'
        ];
        elementsToRemove.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
    }

    // 進入頁面時自動生成圖片堆疊與愛心狀態
    if (typeof generateImageStack === 'function') generateImageStack(currentColorGroup);
    if (typeof updateWishlistHeart === 'function') updateWishlistHeart(currentColorGroup);

    // updateIndicators函數已在上方定義，此處移除重複定義

    // 手機端重新初始化點擊事件（無hover效果）
    function initializeMobileClickEvents() {
        if (!isMobileDevice()) return;
        
        console.log('📱 Reinitializing mobile click events...');
        
        // 重新初始化顏色選擇器
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                const newColorName = this.dataset.colorName;
                const newPrice = this.dataset.price;

                if (imageGroups[newColorName]) {
                    currentColorGroup = newColorName;
                    
                    // 立即重置圖片索引到第一張
                    currentImageIndex = 0;
                    
                    // 重新生成圖片堆疊
                    generateImageStack(currentColorGroup);

                    const colorNameDisplay = document.getElementById('color-name');
                    const priceDisplay = document.getElementById('product-price');
                    if (colorNameDisplay) colorNameDisplay.textContent = newColorName;
                    if (priceDisplay) priceDisplay.textContent = newPrice;

                    updateWishlistHeart(currentColorGroup);

                    colorSwatches.forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // 強制重置到第一張圖片
                    resetImageIndex();
                    
                    // 手機端額外確保位置正確
                    if (isMobileDevice()) {
                        setTimeout(() => {
                            const container = imageStack?.parentElement;
                            if (container) {
                                container.style.scrollBehavior = 'auto';
                                container.scrollLeft = 0;
                                container.scrollTo({ left: 0, behavior: 'auto' });
                                currentImageIndex = 0;
                                updateIndicators(0);
                                
                                console.log('📱 Color changed - Reset to first image');
                                
                                // 恢復smooth滾動
                                setTimeout(() => {
                                    container.style.scrollBehavior = 'smooth';
                                }, 100);
                            }
                        }, 50);
                    }
                }
            });
        });
        
        // 重新初始化購物車按鈕
        const placeInCartBtn = document.getElementById('place-in-cart');
        if (placeInCartBtn) {
            placeInCartBtn.addEventListener('click', function(event) {
                event.preventDefault();
                
                if (this.classList.contains('loading')) return;
                
                // 手機端簡化版加入購物車
                cartItemCount++;
                updateCartBadge();
                
                                    // 获取當前選中的產品代號  
                    const selectedSwatch = document.querySelector('.color-swatch.selected');
                    const productCode = selectedSwatch ? selectedSwatch.dataset.colorName : 'PRODUCT';
                    alert(`ÔFFUSER ${productCode} added to cart!`);
            });
        }
        
        // 重新初始化愛心按鈕
        const wishlistHeart = document.getElementById('wishlist-heart');
        if (wishlistHeart) {
            wishlistHeart.addEventListener('click', function() {
                wishlistStates[currentColorGroup] = !wishlistStates[currentColorGroup];
                updateWishlistHeart(currentColorGroup);
                
                const colorName = currentColorGroup.charAt(0).toUpperCase() + currentColorGroup.slice(1);
                if (wishlistStates[currentColorGroup]) {
                    alert(`Added ${colorName} to your wishlist!`);
                } else {
                    alert(`Removed ${colorName} from your wishlist.`);
                }
            });
        }
        
        // 重新初始化資訊區塊展開
        const expandableItems = document.querySelectorAll('.info-item.expandable');
        expandableItems.forEach(item => {
            const header = item.querySelector('.info-header');
            const content = item.querySelector('.info-content');
            
            if (header && content) {
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
            }
        });
        
        console.log('📱 Mobile click events reinitialized');
    }

    // 手機端滾動優化
    if (isMobileDevice()) {
        // 移除所有可能阻止滾動的touch事件
        const elementsToFix = [
            imageStack,
            document.querySelector('.product-image-container'),
            document.body,
            document.documentElement
        ];
        
        elementsToFix.forEach(element => {
            if (element) {
                element.ontouchmove = null;
                element.ontouchstart = null;
                element.ontouchend = null;
                // 移除可能存在的事件監聽器
                element.style.touchAction = 'auto';
                element.style.overflowY = 'auto';
            }
        });
        
        // 確保頁面可以正常滾動
        document.body.style.overflow = 'auto';
        document.body.style.overscrollBehavior = 'auto';
        document.body.style.touchAction = 'manipulation';
        
        // 確保非圖片區域的垂直滾動
        const scrollableElements = [
            '.product-info',
            '.main-header', 
            '.mobile-search-container',
            '.container'
        ];
        
        scrollableElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.touchAction = 'manipulation';
                element.style.overflowY = 'auto';
            }
        });
        
        console.log('📱 Mobile scrolling optimized');
        
        // 強制清理所有可能的動畫DOM元素
        const animationElements = [
            '.particles-container',
            '.breathing-glow',
            '.mouse-follower',
            '.mouse-follower-primary', 
            '.mouse-follower-secondary',
            '.interaction-particle',
            '.click-ripple',
            '.enhanced-ripple'
        ];
        
        animationElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
        
        // 禁用所有點擊動畫函數
        window.createClickRipple = function() { console.log('📱 Click ripple disabled on mobile'); };
        window.createInteractionParticle = function() { console.log('📱 Interaction particle disabled on mobile'); };
        window.addEnhancedRippleEffect = function() { console.log('📱 Enhanced ripple disabled on mobile'); };
        window.showCartFlyAnimation = function() { console.log('📱 Cart fly animation disabled on mobile'); };
        window.showEnhancedSuccessAnimation = function() { console.log('📱 Success animation disabled on mobile'); };
        
        console.log('📱 All animation functions disabled on mobile');
        
        // 移除所有hover效果的事件監聽器
        const allInteractiveElements = document.querySelectorAll(
            'button, .btn, .color-swatch, .info-header, a, .cart-icon-wrapper, ' +
            '.section-header, .contact-advisor, .header-nav, .fa-heart, ' +
            '.mobile-search-input'
        );
        
        allInteractiveElements.forEach(element => {
            // 克隆元素來移除所有事件監聽器
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
                element.parentNode.replaceChild(newElement, element);
            }
        });
        
        // 重新添加必要的點擊事件（不包含hover效果）
        setTimeout(() => {
            // 重新初始化必要的點擊功能
            initializeMobileClickEvents();
        }, 100);
        
        console.log('📱 All hover effects disabled on mobile');
    }

});