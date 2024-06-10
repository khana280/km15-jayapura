document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const nav = document.querySelector('nav');

    menuIcon.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const gender = document.getElementById('gender').value;
        const address = document.getElementById('address').value;
        const message = document.getElementById('message').value;

        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-email').textContent = email;
        document.getElementById('modal-gender').textContent = gender;
        document.getElementById('modal-address').textContent = address;
        document.getElementById('modal-message').textContent = message;

        const modal = document.getElementById('myModal');
        modal.style.display = 'block';

        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            contactForm.reset(); 

            const successModal = document.getElementById('successModal');
            successModal.style.display = 'block';
            document.getElementById('sender-name').textContent = name;
        });

        const cancelBtn = document.getElementById('cancel-btn');
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none'; 
        });

        const closeBtn = document.querySelector('#myModal .modal-content .close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        const successModalCloseBtn = document.querySelector('#successModal .modal-content .close');
        successModalCloseBtn.addEventListener('click', function() {
            successModal.style.display = 'none'; 
        });

        const okBtn = document.getElementById('ok-btn');
        okBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    });
});