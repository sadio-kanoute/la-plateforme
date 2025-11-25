document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('connexion-form');
  if (!form) return;

  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');
  const message = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const togglePwd = document.getElementById('togglePwd');

  function showMessage(text, type = 'error') {
    message.innerHTML = '';
    const div = document.createElement('div');
    div.className = `msg ${type === 'success' ? 'success' : 'error'}`;
    div.textContent = text;
    message.appendChild(div);
  }

  togglePwd?.addEventListener('click', () => {
    const isPwd = password.type === 'password';
    password.type = isPwd ? 'text' : 'password';
    togglePwd.textContent = isPwd ? 'Masquer' : 'Afficher';
    togglePwd.setAttribute('aria-pressed', String(isPwd));
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    message.innerHTML = '';

    const userVal = (username.value || '').trim();
    const passVal = password.value || '';

    if (!userVal) {
      showMessage('Veuillez saisir votre email ou nom d\'utilisateur.');
      username.focus();
      return;
    }
    if (passVal.length < 6) {
      showMessage('Le mot de passe doit contenir au moins 6 caractères.');
      password.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';

    try {
      // Remplacez l'URL par votre API réelle si besoin
      // const resp = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: userVal, password: passVal, remember: remember.checked })
      // });
      // const result = await resp.json();
      // if (!resp.ok) throw new Error(result?.message || 'Erreur de connexion');

      // Simulation (à supprimer si vous avez un backend)
      await new Promise(r => setTimeout(r, 700));
      const fakeSuccess = (userVal === 'demo' && passVal === 'demo123') || userVal.includes('@');

      if (!fakeSuccess) {
        showMessage('Identifiants incorrects.', 'error');
        password.select();
      } else {
        showMessage('Connexion réussie. Redirection...', 'success');
        setTimeout(() => {
          // window.location.href = '/dashboard.html';
          console.log('redirection simulée — remplacer par window.location.href');
        }, 800);
      }
    } catch (err) {
      showMessage(err.message || 'Erreur inconnue', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Connexion';
    }
  });
});
