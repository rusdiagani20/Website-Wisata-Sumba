// ===== SCRIPT LINK AKTIF NAVBAR =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.link-active').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        const currentPage = window.location.pathname.split('/').pop();
        if (linkPage === currentPage) {
            link.classList.remove('text-gray-600', 'dark:text-gray-50', 'after:scale-x-0');
            link.classList.add('text-blue-900', 'dark:text-blue-500', 'after:scale-x-100');
        }
    });
});

// ===== DARK MODE TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const themeToggleDarkIcon  = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn       = document.getElementById('theme-toggle');

    if (!themeToggleDarkIcon || !themeToggleLightIcon || !themeToggleBtn) return;

    const themeToggleDarkIconMobile  = document.getElementById('theme-toggle-dark-icon-mobile');
    const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
    
    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        if (themeToggleDarkIconMobile) themeToggleDarkIconMobile.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        if (themeToggleLightIconMobile) themeToggleLightIconMobile.classList.remove('hidden');
    }

    const toggleTheme = function() {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // Toggle mobile icons jika ada
        const themeToggleDarkIconMobile  = document.getElementById('theme-toggle-dark-icon-mobile');
        const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
        if (themeToggleDarkIconMobile && themeToggleLightIconMobile) {
            themeToggleDarkIconMobile.classList.toggle('hidden');
            themeToggleLightIconMobile.classList.toggle('hidden');
        }

        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Event listener untuk button toggle mobile
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.addEventListener('click', toggleTheme);
    }
});

// ===== PENCARIAN REAL TIME =====
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchForm  = document.getElementById('searchForm');
    const cards       = document.querySelectorAll('.card-item');

    if (!searchInput || !searchForm) return; // guard clause — stop jika elemen tidak ada

    function filterCards(query) {
        const keyword = query.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const title  = card.querySelector('h2')?.textContent.toLowerCase() || '';
            const desc   = card.querySelector('p')?.textContent.toLowerCase() || '';
            const region = card.dataset.region?.toLowerCase() || '';
            const match  = !keyword || title.includes(keyword) || desc.includes(keyword) || region.includes(keyword);

            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        let emptyMsg = document.getElementById('empty-msg');
        if (!emptyMsg) {
            emptyMsg = document.createElement('p');
            emptyMsg.id        = 'empty-msg';
            emptyMsg.className = 'col-span-3 text-center text-gray-500 py-10';
            emptyMsg.textContent = 'No destinations found.';
            document.getElementById('card-group')?.appendChild(emptyMsg);
        }
        emptyMsg.style.display = visibleCount === 0 ? '' : 'none';
    }

    searchInput.addEventListener('input', (e) => filterCards(e.target.value));
    searchForm.addEventListener('submit', (e) => { e.preventDefault(); filterCards(searchInput.value); });
});

// ===== FILTER REGION DROPDOWN =====
document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.getElementById('dropdownHoverButton');
    const dropdownMenu   = document.getElementById('dropdownHover');

    if (!dropdownButton || !dropdownMenu) return; // guard clause

    const filterLinks = document.querySelectorAll('.region-filter');
    const allCards    = document.querySelectorAll('.card-item');
    const btnShowMore = document.getElementById('btnShowMore');

    let currentRegion = 'all';
    let isExpanded    = false;

    dropdownButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', function(e) {
        if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    function updateDisplay() {
        let filteredCards = currentRegion === 'all'
            ? Array.from(allCards)
            : Array.from(allCards).filter(card => card.getAttribute('data-region') === currentRegion);

        filteredCards.forEach((card, index) => {
            card.style.display = (!isExpanded && index >= 3) ? 'none' : 'block';
        });

        Array.from(allCards).forEach(card => {
            if (!filteredCards.includes(card)) card.style.display = 'none';
        });

        if (btnShowMore) {
            btnShowMore.style.display = filteredCards.length <= 3 ? 'none' : 'inline-flex';
            btnShowMore.innerHTML = isExpanded && filteredCards.length > 3
                ? `Show Less <svg class="w-4 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7"/></svg>`
                : `Show More <svg class="w-4 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>`;
        }

        let noResultMsg = document.querySelector('.no-result-message');
        if (filteredCards.length === 0) {
            if (!noResultMsg) {
                const message = document.createElement('div');
                message.className   = 'no-result-message col-span-3 text-center py-10 text-gray-500 text-lg font-semibold';
                message.textContent = 'No destinations found in this region.';
                document.getElementById('card-group')?.appendChild(message);
            }
        } else {
            noResultMsg?.remove();
        }
    }

    function filterByRegion(region, regionText) {
        currentRegion = region;
        isExpanded    = false;
        dropdownButton.innerHTML = `${regionText}<svg class="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>`;
        updateDisplay();
    }

    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterByRegion(this.getAttribute('data-region'), this.textContent.trim());
            dropdownMenu.classList.add('hidden');
        });
    });

    if (btnShowMore) {
        btnShowMore.addEventListener('click', function() {
            isExpanded = !isExpanded;
            updateDisplay();
        });
    }

    filterByRegion('all', 'All Regions');
});

