/* connexion.js — Connexion / Déconnexion utilisateur */

/**
 * Renvoie l'utilisateur actuellement connecté
 */
function getCurrentUser() {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
}

/**
 * Enregistre l'utilisateur comme connecté
 */
function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Déconnexion
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../login.html";
}


/* Fonction LOGIN (à appeler depuis la page de connexion)*/

function login(email, password) {

    // Charger les utilisateurs
    return loadUsers().then(users => {

        // Chercher un utilisateur correspondant
        const foundUser = users.find(u => 
            u.email === email.trim() && 
            u.password === password.trim()
        );

        if (!foundUser) {
            return { success: false, message: "Identifiants incorrects" };
        }

        // Stocker l'utilisateur connecté
        setCurrentUser(foundUser);

        return { success: true, user: foundUser };
    });
}
