class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('slideIndicators');
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.updateNavigation();
        this.updateSlideNumbers();
        this.initializeChart();
    }
    
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === 1 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', i);
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });
        
        // Touch/swipe support
        let startX = null;
        let startY = null;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    updateSlideNumbers() {
        const slideHeaders = document.querySelectorAll('.slide-number');
        slideHeaders.forEach((header, index) => {
            header.textContent = `${index + 1} / ${this.totalSlides}`;
        });
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        // Remove active class from current slide
        const currentSlideElement = document.querySelector('.slide.active');
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            
            // Add transition class based on direction
            if (slideNumber > this.currentSlide) {
                currentSlideElement.classList.add('prev');
            }
        }
        
        // Add active class to new slide
        const newSlideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideElement) {
            // Remove any existing transition classes
            newSlideElement.classList.remove('prev');
            newSlideElement.classList.add('active');
        }
        
        // Clean up transition classes after animation
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.classList.remove('prev');
            });
        }, 500);
        
        this.currentSlide = slideNumber;
        this.updateNavigation();
        this.updateIndicators();
        
        // Initialize chart when reaching slide 5 (Investment Structure & Cash Flow)
        if (slideNumber === 5) {
            setTimeout(() => this.initializeChart(), 100);
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateNavigation() {
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button text for last slide
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.innerHTML = '<span>End</span>';
        } else {
            this.nextBtn.innerHTML = '<span>Next ›</span>';
        }
        
        // Update first slide button text
        if (this.currentSlide === 1) {
            this.prevBtn.innerHTML = '<span>Start</span>';
        } else {
            this.prevBtn.innerHTML = '<span>‹ Previous</span>';
        }
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    initializeChart() {
        const chartCanvas = document.getElementById('cashFlowChart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.cashFlowChart) {
            this.cashFlowChart.destroy();
        }
        
        const ctx = chartCanvas.getContext('2d');
        
        // Cash flow data for 8-month project
        const cashFlowData = [
            { month: 'Start', revenue: 0, cumulative: -9.52, investorShare: 0 },
            { month: 'Month 1', revenue: 0, cumulative: -9.52, investorShare: 0 },
            { month: 'Month 2', revenue: 7.27, cumulative: -2.25, investorShare: 0 },
            { month: 'Month 3', revenue: 7.27, cumulative: 5.02, investorShare: 0 },
            { month: 'Month 4', revenue: 7.27, cumulative: 12.29, investorShare: 0 },
            { month: 'Month 5', revenue: 7.27, cumulative: 19.56, investorShare: 0 },
            { month: 'Month 6', revenue: 7.27, cumulative: 26.83, investorShare: 0 },
            { month: 'Month 7', revenue: 7.27, cumulative: 34.10, investorShare: 0 },
            { month: 'Month 8', revenue: 14.41, cumulative: 48.51, investorShare: 11.30 }
        ];
        
        this.cashFlowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cashFlowData.map(d => d.month),
                datasets: [
                    {
                        label: 'Monthly Revenue (₹M)',
                        data: cashFlowData.map(d => d.revenue),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Cumulative Cash Flow (₹M)',
                        data: cashFlowData.map(d => d.cumulative),
                        borderColor: '#21808D',
                        backgroundColor: 'rgba(33, 128, 141, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Your Return (₹M)',
                        data: cashFlowData.map(d => d.investorShare),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.2)',
                        borderWidth: 4,
                        fill: false,
                        tension: 0,
                        pointBackgroundColor: '#DB4545',
                        pointBorderColor: '#B4413C',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '8-Month Cash Flow Projection | 28% Annualized Return',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#134252'
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '₹' + context.parsed.y.toFixed(2) + 'M';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Project Timeline',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Revenue & Cash Flow (₹M)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        beginAtZero: false
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Your Investment Return (₹M)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 0,
                        max: 15
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Utility methods for additional functionality
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    // Method to format currency values (utility)
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Method to format numbers with Indian numbering system
    static formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    }
}

// Additional utility functions for the presentation
class PresentationUtils {
    // Smooth scroll to element
    static scrollToElement(element, duration = 300) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = PresentationUtils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        requestAnimationFrame(animation);
    }
    
    // Easing function for smooth animations
    static easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    // Highlight specific elements with animation
    static highlightElement(element, duration = 2000) {
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 8px 25px rgba(33, 128, 141, 0.3)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '';
        }, duration);
    }
    
    // Add entrance animations to slide content
    static animateSlideContent(slideElement) {
        const animatableElements = slideElement.querySelectorAll('.summary-card, .detail-section, .breakdown-card, .strategy-card, .security-card, .risk-card, .value-card, .step');
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
}

