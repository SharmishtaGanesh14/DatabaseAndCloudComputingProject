// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Highlighting
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkUrl = link.getAttribute('href');
            
            // Handle regular page links
            if (linkUrl.startsWith('http') || linkUrl.includes('.html')) {
                const linkPage = linkUrl.split('/').pop();
                if (currentPage === linkPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            } 
            // Handle anchor links (Upload/About)
            else if (linkUrl.startsWith('#')) {
                const targetSection = document.querySelector(linkUrl);
                if (targetSection) {
                    link.addEventListener('click', function() {
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    });
                }
            }
        });
    }

    // Initialize navigation highlighting
    updateActiveNavLink();


    // Category Filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        console.log(`Filtering by category: ${category}`);
        // Highlight the corresponding category in navigation if needed
        document.querySelectorAll('.nav-menu a').forEach(link => {
            if (link.getAttribute('href') === `index.html?category=${category}`) {
                link.classList.add('active');
            }
        });
        // Actual implementation would fetch filtered data from backend
    }

    // File Upload Functionality
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle file upload logic here
            console.log('File upload submitted');
            // You would add AJAX/fetch code here for actual upload
        });
    }
});
// Show Logged-In User in Navbar
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('sciVaultUser'));
    const authButton = document.querySelector('.auth-button');
  
    if (user && user.name) {
      authButton.innerHTML = `
        <span style="color:white;"><i class="fas fa-user"></i> ${user.name} (${user.usertype})</span>
        <button id="logout-btn" class="btn-login" style="margin-left: 10px;"><i class="fas fa-sign-out-alt"></i> Logout</button>
      `;
  
      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('sciVaultUser');
        window.location.href = 'index.html';
      });
    }
  });
  