document.addEventListener('DOMContentLoaded', function() {
    
    // --- Element Selection ---
    const mainProductImage = document.getElementById('main-product-image');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const colorNameDisplay = document.getElementById('color-name');
    const priceDisplay = document.getElementById('product-price'); // **NEW**: Select the price element

    const wishlistHeart = document.getElementById('wishlist-heart');
    const contactBtn = document.getElementById('contact-btn');
    const findStoreBtn = document.getElementById('find-store-btn');

    // --- Image, Color Name, and Price Swapping Logic ---
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            // 1. Get data from the dataset of the clicked swatch
            const newImageSrc = this.dataset.mainImage;
            const newColorName = this.dataset.colorName;
            const newPrice = this.dataset.price; // **NEW**: Get the price from the dataset

            // 2. Update the main product image
            mainProductImage.src = newImageSrc;

            // 3. Update the displayed color name
            colorNameDisplay.textContent = newColorName;
            
            // 4. Update the displayed price
            priceDisplay.textContent = newPrice; // **NEW**: Update the price content

            // 5. Update the 'selected' visual style
            colorSwatches.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // --- Button Click Logic ---

    // Wishlist Heart Button
    wishlistHeart.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.classList.remove('far');
            this.classList.add('fas');
            alert('Added to your wishlist!');
        } else {
            this.classList.remove('fas');
            this.classList.add('far');
            alert('Removed from your wishlist.');
        }
    });

    // Contact Concierge Button
    contactBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        alert('Contacting Concierge Services...');
    });

    // Find in Store Button
    findStoreBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        alert('Opening store locator...');
    });


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