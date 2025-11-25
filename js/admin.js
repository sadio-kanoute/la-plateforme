/**Retourne l'utilisateur connecté (depuis localStorage)*/
function getCurrentUser() {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
}

/**
 * Redirige vers la page de connexion
 */
function redirectToLogin() {
    window.location.href = "../login.html";
}


/* Vérification d'accès (admin uniquement) */

const currentUser = getCurrentUser();

if (!currentUser || currentUser.role !== "admin") {
    redirectToLogin();
}


// Cibles HTML optionnelles (si présentes)
const statUsers = document.getElementById("stat-users");
const statPending = document.getElementById("stat-pending");
const statAdmins = document.getElementById("stat-admins");
const statModos = document.getElementById("stat-moderators");

// Charger données
Promise.all([loadUsers(), loadRequests()]).then(values => {
    const users = values[0];
    const requests = values[1];

    // Stats
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === "admin").length;
    const moderators = users.filter(u => u.role === "moderator").length;
    const pending = requests.filter(r => r.status === "pending").length;

    // Affichage si les éléments existent
    if (statUsers) statUsers.textContent = totalUsers;
    if (statPending) statPending.textContent = pending;
    if (statAdmins) statAdmins.textContent = admins;
    if (statModos) statModos.textContent = moderators;
});