// ===== SCROLL TO TOP =====
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (!scrollToTopBtn) return; // guard clause

    window.addEventListener('scroll', function() {
        scrollToTopBtn.classList.toggle('show', window.scrollY > 500);
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== FILTER GALLERY =====
document.addEventListener('DOMContentLoaded', function () {
    const filterLinks  = document.querySelectorAll('.region-filter');
    const allItems     = document.querySelectorAll('.gallery-item');
    const btnShowMore  = document.getElementById('btnShowMore');
    const galleryGroup = document.getElementById('gallery-group');

    if (!filterLinks.length || !galleryGroup) return;

    const ITEMS_PER_PAGE_ALL = 8;
    const ITEMS_PER_PAGE_FILTER = 3;
    let currentRegion    = 'all';
    let isExpanded       = false;

    // ─── Simpan class asli tiap item saat pertama kali (sekali saja) ──────────
    allItems.forEach(item => {
        // Ambil dari data-original-class di HTML jika sudah ada,
        // fallback ke className runtime kalau belum
        if (!item.dataset.originalClass) {
            item.dataset.originalClass = Array.from(item.classList)
                .filter(c => c !== 'gallery-item')
                .join(' ');
        }
    });

    // ─── Kembalikan semua item ke class layout aslinya (mode All) ─────────────
    function restoreOriginalClasses() {
        allItems.forEach(item => {
            let baseClass = item.dataset.originalClass || '';
            
            // Pastikan class essential untuk hover effect selalu ada
            const essentialClasses = ['relative', 'overflow-hidden', 'group'];
            const classes = `${baseClass}`.split(' ').filter(c => c);
            
            essentialClasses.forEach(essential => {
                if (!classes.includes(essential)) {
                    classes.push(essential);
                }
            });
            
            item.className = `gallery-item ${classes.join(' ')}`;
        });
        galleryGroup.classList.remove('filtered-mode');
    }

    // ─── Ubah semua item ke ukuran flat w-full h-70 (mode filter region) ──────
    function applyFlatClasses(items) {
        items.forEach(item => {
            // Pastikan class group tetap ada untuk hover effect
            item.className = 'gallery-item relative w-full h-70 overflow-hidden group';
        });
        galleryGroup.classList.add('filtered-mode');
    }

    // ─── Update tampilan utama ─────────────────────────────────────────────────
    function updateDisplay() {

        // 1. Kumpulkan item sesuai region
        const filtered = currentRegion === 'all'
            ? Array.from(allItems)
            : Array.from(allItems).filter(
                item => item.getAttribute('data-region') === currentRegion
              );

        // 2. Sembunyikan semua item dulu
        allItems.forEach(item => { item.style.display = 'none'; });

        if (currentRegion === 'all') {
            // ── MODE ALL ──────────────────────────────────────────────────────
            restoreOriginalClasses();

            // Tampilkan hanya 6 item pertama, ukuran & layout asli tetap utuh
            filtered.slice(0, ITEMS_PER_PAGE_ALL).forEach(item => {
                item.style.display = 'block';
            });

            // Tombol Show More disembunyikan di mode All
            if (btnShowMore) btnShowMore.style.display = 'none';

        } else {
            // ── MODE FILTER REGION ────────────────────────────────────────────
            // Ubah semua item yang masuk filter ke ukuran flat
            applyFlatClasses(filtered);

            // Tentukan berapa yang ditampilkan
        const limit = isExpanded ? filtered.length : ITEMS_PER_PAGE_FILTER;
            filtered.forEach((item, index) => {
                item.style.display = index < limit ? 'block' : 'none';
            });

            // Handle tombol Show More / Show Less
            if (btnShowMore) {
                if (filtered.length > ITEMS_PER_PAGE_FILTER) {
                    btnShowMore.style.display = 'inline-flex';
                    btnShowMore.innerHTML = isExpanded
                        ? `Show Less
                           <svg class="w-4 h-4 ms-1.5 -me-0.5 rotate-180" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="none" viewBox="0 0 24 24">
                               <path stroke="currentColor" stroke-linecap="round"
                                     stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
                           </svg>`
                        : `Show More
                           <svg class="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="none" viewBox="0 0 24 24">
                               <path stroke="currentColor" stroke-linecap="round"
                                     stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
                           </svg>`;
                } else {
                    // Data ≤ 6, tombol tidak perlu tampil
                    btnShowMore.style.display = 'none';
                }
            }
        }

        // ── Pesan kosong jika tidak ada data ──────────────────────────────────
        let noResultMsg = galleryGroup.querySelector('.no-result-message');
        if (filtered.length === 0) {
            if (!noResultMsg) {
                noResultMsg = document.createElement('div');
                noResultMsg.className   = 'no-result-message col-span-3 text-center py-10 text-gray-500 text-lg font-semibold';
                noResultMsg.textContent = 'No destinations found in this region.';
                galleryGroup.appendChild(noResultMsg);
            }
        } else {
            noResultMsg?.remove();
        }
    }

    // ─── Set region aktif + update style link ─────────────────────────────────
    function setActiveRegion(region) {
        currentRegion = region;
        isExpanded    = false;

        filterLinks.forEach(link => {
            const isActive = link.getAttribute('data-region') === region;

            // Aktif: garis bawah muncul + warna biru
            link.classList.toggle('text-blue-900', isActive);
            link.classList.toggle('dark:text-blue-500', isActive);
            link.classList.toggle('after:scale-x-100', isActive);
            // Non-aktif: kembalikan ke abu-abu + garis bawah hilang
            link.classList.toggle('text-gray-600', !isActive);
            link.classList.toggle('dark:text-gray-50', !isActive);
            link.classList.toggle('after:scale-x-0', !isActive);
        });

        updateDisplay();
    }

    // ─── Event: klik tiap link filter ─────────────────────────────────────────
    filterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveRegion(this.getAttribute('data-region'));
        });
    });

    // ─── Event: Show More / Show Less ─────────────────────────────────────────
    if (btnShowMore) {
        btnShowMore.addEventListener('click', function () {
            isExpanded = !isExpanded;
            updateDisplay();
        });
    }

    // ─── Inisialisasi default → All ───────────────────────────────────────────
    setActiveRegion('all');
});
// End Filter Gallery

