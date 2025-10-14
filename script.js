// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mobile menu functionality with improved touch handling
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll(disable) {
        if (disable) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
    
    mobileMenu.addEventListener('click', function() {
        const isActive = mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('active');
        toggleBodyScroll(isActive);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('is-active');
            toggleBodyScroll(false);
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('is-active');
            toggleBodyScroll(false);
        }
    });

    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Adjust offset based on screen size
                const navHeight = window.innerWidth <= 480 ? 65 : 70;
                const offsetTop = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('is-active');
                toggleBodyScroll(false);
                
                // Add visual feedback for mobile
                if (isMobile) {
                    link.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                    setTimeout(() => {
                        link.style.backgroundColor = '';
                    }, 300);
                }
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.definition-card, .type-card, .cause-card, .effect-card, .standard-card, .migrant-card, .article-card');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Counter animation for hero stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        });
    }

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Interactive card hover effects
    const cards = document.querySelectorAll('.definition-card, .type-card, .cause-card, .effect-card, .standard-card, .migrant-card, .article-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // Touch and mouse-friendly tooltip functionality for statistics
    const stats = document.querySelectorAll('.stat-item');
    
    stats.forEach(stat => {
        let tooltipTimeout;
        
        function showTooltip() {
            // Remove existing tooltips
            const existingTooltip = this.querySelector('.tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.querySelector('.stat-label').textContent + ' - Ayon sa mga pag-aaral';
            
            const isMobileView = window.innerWidth <= 768;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: ${isMobileView ? '12px 16px' : '8px 12px'};
                border-radius: 8px;
                font-size: ${isMobileView ? '0.9rem' : '0.8rem'};
                top: ${isMobileView ? '-50px' : '-40px'};
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
            
            // Auto-hide on mobile after 3 seconds
            if (isMobileView) {
                tooltipTimeout = setTimeout(() => {
                    if (tooltip.parentElement) {
                        tooltip.style.opacity = '0';
                        setTimeout(() => {
                            if (tooltip.parentElement) {
                                tooltip.remove();
                            }
                        }, 300);
                    }
                }, 3000);
            }
        }
        
        function hideTooltip() {
            clearTimeout(tooltipTimeout);
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentElement) {
                        tooltip.remove();
                    }
                }, 300);
            }
        }
        
        // Mouse events for desktop
        if (!isTouch) {
            stat.addEventListener('mouseenter', showTooltip);
            stat.addEventListener('mouseleave', hideTooltip);
        }
        
        // Touch events for mobile
        stat.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const hasTooltip = this.querySelector('.tooltip');
            
            if (hasTooltip) {
                hideTooltip.call(this);
            } else {
                // Hide other tooltips first
                stats.forEach(otherStat => {
                    if (otherStat !== this) {
                        hideTooltip.call(otherStat);
                    }
                });
                showTooltip.call(this);
            }
        }, { passive: false });
        
        // Add visual feedback for touch
        if (isTouch) {
            stat.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            stat.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Dynamic text animation for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // Progress indicator for reading
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Interactive migration flow visualization
    const migrationVisual = document.querySelector('.migration-visual');
    if (migrationVisual) {
        let animationDirection = 1;
        
        setInterval(() => {
            const personIcon = migrationVisual.querySelector('.person-icon');
            const currentTransform = personIcon.style.transform || 'translateX(0px)';
            const currentX = parseInt(currentTransform.match(/-?\d+/) || [0]);
            
            if (currentX >= 60) {
                animationDirection = -1;
            } else if (currentX <= 0) {
                animationDirection = 1;
            }
            
            const newX = currentX + (animationDirection * 2);
            personIcon.style.transform = `translateX(${newX}px)`;
        }, 100);
    }

    // Mobile-friendly search functionality
    function createSearchBox() {
        const isMobileScreen = window.innerWidth <= 768;
        const searchContainer = document.createElement('div');
        
        searchContainer.innerHTML = `
            <div id="searchContainer" style="position: fixed; top: ${isMobileScreen ? '75px' : '80px'}; right: ${isMobileScreen ? '10px' : '20px'}; z-index: 1000;">
                <input type="text" id="searchBox" placeholder="Hanapin sa pahina..." 
                       style="padding: ${isMobileScreen ? '12px 15px' : '10px'}; 
                              border: 2px solid #2563eb; 
                              border-radius: 25px; 
                              outline: none; 
                              width: ${isMobileScreen ? '250px' : '200px'}; 
                              display: none;
                              font-size: ${isMobileScreen ? '16px' : '14px'};
                              background: white;
                              box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <button id="searchToggle" style="background: #2563eb; 
                                                color: white; 
                                                border: none; 
                                                padding: ${isMobileScreen ? '12px' : '10px'}; 
                                                border-radius: 50%; 
                                                cursor: pointer;
                                                box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
                                                transition: all 0.3s ease;
                                                touch-action: manipulation;">
                    <i class="fas fa-search" style="font-size: ${isMobileScreen ? '16px' : '14px'};"></i>
                </button>
            </div>
        `;
        document.body.appendChild(searchContainer);

        const searchToggle = document.getElementById('searchToggle');
        const searchBox = document.getElementById('searchBox');
        const searchContainerEl = document.getElementById('searchContainer');
        
        // Touch-friendly toggle
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (searchBox.style.display === 'none' || !searchBox.style.display) {
                searchBox.style.display = 'block';
                searchBox.focus();
                if (isMobileScreen) {
                    // Prevent zoom on iOS
                    searchBox.setAttribute('readonly', true);
                    setTimeout(() => {
                        searchBox.removeAttribute('readonly');
                    }, 100);
                }
                searchToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                searchBox.style.display = 'none';
                searchToggle.innerHTML = '<i class="fas fa-search"></i>';
                clearSearchResults();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainerEl.contains(e.target) && searchBox.style.display === 'block') {
                searchBox.style.display = 'none';
                searchToggle.innerHTML = '<i class="fas fa-search"></i>';
                clearSearchResults();
            }
        });

        function clearSearchResults() {
            const highlighted = document.querySelectorAll('.search-highlight');
            highlighted.forEach(el => {
                el.style.background = 'transparent';
                el.classList.remove('search-highlight');
            });
        }

        let searchTimeout;
        searchBox.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                clearSearchResults();
                
                if (searchTerm.length >= 2) {
                    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, li');
                    let matchCount = 0;
                    
                    textElements.forEach(element => {
                        if (element.textContent.toLowerCase().includes(searchTerm)) {
                            element.style.background = 'rgba(255, 255, 0, 0.3)';
                            element.classList.add('search-highlight');
                            matchCount++;
                        }
                    });
                    
                    // Show match count on mobile
                    if (isMobileScreen && matchCount > 0) {
                        searchBox.placeholder = `${matchCount} resulta nahanap`;
                    } else if (isMobileScreen && searchTerm.length >= 2) {
                        searchBox.placeholder = 'Walang nahanap';
                    }
                } else {
                    searchBox.placeholder = 'Hanapin sa pahina...';
                }
            }, 300);
        });
        
        // Handle virtual keyboard on mobile
        if (isMobileScreen) {
            searchBox.addEventListener('focus', function() {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 300);
            });
        }
    }

    createSearchBox();

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #2563eb;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'scale(1)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'scale(0.8)';
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme toggle functionality (optional)
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 85px;
            left: 20px;
            background: #475569;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(themeToggle);

        let darkMode = false;
        
        themeToggle.addEventListener('click', function() {
            darkMode = !darkMode;
            
            if (darkMode) {
                document.body.style.filter = 'invert(1) hue-rotate(180deg)';
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.style.background = '#fbbf24';
            } else {
                document.body.style.filter = 'none';
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.style.background = '#475569';
            }
        });
    }

    createThemeToggle();

    // Print functionality
    function createPrintButton() {
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i>';
        printButton.style.cssText = `
            position: fixed;
            top: 145px;
            left: 20px;
            background: #059669;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(printButton);

        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    createPrintButton();

    // Console welcome message
    console.log(`
    🌍 Migrasyon Educational Website
    ================================
    Maligayang pagdating sa interactive na pag-aaral tungkol sa migrasyon!
    
    Features:
    ✓ Modular design
    ✓ Responsive layout  
    ✓ Smooth animations
    ✓ Interactive elements
    ✓ Search functionality
    ✓ Dark mode toggle
    ✓ Print support
    
    Mag-enjoy sa pag-aaral! 📚
    `);
});

// Additional utility functions
function highlightText(element, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = element.textContent.replace(regex, '<mark>$1</mark>');
}

function removeHighlights() {
    const marks = document.querySelectorAll('mark');
    marks.forEach(mark => {
        mark.outerHTML = mark.textContent;
    });
}

    // Activities Section Interactive Features
    function initializeActivities() {
        // Add print functionality for activities
        const activitySection = document.getElementById('activities');
        if (activitySection) {
            const printButton = document.createElement('button');
            printButton.innerHTML = '<i class="fas fa-print"></i> I-print ang mga Gawain';
            printButton.className = 'print-activities-btn';
            printButton.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 0.9rem;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                touch-action: manipulation;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            document.body.appendChild(printButton);

            // Show/hide print button based on activities section visibility
            const activitiesObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        printButton.style.opacity = '1';
                        printButton.style.transform = 'scale(1)';
                    } else {
                        printButton.style.opacity = '0';
                        printButton.style.transform = 'scale(0.8)';
                    }
                });
            }, { threshold: 0.1 });

            activitiesObserver.observe(activitySection);

            printButton.addEventListener('click', function() {
                // Create a new window with only the activities content
                const activitiesContent = activitySection.innerHTML;
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>MDL Activities - Migrasyon</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                margin: 20px; 
                                line-height: 1.6;
                            }
                            .container { max-width: 800px; margin: 0 auto; }
                            .activity-section { 
                                margin-bottom: 30px; 
                                page-break-inside: avoid;
                            }
                            .activity-header { 
                                background: #f3f4f6; 
                                padding: 15px; 
                                border-left: 4px solid #3b82f6;
                                margin-bottom: 15px;
                            }
                            .blank-line { 
                                border-bottom: 1px solid #333; 
                                min-width: 200px; 
                                display: inline-block;
                                margin: 0 5px;
                            }
                            .question-item, .process-question { 
                                margin-bottom: 15px; 
                                display: flex;
                                gap: 10px;
                            }
                            .question-number { 
                                font-weight: bold; 
                                min-width: 25px;
                            }
                            blockquote { 
                                border-left: 3px solid #ccc; 
                                padding-left: 15px; 
                                margin: 15px 0;
                                font-style: italic;
                            }
                            @media print {
                                .activity-header { background: none !important; }
                                body { margin: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>MDL Activities - Migrasyon</h1>
                            <p><strong>Pangalan:</strong> _________________________ <strong>Seksyon:</strong> _____________</p>
                            <hr>
                            ${activitiesContent}
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            });
        }

        // Add interactive highlighting for important terms
        const importantTerms = [
            'migrasyon', 'OFW', 'globalisasyon', 'push factor', 'pull factor',
            'panloob na migrasyon', 'panlabas na migrasyon', 'immigrant', 'migrant'
        ];

        function highlightImportantTerms() {
            const activityContent = document.querySelectorAll('.activity-content p, .article-content p');
            activityContent.forEach(paragraph => {
                let content = paragraph.innerHTML;
                importantTerms.forEach(term => {
                    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
                    content = content.replace(regex, '<span class="important-term">$1</span>');
                });
                paragraph.innerHTML = content;
            });
        }

        // Add CSS for important terms
        const termStyle = document.createElement('style');
        termStyle.textContent = `
            .important-term {
                background: rgba(59, 130, 246, 0.1);
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: 500;
                color: #1d4ed8;
                transition: all 0.2s ease;
            }
            .important-term:hover {
                background: rgba(59, 130, 246, 0.2);
            }
        `;
        document.head.appendChild(termStyle);

        highlightImportantTerms();

        // Add word count for performance task
        const performanceTask = document.querySelector('.performance-task + .activity-content');
        if (performanceTask) {
            const wordCountDiv = document.createElement('div');
            wordCountDiv.style.cssText = `
                background: #fef3c7;
                border: 1px solid #f59e0b;
                padding: 10px 15px;
                border-radius: 8px;
                margin-top: 15px;
                font-size: 0.9rem;
                color: #92400e;
            `;
            wordCountDiv.innerHTML = `
                <i class="fas fa-info-circle"></i> 
                <strong>Tip:</strong> Ang liham ay dapat may 200-300 salita para sa mas detalyadong sagot.
            `;
            performanceTask.appendChild(wordCountDiv);
        }

        // Add interactive question checklist (for students to track their progress)
        const questionItems = document.querySelectorAll('.question-item, .process-question');
        questionItems.forEach((item, index) => {
            const checkbox = document.createElement('div');
            checkbox.style.cssText = `
                width: 20px;
                height: 20px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;
            `;
            
            checkbox.addEventListener('click', function() {
                if (this.classList.contains('checked')) {
                    this.classList.remove('checked');
                    this.style.background = 'white';
                    this.style.borderColor = '#d1d5db';
                    this.innerHTML = '';
                } else {
                    this.classList.add('checked');
                    this.style.background = '#10b981';
                    this.style.borderColor = '#10b981';
                    this.innerHTML = '<i class="fas fa-check" style="color: white; font-size: 12px;"></i>';
                }
                
                // Save progress to localStorage
                const progress = Array.from(questionItems).map((q, i) => 
                    q.querySelector('div').classList.contains('checked')
                );
                localStorage.setItem('migrationActivitiesProgress', JSON.stringify(progress));
            });

            item.insertBefore(checkbox, item.firstChild);
        });

        // Load saved progress
        const savedProgress = localStorage.getItem('migrationActivitiesProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            questionItems.forEach((item, index) => {
                if (progress[index]) {
                    const checkbox = item.querySelector('div');
                    checkbox.click(); // This will trigger the checked state
                }
            });
        }
    }

    // Initialize activities when DOM is loaded
    if (document.getElementById('activities')) {
        initializeActivities();
    }

// Export functions for potential use in other scripts
window.MigrationWebsite = {
    highlightText,
    removeHighlights,
    initializeActivities
};