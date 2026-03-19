const links = document.querySelectorAll('nav a');

const sections = document.querySelectorAll('section');

links.forEach(link => {
    link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        const target = document.querySelector(this.getAttribute('href'));
        target.classList.add('active');
    });
});