// ===== FORM TRIP SUBMISSION =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tripForm');

    if (!form) return; // guard clause — stop jika form tidak ada

    // Fungsi untuk mereset semua input form
    function resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('trip_date').value = '';
        document.getElementById('message').value = '';
    }
    
    // Menambahkan event listener untuk submit
    form.addEventListener('submit', function(event) {
        // Mencegah form untuk refresh halaman
        event.preventDefault();
        event.stopPropagation();
        
        // Ambil semua nilai dari input
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const tripDate = document.getElementById('trip_date').value;
        const message = document.getElementById('message').value.trim();
        
        // Validasi: cek apakah field wajib sudah diisi
        if (!name) {
            alert('❌ Harap isi Nama Anda!');
            document.getElementById('name').focus();
            return false;
        }

        if (!phone) {
            alert('❌ Harap isi Nomor Telepon Anda!');
            document.getElementById('phone').focus();
            return false;
        }
        
        if (!email) {
            alert('❌ Harap isi Email Anda!');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!tripDate) {
            alert('❌ Harap pilih Tanggal Perjalanan!');
            document.getElementById('trip_date').focus();
            return false;
        }
        
        // Validasi format email sederhana
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('❌ Harap masukkan email yang valid! (contoh: nama@domain.com)');
            document.getElementById('email').focus();
            return false;
        }
        
        // Buat pesan popup
        let popupMessage = "✅ DATA BERHASIL DISIMPAN!\n\n";
        popupMessage += "==============================\n";
        popupMessage += "📋 DETAIL DATA ANDA:\n";
        popupMessage += "==============================\n";
        popupMessage += `👤 Nama: ${name}\n`;
        popupMessage += `📞 Telepon: ${phone}\n`;
        popupMessage += `📧 Email: ${email}\n`;
        popupMessage += `📅 Tanggal Trip: ${tripDate}\n`;
        popupMessage += `💬 Pesan: ${message || "(Tidak ada pesan)"}\n`;
        popupMessage += "==============================\n";
        popupMessage += "Terima kasih! Kami akan segera menghubungi Anda.";
        
        // Tampilkan popup
        alert(popupMessage);
        
        // Setelah popup OK ditekan, reset semua input form
        resetForm();
        
        // Opsional: Fokus ke input nama lagi untuk pengisian berikutnya
        document.getElementById('name').focus();
        
        // Tampilkan di console untuk debugging
        console.log('Data berhasil disimpan dan form telah direset:', {
            name: name,
            phone: phone,
            email: email,
            tripDate: tripDate,
            message: message
        });
        
        return true;
    });
    
    // Tambahan: Event listener untuk debugging
    console.log('Form trip siap digunakan! Silahkan isi form dan klik Submit. Setelah submit, form akan otomatis tereset.');
});
// End Form Trip Submission

