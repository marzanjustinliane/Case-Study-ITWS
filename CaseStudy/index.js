document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('show');
            const isShown = navLinks.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isShown);
        });
    }

    const adminLoginButton = document.getElementById('adminLoginButton');
    const adminLoginDialog = document.getElementById('adminLoginDialog');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginCancel = document.getElementById('adminLoginCancel');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    if (adminLoginButton && adminLoginDialog && adminLoginForm && adminLoginCancel && adminLoginMessage) {
        adminLoginButton.addEventListener('click', function () {
            adminLoginMessage.textContent = '';
            adminLoginDialog.showModal();
        });

        adminLoginCancel.addEventListener('click', function () {
            adminLoginDialog.close();
        });

        adminLoginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            adminLoginMessage.textContent = 'Demo only: admin authentication is not connected.';
        });
    }
});