// Print functionality
class PrintHandler {
    static preparePrintView() {
        // Create print-specific styles
        const printStyles = `
            @media print {
                .presentation-container {
                    height: auto !important;
                    overflow: visible !important;
                }
                
                .slide {
                    position: static !important;
                    opacity: 1 !important;
                    transform: none !important;
                    page-break-after: always;
                    height: 100vh;
                    display: flex !important;
                }
                
                .slide:last-child {
                    page-break-after: avoid;
                }
                
                .navigation-controls {
                    display: none !important;
                }
                
                .slide-header {
                    position: static !important;
                }
                
                body {
                    font-size: 12pt !important;
                }
                
                h1 { font-size: 24pt !important; }
                h2 { font-size: 20pt !important; }
                h3 { font-size: 16pt !important; }
                h4 { font-size: 14pt !important; }
                
                #cashFlowChart {
                    max-height: 300px !important;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = printStyles;
        document.head.appendChild(styleSheet);
        
        // Show all slides for printing
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.add('active');
        });
        
        return styleSheet;
    }
    
    static print() {
        const printStyleSheet = PrintHandler.preparePrintView();
        
        setTimeout(() => {
            window.print();
            
            // Cleanup after printing
            setTimeout(() => {
                document.head.removeChild(printStyleSheet);
                // Restore normal view
                document.querySelectorAll('.slide').forEach((slide, index) => {
                    if (index !== presentation.getCurrentSlide() - 1) {
                        slide.classList.remove('active');
                    }
                });
            }, 1000);
        }, 500);
    }
}

// Fullscreen functionality
class FullscreenHandler {
    static toggle() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    static init() {
        // Add fullscreen toggle on F11 or F key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
                e.preventDefault();
                FullscreenHandler.toggle();
            }
        });
    }
}

// Investment Calculator - for validation
class InvestmentCalculator {
    static calculateReturn(principal, annualRate, months) {
        const monthlyRate = annualRate / 12;
        const actualRate = monthlyRate * months;
        return principal * (1 + actualRate);
    }
    
    static validateCalculations() {
        const principal = 9523500; // ₹9.52M
        const annualRate = 0.28; // 28%
        const months = 8;
        
        // Calculate expected return
        const expectedReturn = InvestmentCalculator.calculateReturn(principal, annualRate, months);
        const profit = expectedReturn - principal;
        const actualReturnRate = (profit / principal) * 100;
        
        console.log('Investment Validation:');
        console.log(`Principal: ₹${(principal / 1000000).toFixed(2)}M`);
        console.log(`Expected Return: ₹${(expectedReturn / 1000000).toFixed(2)}M`);
        console.log(`Profit: ₹${(profit / 1000000).toFixed(2)}M`);
        console.log(`Actual Return Rate (8 months): ${actualReturnRate.toFixed(2)}%`);
        console.log(`Annualized Rate: ${annualRate * 100}%`);
        
        return {
            principal,
            expectedReturn,
            profit,
            actualReturnRate,
            annualizedRate: annualRate * 100
        };
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main presentation controller
    window.presentation = new PresentationController();
    
    // Initialize fullscreen handler
    FullscreenHandler.init();
    
    // Add print functionality (Ctrl+P)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            PrintHandler.print();
        }
    });
    
    // Add animation to slide content when slide changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active') && slide.classList.contains('slide')) {
                    PresentationUtils.animateSlideContent(slide);
                }
            }
        });
    });
    
    // Observe all slides for class changes
    document.querySelectorAll('.slide').forEach(slide => {
        observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
    
    // Add initial animation to first slide
    setTimeout(() => {
        const firstSlide = document.querySelector('.slide.active');
        if (firstSlide) {
            PresentationUtils.animateSlideContent(firstSlide);
        }
    }, 500);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Validate investment calculations
    InvestmentCalculator.validateCalculations();
    
    // Console message for developers
    console.log('Properties Wallah Investment Presentation loaded successfully!');
    console.log('Corrected for 28% annualized return over 8 months (18.67% actual return)');
    console.log('Navigation: Use arrow keys, click buttons, or swipe on mobile');
    console.log('Print: Press Ctrl+P');
    console.log('Fullscreen: Press F11 or Ctrl+F');
});