// ===== TESTIMONIAL SHOW MORE/LESS =====
let isExpanded = false;

function initializeShowMoreLess() {
    const showMoreBtn = document.getElementById('show-more-btn');
    const testimonialsContainer = document.getElementById('testimonials-container');

    if (!showMoreBtn || !testimonialsContainer) return;

    const testimonialCards = testimonialsContainer.querySelectorAll('.testimonial-card');
    
    // Hide cards from index 3 onwards
    testimonialCards.forEach((card, index) => {
        if (index >= 3) {
            card.classList.add('hidden');
        }
    });

    // Remove existing event listener to avoid duplicates
    showMoreBtn.removeEventListener('click', handleShowMoreClick);
    
    // Add event listener
    showMoreBtn.addEventListener('click', handleShowMoreClick);
}

function handleShowMoreClick(e) {
    e.preventDefault();
    const showMoreBtn = document.getElementById('show-more-btn');
    const testimonialsContainer = document.getElementById('testimonials-container');
    const testimonialCards = testimonialsContainer.querySelectorAll('.testimonial-card');
    
    isExpanded = !isExpanded;

    // Toggle hidden class pada card dari index 3 onwards
    testimonialCards.forEach((card, index) => {
        if (index >= 3) {
            card.classList.toggle('hidden');
        }
    });

    // Update button text
    if (isExpanded) {
        showMoreBtn.innerHTML = `Show less
            <svg class="text-blue-900 dark:text-blue-500 group-hover:text-blue-950 dark:group-hover:text-blue-700" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                <path d="M200-200v-440h80v360h360v80H200Zm200-200v-440h80v360h360v80H400Z"/>
            </svg>`;
    } else {
        showMoreBtn.innerHTML = `Show more
            <svg class="text-blue-900 dark:text-blue-500 group-hover:text-blue-950 dark:group-hover:text-blue-700" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                <path d="M680-320v-360H320v-80h440v440h-80ZM480-120v-360H120v-80h440v440h-80Z"/>
            </svg>`;
    }
}

// ===== TESTIMONIAL FORM HANDLER =====
// Load testimonials from localStorage on page load
function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const container = document.getElementById('testimonials-container');
    
    testimonials.forEach(testimonial => {
        const cardHTML = createTestimonialCard(testimonial);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML;
        container.appendChild(tempDiv.firstElementChild);
    });
}

