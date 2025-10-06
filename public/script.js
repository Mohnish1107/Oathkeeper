// Mobile Menu Toggle
        alert("Server is On");
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                document.querySelector('nav').classList.remove('active');
            });
        });

        // Simple animation for stats counter (for demonstration)
        document.addEventListener('DOMContentLoaded', function() {
            const statItems = document.querySelectorAll('.stat-item h3');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const finalValue = parseInt(target.textContent);
                        let currentValue = 0;
                        const increment = finalValue / 50;
                        
                        const timer = setInterval(() => {
                            currentValue += increment;
                            if (currentValue >= finalValue) {
                                target.textContent = finalValue;
                                clearInterval(timer);
                            } else {
                                target.textContent = Math.floor(currentValue);
                            }
                        }, 30);
                        
                        observer.unobserve(target);
                    }
                });
            }, { threshold: 0.5 });
            
            statItems.forEach(item => {
                observer.observe(item);
            });
        });