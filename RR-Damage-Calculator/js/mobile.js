document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.panel-body').forEach(body => {
        body.style.maxHeight = 'none';
        body.style.opacity = '1';
        body.style.overflow = 'visible';
    });

    let scrollTimeout;
    const tableContainer = document.querySelector('.holder-0');
    if (tableContainer) {
        tableContainer.addEventListener('scroll', function() {
            if (!this.classList.contains('scrolling')) {
                this.classList.add('scrolling');
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
    }

    document.querySelectorAll('.btn').forEach(btn => {
        let lastTap = 0;
        btn.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    });

    if (typeof $.fn.select2 !== 'undefined') {
        $.extend($.fn.select2.defaults, {
            width: '100%',
            minimumResultsForSearch: 10,
            closeOnSelect: true
        });
    }

    const darkModeToggle = document.getElementById('dark-theme-toggle');
    if (darkModeToggle) {
        const darkThemeStyles = document.getElementById('dark-theme-styles');
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            darkThemeStyles.disabled = !isDark;
            localStorage.setItem('darkTheme', isDark);

            this.classList.add('updating');
            this.textContent = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme';
            setTimeout(() => this.classList.remove('updating'), 300);
        });
    }

    window.addEventListener('orientationchange', function() {
        if (typeof $.fn.select2 !== 'undefined') {
            $('.select2-container').select2('close');
        }
    });
});