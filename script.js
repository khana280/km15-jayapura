document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');

    menuIcon.addEventListener('click', function() {
        navbar.classList.toggle('active');
        
        window.addEventListener('scroll', function() {
            // Jika dropdown menu aktif, sembunyikan dropdown menu
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        });
        // Tambahkan atau hapus kelas untuk menengahkan navbar
        if (navbar.classList.contains('active')) {
            navbar.style.right = '50%';
        } else {
            navbar.style.right = '0';
        }
    });
});