// Create testimonial card HTML
function createTestimonialCard(data) {
    const stars = Array(5).fill(0).map((_, i) => {
        const isFilled = i < data.rating;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 ${isFilled ? 'text-cyan-900' : 'text-gray-400'}">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                </svg>`;
    }).join('');
    
    return `<div class="testimonial-card relative flex flex-col shadow-xl/20 lg:p-7 md:p-5 max-sm:p-3 gap-5 rounded-sm dark:bg-neutral-secondary-medium">
                <div class="flex gap-1">
                    ${stars}
                </div>
                <div class="text-justify">
                    <p class="lg:text-base md:text-base max-sm:text-sm dark:text-gray-50">"${data.message}"</p>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-15 h-15 shrink-0">
                        <img src="${data.avatar}" alt="${data.name}" class="w-full h-full object-cover rounded-full">
                    </div>
                    <div>
                        <p class="lg:text-base md:text-base max-sm:text-sm font-semibold dark:text-gray-50">${data.name}</p>
                        <p class="lg:text-base md:text-base max-sm:text-xs dark:text-gray-50">${data.job}</p>
                    </div>
                </div>
                <div class="absolute top-1 right-2 p-2 opacity-35">
                    <svg xmlns="http://www.w3.org/2000/svg" height="74px" viewBox="0 -960 960 960" width="74px" fill="#527489"><path d="m165-201 104-177q-72-11-114-63.5T113-560q0-78 54.5-132T300-746q78 0 131.5 54T485-560.03q0 24.4-5 44.72Q475-495 466-477L306-201H165Zm403 0 102-177q-72-11-113.5-63.5T515-560q0-78 53.5-132T700-746q78 0 132.5 54T887-560.03q0 24.4-5 44.72Q877-495 867-477L707-201H568ZM329-530.15q12-12.14 12-29.5 0-17.35-11.65-29.85-11.64-12.5-29-12.5-17.35 0-29.85 12.15-12.5 12.14-12.5 29.5 0 17.35 12.15 29.85 12.14 12.5 29.5 12.5Q317-518 329-530.15Zm400.5 0q12.5-12.14 12.5-29.5 0-17.35-12.15-29.85-12.14-12.5-29.5-12.5Q683-602 671-589.85q-12 12.14-12 29.5 0 17.35 11.65 29.85 11.64 12.5 29 12.5 17.35 0 29.85-12.15ZM701-560Zm-401 0Z"/></svg>
                </div>
            </div>`;
}

// Show success/error popup
function showPopup(message, type = 'success') {
    const popup = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    popup.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse`;
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Handle star rating
const starBtns = document.querySelectorAll('.star-btn');
let selectedRating = 0;

starBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRating = parseInt(btn.dataset.rating);
        document.getElementById('ratingValue').value = selectedRating;
        
        // Update star colors
        starBtns.forEach(b => {
            const rating = parseInt(b.dataset.rating);
            const svg = b.querySelector('svg');
            if (rating <= selectedRating) {
                svg.classList.remove('text-gray-400');
                svg.classList.add('text-cyan-900');
            } else {
                svg.classList.remove('text-cyan-900');
                svg.classList.add('text-gray-400');
            }
        });
    });
});

// Handle file upload
let uploadedImageData = null;
const fileInput = document.getElementById('file_input');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImageData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Form validation
function validateForm() {
    const name = document.getElementById('reviewName').value.trim();
    const job = document.getElementById('reviewJob').value.trim();
    const message = document.getElementById('reviewMessage').value.trim();
    
    if (!name) {
        showPopup('Please enter your name', 'error');
        return false;
    }
    if (!job) {
        showPopup('Please enter your job title', 'error');
        return false;
    }
    if (!message) {
        showPopup('Please enter your message', 'error');
        return false;
    }
    if (!uploadedImageData) {
        showPopup('Please upload an avatar image', 'error');
        return false;
    }
    if (selectedRating === 0) {
        showPopup('Please select a rating', 'error');
        return false;
    }
    
    return true;
}

// Handle form submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Create testimonial object
        const testimonial = {
            name: document.getElementById('reviewName').value.trim(),
            job: document.getElementById('reviewJob').value.trim(),
            message: document.getElementById('reviewMessage').value.trim(),
            rating: selectedRating,
            avatar: uploadedImageData
        };
        
        // Save to localStorage
        const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
        testimonials.push(testimonial);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        
        // Add card to DOM
        const cardHTML = createTestimonialCard(testimonial);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML;
        document.getElementById('testimonials-container').appendChild(tempDiv.firstElementChild);
        
        // Reinitialize show more/less with new card
        initializeShowMoreLess();
        
        // Reset form
        reviewForm.reset();
        uploadedImageData = null;
        selectedRating = 0;
        document.getElementById('ratingValue').value = 0;
        starBtns.forEach(btn => {
            const svg = btn.querySelector('svg');
            svg.classList.remove('text-cyan-900');
            svg.classList.add('text-gray-400');
        });
        
        // Show success message
        showPopup('Review added successfully!', 'success');
        
        // Close modal using Flowbite method
        const cancelBtn = document.querySelector('[data-modal-hide="crud-modal"]');
        if (cancelBtn) {
            cancelBtn.click();
        }
    });
}

// Load testimonials when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTestimonials();
    // Initialize show more/less functionality
    setTimeout(initializeShowMoreLess, 100);
});