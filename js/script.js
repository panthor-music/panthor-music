document.addEventListener('DOMContentLoaded', async () => {

    // ── Load CMS data (all in parallel, graceful fallback if any fail) ───
    const [settingsData, aboutData, tracksData, videosData] = await Promise.all([
        fetch('_data/settings.json').then(r => r.json()).catch(() => null),
        fetch('_data/about.json').then(r => r.json()).catch(() => null),
        fetch('_data/tracks.json').then(r => r.json()).catch(() => null),
        fetch('_data/videos.json').then(r => r.json()).catch(() => null),
    ]);

    // Hero subtitle
    if (settingsData?.hero_subtitle) {
        const heroSub = document.getElementById('hero-subtitle');
        if (heroSub) heroSub.textContent = settingsData.hero_subtitle;
    }

    // Social links (footer + preview modal)
    if (settingsData?.social) {
        const soc = settingsData.social;
        const map = { instagram: soc.instagram, youtube: soc.youtube, spotify: soc.spotify, 'apple-music': soc.apple_music };
        Object.entries(map).forEach(([key, url]) => {
            if (url) document.querySelectorAll(`[data-social="${key}"]`).forEach(a => { a.href = url; });
        });
    }

    // Artist bio
    if (aboutData) {
        const abMain = document.getElementById('about-paragraphs');
        if (abMain && aboutData.paragraphs?.length) {
            abMain.innerHTML = aboutData.paragraphs.map(p => `<p>${p}</p>`).join('');
        }
        const abExt = document.getElementById('aboutExtended');
        if (abExt && aboutData.paragraphs_extended?.length) {
            abExt.innerHTML = aboutData.paragraphs_extended.map(p => `<p>${p}</p>`).join('');
        }
    }

    // Videos section
    if (videosData) {
        const badge = document.getElementById('videos-coming-soon');
        if (badge) badge.style.display = videosData.coming_soon ? '' : 'none';

        if (videosData.featured) {
            const f = videosData.featured;
            const thumbWrap = document.querySelector('.nr-thumb-wrap');
            if (thumbWrap) {
                thumbWrap.dataset.videoId = f.video_id;
                const img = thumbWrap.querySelector('img');
                if (img) { img.src = f.thumbnail; img.alt = f.title; }
            }
            const nrInfo = document.querySelector('.nr-info');
            if (nrInfo) {
                const t = nrInfo.querySelector('.nr-title');
                const s = nrInfo.querySelector('.nr-sub');
                const d = nrInfo.querySelector('.nr-desc');
                if (t) t.textContent = f.title;
                if (s) s.textContent = f.subtitle;
                if (d) d.textContent = f.description;
            }
        }

        if (videosData.more_videos?.length) {
            const grid = document.getElementById('more-videos-grid');
            if (grid) {
                grid.innerHTML = videosData.more_videos.map(v => `
                    <div class="video-card" data-video-id="${v.video_id}">
                        <img src="${v.thumbnail}" alt="${v.title}" loading="lazy">
                        <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
                        <h3>${v.title}</h3>
                    </div>`).join('');
            }
        }
    }

    // 1. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 800);
        });
    }


    // 3. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Parallax Effect & Hero Particles
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            // Background parallax (JS fallback / enhancement for all browsers)
            if (heroSection) {
                heroSection.style.backgroundPositionY = `${50 + scrolled * 0.2}%`;
            }
            // Hero text fade + lift
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
            }
        }
    });

    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        for(let i=0; i<40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 4 + 3}s`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // ── Animated Music Player ────────────────────────────────────────────
    const TRACKS = (tracksData?.tracks?.length) ? tracksData.tracks : [
        { title: 'Drifter',                src: 'MP3s/mp3s/mp3s/Drifter bpm 160 Final Master.mp3' },
        { title: 'Gates of Return',        src: 'MP3s/mp3s/mp3s/Gates of Return BPM 140 Final Master.mp3' },
        { title: 'I Love You',             src: 'MP3s/mp3s/mp3s/I love you bpm 140 Final Master.mp3' },
        { title: 'Life Is for Man to Live',src: 'MP3s/mp3s/mp3s/Life is for Man to Live bpm 84 Final Master.mp3' },
        { title: 'No War',                 src: 'MP3s/mp3s/mp3s/No War BPM 85 Final Master.mp3' },
        { title: 'No Woman Stands Alone',  src: 'MP3s/mp3s/mp3s/No Woman Stands Alone bpm 160 Final Master.mp3' },
        { title: 'Oh Jah',                 src: 'MP3s/mp3s/mp3s/Oh Jah bpm150 Final Master.mp3' },
        { title: 'Purpose',                src: 'MP3s/mp3s/mp3s/Purpose BPM 150 Final Master.mp3' },
        { title: 'School Days',            src: 'MP3s/mp3s/mp3s/School Days bpm 145 Final Master.mp3' },
        { title: 'Take Life Easy',         src: 'MP3s/mp3s/mp3s/Take Life Easy bpm 160 Final Master.mp3' },
        { title: 'Water Pumpee',           src: 'MP3s/mp3s/mp3s/Water Pumpee bpm 87 Audio Final Master.mp3' },
    ];

    const mpList    = document.getElementById('mpList');
    const mpVinyl   = document.getElementById('mpVinyl');
    const mpVinylWrap = mpVinyl ? mpVinyl.parentElement : null;
    const mpEq      = document.getElementById('mpEq');
    const mpTitle   = document.getElementById('mpTitle');
    const mpCur     = document.getElementById('mpCur');
    const mpTot     = document.getElementById('mpTot');
    const mpFill    = document.getElementById('mpFill');
    const mpSeek    = document.getElementById('mpSeek');
    const mpPlayIcon= document.getElementById('mpPlayIcon');
    const mpVol     = document.getElementById('mpVol');
    const btnPlay   = document.getElementById('mpPlay');
    const btnPrev   = document.getElementById('mpPrev');
    const btnNext   = document.getElementById('mpNext');

    if (!mpList || !btnPlay) { /* player not in DOM */ }
    else {
        let audio       = new Audio();
        let curIdx      = -1;
        let isPlaying   = false;
        const durations = {};

        // Sync volume on playback to prevent browser-specific volume reset gotchas
        audio.addEventListener('play', () => {
            if (mpVol) {
                audio.volume = parseFloat(mpVol.value);
            }
        });

        const fmt = s => isNaN(s)||!isFinite(s) ? '--:--' : Math.floor(s/60)+':'+Math.floor(s%60).toString().padStart(2,'0');

        // Render track list
        TRACKS.forEach((t, i) => {
            const row = document.createElement('div');
            row.className = 'mp-track-item';
            row.dataset.index = i;
            row.innerHTML = `<span class="mp-tnum">${i+1}</span><span class="mp-tname">${t.title}</span><span class="mp-tdur" id="mpd${i}">--:--</span>`;
            row.addEventListener('click', () => loadTrack(i, true));
            mpList.appendChild(row);
            // Pre-load duration only
            const tmp = new Audio(t.src);
            tmp.addEventListener('loadedmetadata', () => {
                durations[i] = tmp.duration;
                document.getElementById('mpd'+i).textContent = fmt(tmp.duration);
            });
        });

        function setUI(playing) {
            isPlaying = playing;
            mpPlayIcon.className = playing ? 'fas fa-pause' : 'fas fa-play';
            mpVinyl.classList.toggle('spinning', playing);
            if(mpVinylWrap) mpVinylWrap.classList.toggle('playing', playing);
            mpEq.classList.toggle('active', playing);
        }

        function loadTrack(idx, autoplay) {
            curIdx = idx;
            const t = TRACKS[idx];
            audio.src = t.src;
            audio.volume = mpVol ? parseFloat(mpVol.value) : 1;
            mpTitle.textContent = t.title;
            mpFill.style.width = '0%';
            mpCur.textContent = '0:00';
            mpTot.textContent = durations[idx] ? fmt(durations[idx]) : '--:--';
            document.querySelectorAll('.mp-track-item').forEach((r,i) => r.classList.toggle('active', i===idx));
            document.querySelector('.mp-track-item.active')?.scrollIntoView({block:'nearest',behavior:'smooth'});
            if (autoplay) { audio.play(); setUI(true); } else { setUI(false); }
        }

        btnPlay.addEventListener('click', () => {
            if (curIdx === -1) { loadTrack(0, true); return; }
            if (isPlaying) { audio.pause(); setUI(false); }
            else { audio.play(); setUI(true); }
        });

        btnNext.addEventListener('click', () => loadTrack((curIdx+1) % TRACKS.length, isPlaying || curIdx===-1));
        btnPrev.addEventListener('click', () => {
            if (audio.currentTime > 3) { audio.currentTime = 0; return; }
            loadTrack((curIdx-1+TRACKS.length) % TRACKS.length, isPlaying);
        });

        // ── Preview Limit: fade out 27-30s, pause at 30s, show modal ────
        const previewOverlay = document.getElementById('preview-modal');
        const previewClose   = document.getElementById('preview-close');
        let previewTriggered = false;
        let fadingOut        = false;
        let userVolume       = 1;

        const closePreview = () => previewOverlay && previewOverlay.classList.remove('open');

        if (previewClose) previewClose.addEventListener('click', closePreview);
        if (previewOverlay) {
            previewOverlay.addEventListener('click', e => {
                if (e.target === previewOverlay) closePreview();
            });
        }

        // Reset flags when a new track loads
        audio.addEventListener('emptied', () => {
            previewTriggered = false;
            fadingOut        = false;
        });

        audio.addEventListener('timeupdate', () => {
            // Always update seek bar and time display
            if (audio.duration && isFinite(audio.duration)) {
                mpFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
            }
            mpCur.textContent = fmt(audio.currentTime);

            // Always enforce hard cap — show modal every time they try to play past 1min
            if (audio.currentTime > 60) {
                audio.currentTime = 60;
                audio.pause();
                setUI(false);
                if (previewOverlay) previewOverlay.classList.add('open');
                return;
            }

            if (previewTriggered) return;

            // Capture user's volume just before fade starts
            if (!fadingOut && audio.currentTime >= 57) {
                fadingOut  = true;
                userVolume = mpVol ? parseFloat(mpVol.value) : audio.volume;
            }

            // Smooth fade out from 57s to 60s
            if (fadingOut && audio.currentTime < 60) {
                const progress = Math.min(1, (audio.currentTime - 57) / 3);
                audio.volume   = Math.max(0, userVolume * (1 - progress));
            }

            // Stop at 60s, restore volume, show modal
            if (fadingOut && audio.currentTime >= 60) {
                previewTriggered = true;
                audio.pause();
                audio.currentTime = 60;
                audio.volume = userVolume;
                setUI(false);
                if (previewOverlay) previewOverlay.classList.add('open');
            }
        });
        audio.addEventListener('loadedmetadata', () => { mpTot.textContent = fmt(audio.duration); });
        audio.addEventListener('ended', () => loadTrack((curIdx+1) % TRACKS.length, true));

        // Seek bar — click (desktop) + touch drag (mobile), capped at 60s
        const PREVIEW_LIMIT = 60;
        const seekTo = clientX => {
            if (!audio.duration) return;
            const r = mpSeek.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
            audio.currentTime = Math.min(ratio * audio.duration, PREVIEW_LIMIT);
        };
        mpSeek.addEventListener('click', e => seekTo(e.clientX));
        mpSeek.addEventListener('touchstart', e => seekTo(e.touches[0].clientX), { passive: true });
        mpSeek.addEventListener('touchmove',  e => seekTo(e.touches[0].clientX), { passive: true });

        if (mpVol) {
            const updateVolume = () => { 
                audio.volume = parseFloat(mpVol.value); 
                const pct = mpVol.value * 100;
                mpVol.style.background = `linear-gradient(to right, var(--gold-primary) 0%, var(--gold-primary) ${pct}%, rgba(255, 255, 255, 0.1) ${pct}%, rgba(255, 255, 255, 0.1) 100%)`;
            };
            
            // Initialize volume track highlight on load
            updateVolume();
            
            mpVol.addEventListener('input', updateVolume);
            mpVol.addEventListener('change', updateVolume);
        }
    }


    // Carousel Logic
    const carousel = document.querySelector('.video-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            // Approx 400px card width + 30px gap
            carousel.scrollBy({ left: -430, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 430, behavior: 'smooth' });
        });
    }

    // Gallery Carousel
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const galleryPrevBtn = document.querySelector('.gallery-prev-btn');
    const galleryNextBtn = document.querySelector('.gallery-next-btn');
    let currentGallerySlide = 0;
    let galleryAutoPlay;

    function goToGallerySlide(n) {
        gallerySlides[currentGallerySlide].classList.remove('active');
        galleryDots[currentGallerySlide].classList.remove('active');
        currentGallerySlide = (n + gallerySlides.length) % gallerySlides.length;
        gallerySlides[currentGallerySlide].classList.add('active');
        galleryDots[currentGallerySlide].classList.add('active');
    }

    function startGalleryAuto() {
        galleryAutoPlay = setInterval(() => goToGallerySlide(currentGallerySlide + 1), 5000);
    }

    if (gallerySlides.length) {
        if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', () => { clearInterval(galleryAutoPlay); goToGallerySlide(currentGallerySlide - 1); startGalleryAuto(); });
        if (galleryNextBtn) galleryNextBtn.addEventListener('click', () => { clearInterval(galleryAutoPlay); goToGallerySlide(currentGallerySlide + 1); startGalleryAuto(); });
        galleryDots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(galleryAutoPlay); goToGallerySlide(i); startGalleryAuto(); }));
        startGalleryAuto();
    }

    // Modal / Lightbox Logic
    const modal = document.getElementById('mediaModal');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');

    if (modal) {
        let currentMediaArray = [];
        let currentIndex = 0;
        let isVideo = false;

        const renderModalContent = () => {
            if (isVideo) {
                const videoId = currentMediaArray[currentIndex].getAttribute('data-video-id');
                modalContent.innerHTML = `
                    <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; box-shadow: 0 10px 40px rgba(212,175,55,0.2);">
                        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                `;
            } else {
                const img = currentMediaArray[currentIndex].querySelector('.gallery-img');
                modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" class="modal-img">`;
            }
        };

        const openModal = (array, index, videoMode) => {
            currentMediaArray = array;
            currentIndex = index;
            isVideo = videoMode;
            renderModalContent();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Show/hide arrows if multiple items exist
            if(modalPrev) modalPrev.style.display = currentMediaArray.length > 1 ? 'block' : 'none';
            if(modalNext) modalNext.style.display = currentMediaArray.length > 1 ? 'block' : 'none';
        };

        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openModal(galleryItems, index, false));
        });

        const videoItems = Array.from(document.querySelectorAll('.video-card'));
        videoItems.forEach((card, index) => {
            card.addEventListener('click', () => openModal(videoItems, index, true));
        });

        if (modalPrev) {
            modalPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMediaArray.length - 1;
                renderModalContent();
            });
        }
        if (modalNext) {
            modalNext.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex < currentMediaArray.length - 1) ? currentIndex + 1 : 0;
                renderModalContent();
            });
        }

        // Touch events for Mobile Swipe Gestures
        let touchStartX = 0;
        let touchEndX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50; // minimum distance in px
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe Left -> Next slide
                if (currentMediaArray.length > 1) {
                    currentIndex = (currentIndex < currentMediaArray.length - 1) ? currentIndex + 1 : 0;
                    renderModalContent();
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe Right -> Prev slide
                if (currentMediaArray.length > 1) {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMediaArray.length - 1;
                    renderModalContent();
                }
            }
        };

        // Close Modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => { modalContent.innerHTML = ''; }, 300);
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) closeModal();
        });
    }

    // --- Existing Functionality ---
    
    // Set current year in footer
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when link is clicked
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.track-card, .video-card, .gallery-img, .bts-card, .contact-container, .about-image, .about-content');
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        observer.observe(el);
    });

    // ── Back to Top ──────────────────────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Active Nav Highlight on Scroll ───────────────────────────────────
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links li a');

    const activateNav = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', activateNav, { passive: true });
    activateNav(); // run once on load

    // ── BOOKING FORM: Formspree (email) + WhatsApp ──────────────────────
    const PANTHOR_WHATSAPP  = settingsData?.contact?.whatsapp || '18762545480';
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwvjrzjr';

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const phone   = document.getElementById('phone').value.trim();
            const subject = document.getElementById('inquiry').value;
            const message = document.getElementById('message').value.trim();

            // Send to Formspree (email delivery)
            try {
                await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });
            } catch (_) { /* silently continue to WhatsApp even if email fails */ }

            // Open WhatsApp with pre-filled message
            const waBody = [
                `🎵 *PANTHOR BOOKING REQUEST*`,
                ``,
                `*Name:* ${name}`,
                `*Email:* ${email}`,
                phone ? `*Phone:* ${phone}` : null,
                `*Subject:* ${subject}`,
                ``,
                `*Message:*`,
                message
            ].filter(l => l !== null).join('\n');

            btn.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp...';

            window.open(`https://wa.me/${PANTHOR_WHATSAPP}?text=${encodeURIComponent(waBody)}`, '_blank');
            bookingForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 4000);
        });
    }

    // ── About Section: Read More Toggle ─────────────────────────────────
    const readMoreBtn   = document.getElementById('readMoreBtn');
    const aboutExtended = document.getElementById('aboutExtended');

    if (readMoreBtn && aboutExtended) {
        readMoreBtn.addEventListener('click', () => {
            const isExpanded = aboutExtended.classList.toggle('expanded');
            readMoreBtn.textContent = isExpanded ? 'Read Less' : 'Read More';
        });
    }
});

