// Auth state
let currentUser = null;
let pendingRegistration = null;

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    document.getElementById('otpSection').classList.remove('active');
  });
});

// Register - Send OTP
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  pendingRegistration = { name, email, password };

  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('registerForm').classList.remove('active');
      document.getElementById('otpSection').classList.add('active');
      setupOTPInputs();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Failed to send OTP. Make sure the server is running.');
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      enterApp(data.user);
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Login failed. Check server.');
  }
});

// OTP Input auto-advance
function setupOTPInputs() {
  const inputs = document.querySelectorAll('.otp-box');
  inputs.forEach((input, i) => {
    input.value = '';
    input.addEventListener('input', () => {
      if (input.value && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });
  inputs[0].focus();
}

// Verify OTP
async function verifyOTP() {
  const inputs = document.querySelectorAll('.otp-box');
  const otp = Array.from(inputs).map(i => i.value).join('');

  if (otp.length !== 6) {
    alert('Enter complete OTP');
    return;
  }

  try {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: pendingRegistration.email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      enterApp(data.user);
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Verification failed.');
  }
}

// Google Login
function googleLogin() {
  window.location.href = '/api/auth/google';
}

// Check URL params for Google callback
const params = new URLSearchParams(window.location.search);
if (params.get('token')) {
  const user = { name: params.get('name'), email: params.get('email') };
  localStorage.setItem('token', params.get('token'));
  localStorage.setItem('user', JSON.stringify(user));
  enterApp(user);
  window.history.replaceState({}, '', '/');
}

// Check stored session
const stored = localStorage.getItem('user');
if (stored) {
  enterApp(JSON.parse(stored));
}

function enterApp(user) {
  currentUser = user;
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
  document.getElementById('userName').textContent = `👤 ${user.name}`;
  document.getElementById('loading').classList.add('hidden');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('mainContent').style.display = 'none';
}