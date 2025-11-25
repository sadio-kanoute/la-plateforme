/* ============================================
   Roles.js — Gestion des rôles utilisateurs
   ============================================ */
let users = [];

// Charger les utilisateurs (depuis storage.js)
loadUsers().then(data => {
    users = data;
    renderUsers();
});


// Cible le tbody du tableau
const usersTable = document.getElementById("users-table");


/* ============================================
   Rendu du tableau
   ============================================ */
function renderUsers() {
    usersTable.innerHTML = ""; // Reset du tableau

    users.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${renderRoleBadge(user.role)}</td>
            <td class="text-end">
                ${renderRoleActions(user)}
            </td>
        `;

        usersTable.appendChild(tr);
    });
}


/* ============================================
   Badge rôle minimaliste façon Apple
   ============================================ */
function renderRoleBadge(role) {
    const colors = {
        "admin": "#c2168eff",
        "moderator": "#2079a6ff",
        "user": "#bad677ff"
    };

    return `
        <span 
            style="
                display:inline-block;
                padding:4px 12px;
                border-radius:12px;
                font-size:0.75rem;
                background:${colors[role]};
                color:white;
                letter-spacing:0.3px;
            "
        >
            ${role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    `;
}


/* ============================================
   Boutons d'action dynamiques
   (Promouvoir / Rétrograder)
   ============================================ */
function renderRoleActions(user) {
    let html = "";

    if (user.role === "user") {
        html += createActionBtn("Promouvoir en Modérateur", () => setRole(user.id, "moderator"));
    } 
    else if (user.role === "moderator") {
        html += createActionBtn("Promouvoir en Admin", () => setRole(user.id, "admin"));
        html += createActionBtn("Rétrograder en User", () => setRole(user.id, "user"));
    } 
    else if (user.role === "admin") {
        html += createActionBtn("Rétrograder en Modérateur", () => setRole(user.id, "moderator"));
    }

    return html;
}


/* ============================================
   Génère un bouton d'action minimaliste
   ============================================ */
function createActionBtn(label, callback) {
    const id = "btn-" + Math.random().toString(36).substr(2, 9);

    // On crée un bouton invisible au début (structure HTML)
    setTimeout(() => {
        document.getElementById(id).addEventListener("click", callback);
    }, 0);

    return `
        <button 
            id="${id}"
            class="btn btn-sm btn-dark ms-2"
            style="border-radius:10px; opacity:0.9;"
        >
            ${label}
        </button>
    `;
}


/* Mise à jour du rôle utilisateur */
function setRole(userId, newRole) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.role = newRole;
    saveUsers(users); // stockage dans localStorage

    renderUsers(); // re-render
}


/* Lancement initial */
renderUsers();
