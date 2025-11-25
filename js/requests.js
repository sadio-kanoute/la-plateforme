/*requests.js — Gestion des demandes de présence*/

// Données
let requests = [];
let users = [];

// Cible du tableau
const requestsTable = document.getElementById("requests-table");


/* Lancement initial*/
Promise.all([loadRequests(), loadUsers()]).then(values => {
    requests = values[0];
    users = values[1];

    renderRequests();
});


/* Rendu du tableau */
function renderRequests() {
    requestsTable.innerHTML = ""; // reset

    requests.forEach(req => {
        const user = users.find(u => u.id === req.userId);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user ? user.firstName + " " + user.lastName : "Utilisateur inconnu"}</td>
            <td>${formatDate(req.date)}</td>
            <td>${renderStatusBadge(req.status)}</td>
            <td class="text-end">
                ${renderActions(req)}
            </td>
        `;

        requestsTable.appendChild(tr);
    });
}


/* Badges de statut */
function renderStatusBadge(status) {
    const colors = {
        "pending": "#555",
        "accepted": "#0a0",
        "refused": "#a00"
    };

    const labels = {
        "pending": "En attente",
        "accepted": "Acceptée",
        "refused": "Refusée"
    };

    return `
        <span 
            style="
                display:inline-block;
                padding:4px 12px;
                border-radius:12px;
                font-size:0.75rem;
                background:${colors[status]};
                color:white;
                letter-spacing:0.3px;
            "
        >
            ${labels[status]}
        </span>
    `;
}


/* Boutons d'action (Accepter / Refuser) */
function renderActions(request) {
    if (request.status !== "pending") return ""; // Pas d'action si déjà traité

    const acceptId = "btn-acc-" + request.id;
    const refuseId = "btn-ref-" + request.id;

    // EventListeners ajoutés après création du bouton
    setTimeout(() => {
        const accBtn = document.getElementById(acceptId);
        const refBtn = document.getElementById(refuseId);

        if (accBtn) accBtn.addEventListener("click", () => updateRequestStatus(request.id, "accepted"));
        if (refBtn) refBtn.addEventListener("click", () => updateRequestStatus(request.id, "refused"));
    }, 0);

    return `
        <button id="${acceptId}" class="btn btn-sm btn-dark me-2" style="border-radius:10px;">Accepter</button>
        <button id="${refuseId}" class="btn btn-sm btn-outline-dark" style="border-radius:10px;">Refuser</button>
    `;
}


/* Mise à jour du statut */
function updateRequestStatus(id, newStatus) {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    req.status = newStatus;

    saveRequests(requests); // sauvegarde

    renderRequests(); // re-render
}


/* Format de date */
function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}
