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



document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contact-form');

    // Fungsi untuk menangani pengiriman formulir
    const handleSubmit = function(event) {
        event.preventDefault(); // Menghentikan perilaku bawaan formulir

        // Mengambil nilai dari input nama, email, gender, address, dan pesan
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const gender = document.getElementById('gender').value;
        const address = document.getElementById('address').value;
        const message = document.getElementById('message').value;

        // Menampilkan pesan terima kasih dengan nama pengirim
        const thankYouMessage = `Terima kasih atas masukan, ${name}!`;

        // Menampilkan pesan terima kasih dan reset formulir setelah pengguna menekan OK pada pop up
        if (confirm(thankYouMessage)) {
            contactForm.reset();
        }
    };

    // Menambahkan event listener ke formulir saat pengiriman formulir dilakukan
    contactForm.addEventListener('submit', handleSubmit);
});



