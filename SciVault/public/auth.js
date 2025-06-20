// auth.js
// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          // Remove active class from all buttons and contents
          tabBtns.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked button and corresponding content
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.getElementById(tabId).classList.add('active');
      });
  });
  
  // Form submission handlers would go here
  // const loginForm = document.querySelector('#login form');
  // const registerForm = document.querySelector('#register form');
  // ...
});

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register .auth-form');

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
          username: document.getElementById('register-username').value,
          email: document.getElementById('register-email').value,
          password: document.getElementById('register-password').value,
          institution: document.getElementById('register-institution').value,
          usertype: document.getElementById('register-usertype').value
      };

      try {
          const response = await fetch('http://localhost:3000/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });

          if (response.ok) {
              alert('Registration successful!');
              registerForm.reset();
          } else {
              const text = await response.text();
              alert(`Error: ${text}`);
          }
      } catch (error) {
          alert('Server error: ' + error.message);
      }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login .auth-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Welcome back, ${result.user.name}!`);
        // Optionally save login info (e.g., in localStorage)
        localStorage.setItem('sciVaultUser', JSON.stringify(result.user));
        // Redirect to home or dashboard
        window.location.href = 'index.html';
      } else {
        alert(`Login failed: ${result.message || result}`);
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  });
});
