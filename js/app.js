// =========================================================
// --- INITIALISATION DU THÈME ---
// =========================================================
let currentTheme = localStorage.getItem('app-theme') || 'theme-rdr2-light';

// Exporte les données en téléchargement direct
function exportData() {
    const dataStr = JSON.stringify(db, null, 4);
    const fileName = `rdr2_tracker_backup_${new Date().toISOString().slice(0,10)}.json`;
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
    
    let panel = document.getElementById('settings-panel');
    if (panel) panel.classList.remove('show');
}

function importData(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function(){
        try {
            let parsed = JSON.parse(reader.result);
            if (parsed.camp && parsed.trappeur && parsed.receleur) {
                let newDb = JSON.parse(JSON.stringify(initialData));

                parsed.camp.forEach(oldItem => {
                    let newItem = newDb.camp.find(x => x.id === oldItem.id);
                    if (newItem) newItem.current = Math.min(oldItem.current, newItem.total);
                });

                parsed.trappeur.forEach(oldItem => {
                    let newItem = newDb.trappeur.find(x => x.id === oldItem.id);
                    if (newItem) newItem.current = Math.min(oldItem.current, newItem.total);
                });

                parsed.receleur.forEach(oldItem => {
                    let newItem = newDb.receleur.find(x => x.id === oldItem.id);
                    if (newItem) {
                        if (newItem.isTalisman) {
                            oldItem.components.forEach((oldComp, idx) => {
                                if (newItem.components[idx]) newItem.components[idx].checked = oldComp.checked;
                            });
                        } else {
                            newItem.checked = oldItem.checked;
                        }
                    }
                });

                newDb.stock = parsed.stock || [];
                newDb.history = parsed.history || [];

                db = newDb;
                saveDB("Importation intelligente réussie");
                alert("Données importées avec succès !");
                location.reload();
            } else {
                alert("Format de fichier invalide.");
            }
        } catch (e) {
            alert("Erreur de lecture du fichier.");
        }
    };
    if(input.files.length > 0) reader.readAsText(input.files[0]);
}

// =========================================================
// --- BASE DE DONNÉES COMPLÈTE ---
// =========================================================
const initialData = {
    camp: [
        { id: 1, category: "Améliorations", item: "Quartiers d'Arthur <br><small style='color: var(--text-muted); font-weight: normal;'>(Crâne d'alligator)</small>", resource: "Alligator (une carcasse)", total: 1, current: 0 },
        { id: 2, category: "Améliorations", item: "Tables du camp <br><small style='color: var(--text-muted); font-weight: normal;'>(Nappe en cuir d'antilope)</small>", resource: "Antilope", total: 2, current: 0 },
        { id: 3, category: "Améliorations", item: "Chariot garde-manger <br><small style='color: var(--text-muted); font-weight: normal;'>(Crâne d'antilope)</small>", resource: "Antilope (carcasse)", total: 1, current: 0 },
        { id: 4, category: "Sacoches", item: "Toutes les sacoches <br><small style='color: var(--text-muted); font-weight: normal;'>(1 peau requise par modèle)</small>", resource: "Biche", total: 7, current: 0 },
        { id: 5, category: "Sacoches", item: "Sacoche de provisions", resource: "Bison", total: 1, current: 0 },
        { id: 6, category: "Sacoches", item: "Sacoche d'ingrédients", resource: "Blaireau", total: 1, current: 0 },
        { id: 7, category: "Améliorations", item: "Quartiers d'Arthur <br><small style='color: var(--text-muted); font-weight: normal;'>(Tapis en peau de bœuf)</small>", resource: "Bœuf", total: 2, current: 0 },
        { id: 8, category: "Sacoches / Améliorations", item: "Sacoche d'objets de valeur et Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Couverture de siège du feu de camp)</small>", resource: "Castor", total: 2, current: 0 },
        { id: 9, category: "Sacoches", item: "Sacoche pour fortifiants", resource: "Cerf", total: 1, current: 0 },
        { id: 10, category: "Améliorations", item: "Feu de camp des sentinelles <br><small style='color: var(--text-muted); font-weight: normal;'>(Ossements décoratifs)</small>", resource: "Cerf (bois)", total: 1, current: 0 },
        { id: 11, category: "Améliorations", item: "Feu de camp des sentinelles <br><small style='color: var(--text-muted); font-weight: normal;'>(Tapis de sol pour feu de camp)</small>", resource: "Chèvre", total: 2, current: 0 },
        { id: 12, category: "Sacoches / Améliorations", item: "Sacoche de Légende de l'Est et Quartiers d'Arthur <br><small style='color: var(--text-muted); font-weight: normal;'>(Coffre recouvert de peau de couguar)</small>", resource: "Couguar", total: 3, current: 0 },
        { id: 13, category: "Sacoches", item: "Sacoche d'ingrédients", resource: "Écureuil", total: 1, current: 0 },
        { id: 14, category: "Sacoches", item: "Sacoche de matériaux", resource: "Iguane", total: 1, current: 0 },
        { id: 15, category: "Sacoches", item: "Sacoche d'objets de valeur", resource: "Lapin", total: 1, current: 0 },
        { id: 16, category: "Sacoches / Améliorations", item: "Sacoche de Légende de l'Est et Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Couverture du trône du feu de camp)</small>", resource: "Loup", total: 3, current: 0 },
        { id: 17, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Crâne de loup)</small>", resource: "Loup (carcasse)", total: 1, current: 0 },
        { id: 18, category: "Améliorations", item: "Quartiers d'Arthur <br><small style='color: var(--text-muted); font-weight: normal;'>(Crâne de mouflon)</small>", resource: "Mouflon mâle (une carcasse)", total: 1, current: 0 },
        { id: 19, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Bois d'orignal)</small>", resource: "Orignal (Bois)", total: 1, current: 0 },
        { id: 20, category: "Sacoches", item: "Sacoche de nécessaires", resource: "Panthère", total: 1, current: 0 },
        { id: 21, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Couverture de siège du feu de camp)</small>", resource: "Rat musqué", total: 1, current: 0 },
        { id: 22, category: "Sacoches", item: "Sacoche de provisions", resource: "Raton laveur", total: 1, current: 0 },
        { id: 23, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Couverture de siège du feu de camp)</small>", resource: "Renard", total: 1, current: 0 },
        { id: 24, category: "Sacoches", item: "Sacoche de matériaux, Quartiers d'Arthur et Quartiers de John <br><small style='color: var(--text-muted); font-weight: normal;'>(Table et Tapis en peau de sanglier)</small>", resource: "Sanglier", total: 6, current: 0 },
        { id: 25, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Caisse de banjo en peau de serpent)</small>", resource: "Serpent", total: 2, current: 0 },
        { id: 26, category: "Améliorations", item: "Feu de camp principal <br><small style='color: var(--text-muted); font-weight: normal;'>(Tapis de sol en peau de vache)</small>", resource: "Vache", total: 1, current: 0 },
        { id: 27, category: "Sacoches", item: "Sacoche de fortifiants et Sacoche de nécessaires", resource: "Wapiti", total: 2, current: 0 },
        { id: 28, category: "Sacoches", item: "Feu de camp des sentinelles <br><small style='color: var(--text-muted); font-weight: normal;'>(Bois de wapiti)</small>", resource: "Wapiti (bois)", total: 1, current: 0 }
    ],

    receleur: [
        { id: 104, type: "Amulette", name: "Amulette Corne d'antilope", resource: "Antilope Légendaire", isTalisman: false, checked: false },
        { id: 106, type: "Amulette", name: "Amulette Corne de Tatanka", resource: "Bison Tatanka Légendaire", isTalisman: false, checked: false },
        { id: 107, type: "Amulette", name: "Amulette Dent de castor", resource: "Castor Légendaire", isTalisman: false, checked: false },
        { id: 101, type: "Amulette", name: "Amulette Bois de cerf", resource: "Cerf Légendaire", isTalisman: false, checked: false },
        { id: 108, type: "Amulette", name: "Amulette Dent de couguar", resource: "Couguar Légendaire", isTalisman: false, checked: false },
        { id: 109, type: "Amulette", name: "Amulette Dent de coyote", resource: "Coyote Légendaire", isTalisman: false, checked: false },
        { id: 112, type: "Amulette", name: "Amulette Patte de lion", resource: "Lion Légendaire", isTalisman: false, checked: false },
        { id: 113, type: "Amulette", name: "Amulette Cœur de loup", resource: "Loup Légendaire", isTalisman: false, checked: false },
        { id: 105, type: "Amulette", name: "Amulette Corne de mouflon", resource: "Mouflon Légendaire", isTalisman: false, checked: false },
        { id: 103, type: "Amulette", name: "Amulette Bois d'orignal", resource: "Orignal Légendaire", isTalisman: false, checked: false },
        { id: 111, type: "Amulette", name: "Amulette œil de panthère", resource: "Panthère Légendaire", isTalisman: false, checked: false },
        { id: 110, type: "Amulette", name: "Amulette Griffe de renard", resource: "Renard Légendaire", isTalisman: false, checked: false },
        { id: 102, type: "Amulette", name: "Amulette Bois de wapiti", resource: "Wapiti Légendaire", isTalisman: false, checked: false },
        { id: 118, type: "Talisman", name: "Talisman Dent d'alligator", isTalisman: true, components: [
            { name: "Dent d'alligator légendaire", checked: false },
            { name: "Bracelet articulé en or", checked: false },
            { name: "Menottes de la guerre de Sécession", checked: false }
        ]},
        { id: 114, type: "Talisman", name: "Talisman Corne de bison", isTalisman: true, components: [
            { name: "Corne de bison légendaire", checked: false },
            { name: "Boucle d'oreille en argent", checked: false },
            { name: "Morceau de coquille d'ormeau", checked: false }
        ]},
        { id: 117, type: "Talisman", name: "Talisman Serre de corbeau", isTalisman: true, components: [
            { name: "Vieille boussole en cuivre", checked: false }
        ]},
        { id: 115, type: "Talisman", name: "Talisman Griffe d'ours", isTalisman: true, components: [
            { name: "Griffe d'ours légendaire", checked: false },
            { name: "Bracelet chaîne en argent", checked: false },
            { name: "Morceau de quartz", checked: false }
        ]},
        { id: 116, type: "Talisman", name: "Talisman Défense de sanglier", isTalisman: true, components: [
            { name: "Défense de sanglier légendaire", checked: false },
            { name: "Boucle d'oreille en or", checked: false },
            { name: "Bois pétrifié cobalt", checked: false }
        ]}
    ],

    trappeur: [
        { id: 201, group: "Plumes / Éléments", resource: "Aigle", info: "Chapeau, Accessoires", total: 4, current: 0 },
        { id: 202, group: "Peaux Parfaites", resource: "Alligator", info: "Selle", total: 1, current: 0 },
        { id: 203, group: "Légendaires", resource: "Alligator Légendaire", info: "Chapeau, Gilet, Bottes", total: 1, current: 0 },
        { id: 204, group: "Peaux Parfaites", resource: "Antilope", info: "Chapeau, Gilet, Jambières", total: 4, current: 0 },
        { id: 205, group: "Légendaires", resource: "Antilope Légendaire", info: "Manteau, Gants", total: 1, current: 0 },
        { id: 206, group: "Peaux Parfaites", resource: "Biche", info: "Gilet, Chapeau, Jambières", total: 5, current: 0 },
        { id: 207, group: "Peaux Parfaites", resource: "Bison", info: "Chapeau, Vestes", total: 3, current: 0 },
        { id: 208, group: "Légendaires", resource: "Bison Blanc Légendaire", info: "Chapeau, Veste", total: 1, current: 0 },
        { id: 209, group: "Légendaires", resource: "Bison Tatanka Légendaire", info: "Gilet, Jambières, Bottes", total: 1, current: 0 },
        { id: 210, group: "Petites Peaux", resource: "Blaireau", info: "Gants, Chapeau", total: 2, current: 0 },
        { id: 211, group: "Peaux Parfaites", resource: "Bœuf", info: "Veste, Bottes, Jambières", total: 3, current: 0 },
        { id: 212, group: "Plumes / Éléments", resource: "Bruant", info: "Accessoires", total: 4, current: 0 },
        { id: 213, group: "Plumes / Éléments", resource: "Buse", info: "Accessoires, Chapeau", total: 3, current: 0 },
        { id: 214, group: "Plumes / Éléments", resource: "Caille", info: "Accessoires", total: 2, current: 0 },
        { id: 215, group: "Plumes / Éléments", resource: "Canard", info: "Accessoires", total: 3, current: 0 },
        { id: 216, group: "Plumes / Éléments", resource: "Cardinal", info: "Accessoires, Chapeau", total: 3, current: 0 },
        { id: 217, group: "Peaux Parfaites", resource: "Castor", info: "Chapeau, Gilet, Selle, Veste", total: 9, current: 0 },
        { id: 218, group: "Légendaires", resource: "Castor Légendaire", info: "Chapeau, Gants", total: 1, current: 0 },
        { id: 219, group: "Peaux Parfaites", resource: "Cerf", info: "Bottes, Gilet, Gants", total: 4, current: 0 },
        { id: 220, group: "Légendaires", resource: "Cerf Légendaire", info: "Gilet, Gants", total: 1, current: 0 },
        { id: 221, group: "Peaux Parfaites", resource: "Chèvre", info: "Jambières, Bottes, Chapeau, Gilet", total: 7, current: 0 },
        { id: 222, group: "Plumes / Eléments", resource: "Coq", info: "Accessoires", total: 4, current: 0 },
        { id: 224, group: "Plumes / Éléments", resource: "Condor", info: "Accessoires", total: 1, current: 0 },
        { id: 225, group: "Plumes / Éléments", resource: "Corbeau", info: "Chapeau, Accessoires", total: 13, current: 0 },
        { id: 226, group: "Plumes / Éléments", resource: "Corneille", info: "Accessoires", total: 2, current: 0 },
        { id: 227, group: "Peaux Parfaites", resource: "Couguar", info: "Redingote, Selle, Gilet", total: 4, current: 0 },
        { id: 228, group: "Légendaires", resource: "Couguar Légendaire", info: "Gilet, Chapeau, Gants", total: 1, current: 0 },
        { id: 229, group: "Peaux Parfaites", resource: "Coyote", info: "Veste, Chapeau", total: 3, current: 0 },
        { id: 230, group: "Légendaires", resource: "Coyote Légendaire", info: "Chapeau, Jambières", total: 1, current: 0 },
        { id: 231, group: "Peaux Parfaites", resource: "Opossum", info: "Chapeau", total: 4, current: 0 },
        { id: 232, group: "Plumes / Éléments", resource: "Dinde", info: "Chapeau, Accessoires", total: 6, current: 0 },
        { id: 233, group: "Petites Peaux", resource: "Écureuil", info: "Chapeau", total: 6, current: 0 },
        { id: 234, group: "Plumes / Éléments", resource: "Gallinacé", info: "Accessoires", total: 4, current: 0 },
        { id: 236, group: "Plumes / Éléments", resource: "Faisan", info: "Accessoires", total: 2, current: 0 },
        { id: 237, group: "Plumes / Éléments", resource: "Geai bleu", info: "Accessoires", total: 3, current: 0 },
        { id: 238, group: "Plumes / Éléments", resource: "Merle", info: "Chapeau, Accessoires", total: 7, current: 0 },
        { id: 239, group: "Plumes / Éléments", resource: "Jaseur d'amérique", info: "Accessoires", total: 2, current: 0 },
        { id: 240, group: "Plumes / Éléments", resource: "Hibou / Chouette", info: "Accessoires", total: 1, current: 0 },
        { id: 241, group: "Peaux Parfaites", resource: "Iguane", info: "Chapeau, Gants", total: 3, current: 0 },
        { id: 242, group: "Petites Peaux", resource: "Lapin", info: "Chapeau, Gants", total: 7, current: 0 },
        { id: 243, group: "Peaux Parfaites", resource: "Monstre de Gila", info: "Gants, Chapeau", total: 2, current: 0 },
        { id: 244, group: "Peaux Parfaites", resource: "Loup", info: "Vestes, Gilets, Chapeau", total: 3, current: 0 },
        { id: 245, group: "Légendaires", resource: "Loup Légendaire", info: "Gilet, Jambières", total: 1, current: 0 },
        { id: 246, group: "Plumes / Éléments", resource: "Mouette / Goéland", info: "Accessoires", total: 1, current: 0 },
        { id: 247, group: "Peaux Parfaites", resource: "Mouflon", info: "Gilet, Chapeau, Veste", total: 6, current: 0 },
        { id: 248, group: "Légendaires", resource: "Mouflon Légendaire", info: "Chapeau, Gants, Jambières", total: 1, current: 0 },
        { id: 249, group: "Peaux Parfaites", resource: "Moufette", info: "Chapeau, Bottes", total: 3, current: 0 },
        { id: 250, group: "Plumes / Éléments", resource: "Oie", info: "Accessoires", total: 2, current: 0 },
        { id: 251, group: "Plumes / Éléments", resource: "Oriole", info: "Chapeau, Accessoires", total: 5, current: 0 },
        { id: 252, group: "Peaux Parfaites", resource: "Orignal", info: "Jambières, Veste, Gants", total: 4, current: 0 },
        { id: 253, group: "Légendaires", resource: "Orignal Légendaire", info: "Bottes, Veste", total: 1, current: 0 },
        { id: 254, group: "Peaux Parfaites", resource: "Ours", info: "Selle, Jambières", total: 2, current: 0 },
        { id: 255, group: "Légendaires", resource: "Ours Légendaire", info: "Chapeau, Veste, Bottes", total: 1, current: 0 },
        { id: 256, group: "Peaux Parfaites", resource: "Panthère", info: "Gilet, Selle", total: 3, current: 0 },
        { id: 257, group: "Légendaires", resource: "Panthère Légendaire", info: "Cape, Gants", total: 1, current: 0 },
        { id: 258, group: "Peaux Parfaites", resource: "Ours Noir", info: "Redingote, Chapeau, Jambières", total: 3, current: 0 },
        { id: 259, group: "Plumes / Éléments", resource: "Pic", info: "Accessoires", total: 6, current: 0 },
        { id: 260, group: "Plumes / Éléments", resource: "Pigeon", info: "Accessoires", total: 2, current: 0 },
        { id: 261, group: "Plumes / Éléments", resource: "Piranga", info: "Accessoires", total: 2, current: 0 },
        { id: 262, group: "Plumes / Éléments", resource: "Plongeon", info: "Accessoires", total: 2, current: 0 },
        { id: 263, group: "Peaux Parfaites", resource: "Porc / Cochon", info: "Gants, Gilet", total: 2, current: 0 },
        { id: 264, group: "Peaux Parfaites", resource: "Pécari à collier", info: "Bottes, Gants, Jambières", total: 4, current: 0 },
        { id: 267, group: "Peaux Parfaites", resource: "Rat", info: "Chapeau", total: 16, current: 0 },
        { id: 268, group: "Peaux Parfaites", resource: "Raton laveur", info: "Chapeau", total: 1, current: 0 },
        { id: 269, group: "Petites Peaux", resource: "Rat musqué", info: "Chapeaux, Gants, Jambières", total: 7, current: 0 },
        { id: 270, group: "Peaux Parfaites", resource: "Renard", info: "Jambières, Chapeaux", total: 3, current: 0 },
        { id: 271, group: "Légendaires", resource: "Renard Légendaire", info: "Bottes, Gants", total: 1, current: 0 },
        { id: 272, group: "Légendaires", resource: "Sanglier Légendaire", info: "Chapeau, Bottes", total: 1, current: 0 },
        { id: 273, group: "Peaux Parfaites", resource: "Sanglier", info: "Bottes, Gants, Jambières, Selle, Accessoires", total: 10, current: 0 },
        { id: 274, group: "Peaux Parfaites", resource: "Serpent", info: "Chapeau, Jambières, Gants, Selle", total: 15, current: 0 },
        { id: 275, group: "Plumes / Éléments", resource: "Vautour", info: "Accessoires", total: 1, current: 0 },
        { id: 276, group: "Peaux Parfaites", resource: "Taureau", info: "Vétements, Bottes, Jambières", total: 3, current: 0 },
        { id: 277, group: "Peaux Parfaites", resource: "Vache", info: "Gilets, Vestes, Bottes, Chapeau", total: 5, current: 0 },
        { id: 278, group: "Peaux Parfaites", resource: "Wapiti", info: "Bottes, Chapeau, Gants, Jambières", total: 5, current: 0 },
        { id: 279, group: "Légendaires", resource: "Wapiti Légendaire", info: "Jambières, Bottes, Gants", total: 1, current: 0 },
        { id: 280, group: "Peaux Parfaites", resource: "Mouton", info: "Cape, Gilet, Chapeau, Jambières", total: 8, current: 0 },
        { id: 281, group: "Peaux Parfaites", resource: "Carapace de tatou", info: "Accessoires", total: 2, current: 0 }
    ],
    stock: [],
    history: []
};

// =========================================================
// --- HISTORY & DB INITIALIZATION ---
// =========================================================
let db;
try {
    let localData = localStorage.getItem('rdr2_tracker_db');
    db = localData ? JSON.parse(localData) : structuredClone(initialData);
} catch (e) {
    console.error("Erreur critique de lecture de la sauvegarde. Chargement des données par défaut pour éviter le crash.", e);
    db = structuredClone(initialData);
}

if (!db.history) db.history = [];
if (db.history.length === 0) {
    db.history.push({
        timestamp: Date.now(),
        label: "Point de départ",
        snapshot: JSON.stringify({ camp: db.camp, receleur: db.receleur, trappeur: db.trappeur, stock: db.stock })
    });
    localStorage.setItem('rdr2_tracker_db', JSON.stringify(db));
}

function saveDB(actionLabel = null, preventRender = false) {
    if (actionLabel) {
        db.history.push({
            timestamp: Date.now(),
            label: actionLabel,
            snapshot: JSON.stringify({ camp: db.camp, receleur: db.receleur, trappeur: db.trappeur, stock: db.stock })
        });
        if (db.history.length > 20) db.history.shift();
    }
    localStorage.setItem('rdr2_tracker_db', JSON.stringify(db));
    
    // Si on demande de ne PAS re-rendre globalement, on ignore renderAll()
    if (!preventRender) {
        renderAll();
    }
}

function triggerUndo() {
    if (!db.history || db.history.length <= 1) return;
    
    let btn = document.querySelector('.undo-btn');
    if (btn) {
        btn.classList.remove('animate-undo-click'); 
        void btn.offsetWidth; 
        btn.classList.add('animate-undo-click');
    }

    db.history.pop();
    let previousAction = db.history[db.history.length - 1];
    let snapshot = JSON.parse(previousAction.snapshot);
    
    db.camp = snapshot.camp;
    db.receleur = snapshot.receleur;
    db.trappeur = snapshot.trappeur;
    db.stock = snapshot.stock;
    
    localStorage.setItem('rdr2_tracker_db', JSON.stringify(db));
    renderAll();
}

// =========================================================
// --- THÈMES ET NAVIGATION ---
// =========================================================
const appThemes = [
    { id: 'theme-modern', name: 'Sombre' },
    { id: 'theme-rdr2-dark', name: 'RDR2 Sombre' },
    { id: 'theme-rdr2-light', name: 'RDR2 Clair' }
];

if (typeof window.memoryThemeFallback === 'undefined') {
    window.memoryThemeFallback = 'theme-rdr2-light';
}

function cycleTheme() {
    let currentThemeId = window.memoryThemeFallback;
    try {
        let localValue = localStorage.getItem('app-theme');
        if (localValue) currentThemeId = localValue;
    } catch(e) {
        currentThemeId = window.memoryThemeFallback;
    }
    
    let currentIndex = appThemes.findIndex(t => t.id === currentThemeId);
    if (currentIndex === -1) currentIndex = 0;
    
    let nextIndex = (currentIndex + 1) % appThemes.length;
    let nextTheme = appThemes[nextIndex];
    applyTheme(nextTheme.id);
}

function applyTheme(themeId) {
    document.body.classList.remove('theme-modern', 'theme-light', 'theme-rdr2-dark', 'theme-rdr2-light', 'theme-rdr2-parchment');
    
    if (themeId !== 'theme-modern') {
        document.body.classList.add(themeId);
    }
    
    window.memoryThemeFallback = themeId;
    currentTheme = themeId; 
    try {
        localStorage.setItem('app-theme', themeId);
    } catch(e) {}
    
    updateEmojisInUI();
    
    let currentHash = window.location.hash.replace('#', '') || 'dashboard';
    const titles = {
        'dashboard': '🏠 Tableau de Bord',
        'camp': '🏕️ Camp de Base',
        'receleur': '🦊 Receleur',
        'trappeur': '🧥 Trappeur',
        'stock': '📦 Gestion du Stock',
        'hunting': '🎯 Liste de Chasse Globale',
        'map': '🗺️ Carte Interactive'
    };
    
    let activeNav = Array.from(document.querySelectorAll('.nav-item')).find(el => {
        let onClickAttr = el.getAttribute('onclick');
        return onClickAttr && onClickAttr.indexOf("'" + currentHash + "'") !== -1;
    });
    
    switchView(currentHash, titles[currentHash] || '🏠 Tableau de Bord', activeNav, false);
}

function updateEmojisInUI() {
    const isRDR = (currentTheme === 'theme-rdr2-dark' || currentTheme === 'theme-rdr2-light');
    
    let navIcons = document.querySelectorAll('.nav-item i');
    const defaultIcons = ['🏠', '🏕️', '🦊', '🧥', '📦', '🎯', '🗺️'];
    const rdrIcons = ['⌂', '↟', '⚖\uFE0E', '⚒\uFE0E', '⛃', '⌖', '⛯']; 
    
    if (navIcons.length >= 6) { 
        navIcons.forEach((icon, index) => {
            if(defaultIcons[index]) {
                icon.innerText = isRDR ? rdrIcons[index] : defaultIcons[index];
            }
        });
    }

    let cards = document.querySelectorAll('#view-dashboard .card h3');
    if (cards.length >= 4) {
        cards[1].innerHTML = isRDR ? '↟ Camp de Base' : '🏕️ Camp de Base';
        cards[2].innerHTML = isRDR ? '⚖\uFE0E Receleur' : '🦊 Receleur';
        cards[3].innerHTML = isRDR ? '⚒\uFE0E Trappeur' : '🧥 Trappeur';
    }

    let btnExport = document.querySelector('button[onclick="exportData()"]');
    let btnImport = document.querySelector('button[onclick*="import-file"]');
    let btnTheme = document.getElementById('btn-theme');
    let btnReset = document.querySelector('button[onclick="resetToDefault()"]');

    if (btnExport) btnExport.innerHTML = isRDR ? '⇡ Exporter les données (JSON)' : '📤 Exporter les données (JSON)';
    if (btnImport) btnImport.innerHTML = isRDR ? '⇣ Importer un fichier' : '📥 Importer un fichier';
    if (btnReset) btnReset.innerHTML = isRDR ? '↺ Réinitialiser l\'application' : '🔄 Réinitialiser l\'application';

    if (btnTheme) {
        let themeObj = appThemes.find(t => t.id === currentTheme);
        let themeName = themeObj ? themeObj.name : 'Sombre';
        btnTheme.innerHTML = isRDR ? `❖ Thème : ${themeName}` : `🎨 Thème : ${themeName}`;
    }

    try {
        let huntingTable = document.querySelector('#table-hunting-list tbody');
        if (huntingTable && huntingTable.innerHTML !== '') {
            renderHuntingList();
            if (document.getElementById('global-search') && document.getElementById('global-search').value.trim() !== '') {
                handleSearch();
            }
        }
    } catch (error) {}
}

function switchView(viewId, title, element, updateHistory = true) {
    let dropdown = document.getElementById('global-search-dropdown');
    if (dropdown) dropdown.style.display = 'none';

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    let targetView = document.getElementById(`view-${viewId}`);
    if(targetView) targetView.classList.add('active');
    if (element) element.classList.add('active');

    let searchContainer = document.querySelector('.h-search');
    let searchInput = document.getElementById('global-search');
    
    if (searchContainer) {
        searchContainer.style.display = ''; // Ne jamais cacher la barre !
    }
    
    if (searchInput) {
        if (viewId === 'map') {
            searchInput.placeholder = "Rechercher sur la carte (ex: Trésor, Os...)";
        } else {
            searchInput.placeholder = "Recherche rapide (biche, plume...)";
        }
    }
    
    if(title) {
        let cleanTitle = title.replace('🏠', '').replace('⌂', '').trim();
        let isRDR = (typeof currentTheme !== 'undefined' && currentTheme.includes('rdr2'));
        if (isRDR) {
            cleanTitle = cleanTitle.replace('🏕️', '↟').replace('🦊', '⚖\uFE0E').replace('🧥', '⚒\uFE0E').replace('📦', '⛃').replace('🎯', '⌖').replace('🗺️', '⛯');
        }
        
        let finalTitleText = "";
        if (viewId === 'dashboard') {
            finalTitleText = cleanTitle; 
        } else {
            let parts = cleanTitle.split(' ');
            finalTitleText = parts.slice(1).join(' '); 
        }

        let titleEl = document.getElementById('view-title-text');
        if(titleEl) titleEl.innerText = finalTitleText;
    }

    window.scrollTo(0, 0);

    if (updateHistory) {
        let currentHash = window.location.hash.replace('#', '') || 'dashboard';
        if (viewId === 'dashboard') {
            window.history.replaceState(null, null, '#dashboard');
        } else if (currentHash === 'dashboard') {
            window.history.pushState(null, null, '#' + viewId);
        } else {
            window.history.replaceState(null, null, '#' + viewId);
        }
    }

    let undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        if (viewId === 'map') {
            undoBtn.style.display = 'none';
        } else {
            undoBtn.style.display = 'flex';
        }
    }

    // CORRECTION : On initialise la carte ici, une fois que la section est bien affichée (.active)
    if (viewId === 'map') {
        if (!rdr2Map && typeof initOrUpdateMap === 'function') {
            initOrUpdateMap();
        }
        if (rdr2Map) {
            setTimeout(() => { rdr2Map.invalidateSize(); }, 50);
            setTimeout(() => { 
                rdr2Map.invalidateSize(); 
                let scale = Math.max(rdr2Map.getSize().x / 8000, rdr2Map.getSize().y / 6211);
                rdr2Map.setView([3105, 4000], Math.log(scale) / Math.LN2);
            }, 250);
        }
    }
}

// =========================================================
// --- UTILITAIRES ET RENDU ---
// =========================================================
function normalizeStr(str) {
    if (!str) return "";
    return str.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
              .toLowerCase()                    // Met tout en minuscules
              .replace(/œ/g, "oe")              // Transforme le œ en oe
              .replace(/æ/g, "ae")              // Transforme le æ en ae (au cas où)
              .trim();                          // Enlève les espaces en trop
}

function renderAll() {
    renderDashboard();
    renderCamp();
    renderReceleur();
    renderTrappeur();
    renderStock();
    renderHuntingList();
}

function calculateProgressForCategory(arr) {
    let total = 0;
    let current = 0;
    arr.forEach(item => {
        if (item.components) {
            total += item.components.length;
            current += item.components.filter(c => c.checked).length;
        } else if (item.isTalisman === false) {
            total += 1;
            current += item.checked ? 1 : 0;
        } else {
            total += item.total || 0;
            current += item.current || 0;
        }
    });
    return { total, current, percent: total > 0 ? Math.round((current / total) * 100) : 0 };
}

function renderDashboard() {
    let cProgress = calculateProgressForCategory(db.camp);
    let rProgress = calculateProgressForCategory(db.receleur);
    let tProgress = calculateProgressForCategory(db.trappeur);

    let globalTotal = cProgress.total + rProgress.total + tProgress.total;
    let globalCurrent = cProgress.current + rProgress.current + tProgress.current;
    let globalPercent = globalTotal > 0 ? Math.round((globalCurrent / globalTotal) * 100) : 0;

    document.getElementById('prog-global-val').innerText = globalPercent + '%';
    document.getElementById('prog-global-count').innerText = `${globalCurrent} / ${globalTotal}`;
    document.getElementById('prog-global-bar').style.width = globalPercent + '%';

    document.getElementById('prog-camp-val').innerText = cProgress.percent + '%';
    document.getElementById('prog-camp-count').innerText = `${cProgress.current} / ${cProgress.total}`;
    document.getElementById('prog-camp-bar').style.width = cProgress.percent + '%';

    document.getElementById('prog-rec-val').innerText = rProgress.percent + '%';
    document.getElementById('prog-rec-count').innerText = `${rProgress.current} / ${rProgress.total}`;
    document.getElementById('prog-rec-bar').style.width = rProgress.percent + '%';

    document.getElementById('prog-trap-val').innerText = tProgress.percent + '%';
    document.getElementById('prog-trap-count').innerText = `${tProgress.current} / ${tProgress.total}`;
    document.getElementById('prog-trap-bar').style.width = tProgress.percent + '%';

    let remainingAnimals = 0;
    db.camp.forEach(i => remainingAnimals += (i.total - i.current));
    db.trappeur.forEach(i => remainingAnimals += (i.total - i.current));
    document.getElementById('stat-animals-needed').innerText = remainingAnimals;

    let ams = db.receleur.filter(i => !i.isTalisman && i.checked).length;
    let tals = db.receleur.filter(i => i.isTalisman && i.components.every(c => c.checked)).length;
    document.getElementById('stat-amulets').innerText = ams;
    document.getElementById('stat-talismans').innerText = tals;
}

function makeStarsHtml(current, total, onClickFnStr) {
    let minusClick = onClickFnStr.replace('QTY', Math.max(0, current - 1));
    let plusClick = onClickFnStr.replace('QTY', Math.min(total, current + 1));
    let percent = (current / total) * 100;

    let html = `<div class="progress-container">`;
    html += `<button class="btn-mini" onclick="${minusClick}">-</button>`;
    html += `
        <div class="mini-bar-bg">
            <div class="mini-bar-fill" style="width: ${percent}%"></div>
        </div>`;
    html += `<button class="btn-mini" onclick="${plusClick}">+</button>`;
    html += `<span class="numeric-text" style="width: 50px; text-align: left;">(${current}/${total})</span>`;
    html += `</div>`;
    return html;
}

function renderCamp() {
    let tbody = document.querySelector('#table-camp tbody');
    tbody.innerHTML = '';

    // 1. Détection du filtre actif
    let activeFilter = 'all';
    let activePill = document.querySelector('.filter-pill.active');
    if (activePill) {
        activeFilter = activePill.dataset.filter;
    }

    // 2. VUE "TOUT AFFICHER" (Classique)
    if (activeFilter === 'all') {
        db.camp.forEach(item => {
            let isComplete = item.current >= item.total;
            let tr = document.createElement('tr');
            if (isComplete) tr.className = 'row-complete';

            let resName = item.resource;
            let mainPart = resName;
            let extraPart = "";

            if (resName.includes("(")) {
                mainPart = resName.split("(")[0].trim();
                extraPart = "<br><small style='font-weight:normal; color:var(--text-muted);'>(" + resName.split("(")[1] + "</small>";
            }

            tr.innerHTML = `
                <td>${item.item}</td>
                <td>${mainPart} ${extraPart}</td>
                <td>${makeStarsHtml(item.current, item.total, `updateQty('camp', ${item.id}, QTY)`)}</td>
            `;
            tbody.appendChild(tr);
        });
        return; // On stoppe l'exécution ici
    }

    // 3. VUE FILTRÉE (Le Menu de Pearson)
    const categoryConfigs = {
        sacoches: [
            { group: "Sacoche pour fortifiants", items: [{ id: 4, label: "Biche" }, { id: 9, label: "Cerf" }, { id: 27, label: "Wapiti" }] },
            { group: "Sacoche d'ingrédients", items: [{ id: 4, label: "Biche" }, { id: 6, label: "Blaireau" }, { id: 13, label: "Écureuil" }] },
            { group: "Sacoche de nécessaires", items: [{ id: 4, label: "Biche" }, { id: 20, label: "Panthère" }, { id: 27, label: "Wapiti" }] },
            { group: "Sacoche de provisions", items: [{ id: 4, label: "Biche" }, { id: 5, label: "Bison" }, { id: 22, label: "Raton laveur" }] },
            { group: "Sacoche de matériaux", items: [{ id: 4, label: "Biche" }, { id: 14, label: "Iguane" }, { id: 24, label: "Sanglier" }] },
            { group: "Sacoche d'objets de valeur", items: [{ id: 4, label: "Biche" }, { id: 8, label: "Castor" }, { id: 15, label: "Lapin" }] },
            { group: "Sacoche de Légende de l'Est", items: [{ id: 4, label: "Biche" }, { id: 12, label: "Couguar" }, { id: 16, label: "Loup" }] }
        ],
        quartiers: [
            { group: "Quartiers d'Arthur", items: [{ id: 1, label: "Crâne d'alligator" }, { id: 18, label: "Crâne de mouflon" }, { id: 12, label: "Coffre recouvert de peau de couguar" }, { id: 24, label: "Table recouverte de peau de sanglier" }, { id: 7, label: "Tapis en peau de bœuf" }] },
            { group: "Quartiers de John", items: [{ id: 24, label: "Tapis en peau de sanglier" }] }
        ],
        ameliorations: [
            { group: "Tables du camp", items: [{ id: 2, label: "Nappe en cuir d'antilope" }] },
            { group: "Chariot garde-manger", items: [{ id: 3, label: "Crâne d'antilope" }] },
            { group: "Feu de camp principal", items: [{ id: 19, label: "Bois d'orignal" }, { id: 17, label: "Crâne de loup" }, { id: 25, label: "Caisse de banjo" }, { id: 8, label: "Couverture de siège (Castor)" }, { id: 21, label: "Couverture de siège (Rat musqué)" }, { id: 23, label: "Couverture de siège (Renard)" }, { id: 16, label: "Couverture du trône du feu de camp" }, { id: 26, label: "Tapis de sol en peau de vache" }] },
            { group: "Feu de camp des sentinelles", items: [{ id: 11, label: "Tapis de sol pour feu de camp" }, { id: 28, label: "Bois de wapiti" }, { id: 10, label: "Ossements décoratifs" }] }
        ]
    };

    let currentConfig = categoryConfigs[activeFilter];
    if (!currentConfig) return;

    let renderCounts = {};

    currentConfig.forEach(groupBlock => {
        let groupItemsElements = []; 
        let isGroupComplete = true; 
        
        // --- ASTUCE : On va stocker ici les noms des animaux pour les cacher dans le titre ---
        let hiddenKeywords = []; 

        groupBlock.items.forEach(req => {
            let dbItem = db.camp.find(i => i.id === req.id);
            if (!dbItem) return;

            // On ajoute l'animal à notre liste de mots cachés
            hiddenKeywords.push(req.label.toLowerCase(), dbItem.resource.toLowerCase());

            let tr = document.createElement('tr');
            let actionHtml = '';
            let firstColumnHtml = '';

            // Si c'est l'onglet Sacoches
            if (activeFilter === 'sacoches') {
                renderCounts[req.id] = (renderCounts[req.id] || 0) + 1;
                let isChecked = renderCounts[req.id] <= dbItem.current;
                
                if (!isChecked) isGroupComplete = false; 
                if (isChecked) tr.className = 'row-complete';

                firstColumnHtml = `<td></td>`;
                actionHtml = `
                    <td style="text-align: center;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} 
                            onchange="toggleCampCheckbox(${req.id}, this.checked)" 
                            style="width: 22px; height: 22px; cursor: pointer; accent-color: #8b0000;">
                    </td>
                `;
            } 
            // Si c'est Quartiers ou Améliorations
            else {
                if (dbItem.current < dbItem.total) isGroupComplete = false;
                if (dbItem.current >= dbItem.total) tr.className = 'row-complete';
                
                firstColumnHtml = `<td style="padding-left: 35px; font-weight: 500; color: var(--text-color);">${req.label}</td>`;
                actionHtml = `<td>${makeStarsHtml(dbItem.current, dbItem.total, `updateQty('camp', ${req.id}, QTY)`)}</td>`;
            }

            tr.innerHTML = `
                ${firstColumnHtml}
                <td>${dbItem.resource.split('(')[0].trim()}</td>
                ${actionHtml}
            `;
            groupItemsElements.push(tr);
        });

        // Génération de l'en-tête de groupe
        let trGroup = document.createElement('tr');
        let groupStyle = "display: table-cell !important; background: rgba(139,0,0,0.08); font-weight: bold; font-size: 1.1em; color: var(--text-color); border-bottom: 2px solid #8b0000; padding: 12px 15px;";
        
        if (isGroupComplete) {
            groupStyle += " text-decoration: line-through; opacity: 0.6;";
        }

        // --- MAGIE : Le texte invisible qui trompe la barre de recherche ---
        let hiddenSpan = `<span style="font-size: 0; opacity: 0; position: absolute; pointer-events: none;">${hiddenKeywords.join(' ')}</span>`;

        trGroup.innerHTML = `
            <td colspan="3" style="${groupStyle}">
                ${groupBlock.group} ${hiddenSpan}
            </td>
        `;
        tbody.appendChild(trGroup);

        groupItemsElements.forEach(tr => tbody.appendChild(tr));
    });
}

function renderReceleur() {
    let tbody = document.querySelector('#table-receleur tbody');
    tbody.innerHTML = '';
    db.receleur.forEach(item => {
        let tr = document.createElement('tr');
        
        if (item.isTalisman) {
            let allChecked = item.components.every(c => c.checked);
            let checkedCount = item.components.filter(c => c.checked).length;
            
            tr.className = allChecked ? 'row-talisman row-complete' : 'row-talisman';

            let compHtml = item.components.map((c, idx) => `
                <label class="checkbox-item">
                    <input type="checkbox" ${c.checked ? 'checked' : ''} onchange="toggleTalismanComponent(${item.id}, ${idx})">
                    <span style="${c.checked ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${c.name}</span>
                </label>
            `).join('');

            let badgeHtml = allChecked ? '' : `<br><span class="badge-progress" style="margin-top: 6px; display: inline-block;">📿 En cours (${checkedCount}/${item.components.length})</span>`;

            tr.innerHTML = `
                <td><div style="font-weight:bold; font-size: 0.9rem; color: var(--accent-hover);">Talisman</div>${item.name.replace('Talisman ', '')} ${badgeHtml}</td>
                <td>${compHtml}</td>
                <td style="text-align: center; vertical-align: middle;">${allChecked ? '<span class="badge-done">Terminé</span>' : '<small class="text-fabriquer" style="color:var(--text-muted)">À fabriquer</small>'}</td>
            `;
        } else {
            tr.className = item.checked ? 'row-amulet row-complete' : 'row-amulet';
            
            tr.innerHTML = `
                <td><div style="font-weight:bold; font-size: 0.9rem; color: var(--accent-hover);">Amulette</div>${item.name.replace('Amulette ', '')}</td>
                <td>${item.resource}</td>
                <td style="text-align: center; vertical-align: middle;">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleAmuletCheck(${item.id})">
                </td>
            `;
        }
        tbody.appendChild(tr);
    });
}

function renderTrappeur() {
    let tbody = document.querySelector('#table-trappeur tbody');
    tbody.innerHTML = '';
    db.trappeur.sort((a, b) => a.resource.localeCompare(b.resource));

    db.trappeur.forEach(item => {
        let isComplete = item.current >= item.total;
        let tr = document.createElement('tr');
        if (isComplete) tr.className = 'row-complete';
        
        let isPlume = item.group.toLowerCase().includes('plume') || item.group.toLowerCase().includes('élément');
        let resourceText = isPlume ? `${item.resource} <br><small style="color:var(--text-muted); font-weight:normal;">(Plume)</small>` : item.resource;

        tr.innerHTML = `
            <td>${item.info}</td>
            <td>${resourceText}</td>
            <td>${makeStarsHtml(item.current, item.total, `updateQty('trappeur', ${item.id}, QTY)`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderHuntingList() {
    let tbody = document.querySelector('#table-hunting-list tbody');
    tbody.innerHTML = '';
    let aggregate = {};

    const initAgg = (rawName) => {
        let name = rawName.trim(); 
        let key = normalizeStr(name);
        if (!aggregate[key]) {
            aggregate[key] = {
                displayName: name,
                campReq: 0, campObt: 0,
                trapReq: 0, trapObt: 0,
                recReq: 0, recObt: 0,
                stock: 0
            };
        }
        return key;
    };

    db.camp.forEach(i => {
        let key = initAgg(i.resource);
        aggregate[key].campReq += (i.total || 0);
        aggregate[key].campObt += (i.current || 0);
    });

    db.trappeur.forEach(i => {
        let key = initAgg(i.resource);
        aggregate[key].trapReq += (i.total || 0);
        aggregate[key].trapObt += (i.current || 0);
    });

    db.receleur.forEach(i => {
        if (!i.isTalisman && i.resource) {
            let key = initAgg(i.resource);
            aggregate[key].recReq += 1;
            aggregate[key].recObt += (i.checked ? 1 : 0);
        } else if (i.isTalisman) {
            i.components.forEach(comp => {
                let compNorm = normalizeStr(comp.name);
                if (compNorm.includes("legendaire")) {
                    Object.keys(aggregate).forEach(key => {
                        if (key.includes("legendaire") && compNorm.includes(key.replace("legendaire", "").trim())) {
                            aggregate[key].recReq += 1;
                            aggregate[key].recObt += (comp.checked ? 1 : 0);
                        }
                    });
                }
            });
        }
    });

    db.stock.forEach(i => {
        let key = normalizeStr(i.resource);
        if (aggregate[key]) {
            aggregate[key].stock += i.qty;
        }
    });

    Object.keys(aggregate).sort((a, b) => a.localeCompare(b, 'fr')).forEach(key => {
        let data = aggregate[key];
        let totalReq = data.campReq + data.trapReq + data.recReq;
        let totalObt = data.campObt + data.trapObt + data.recObt;
        let reste = Math.max(0, totalReq - totalObt);

        let mainTr = document.createElement('tr');
        mainTr.className = 'hunting-main-row';
        if (reste === 0) mainTr.classList.add('row-complete');

        mainTr.onclick = function() {
            let details = this.nextElementSibling;
            if (details && details.classList.contains('hunting-details-row')) {
                details.style.display = details.style.display === 'none' ? 'table-row' : 'none';
            }
        };
        mainTr.style.cursor = 'pointer';

        mainTr.innerHTML = `
            <td><strong>${data.displayName}</strong></td>
            <td>${totalReq}</td>
            <td>${totalObt}</td>
            <td>${reste === 0 ? '<span class="badge-done">Terminé</span>' : `<span style="color:var(--accent-hover); font-weight:bold;">${reste}</span>`}</td>
        `;
        tbody.appendChild(mainTr);

        let detailsTr = document.createElement('tr');
        detailsTr.className = 'hunting-details-row';
        detailsTr.style.display = 'none'; 
        
        let campStr = data.campReq > 0 ? `(${data.campObt}/${data.campReq})` : '-';
        let recStr = data.recReq > 0 ? `(${data.recObt}/${data.recReq})` : '-';
        let trapStr = data.trapReq > 0 ? `(${data.trapObt}/${data.trapReq})` : '-';

        let isRDR = (typeof currentTheme !== 'undefined' && currentTheme.includes('rdr2'));
        let iconCamp = isRDR ? '↟' : '🏕️';
        let iconRec = isRDR ? '⚖\uFE0E' : '🦊';
        let iconTrap = isRDR ? '⚒\uFE0E' : '🧥';
        let iconStock = isRDR ? '⛃' : '📦';
        
        detailsTr.innerHTML = `
            <td colspan="4" style="padding: 0; border-bottom: 1px solid var(--border-color);">
                <div class="hunting-breakdown-box">
                    <div class="breakdown-item" onclick="switchView('camp', '🏕️ Camp de Base', document.querySelectorAll('.nav-item')[1])">
                        <div class="bd-label"><i class="theme-icon-camp" style="font-style:normal; margin-right:8px;">${iconCamp}</i>Camp de base</div> <div class="bd-value"><strong>${campStr}</strong></div>
                    </div>
                    <div class="breakdown-item" onclick="switchView('receleur', '🦊 Receleur', document.querySelectorAll('.nav-item')[2])">
                        <div class="bd-label"><i class="theme-icon-rec" style="font-style:normal; margin-right:8px;">${iconRec}</i>Receleur</div> <div class="bd-value"><strong>${recStr}</strong></div>
                    </div>
                    <div class="breakdown-item" onclick="switchView('trappeur', '🧥 Trappeur', document.querySelectorAll('.nav-item')[3])">
                        <div class="bd-label"><i class="theme-icon-trap" style="font-style:normal; margin-right:8px;">${iconTrap}</i>Trappeur</div> <div class="bd-value"><strong>${trapStr}</strong></div>
                    </div>
                    <div class="breakdown-item" onclick="switchView('stock', '📦 Gestion du Stock', document.querySelectorAll('.nav-item')[4])" style="color: ${data.stock > 0 ? '#4caf50' : 'var(--text-muted)'};">
                        <div class="bd-label"><i class="theme-icon-stock" style="font-style:normal; margin-right:8px;">${iconStock}</i>Actuellement en stock</div> <div class="bd-value"><strong>${data.stock}</strong></div>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(detailsTr);
    });
}

function renderStock() {
    let tbody = document.querySelector('#table-stock tbody');
    tbody.innerHTML = '';
    if (db.stock.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">Le stock est vide.</td></tr>`;
        window.lastAddedStockItem = null;
        return;
    }
    
    db.stock.sort((a, b) => a.resource.localeCompare(b.resource, 'fr', { sensitivity: 'base' }));

    db.stock.forEach((item, index) => {
        let stockName = normalizeStr(item.resource);
        
        // On prépare l'analyse pour les animaux légendaires
        let isLegendary = stockName.includes("legendaire");
        let firstWord = stockName.replace("legendaire", "").trim().split(" ")[0];

        let campQtyNeeded = db.camp
            .filter(i => normalizeStr(i.resource) === stockName && (i.total - i.current > 0))
            .reduce((sum, i) => sum + (i.total - i.current), 0);

        let trapQtyNeeded = db.trappeur
            .filter(i => normalizeStr(i.resource) === stockName && (i.total - i.current > 0))
            .reduce((sum, i) => sum + (i.total - i.current), 0);

        // NOUVEAU : On vérifie les Amulettes ET les Talismans pour le Receleur
        let recQtyNeeded = 0;
        db.receleur.forEach(i => {
            if (i.isTalisman && isLegendary) {
                i.components.forEach(comp => {
                    let compNorm = normalizeStr(comp.name);
                    if (compNorm.includes(firstWord) && compNorm.includes("legendaire") && !comp.checked) {
                        recQtyNeeded++;
                    }
                });
            } else if (!i.isTalisman) {
                if (normalizeStr(i.resource) === stockName && !i.checked) {
                    recQtyNeeded++;
                }
            }
        });

        let animClass = (window.lastAddedStockItem === stockName) ? 'stock-item-added' : '';

        tbody.innerHTML += `
            <tr class="${animClass}">
                <td><strong>${item.resource}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                        <button class="btn-mini" onclick="adjustStockQty(${index}, -1)">-</button>
                        <span style="font-weight:bold; min-width: 25px; text-align: center;">${item.qty}</span>
                        <button class="btn-mini" onclick="adjustStockQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        ${campQtyNeeded > 0 ? `<button class="btn-action btn-camp" onclick="routeStockItem(${index}, 'camp')">🏕️ Pearson (${campQtyNeeded})</button>` : ''}
                        ${recQtyNeeded > 0 ? `<button class="btn-action btn-rec" onclick="routeStockItem(${index}, 'receleur')">⚖ Receleur (${recQtyNeeded})</button>` : ''}
                        ${trapQtyNeeded > 0 ? `<button class="btn-action btn-trap" onclick="routeStockItem(${index}, 'trappeur')">⚒ Trappeur (${trapQtyNeeded})</button>` : ''}
                        <button class="btn-action btn-del" onclick="routeStockItem(${index}, 'delete')">🗑️ Jeter</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    window.lastAddedStockItem = null;
}

// =========================================================
// --- SYNCHRONISATION INTELLIGENTE DU STOCK ---
// =========================================================

function getBaseAnimalName(itemName) {
    let norm = normalizeStr(itemName);
    
    // Dictionnaire ultra-précis pour forcer la liaison des composants de Talismans
    const exactMatches = {
        "dent d'alligator legendaire": "Alligator Légendaire",
        "corne de bison legendaire": "Bison Blanc Légendaire",
        "griffe d'ours legendaire": "Ours Légendaire",
        "defense de sanglier legendaire": "Sanglier Légendaire"
    };

    if (exactMatches[norm]) {
        return exactMatches[norm];
    }
    
    // Dictionnaire de secours pour les Amulettes et autres animaux
    const legendariesMap = {
        "alligator": "Alligator Légendaire",
        "antilope": "Antilope Légendaire",
        "blanc": "Bison Blanc Légendaire",
        "tatanka": "Bison Tatanka Légendaire",
        "castor": "Castor Légendaire",
        "cerf": "Cerf Légendaire",
        "couguar": "Couguar Légendaire",
        "cougar": "Couguar Légendaire", 
        "coyote": "Coyote Légendaire",
        "lion": "Lion Légendaire",
        "loup": "Loup Légendaire",
        "mouflon": "Mouflon Légendaire",
        "orignal": "Orignal Légendaire",
        "ours": "Ours Légendaire",
        "panthere": "Panthère Légendaire",
        "renard": "Renard Légendaire",
        "sanglier": "Sanglier Légendaire",
        "wapiti": "Wapiti Légendaire"
    };

    if (norm.includes("legendaire") || norm.includes("tatanka") || norm.includes("lion")) {
        for (let key in legendariesMap) {
            if (norm.includes(key)) {
                return legendariesMap[key];
            }
        }
    }
    return itemName;
}

function syncStockAutomatique(rawResourceName, delta) {
    if (!rawResourceName || delta === 0) return;
    
    let baseName = getBaseAnimalName(rawResourceName);
    let normName = normalizeStr(baseName);
    
    let stockIndex = db.stock.findIndex(s => normalizeStr(s.resource) === normName);

    if (delta > 0) {
        // Validation (+) : On RETIRE du stock
        if (stockIndex !== -1) {
            db.stock[stockIndex].qty -= delta;
            if (db.stock[stockIndex].qty <= 0) {
                db.stock.splice(stockIndex, 1);
            }
        }
    } else if (delta < 0) {
        // Annulation (-) : On REMET dans le stock
        let amountToAdd = Math.abs(delta);
        if (stockIndex !== -1) {
            db.stock[stockIndex].qty += amountToAdd;
        } else {
            db.stock.push({ resource: baseName, qty: amountToAdd });
        }
    }
}

function updateQty(category, id, newQty) {
    let item = db[category].find(x => x.id === id);
    if (!item) return;
    if (newQty < 0 || newQty > item.total) return;

    let oldQty = item.current;
    let delta = newQty - oldQty; 
    item.current = newQty;
    
    // Synchronise le stock
    syncStockAutomatique(item.resource, delta);
    
    saveDB(`Modification quantité de ${item.resource || item.name} : ${oldQty} ➔ ${newQty}`, true);
    
    if (category === 'camp') renderCamp();
    if (category === 'trappeur') renderTrappeur();
    
    renderDashboard();
    renderHuntingList();
    renderStock();
}

function toggleTalismanComponent(id, compIdx) {
    let talisman = db.receleur.find(x => x.id === id);
    if (talisman && talisman.components[compIdx]) {
        let comp = talisman.components[compIdx];
        comp.checked = !comp.checked;
        
        // Synchronise le stock
        let delta = comp.checked ? 1 : -1;
        syncStockAutomatique(comp.name, delta);

        saveDB(`Composant Talisman coché/décoché : ${comp.name}`, true);
        
        renderReceleur();
        renderDashboard();
        renderHuntingList();
        renderStock();
    }
}

function toggleAmuletCheck(id) {
    let amulette = db.receleur.find(x => x.id === id);
    if (amulette) {
        amulette.checked = !amulette.checked;
        
        // Synchronise le stock
        let delta = amulette.checked ? 1 : -1;
        syncStockAutomatique(amulette.resource, delta);

        saveDB(`Amulette cochée/décochée : ${amulette.name}`, true);
        
        renderReceleur();
        renderDashboard();
        renderHuntingList();
        renderStock();
    }
}

// =========================================================
// --- SYSTÈME DE STOCK & RECHERCHE ---
// =========================================================
let allAnimalNames = [];

function initCustomAutocomplete() {
    let suggestions = new Set();
    db.camp.forEach(item => suggestions.add(item.resource.trim()));
    db.trappeur.forEach(item => suggestions.add(item.resource.trim()));
    db.receleur.forEach(item => { if (!item.isTalisman) suggestions.add(item.resource); });
    
    allAnimalNames = Array.from(suggestions).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

    let btn = document.getElementById('toggle-dropdown-btn');
    if(btn) {
        btn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            let dropdown = document.getElementById('custom-animal-list');
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                renderCustomDropdown(true); 
                dropdown.style.display = 'block';
            }
        });
    }

    let si = document.getElementById('stock-animal');
    if(si) {
        si.addEventListener('keydown', (e) => {
            let realInput = document.getElementById('stock-animal');
            let ghostInput = document.getElementById('stock-animal-ghost');
            if ((e.key === 'ArrowRight' || e.key === 'Tab') && ghostInput.value && ghostInput.value !== realInput.value) {
                e.preventDefault(); 
                realInput.value = ghostInput.value;
                handleStockInput();
            }
        });
    }

    document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            let cal = document.getElementById('custom-animal-list');
            if(cal) cal.style.display = 'none';
        }
    });
}

function handleStockInput() {
    let realInput = document.getElementById('stock-animal');
    let ghostInput = document.getElementById('stock-animal-ghost');
    let dropdown = document.getElementById('custom-animal-list');
    let val = realInput.value;

    if (!val) {
        ghostInput.value = '';
        if (dropdown) dropdown.style.display = 'none'; 
    } else {
        let normVal = normalizeStr(val);
        let match = allAnimalNames.find(name => normalizeStr(name).startsWith(normVal));
        
        if (match) {
            let normMatch = normalizeStr(match);
            // On calcule le reste à partir de la version normalisée pour éviter le décalage du "œ"
            let remainder = normMatch.slice(normVal.length);
            ghostInput.value = val + remainder;
        } else {
            ghostInput.value = '';
        }

        renderCustomDropdown(false);
        if (dropdown) dropdown.style.display = 'block';
    }

    checkSmartAllocation();
}

function renderCustomDropdown(showAll = false) {
    let realInput = document.getElementById('stock-animal');
    let ghostInput = document.getElementById('stock-animal-ghost');
    let dropdown = document.getElementById('custom-animal-list');
    
    dropdown.innerHTML = '';
    let val = normalizeStr(realInput.value);
    let listToRender = allAnimalNames;
    
    if (!showAll && val) {
        listToRender = allAnimalNames.filter(name => {
            let n = normalizeStr(name);
            return n.startsWith(val) || n.includes(" " + val);
        });
    }

    if (listToRender.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    listToRender.forEach(name => {
        let li = document.createElement('li');
        li.textContent = name;
        
        li.onclick = () => {
            window.preventStockClear = true; 
            realInput.value = name;
            ghostInput.value = '';
            dropdown.style.display = 'none';
            checkSmartAllocation();
            realInput.blur(); 
        };
        
        dropdown.appendChild(li);
    });
}

function checkSmartAllocation() {
    let rawInput = document.getElementById('stock-animal').value;
    let inputVal = normalizeStr(rawInput); 
    let box = document.getElementById('smart-allocation');
    let btnsContainer = document.getElementById('allocation-options-btns');
    
    if (inputVal === "") {
        box.style.display = 'none';
        return;
    }

    const cleanName = (name) => normalizeStr(name);

    // Fonction améliorée : elle vérifie le nom complet OU les parties séparées par le slash
    const isMatch = (dbResource, searchVal) => {
        let cleanDb = cleanName(dbResource);
        // Cas 1 : La saisie est identique au nom complet (ex: "porc / cochon")
        if (cleanDb === searchVal) return true;
        // Cas 2 : La saisie correspond à une des parties (ex: "porc" ou "cochon")
        return cleanDb.split('/').some(part => part.trim() === searchVal);
    };

    let needsCamp = db.camp.filter(i => isMatch(i.resource, inputVal) && (i.total - i.current > 0));
    let needsTrap = db.trappeur.filter(i => isMatch(i.resource, inputVal) && (i.total - i.current > 0));
    let needsRec = db.receleur.filter(i => !i.isTalisman && isMatch(i.resource, inputVal) && !i.checked);

    // ... (la suite de la fonction reste identique) ...
    
    let isLegendary = inputVal.includes("legendaire");
    let needsTalisman = [];

    if (isLegendary) {
        let firstWord = inputVal.replace("legendaire", "").trim().split(" ")[0]; 
        
        // CORRECTION : On s'assure qu'un animal a bien été tapé (pas juste "légendaire")
        if (firstWord.length > 0) {
            db.receleur.forEach(item => {
                if (item.isTalisman) {
                    item.components.forEach((comp, idx) => {
                        let compNorm = normalizeStr(comp.name);
                        if (compNorm.includes(firstWord) && compNorm.includes("legendaire") && !comp.checked) {
                            needsTalisman.push({ talismanId: item.id, compIdx: idx, name: comp.name });
                        }
                    });
                }
            });
        }
    }

    let qtyInput = document.getElementById('stock-qty');
    
    let campQtyNeeded = needsCamp.reduce((sum, item) => sum + (item.total - item.current), 0);
    let trapQtyNeeded = needsTrap.reduce((sum, item) => sum + (item.total - item.current), 0);
    let recQtyNeeded = needsRec.length;
    let talismanQtyNeeded = needsTalisman.length;

    let totalVendorsNeeding = campQtyNeeded + trapQtyNeeded + recQtyNeeded + talismanQtyNeeded;

    if (isLegendary) {
        qtyInput.readOnly = true;
        qtyInput.style.opacity = "0.6"; 
        qtyInput.style.cursor = "not-allowed";
        if (window.lastCheckedAnimal !== inputVal) {
            qtyInput.value = totalVendorsNeeding > 0 ? totalVendorsNeeding : 1;
            window.lastCheckedAnimal = inputVal; 
        }
    } else {
        qtyInput.readOnly = false;
        qtyInput.style.opacity = "1";
        qtyInput.style.cursor = "text";
        if (window.lastCheckedAnimal !== inputVal) {
            qtyInput.value = 1;
            window.lastCheckedAnimal = inputVal; 
        }
    }

    btnsContainer.innerHTML = '';
    let realName = rawInput.charAt(0).toUpperCase() + rawInput.slice(1);
    
    if (totalVendorsNeeding === 0) {
        btnsContainer.innerHTML += `<div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px; text-align: center; font-style: italic;">Plus aucun marchand n'en a besoin.</div>`;
    } else {
        if (campQtyNeeded > 0) btnsContainer.innerHTML += `<button class="btn-action btn-camp" onclick="directAddRoute('${realName.replace(/'/g, "\\'")}', 'camp')">🏕️ Pearson (${campQtyNeeded})</button>`;
        if (recQtyNeeded > 0) btnsContainer.innerHTML += `<button class="btn-action btn-rec" onclick="directAddRoute('${realName.replace(/'/g, "\\'")}', 'receleur')">⚖ Receleur (Amulette)</button>`;
        
        needsTalisman.forEach(t => {
            btnsContainer.innerHTML += `<button class="btn-action btn-rec" onclick="allocateTalismanPart(${t.talismanId}, ${t.compIdx}, '${t.name.replace(/'/g, "\\'")}', '${realName.replace(/'/g, "\\'")}')">⚖ Receleur (${t.name})</button>`;
        });
        
        if (trapQtyNeeded > 0) btnsContainer.innerHTML += `<button class="btn-action btn-trap" onclick="directAddRoute('${realName.replace(/'/g, "\\'")}', 'trappeur')">⚒ Trappeur (${isLegendary ? 'Peau' : trapQtyNeeded})</button>`;
    }
    
    btnsContainer.innerHTML += `<button class="btn-action" style="background-color:#555;" onclick="addResourceToStockPlain()">⛃ Garder en Stock</button>`;
    btnsContainer.innerHTML += `<button class="btn-action btn-del" onclick="throwAwayResource()">🗑️ Jeter le reste</button>`;
    btnsContainer.innerHTML += `<button class="btn-action" style="background-color: transparent; border: 1px solid var(--text-muted); color: var(--text-color); margin-top: 5px;" onclick="clearStockInput()">❌ Annuler la saisie</button>`;
    
    box.style.display = 'block';
}

function allocateTalismanPart(talismanId, compIdx, compName, baseAnimalName) {
    let qtyInput = document.getElementById('stock-qty');
    let qty = parseInt(qtyInput.value) || 1;

    let talisman = db.receleur.find(x => x.id === talismanId);
    if (talisman && talisman.components[compIdx]) {
        talisman.components[compIdx].checked = true;
    }

    let remaining = qty - 1;

    if (remaining > 0) {
        let normInput = normalizeStr(baseAnimalName);
        window.lastAddedStockItem = normInput; // <-- L'ANIMATION EST DÉCLENCHÉE ICI
        let existing = db.stock.find(s => normalizeStr(s.resource) === normInput);
        if (existing) {
            existing.qty += remaining;
        } else {
            db.stock.push({ resource: baseAnimalName, qty: remaining });
        }
        saveDB(`1x ${compName} vers Receleur | ${remaining}x gardé(s) en Stock`);
    } else {
        saveDB(`1x ${compName} envoyé(s) vers Receleur`);
        let allocatedTrap = applyResourceToCategory(baseAnimalName, 'trappeur', 1);
        let allocatedRec = applyResourceToCategory(baseAnimalName, 'receleur', 1);
        if (allocatedTrap > 0 || allocatedRec > 0) {
            saveDB(`🌟 Animal Légendaire traité : ${baseAnimalName}`);
        }
    }
    clearStockInput();
}

function directAddRoute(resourceName, destination) {
    let qtyInput = document.getElementById('stock-qty');
    let qty = parseInt(qtyInput.value) || 1;
    
    let allocated = applyResourceToCategory(resourceName, destination, qty);
    let remaining = qty - allocated;
    
    if (remaining > 0) {
        let normInput = normalizeStr(resourceName);
        window.lastAddedStockItem = normInput; // <-- L'ANIMATION EST DÉCLENCHÉE ICI
        let existing = db.stock.find(s => normalizeStr(s.resource) === normInput);
        if (existing) {
            existing.qty += remaining;
        } else {
            db.stock.push({ resource: resourceName, qty: remaining });
        }
        saveDB(`${allocated}x vers ${destination} | ${remaining}x gardé(s) en Stock`);
    } else {
        saveDB(`${allocated}x ${resourceName} envoyé(s) vers ${destination}`);
    }
    
    clearStockInput();
}

function routeStockItem(index, action) {
    let item = db.stock[index];
    if (!item) return;

    if (action === 'delete') {
        db.stock.splice(index, 1);
        saveDB(`🗑️ Suppression de ${item.resource} du stock`);
        return;
    }

    let allocated = applyResourceToCategory(item.resource, action, item.qty);
    
    if (allocated > 0) {
        item.qty -= allocated;
        if (item.qty <= 0) {
            db.stock.splice(index, 1);
            saveDB(`✅ ${allocated}x ${item.resource} donné(s) à ${action} (Le stock est maintenant vide)`);
        } else {
            saveDB(`✅ ${allocated}x ${item.resource} donné(s) à ${action} | Reste ${item.qty} en stock`);
        }
    } else {
        alert("Aucun besoin actif pour " + item.resource + " chez cette catégorie.");
    }
}

function applyResourceToCategory(resourceName, category, maxQty) {
    let totalAllocated = 0;
    let qtyLeft = maxQty;
    let searchName = normalizeStr(resourceName);
    let isLegendary = searchName.includes("legendaire");
    let firstWord = searchName.replace("legendaire", "").trim().split(" ")[0]; 

    let itemsToFill = db[category].filter(i => {
        if (category === 'receleur') {
            if (i.isTalisman) {
                if (!isLegendary) return false;
                return i.components.some(comp => {
                    let compNorm = normalizeStr(comp.name);
                    return compNorm.includes(firstWord) && compNorm.includes("legendaire") && !comp.checked;
                });
            } else {
                let baseName = normalizeStr(i.resource || i.name);
                return baseName === searchName && i.checked === false;
            }
        } else {
            let baseName = normalizeStr(i.resource || i.name);
            return baseName === searchName && (i.total - i.current > 0);
        }
    });

    for (let target of itemsToFill) {
        if (qtyLeft <= 0) break;
        
        if (category === 'receleur') {
            if (target.isTalisman) {
                target.components.forEach(comp => {
                    let compNorm = normalizeStr(comp.name);
                    if (qtyLeft > 0 && compNorm.includes(firstWord) && compNorm.includes("legendaire") && !comp.checked) {
                        comp.checked = true;
                        totalAllocated += 1;
                        qtyLeft -= 1;
                    }
                });
            } else {
                target.checked = true;
                totalAllocated += 1;
                qtyLeft -= 1;
            }
        } else {
            let needed = target.total - target.current;
            let toAdd = Math.min(needed, qtyLeft);
            target.current += toAdd;
            qtyLeft -= toAdd;
            totalAllocated += toAdd;
        }
    }
    return totalAllocated;
}

function addResourceToStockPlain() {
    let rawInput = document.getElementById('stock-animal').value;
    let qtyInput = document.getElementById('stock-qty');
    let qty = parseInt(qtyInput.value) || 1;
    
    if (rawInput.trim() === '') return;
    
    let normInput = normalizeStr(rawInput);
    let resName = rawInput.charAt(0).toUpperCase() + rawInput.slice(1);
    
    window.lastAddedStockItem = normInput; // <-- L'ANIMATION EST DÉCLENCHÉE ICI
    
    let existing = db.stock.find(s => normalizeStr(s.resource) === normInput);
    if (existing) existing.qty += qty;
    else db.stock.push({ resource: resName, qty: qty });
    
    saveDB(`${qty}x ${resName} ajouté(s) au Stock`);
    clearStockInput();
}

function clearStockInput() {
    let animalInput = document.getElementById('stock-animal');
    let ghostInput = document.getElementById('stock-animal-ghost');
    let qtyInput = document.getElementById('stock-qty');
    let allocBox = document.getElementById('smart-allocation');

    if(animalInput) animalInput.value = '';
    if(ghostInput) ghostInput.value = '';
    if(qtyInput) {
        qtyInput.value = 1;
        qtyInput.readOnly = false;
        qtyInput.style.opacity = "1";
        qtyInput.style.cursor = "text";
    }
    if(allocBox) allocBox.style.display = 'none';
    
    document.activeElement.blur();
    window.lastCheckedAnimal = ""; 
}

const stockInput = document.getElementById('stock-animal');
const qtyInput = document.getElementById('stock-qty');

function onStockFocus() { document.body.classList.add('stock-typing'); }
function onStockBlur() {
    setTimeout(() => {
        document.body.classList.remove('stock-typing');
        let active = document.activeElement;
        if (active && (active.id === 'stock-qty' || active.id === 'stock-animal')) return;
        let dropdown = document.getElementById('custom-animal-list');
        if (dropdown) dropdown.style.display = 'none';
    }, 200); 
}

// ⚠️ CORRECTION DU DOUBLE BLOC IF(QTYINPUT) ⚠️
if (qtyInput) {
    qtyInput.addEventListener('focus', function() {
        onStockFocus();
        if (this.value === '1') {
            this.value = '';
        }
    });
    qtyInput.addEventListener('blur', function() {
        onStockBlur();
        if (this.value === '' || parseInt(this.value) < 1) {
            this.value = '1';
        }
    });
    qtyInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.blur(); });
}

function changeStockQty(delta) {
    let qtyInput = document.getElementById('stock-qty');
    if (qtyInput.readOnly) return;

    let currentVal = parseInt(qtyInput.value) || 1;
    let newVal = currentVal + delta;
    if (newVal < 1) newVal = 1;
    qtyInput.value = newVal;
    checkSmartAllocation();
}

function adjustStockQty(index, delta) {
    if (db.stock[index]) {
        let newQty = db.stock[index].qty + delta;
        if (newQty <= 0) {
            db.stock.splice(index, 1);
            saveDB(`Suppression de la ressource du stock`);
        } else {
            db.stock[index].qty = newQty;
            window.lastAddedStockItem = normalizeStr(db.stock[index].resource); // <-- L'ANIMATION EST DÉCLENCHÉE ICI
            saveDB(`Ajustement direct en stock : ${db.stock[index].resource} ➔ ${newQty}`);
        }
    }
}

function throwAwayResource() {
    let rawInput = document.getElementById('stock-animal').value;
    let qtyInput = document.getElementById('stock-qty').value;
    if (rawInput) {
        let resName = rawInput.charAt(0).toUpperCase() + rawInput.slice(1);
        saveDB(`${qtyInput}x ${resName} jeté(s)`);
    }
    clearStockInput();
}

function toggleColumn(tableId, btnElement) {
    let table = document.getElementById(tableId);
    let isHidden = table.classList.contains('mobile-hide-col1');
    if (isHidden) {
        table.classList.remove('mobile-hide-col1');
        table.classList.add('mobile-show-col1');
        btnElement.innerHTML = "👁️ Masquer les détails";
    } else {
        table.classList.remove('mobile-show-col1');
        table.classList.add('mobile-hide-col1');
        if(tableId === 'table-camp') btnElement.innerHTML = "👁️ Afficher les objets à débloquer";
        else btnElement.innerHTML = "👁️ Afficher les équipements";
    }
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    if(panel) panel.classList.toggle('show');
}

// Fermeture du menu Paramètres au clic à l'extérieur
document.addEventListener('pointerdown', function(e) {
    let panel = document.getElementById('settings-panel');
    let menuBtn = document.querySelector('.menu-trigger');
    
    // Si le panneau est ouvert
    if (panel && panel.classList.contains('show')) {
        // Et qu'on clique en dehors du panneau ET en dehors du bouton menu
        if (!panel.contains(e.target) && (!menuBtn || !menuBtn.contains(e.target))) {
            panel.classList.remove('show');
        }
    }
});

function resetToDefault() {
    if (confirm("Voulez-vous vraiment réinitialiser l'application ? Vos modifications locales seront effacées.")) {
        db = JSON.parse(JSON.stringify(initialData));
        saveDB();
        location.reload();
    }
}

// =========================================================
// --- RECHERCHE GLOBALE & DYNAMIQUE DE LA CARTE ---
// =========================================================

function getAllSearchableTerms() {
    let isMapActive = document.getElementById('view-map').classList.contains('active');
    let terms = new Set();

    if (isMapActive) {
        // Si on est sur la carte, on suggère les noms des marqueurs
        if (window.allMapMarkersCollection) {
            window.allMapMarkersCollection.forEach(item => {
                terms.add(item.name.replace(" Légendaire", "")); // Suggère "Cerf" au lieu de "Cerf Légendaire"
            });
            // On ajoute aussi des mots-clés génériques
            terms.add("Trésors");
            terms.add("Animaux Légendaires");
            terms.add("Poissons Légendaires");
            terms.add("Os de Dinosaures");
        }
    } else {
        // Comportement normal pour les autres pages
        db.camp.forEach(item => { if (item.resource) terms.add(item.resource); });
        db.trappeur.forEach(item => { if (item.resource) terms.add(item.resource); });
        db.receleur.forEach(item => { if (item.resource) terms.add(item.resource); });
    }
    return Array.from(terms).filter(t => t).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function handleSearch() {
    let rawQ = document.getElementById('global-search').value;
    let q = rawQ.toLowerCase().trim();
    let normQ = normalizeStr(q);
    
    let clearBtn = document.getElementById('clear-search-btn');
    let arrowBtn = document.getElementById('dropdown-toggle-btn');
    
    if (clearBtn && arrowBtn) {
        if (q.length > 0) {
            clearBtn.style.display = 'flex';
            arrowBtn.style.display = 'none';
        } else {
            clearBtn.style.display = 'none';
            arrowBtn.style.display = 'flex';
        }
    }

    let isMapActive = document.getElementById('view-map').classList.contains('active');
    if (isMapActive) {
        filterMapMarkers(normQ);
        return;
    }

    let isDashboardActive = document.getElementById('view-dashboard').classList.contains('active');
    if (q.length > 0 && isDashboardActive) {
        let huntingNav = document.querySelectorAll('.nav-item')[5];
        switchView('hunting', '🎯 Liste de Chasse Globale', huntingNav, false);
    }

    document.querySelectorAll('.data-table tbody tr').forEach(tr => {
        if (tr.classList.contains('hunting-details-row')) return;
        let text = normalizeStr(tr.innerText);
        let match = text.includes(normQ);
        tr.style.display = match ? '' : 'none';

        if (tr.classList.contains('hunting-main-row')) {
            let detailsRow = tr.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('hunting-details-row')) {
                if (match && normQ.length > 1) detailsRow.style.display = 'table-row'; 
                else detailsRow.style.display = 'none'; 
            }
        }
    });
}



function handleGlobalSearchInput() {
    const input = document.getElementById('global-search');
    const dropdown = document.getElementById('global-search-dropdown');
    const val = input.value.trim().toLowerCase();
    
    if (typeof handleSearch === 'function') handleSearch();

    if (val.length < 1 || document.getElementById('view-map').classList.contains('active')) {
        dropdown.style.display = 'none';
        return;
    }

    const allTerms = getAllSearchableTerms();
    const matches = allTerms.filter(term => term.toLowerCase().startsWith(val));

    if (matches.length > 0) {
        dropdown.innerHTML = ""; 
        matches.forEach(match => {
            let li = document.createElement('li');
            li.style.cssText = "padding: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer; color: var(--text-color); font-size: 0.95rem;";
            li.textContent = match;

            li.onmousedown = function(e) {
                e.preventDefault(); 
                input.value = match; 
                dropdown.style.display = 'none'; 
                if (typeof handleSearch === 'function') handleSearch(); 
            };
            dropdown.appendChild(li);
        });
        dropdown.style.display = 'block'; 
    } else {
        dropdown.style.display = 'none';
    }
}

function toggleFullSearchList(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = document.getElementById('global-search-dropdown');
    const input = document.getElementById('global-search');
    
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        return;
    }

    const allTerms = getAllSearchableTerms();
    dropdown.innerHTML = "";
    
    allTerms.forEach(match => {
        let li = document.createElement('li');
        li.style.cssText = "padding: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer; color: var(--text-color); font-size: 0.95rem;";
        li.textContent = match;

        li.onmousedown = function(e) {
            e.preventDefault(); 
            input.value = match; 
            dropdown.style.display = 'none'; 
            if (typeof handleSearch === 'function') handleSearch(); 
        };
        dropdown.appendChild(li);
    });
    
    dropdown.style.display = 'block';
}

function clearSearch() {
    let searchInput = document.getElementById('global-search');
    searchInput.value = '';
    handleSearch(); 
    
    let dropdown = document.getElementById('global-search-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    searchInput.blur(); 
}

document.addEventListener('click', function(e) {
    const globalSearch = document.getElementById('global-search');
    const dropdown = document.getElementById('global-search-dropdown');
    const toggleBtn = document.getElementById('dropdown-toggle-btn');
    
    if (globalSearch && dropdown && e.target !== globalSearch && (!toggleBtn || !toggleBtn.contains(e.target))) {
        dropdown.style.display = 'none';
    }
});

// =========================================================
// --- CARTE INTERACTIVE (FULL-BLEED) ---
// =========================================================
let rdr2Map = null;

// =========================================================
// --- ICÔNE PUNAISE ROUGE PERSONNALISÉE ---
// =========================================================
const punaiseRougeIcon = L.divIcon({
    className: 'custom-pin-icon',
    html: `<svg viewBox="0 0 24 48" style="width: 24px; height: 48px; filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.6));">
               <path d="M11 20 L12 48 L13 20 Z" fill="#555" />
               <circle cx="12" cy="14" r="7" fill="#e63946" stroke="#8a0303" stroke-width="1.5" />
               <circle cx="9" cy="11" r="2" fill="#ff9999" />
           </svg>`,
    iconSize: [24, 48],
    iconAnchor: [12, 48], 
    popupAnchor: [0, -35] // Ajusté pour s'ouvrir juste au-dessus de la nouvelle petite tête
});

function initOrUpdateMap() {
    let mapDiv = document.getElementById('map-container');
    if (!mapDiv || mapDiv.clientHeight === 0) {
        setTimeout(initOrUpdateMap, 50);
        return;
    }

    if (!rdr2Map) {
        rdr2Map = L.map('map-container', {
            crs: L.CRS.Simple,
            minZoom: -4,   
            maxZoom: 3,  
            zoomControl: true,
            attributionControl: true, 
            zoomSnap: 0,
            zoomDelta: 0.25,
            dragging: true, 
            touchZoom: true, 
            scrollWheelZoom: true
        });

        rdr2Map.zoomControl.setPosition('bottomright');

        

        let bounds = [[0, 0], [6211, 8000]];
        
        L.imageOverlay('carte-interactive.jpg', bounds, {
            attribution: 'Carte originale <a href="https://www.rockstargames.com/reddeadredemption2" target="_blank">© Rockstar Games</a> | Haute résolution par <a href="https://www.nexusmods.com/reddeadredemption2/mods/676" target="_blank">Jotrus</a>'
        }).addTo(rdr2Map);

        // =========================================================
        // --- SYSTÈME DE REPÈRES PERSONNALISÉS (CLIC-DROIT) ---
        // =========================================================
        
        // 1. Désactiver complètement le menu contextuel du navigateur sur la carte
        document.getElementById('map-container').addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        window.allMapMarkersCollection = [];
        
        // NOUVEAU : On crée un calque dédié pour tes repères
        let calqueReperes = L.layerGroup().addTo(rdr2Map);

        // 2. Créer notre propre action au clic-droit
        rdr2Map.on('contextmenu', function(e) {
            // Ouvre la fenêtre pour demander le texte
            let note = prompt("📝 Que voulez-vous écrire pour ce repère ?");
            
            // Si l'utilisateur a écrit un texte et cliqué sur OK
            if (note !== null && note.trim() !== "") {
                
                // On crée le marqueur avec notre punaise rouge sur notre nouveau calque
                let repere = L.marker([e.latlng.lat, e.latlng.lng], { icon: punaiseRougeIcon }).addTo(calqueReperes);
                
                // On attache le texte à la punaise
                repere.bindPopup(`<div style="text-align: center;">
                    <b>📌 Note :</b><br>${note}<br><br>
                    <i style="font-size: 10px; color: #666;">(Double-cliquez sur la punaise pour la supprimer)</i>
                </div>`);
                
                // On ouvre la bulle de texte immédiatement
                repere.openPopup();

                // Ajout à la collection pour que la barre de recherche trouve la punaise
                window.allMapMarkersCollection.push({ marker: repere, name: note, cat: "repere", parentLayer: calqueReperes });

                // Option pour supprimer la punaise si on fait un double-clic dessus
                repere.on('dblclick', function() {
                    if (confirm("Voulez-vous retirer ce repère ?")) {
                        calqueReperes.removeLayer(repere);
                    }
                });
            }
        });

        let calqueAnimauxLeg = L.layerGroup().addTo(rdr2Map); 
        let calquePoissonsLeg = L.layerGroup().addTo(rdr2Map); 
        let calqueOs = L.layerGroup().addTo(rdr2Map); 
        let calqueAttrapeReves = L.layerGroup().addTo(rdr2Map); 

        let calqueJackHall = L.layerGroup().addTo(rdr2Map);
        let calquePisteEmpoisonnee = L.layerGroup().addTo(rdr2Map);
        let calqueGrandsEnjeux = L.layerGroup().addTo(rdr2Map);
        let calqueMorts = L.layerGroup().addTo(rdr2Map);
        let calqueOtisMiller = L.layerGroup().addTo(rdr2Map);
        let calqueCroquis = L.layerGroup().addTo(rdr2Map);
        let calquePanoramique = L.layerGroup().addTo(rdr2Map);
        let calqueStatues = L.layerGroup().addTo(rdr2Map);
        
        let iconAnimalLeg = L.divIcon({
            className: '', 
            html: '<div style="width: 14px; height: 14px; background-color: #8b0000; border: 2px solid #e3dcc8; border-radius: 50%; box-shadow: 1px 2px 3px rgba(0,0,0,0.6);"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            popupAnchor: [0, -12]
        });

        const listeAnimauxLegendaires = [
            { nom: "Alligator Légendaire", coords: [3145, 6654], desc: "Trappeur / Receleur" },
            { nom: "Antilope Légendaire", coords: [1086, 2345], desc: "Trappeur / Receleur" },
            { nom: "Bison Blanc Légendaire", coords: [5017, 3844], desc: "Trappeur / Receleur" },
            { nom: "Bison Tatanka Légendaire", coords: [1742, 3725], desc: "Trappeur / Receleur" },
            { nom: "Castor Légendaire", coords: [4159, 6844], desc: "Trappeur / Receleur" },
            { nom: "Cerf Légendaire", coords: [3784, 3162], desc: "Trappeur / Receleur" },
            { nom: "Couguar Légendaire", coords: [1494, 712], desc: "Trappeur / Receleur" },
            { nom: "Coyote Légendaire", coords: [3311, 5770], desc: "Trappeur / Receleur" },
            { nom: "Loup Légendaire", coords: [5048, 5185], desc: "Trappeur / Receleur" },
            { nom: "Mouflon Légendaire", coords: [4325, 4402], desc: "Trappeur / Receleur" },
            { nom: "Orignal Légendaire", coords: [5358, 7179], desc: "Trappeur / Receleur" },
            { nom: "Ours Grizzly Légendaire", coords: [4883, 6184], desc: "Trappeur / Receleur" },
            { nom: "Panthère Légendaire", coords: [2227, 6369], desc: "Trappeur / Receleur" },
            { nom: "Renard Légendaire", coords: [3028, 6073], desc: "Trappeur / Receleur" },
            { nom: "Sanglier Légendaire", coords: [3525, 6801], desc: "Trappeur / Receleur" },
            { nom: "Wapiti Légendaire", coords: [4958, 5553], desc: "Trappeur / Receleur" }
        ];

        listeAnimauxLegendaires.forEach(animal => {
            if (animal.coords[0] !== 0 && animal.coords[1] !== 0) {
                let marqueur = L.marker(animal.coords, { icon: iconAnimalLeg })
                 .bindPopup(`<div style="text-align:center;"><b>${animal.nom}</b><br><small style="color:#666;">${animal.desc}</small></div>`)
                 .addTo(calqueAnimauxLeg);
                window.allMapMarkersCollection.push({ marker: marqueur, name: animal.nom, cat: "animal legendaire", parentLayer: calqueAnimauxLeg });

                let nomAffiche = animal.nom.replace(" Légendaire", ""); 
                
                marqueur.bindTooltip(nomAffiche, {
                    permanent: true,        
                    interactive: true,      
                    direction: 'right',     
                    className: 'rdr2-marker-label', 
                    offset: [10, -2]        
                });
            }
        });

        let iconFishLeg = L.divIcon({
            className: '',
            html: '<div style="width: 14px; height: 14px; background-color: #2b5773; border: 2px solid #e3dcc8; border-radius: 50%; box-shadow: 1px 2px 3px rgba(0,0,0,0.6);"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            popupAnchor: [0, -12]
        });

        const listePoissonsLegendaires = [
            { nom: "Perche Noire légendaire", coords: [1225, 2828], desc: "Quête : Pêcheur de poissons" },
            { nom: "Achigan à petite bouche légendaire", coords: [3382, 3352], desc: "Quête : Pêcheur de poissons" },
            { nom: "Barbotte jaune légendaire", coords: [3194, 7391], desc: "Quête : Pêcheur de poissons" },
            { nom: "Brochet légendaire", coords: [4804, 6293], desc: "Quête : Le Vétéran (Hamish)" },
            { nom: "Brochet d'Amérique légendaire", coords: [1926, 3729], desc: "Quête : Pêcheur de poissons" },
            { nom: "Brochet maillé légendaire", coords: [3618, 4732], desc: "Quête : Pêcheur de poissons" },
            { nom: "Crapet arlequin légendaire", coords: [2633, 5571], desc: "Quête : Pêcheur de poissons" },
            { nom: "Crapet de roche légendaire", coords: [2650, 3208], desc: "Quête : Pêcheur de poissons" },
            { nom: "Esturgeon jaune légendaire", coords: [2609, 6671], desc: "Quête : Pêcheur de poissons" },
            { nom: "Lépisosté osseux légendaire", coords: [3167, 6692], desc: "Quête : Pêcheur de poissons" },
            { nom: "Maskinongé légendaire", coords: [4048, 7294], desc: "Quête : Pêcheur de poissons" },
            { nom: "Perche légendaire", coords: [4432, 6804], desc: "Quête : Pêcheur de poissons" },
            { nom: "Saumon rouge légendaire", coords: [4912, 3849], desc: "Quête : Pêcheur de poissons" },
            { nom: "Truite arc-en-ciel légendaire", coords: [5419, 7157], desc: "Quête : Pêcheur de poissons" }
        ];

        listePoissonsLegendaires.forEach(poisson => {
            if (poisson.coords[0] !== 0 && poisson.coords[1] !== 0) {
                let marqueur = L.marker(poisson.coords, { icon: iconFishLeg })
                 .bindPopup(`<div style="text-align:center;"><b>${poisson.nom}</b><br><small style="color:#666;">${poisson.desc}</small></div>`)
                 .addTo(calquePoissonsLeg);
                window.allMapMarkersCollection.push({ marker: marqueur, name: poisson.nom, cat: "poisson legendaire", parentLayer: calquePoissonsLeg });
                let nomAffiche = poisson.nom.replace(" légendaire", "");
                
                marqueur.bindTooltip(nomAffiche, {
                    permanent: true,
                    interactive: true,
                    direction: 'right',
                    className: 'rdr2-fish-label',
                    offset: [10, -2]
                });
            }
        });

        let svgOsDino = `
        <svg viewBox="0 0 100 100" style="width:26px; height:26px; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.6)); transform: rotate(-30deg);">
           <path d="M 30,50
                    C 10,50 10,25 25,25
                    C 35,25 40,35 40,45
                    L 60,45
                    C 60,35 65,25 75,25
                    C 90,25 90,50 70,50
                    C 90,50 90,75 75,75
                    C 65,75 60,65 60,55
                    L 40,55
                    C 40,65 35,75 25,75
                    C 10,75 10,50 30,50 Z" 
                 fill="#e3dcc8" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
        </svg>`;

        let iconBone = L.divIcon({
            className: 'rdr2-pin-container',
            html: svgOsDino,
            iconSize: [26, 26],
            iconAnchor: [13, 13], 
            popupAnchor: [0, -15] 
        });

        const listeOsDinosaures = [
            { nom: "Os de dinosaure 1", coords: [3704, 5339], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 2", coords: [3602, 5396], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 3", coords: [3396, 5284], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 4", coords: [3394, 5712], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 5", coords: [3538, 5758], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 6", coords: [4306, 6274], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 7", coords: [4518, 6789], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 8", coords: [4249, 7133], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 9", coords: [5062, 7119], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 10", coords: [4958, 6597], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 11", coords: [4775, 6067], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 12", coords: [5205, 6243], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 13", coords: [5195, 5608], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 14", coords: [4877, 5196], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 15", coords: [4898, 5408], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 16", coords: [4570, 4972], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 17", coords: [4340, 4630], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 18", coords: [4412, 4656], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 19", coords: [3798, 4370], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 20", coords: [4253, 3965], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 21", coords: [3952, 3324], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 22", coords: [3708, 3387], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 23", coords: [2038, 2855], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 24", coords: [1375, 3104], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 25", coords: [1073, 2456], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 26", coords: [1029, 1828], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 27", coords: [1599, 1990], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 28", coords: [2090, 1832], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 29", coords: [1741, 1214], desc: "Quête : La foi à l'épreuve" },
            { nom: "Os de dinosaure 30", coords: [1476, 1126], desc: "Quête : La foi à l'épreuve" }
        ];

        listeOsDinosaures.forEach(os => {
            if (os.coords[0] !== 0 && os.coords[1] !== 0) {
                let marqueur = L.marker(os.coords, { icon: iconBone })
                 .bindPopup(`<div style="text-align:center;"><b>${os.nom}</b><br><small style="color:#666;">${os.desc}</small></div>`)
                 .addTo(calqueOs);
                 
                window.allMapMarkersCollection.push({ marker: marqueur, name: os.nom, cat: "os dinosaure squelette", parentLayer: calqueOs });
            }
        });

        let svgDiamantOr = `
        <svg viewBox="0 0 24 24" style="width:26px; height:26px; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.6)); opacity: 0.70;">
            <path d="M12 22 L22 8 L18 2 L6 2 L2 8 Z" fill="#d4af37" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 8 L22 8 M6 2 L12 8 M18 2 L12 8 M12 8 L12 22" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round" opacity="0.8"/>
        </svg>`;

        let iconTreasure = L.divIcon({
            className: 'rdr2-pin-container', 
            html: svgDiamantOr,   
            iconSize: [26, 26],   
            iconAnchor: [13, 24], 
            popupAnchor: [0, -22] 
        });

        let svgCarte = `
        <svg viewBox="0 0 100 100" style="width:28px; height:28px; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.6)); transform: rotate(45deg);">
            <ellipse cx="50" cy="20" rx="20" ry="10" fill="#c4b697" stroke="#1a1a1a" stroke-width="4"/>
            <path d="M 30,20 L 30,80 A 20 10 0 0 0 70,80 L 70,20 Z" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="4"/>
            <path d="M 30,20 A 20 10 0 0 0 70,20" fill="none" stroke="#1a1a1a" stroke-width="4"/>
            <path d="M 70,20 C 70,12 45,12 45,20 C 45,24 55,25 55,20" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
            <path d="M 30,48 A 20 6 0 0 0 70,48 L 70,54 A 20 6 0 0 1 30,54 Z" fill="#e91e63" stroke="#1a1a1a" stroke-width="2"/>
            <path d="M 50,51 C 30,40 35,60 48,54 C 48,54 52,54 52,54 C 65,60 70,40 50,51 Z" fill="#e91e63" stroke="#1a1a1a" stroke-width="2"/>
            <path d="M 48,54 Q 40,70 42,75 M 52,54 Q 60,70 58,75" fill="none" stroke="#e91e63" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

        let iconCarte = L.divIcon({
            className: 'rdr2-pin-container',
            html: svgCarte,
            iconSize: [28, 28],
            iconAnchor: [14, 14], 
            popupAnchor: [0, -18] 
        });

        const listeTresors = [
            { nom: "Départ : Bande de Jack Hall", coords: [3440, 4656], desc: "Acheter/Voler la carte à Maximo" },
            { nom: "Trésor de la bande de Jack Hall 1", coords: [3924, 4810], desc: "Trouver la carte 2 (Caliban's Seat)" },
            { nom: "Trésor de la bande de Jack Hall 2", coords: [5059, 5184], desc: "Trouver la carte 3 (Cotorra Springs)" },
            { nom: "Trésor de la bande de Jack Hall 3", coords: [4806, 6261], desc: "Récompense (Lingots d'or à O'Creagh's Run)" },
            
            { nom: "Départ : La piste empoisonnée", coords: [5309, 4377], desc: "Trouver la carte dans le chalet (Cairn Lodge)" },
            { nom: "Trésor de la piste empoisonnée 1", coords: [3240, 5881], desc: "Trouver la carte 2 (Face Rock)" },
            { nom: "Trésor de la piste empoisonnée 2", coords: [4018, 7033], desc: "Trouver la carte 3 (Snake Mound)" },
            { nom: "Trésor de la piste empoisonnée 3", coords: [4450, 6801], desc: "Récompense (Lingots d'or à Elysian Pool)" },
            
            { nom: "Départ : Trésor aux grands enjeux", coords: [3905, 4154], desc: "Voler la carte au chasseur de trésor (Rencontre aléatoire)" },
            { nom: "Trésor aux grands enjeux 1", coords: [4025, 4307], desc: "Trouver la carte 2 (Cumberland Falls)" },
            { nom: "Trésor aux grands enjeux 2", coords: [4911, 4383], desc: "Trouver la carte 3 (Barrow Lagoon)" },
            { nom: "Trésor aux grands enjeux 3", coords: [4889, 5381], desc: "Récompense (Lingots d'or à Bacchus Station)" },
            
            { nom: "Départ : Trésor des morts", coords: [3603, 4840], desc: "Trouver la carte à Limpany (Prison)" },
            { nom: "Trésor des morts 1", coords: [2621, 6793], desc: "Trouver la carte 2 (Saint Denis)" },
            { nom: "Trésor des morts 2", coords: [2937, 7056], desc: "Récompense finale (Lingots d'or)" },
            
            { nom: "Carte d'Otis Miller 1", coords: [5015, 7297], desc: "Morceau de carte de l'Ermite (Nord d'Annesburg)" },
            { nom: "Carte d'Otis Miller 2", coords: [4575, 3221], desc: "Morceau de carte de l'Ermite (Nord-Ouest de Wallace Station)" },
            { nom: "Trésor d'Otis Miller", coords: [2117, 1856], desc: "Récompense (Revolver de Miller à Cholla Springs)" },
            
            { nom: "Départ : Trésor des croquis", coords: [4950, 7155], desc: "Trouver la carte (Reed Cottage)" },
            { nom: "Trésor des croquis", coords: [4486, 6772], desc: "Récompense (Lingot d'or à Elysian Pool)" },
            
            { nom: "Départ : Carte panoramique", coords: [5062, 3909], desc: "Trouver la carte sur le couple gelé (Colter)" },
            { nom: "Emplacement Carte panoramique", coords: [3730, 3649], desc: "Mystère du Mont Shann" },

            { nom: "Indice : Fresque des statues (Window Rock)", coords: [4887, 4956] },
            { nom: "Trésor : Grotte des statues étranges", coords: [5123, 5666] }
        ];

        const spawnsGrandsEnjeux = [
            [3988, 4193], [3978, 4110], [3947, 4044], [3822, 4106], [3542, 3867], [3381, 4285], [3508, 5180], [3827, 4645], [3970, 5119], [4125, 5707], [3633, 5640]
        ];
        
        let calqueSpawnsEnjeux = L.layerGroup();
        let modeSpawnActif = false;

        spawnsGrandsEnjeux.forEach(coord => {
            if (coord[0] !== 0 && coord[1] !== 0) {
                L.marker(coord, {
                    icon: L.divIcon({ className: 'rdr2-spawn-dot', iconSize: [12, 12], iconAnchor: [6, 6] })
                }).addTo(calqueSpawnsEnjeux);
            }
        });

        listeTresors.forEach(tresor => {
            if (tresor.coords[0] !== 0 && tresor.coords[1] !== 0) {
                
                let iconeAUtiliser = iconTreasure;
                let estLeDiamantSpecial = (tresor.nom === "Départ : Trésor aux grands enjeux");
                let estUneCarte = tresor.nom.includes("Carte panoramique");

                if (estUneCarte) {
                    iconeAUtiliser = iconCarte;
                }

                if (estLeDiamantSpecial) {
                    iconeAUtiliser = L.divIcon({
                        className: 'rdr2-pin-container rdr2-special-toggle', 
                        html: svgDiamantOr, 
                        iconSize: [26, 26],   
                        iconAnchor: [13, 24], 
                        popupAnchor: [0, -22] 
                    });
                }

                let marqueur = L.marker(tresor.coords, { icon: iconeAUtiliser });

                if (estLeDiamantSpecial) {
                    marqueur.bindTooltip("Cliquez pour voir les apparitions possibles", {direction: 'top'});
                    
                    marqueur.on('click', function(e) {
                        modeSpawnActif = !modeSpawnActif; 
                        let mapContainer = document.getElementById('map-container');
                        let carteActuelle = e.target._map; 

                        if (modeSpawnActif) {
                            mapContainer.classList.add('map-hiding-mode');
                            calqueSpawnsEnjeux.addTo(carteActuelle);
                        } else {
                            mapContainer.classList.remove('map-hiding-mode');
                            carteActuelle.removeLayer(calqueSpawnsEnjeux);
                        }
                    });

                } else {
                    marqueur.bindPopup(`<div style="text-align:center;"><b>${tresor.nom}</b><br><small style="color:#666;">${tresor.desc}</small></div>`);
                }

                let calqueCible = calqueJackHall; 
                let keywordTresor = "tresor";

                if (tresor.nom.includes("Jack Hall")) { calqueCible = calqueJackHall; keywordTresor = "jack hall"; }
                else if (tresor.nom.includes("piste empoisonnée") || tresor.nom.includes("La piste empoisonnée")) { calqueCible = calquePisteEmpoisonnee; keywordTresor = "piste empoisonnee"; }
                else if (tresor.nom.includes("grands enjeux") || tresor.nom.includes("Grands enjeux")) { calqueCible = calqueGrandsEnjeux; keywordTresor = "grands enjeux"; }
                else if (tresor.nom.includes("morts") || tresor.nom.includes("Morts")) { calqueCible = calqueMorts; keywordTresor = "morts"; }
                else if (tresor.nom.includes("Otis Miller")) { calqueCible = calqueOtisMiller; keywordTresor = "otis miller"; }
                else if (tresor.nom.includes("croquis") || tresor.nom.includes("Croquis")) { calqueCible = calqueCroquis; keywordTresor = "croquis"; }
                else if (tresor.nom.includes("panoramique") || tresor.nom.includes("Panoramique")) { calqueCible = calquePanoramique; keywordTresor = "panoramique"; }
                else if (tresor.nom.includes("statues") || tresor.nom.includes("Statues") || tresor.nom.includes("Statues étranges")) { calqueCible = calqueStatues; keywordTresor = "statues"; }

                marqueur.addTo(calqueCible);
                window.allMapMarkersCollection.push({ marker: marqueur, name: tresor.nom, cat: "tresor carte " + keywordTresor, parentLayer: calqueCible });
            }
        });

        // =========================================================
        // --- ATTRAPE-RÊVES ---
        // =========================================================
        let svgAttrapeReves = `
        <svg viewBox="0 0 100 100" style="width:26px; height:26px; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.6));">
            <circle cx="50" cy="35" r="25" fill="none" stroke="#5c3a21" stroke-width="6"/>
            <path d="M 35 15 L 65 55 M 65 15 L 35 55 M 25 35 L 75 35 M 50 10 L 50 60" stroke="#e3dcc8" stroke-width="1.5"/>
            <path d="M 35 60 Q 30 75 35 90 Q 40 75 35 60" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="2"/>
            <path d="M 50 60 Q 45 80 50 95 Q 55 80 50 60" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="2"/>
            <path d="M 65 60 Q 60 75 65 90 Q 70 75 65 60" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="2"/>
        </svg>`;

        let iconAttrapeReves = L.divIcon({
            className: 'rdr2-pin-container',
            html: svgAttrapeReves,
            iconSize: [26, 26],
            iconAnchor: [13, 13], 
            popupAnchor: [0, -15] 
        });

        // Icône spéciale pour la pointe de flèche (Véritable flèche d'arc plantée)
        let svgFlecheArc = `
        <svg viewBox="0 0 32 32" style="width:34px; height:34px; filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.6));">
            <!-- Plumes (Fletching) -->
            <path d="M 27 5 L 21 1 L 23 7 Z" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="1"/>
            <path d="M 27 5 L 31 11 L 25 9 Z" fill="#e3dcc8" stroke="#1a1a1a" stroke-width="1"/>
            
            <!-- Détails des plumes -->
            <line x1="22" y1="2" x2="26" y2="6" stroke="#1a1a1a" stroke-width="1"/>
            <line x1="30" y1="10" x2="26" y2="6" stroke="#1a1a1a" stroke-width="1"/>
            
            <!-- Hampe en bois (Shaft) -->
            <line x1="27" y1="5" x2="9" y2="23" stroke="#5c3a21" stroke-width="3.5" stroke-linecap="round"/>
            
            <!-- Ligature (Fil qui attache la pointe) -->
            <line x1="12" y1="18" x2="14" y2="20" stroke="#e3dcc8" stroke-width="1.5"/>
            <line x1="10" y1="20" x2="12" y2="22" stroke="#e3dcc8" stroke-width="1.5"/>
            
            <!-- Pointe de flèche en Or (Arrowhead) -->
            <path d="M 2 30 L 12 26 L 9 23 L 6 20 Z" fill="#d4af37" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>`;

        let iconFleche = L.divIcon({
            className: 'rdr2-pin-container',
            html: svgFlecheArc,
            iconSize: [34, 34],
            iconAnchor: [4, 30], /* Ajusté précisément pour que la pointe (en bas à gauche) touche les coordonnées exactes */
            popupAnchor: [12, -24] 
        });

        const listeAttrapeReves = [
            { nom: "Attrape-rêves 1", coords: [3503, 4685], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 2", coords: [3901, 4678], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 3", coords: [3880, 5056], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 4", coords: [4120, 4681], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 5", coords: [4185, 5154], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 6", coords: [4453, 4388], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 7", coords: [4711, 4717], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 8", coords: [5026, 5289], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 9", coords: [5124, 6469], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 10", coords: [4908, 6947], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 11", coords: [4727, 6904], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 12", coords: [4660, 7028], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 13", coords: [4562, 6965], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 14", coords: [4337, 6796], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 15", coords: [4236, 6318], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 16", coords: [4110, 6007], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 17", coords: [3729, 5604], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 18", coords: [3716, 6274], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 19", coords: [3545, 6225], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Attrape-rêves 20", coords: [3555, 6528], desc: "Trouver les 20 attrape-rêves" },
            { nom: "Récompense : Pointe de flèche antique", coords: [4450, 6803], desc: "Grotte cachée d'Elysian Pool" }
        ];

        listeAttrapeReves.forEach(ar => {
            if (ar.coords[0] !== 0 && ar.coords[1] !== 0) {
                // On vérifie le nom : si c'est la récompense, on met la flèche en or, sinon le cerceau classique
                let iconeChoisie = ar.nom.includes("Pointe de flèche") ? iconFleche : iconAttrapeReves;

                let marqueur = L.marker(ar.coords, { icon: iconeChoisie })
                 .bindPopup(`<div style="text-align:center;"><b>${ar.nom}</b><br><small style="color:#666;">${ar.desc}</small></div>`)
                 .addTo(calqueAttrapeReves);
                 
                // Ajout à la collection pour que la barre de recherche globale les trouve !
                window.allMapMarkersCollection.push({ marker: marqueur, name: ar.nom, cat: "attrape reves", parentLayer: calqueAttrapeReves });
            }
        });

        // On crée un calque parent "virtuel" pour synchroniser les trésors
        let calqueParentTresors = L.layerGroup().addTo(rdr2Map);

        // Le menu des filtres de la carte (Toutes les rubriques principales ont la classe map-category-main)
        let filtresCarte = {
            "<span class='map-category-main'><span class='map-icon'>🐾</span> ANIMAUX LÉGENDAIRES</span>": calqueAnimauxLeg,
            "<span class='map-category-main'><span class='map-icon'>🐟</span> POISSONS LÉGENDAIRES</span>": calquePoissonsLeg,
            "<span class='map-category-main'><span class='map-icon'>🦴</span> OS DE DINOSAURES</span>": calqueOs,
            
            // La rubrique parente liée au calqueParentTresors
            "<span class='map-category-main'><span class='map-icon'>🗺️</span> CARTES & TRÉSORS <span class='dropdown-arrow' onclick='toggleMapSubMenu(event)' style='padding: 5px 15px; font-size: 0.9rem;'>▼</span></span>": calqueParentTresors, 
            
            // Les sous-rubriques (en texte clair normal)
            "<span class='map-category-child'>• Bande de Jack Hall</span>": calqueJackHall,
            "<span class='map-category-child'>• La Piste Empoisonnée</span>": calquePisteEmpoisonnee,
            "<span class='map-category-child'>• Trésor aux Grands Enjeux</span>": calqueGrandsEnjeux,
            "<span class='map-category-child'>• Trésor des Morts</span>": calqueMorts,
            "<span class='map-category-child'>• Trésor d'Otis Miller</span>": calqueOtisMiller,
            "<span class='map-category-child'>• Trésor des Croquis</span>": calqueCroquis,
            "<span class='map-category-child'>• Carte Panoramique</span>": calquePanoramique,
            "<span class='map-category-child'>• Statues Étranges</span>": calqueStatues,
            
            "<span class='map-category-main'><span class='map-icon'>🕸️</span> ATTRAPE-RÊVES</span>": calqueAttrapeReves,

            "<span class='map-category-main'><span class='map-icon'>📌</span> VOS REPÈRES</span>": calqueReperes
        };

        let layerControl = L.control.layers(null, filtresCarte, { 
            position: 'bottomleft', 
            collapsed: true 
        }).addTo(rdr2Map);

        // --- SYNCHRONISER LA CASE "CARTES & TRÉSORS" AVEC SES SOUS-RUBRIQUES ---
        rdr2Map.on('overlayadd', function(e) {
            if (e.layer === calqueParentTresors) {
                // 1. On mémorise si la liste déroulante des trésors était ouverte
                let overlaysContainer = document.querySelector('.leaflet-control-layers-overlays');
                let isAccordionOpen = overlaysContainer ? overlaysContainer.classList.contains('force-show-children') : false;

                // 2. On attend 10 millisecondes (le temps que Leaflet débloque son interface)
                setTimeout(() => {
                    if(!rdr2Map.hasLayer(calqueJackHall)) rdr2Map.addLayer(calqueJackHall);
                    if(!rdr2Map.hasLayer(calquePisteEmpoisonnee)) rdr2Map.addLayer(calquePisteEmpoisonnee);
                    if(!rdr2Map.hasLayer(calqueGrandsEnjeux)) rdr2Map.addLayer(calqueGrandsEnjeux);
                    if(!rdr2Map.hasLayer(calqueMorts)) rdr2Map.addLayer(calqueMorts);
                    if(!rdr2Map.hasLayer(calqueOtisMiller)) rdr2Map.addLayer(calqueOtisMiller);
                    if(!rdr2Map.hasLayer(calqueCroquis)) rdr2Map.addLayer(calqueCroquis);
                    if(!rdr2Map.hasLayer(calquePanoramique)) rdr2Map.addLayer(calquePanoramique);
                    if(!rdr2Map.hasLayer(calqueStatues)) rdr2Map.addLayer(calqueStatues);

                    // 3. On restaure l'ouverture de la liste si elle était ouverte
                    let newOverlays = document.querySelector('.leaflet-control-layers-overlays');
                    if (isAccordionOpen && newOverlays) newOverlays.classList.add('force-show-children');
                }, 10);
            }
        });

        rdr2Map.on('overlayremove', function(e) {
            if (e.layer === calqueParentTresors) {
                // 1. On mémorise si la liste déroulante des trésors était ouverte
                let overlaysContainer = document.querySelector('.leaflet-control-layers-overlays');
                let isAccordionOpen = overlaysContainer ? overlaysContainer.classList.contains('force-show-children') : false;

                // 2. On attend 10 millisecondes
                setTimeout(() => {
                    if(rdr2Map.hasLayer(calqueJackHall)) rdr2Map.removeLayer(calqueJackHall);
                    if(rdr2Map.hasLayer(calquePisteEmpoisonnee)) rdr2Map.removeLayer(calquePisteEmpoisonnee);
                    if(rdr2Map.hasLayer(calqueGrandsEnjeux)) rdr2Map.removeLayer(calqueGrandsEnjeux);
                    if(rdr2Map.hasLayer(calqueMorts)) rdr2Map.removeLayer(calqueMorts);
                    if(rdr2Map.hasLayer(calqueOtisMiller)) rdr2Map.removeLayer(calqueOtisMiller);
                    if(rdr2Map.hasLayer(calqueCroquis)) rdr2Map.removeLayer(calqueCroquis);
                    if(rdr2Map.hasLayer(calquePanoramique)) rdr2Map.removeLayer(calquePanoramique);
                    if(rdr2Map.hasLayer(calqueStatues)) rdr2Map.removeLayer(calqueStatues);

                    // 3. On restaure l'ouverture de la liste
                    let newOverlays = document.querySelector('.leaflet-control-layers-overlays');
                    if (isAccordionOpen && newOverlays) newOverlays.classList.add('force-show-children');
                }, 10);
            }
        });


        // --- FORCER LE CLIC SUR LE BOUTON DES FILTRES (Adieu le survol natif !) ---
        let layersContainer = layerControl.getContainer();
        let toggleBtn = layersContainer.querySelector('.leaflet-control-layers-toggle');
        
        if(toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                layersContainer.classList.toggle('force-open-menu');
            });
        }

        // =========================================================
        // --- BOUTONS MASQUER/AFFICHER TOUT (FILTRES CARTE) ---
        // =========================================================
        let layersContainerList = layersContainer.querySelector('.leaflet-control-layers-list');
        if (layersContainerList && !layersContainer.querySelector('.map-filter-buttons-container')) {
            let actionButtons = document.createElement('div');
            actionButtons.className = "map-filter-buttons-container";
            
            let btnHide = document.createElement('button');
            btnHide.className = "rdr2-filter-btn btn-hide-all";
            btnHide.innerHTML = "<span style='font-family: Arial, sans-serif; font-size: 0.9rem;'>✕</span> Masquer";
            
            let btnShow = document.createElement('button');
            btnShow.className = "rdr2-filter-btn btn-show-all";
            btnShow.innerHTML = "<span style='font-family: Arial, sans-serif; font-size: 0.9rem;'>👁</span> Afficher";

            let allLayers = [
                calqueAnimauxLeg, calquePoissonsLeg, calqueOs, calqueParentTresors, 
                calqueJackHall, calquePisteEmpoisonnee, calqueGrandsEnjeux, calqueMorts, 
                calqueOtisMiller, calqueCroquis, calquePanoramique, calqueStatues, calqueAttrapeReves, calqueReperes
            ];

            btnHide.addEventListener('click', function(e) {
                e.preventDefault(); 
                e.stopPropagation();
                allLayers.forEach(layer => { 
                    if(rdr2Map.hasLayer(layer)) rdr2Map.removeLayer(layer); 
                });
            });

            btnShow.addEventListener('click', function(e) {
                e.preventDefault(); 
                e.stopPropagation();
                allLayers.forEach(layer => { 
                    if(!rdr2Map.hasLayer(layer)) rdr2Map.addLayer(layer); 
                });
            });

            actionButtons.appendChild(btnHide);
            actionButtons.appendChild(btnShow);
            layersContainerList.insertBefore(actionButtons, layersContainerList.firstChild);
        }

        // Ferme proprement le menu des filtres si on clique sur la carte
        rdr2Map.on('click', function() {
            layersContainer.classList.remove('force-open-menu');
            let subMenu = document.querySelector('.leaflet-control-layers-overlays');
            if (subMenu) subMenu.classList.remove('force-show-children'); // Ferme l'accordéon des trésors
        });

        /*// 🛠️ OUTIL DÉVELOPPEUR AMÉLIORÉ : Afficher et copier les coordonnées au clic
        rdr2Map.on('click', function(e) {
            let lat = Math.round(e.latlng.lat);
            let lng = Math.round(e.latlng.lng);
            let coordsTexte = `[${lat}, ${lng}]`;
            
            console.log(coordsTexte); 

            // Copie automatique dans le presse-papier
            navigator.clipboard.writeText(coordsTexte).catch(err => console.log('Erreur copie presse-papier', err));

            // Création de la notification visuelle RDR2
            let popupDev = document.createElement('div');
            popupDev.innerText = "📍 Copié : " + coordsTexte;
            popupDev.style.cssText = "position: fixed; top: 120px; left: 50%; transform: translateX(-50%); background-color: #8a1a19; color: #e3dcc8; padding: 10px 25px; border: 2px solid #e3dcc8; border-radius: 6px; font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 1px; z-index: 10000; box-shadow: 0 6px 12px rgba(0,0,0,0.6); pointer-events: none; transition: opacity 0.3s ease;";
            
            document.body.appendChild(popupDev);

            // Fait disparaître la notification au bout de 2 secondes en douceur
            setTimeout(() => {
                popupDev.style.opacity = "0";
                setTimeout(() => popupDev.remove(), 300);
            }, 2000);
        });*/

        function forceCoverZoom() {
            let mapSize = rdr2Map.getSize();
            if (mapSize.x === 0 || mapSize.y === 0) return; 
            
            let scaleX = mapSize.x / 8000;
            let scaleY = mapSize.y / 6211;
            let scale = Math.max(scaleX, scaleY); 
            
            let coverZoom = Math.log(scale) / Math.LN2;
            
            rdr2Map.setView([3105, 4000], coverZoom);
            
            // On ajoute une énorme marge invisible pour pouvoir centrer les coins
            let paddedBounds = [[-3500, -4500], [9700, 12500]];
            rdr2Map.setMaxBounds(paddedBounds); 
        }

        setTimeout(forceCoverZoom, 150);

    } else {

        rdr2Map.invalidateSize();
        
        function forceCoverZoomUpdate() {
            let mapSize = rdr2Map.getSize();
            if (mapSize.x === 0) return;
            let scale = Math.max(mapSize.x / 8000, mapSize.y / 6211);
            rdr2Map.setView([3105, 4000], Math.log(scale) / Math.LN2);
            
            // On ajoute la même marge invisible ici
            let paddedBounds = [[-3500, -4500], [9700, 12500]];
            rdr2Map.setMaxBounds(paddedBounds);
        }
        
        setTimeout(forceCoverZoomUpdate, 150);
    }
}

// =========================================================
// --- DEV EDITOR FUNCTIONS ---
// =========================================================
function renderDevView() {
    const container = document.getElementById('dev-editor-list');
    if (!container) return;
    container.innerHTML = "";
    let html = "";

    html += `<h4 style="color: var(--accent-hover); margin: 20px 0 10px 0; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; font-size: 1.3rem;">🏕️ Besoins du Camp (Pearson)</h4>`;
    db.camp.forEach(item => {
        html += `
            <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: rgba(120, 120, 120, 0.06); border-radius: 6px; margin-bottom: 6px; border: 1px solid var(--border-color);">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
                    <input type="text" class="dev-camp-name" data-id="${item.id}" value="${item.item}" style="width: 100%; background: transparent; border: none; color: var(--accent-hover); font-weight: bold; font-size: 1rem; outline: none;">
                    <input type="text" class="dev-camp-res" data-id="${item.id}" value="${item.resource}" style="width: 100%; background: rgba(120, 120, 120, 0.08); border: 1px solid var(--border-color); color: var(--text-color); font-size: 0.85rem; padding: 6px; border-radius: 4px; outline: none;">
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; min-width: 55px;">
                    <small style="color: var(--text-muted); font-size: 0.7rem; margin-bottom: 2px;">Qté</small>
                    <input type="number" class="dev-camp-input" data-id="${item.id}" value="${item.total}" style="width: 100%; height: 35px; background: rgba(120, 120, 120, 0.15); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px; text-align: center; font-size: 1rem; font-weight: bold; outline: none;">
                </div>
            </div>`;
    });

    html += `<h4 style="color: var(--accent-hover); margin: 30px 0 10px 0; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; font-size: 1.3rem;">🧥 Équipements du Trappeur</h4>`;
    db.trappeur.forEach(item => {
        html += `
            <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: rgba(120, 120, 120, 0.06); border-radius: 6px; margin-bottom: 6px; border: 1px solid var(--border-color);">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
                    <input type="text" class="dev-trap-info" data-id="${item.id}" value="${item.info}" style="width: 100%; background: transparent; border: none; color: var(--accent-hover); font-weight: bold; font-size: 1rem; outline: none;">
                    <input type="text" class="dev-trap-res" data-id="${item.id}" value="${item.resource}" style="width: 100%; background: rgba(120, 120, 120, 0.08); border: 1px solid var(--border-color); color: var(--text-color); font-size: 0.85rem; padding: 6px; border-radius: 4px; outline: none;">
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; min-width: 55px;">
                    <small style="color: var(--text-muted); font-size: 0.7rem; margin-bottom: 2px;">Qté</small>
                    <input type="number" class="dev-trap-input" data-id="${item.id}" value="${item.total}" style="width: 100%; height: 35px; background: rgba(120, 120, 120, 0.15); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px; text-align: center; font-size: 1rem; font-weight: bold; outline: none;">
                </div>
            </div>`;
    });

    html += `<h4 style="color: var(--accent-hover); margin: 30px 0 10px 0; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; font-size: 1.3rem;">🦊 Recettes du Receleur</h4>`;
    db.receleur.forEach(item => {
        if (item.isTalisman) {
            html += `
                <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: rgba(120, 120, 120, 0.06); border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: bold; background: rgba(120,120,120,0.15); padding: 2px 6px; border-radius: 3px;">TALISMAN</span>
                        <input type="text" class="dev-rec-name" data-id="${item.id}" value="${item.name}" style="flex: 1; background: transparent; border: none; color: var(--accent-hover); font-weight: bold; font-size: 1rem; outline: none; border-bottom: 1px dashed var(--border-color);">
                    </div>
                    <div style="padding-left: 10px; display: flex; flex-direction: column; gap: 5px;">
                        <small style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Composants de fabrication requis :</small>
            `;
            item.components.forEach((comp, idx) => {
                html += `<input type="text" class="dev-rec-comp" data-id="${item.id}" data-idx="${idx}" value="${comp.name}" style="width: 100%; background: rgba(120, 120, 120, 0.08); border: 1px solid var(--border-color); color: var(--text-color); font-size: 0.85rem; padding: 6px; border-radius: 4px; outline: none;">`;
            });
            html += `</div></div>`;
        } else {
            html += `
                <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: rgba(120, 120, 120, 0.06); border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: bold; background: rgba(120,120,120,0.15); padding: 2px 6px; border-radius: 3px;">AMULETTE</span>
                        <input type="text" class="dev-rec-name" data-id="${item.id}" value="${item.name}" style="flex: 1; background: transparent; border: none; color: var(--accent-hover); font-weight: bold; font-size: 1rem; outline: none; border-bottom: 1px dashed var(--border-color);">
                    </div>
                    <div style="padding-left: 10px; display: flex; flex-direction: column; gap: 3px;">
                        <small style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Composant requis :</small>
                        <input type="text" class="dev-rec-res" data-id="${item.id}" value="${item.resource}" style="width: 100%; background: rgba(120, 120, 120, 0.08); border: 1px solid var(--border-color); color: var(--text-color); font-size: 0.85rem; padding: 6px; border-radius: 4px; outline: none;">
                    </div>
                </div>`;
        }
    });
    
    container.innerHTML = html;
}

function saveDevData() {
    document.querySelectorAll('.dev-camp-input').forEach(input => {
        let id = parseInt(input.getAttribute('data-id'));
        let newTotal = parseInt(input.value) || 0;
        let newName = document.querySelector(`.dev-camp-name[data-id="${id}"]`).value;
        let newRes = document.querySelector(`.dev-camp-res[data-id="${id}"]`).value;
        
        let activeItem = db.camp.find(x => x.id === id);
        if (activeItem) { activeItem.total = newTotal; activeItem.item = newName; activeItem.resource = newRes; }
    });

    document.querySelectorAll('.dev-trap-input').forEach(input => {
        let id = parseInt(input.getAttribute('data-id'));
        let newTotal = parseInt(input.value) || 0;
        let newInfo = document.querySelector(`.dev-trap-info[data-id="${id}"]`).value;
        let newRes = document.querySelector(`.dev-trap-res[data-id="${id}"]`).value;
        
        let activeItem = db.trappeur.find(x => x.id === id);
        if (activeItem) { activeItem.total = newTotal; activeItem.info = newInfo; activeItem.resource = newRes; }
    });

    document.querySelectorAll('.dev-rec-name').forEach(input => {
        let id = parseInt(input.getAttribute('data-id'));
        let activeItem = db.receleur.find(x => x.id === id);
        if (activeItem) activeItem.name = input.value;
        
        if (activeItem && activeItem.isTalisman) {
            activeItem.components.forEach((comp, idx) => {
                let compInput = document.querySelector(`.dev-rec-comp[data-id="${id}"][data-idx="${idx}"]`);
                if (compInput) comp.name = compInput.value;
            });
        } else if (activeItem) {
            let resInput = document.querySelector(`.dev-rec-res[data-id="${id}"]`);
            if (resInput) activeItem.resource = resInput.value;
        }
    });
    
    localStorage.setItem('rdr2_tracker_db', JSON.stringify(db));
    alert("Modifications appliquées et sauvegardées !");
    renderDevView(); 
}

// =========================================================
// --- LAUNCH APPLICATION ---
// =========================================================
window.addEventListener('popstate', () => {
    let hash = window.location.hash.replace('#', '') || 'dashboard';
    
    if (hash === 'dashboard') {
        document.body.classList.remove('search-typing', 'stock-typing');
    }

    let searchInput = document.getElementById('global-search');
    if (searchInput && searchInput.value !== '') {
        searchInput.value = ''; 
        handleSearch(); 
    }

    const titles = {
        'dashboard': '🏠 Tableau de Bord',
        'camp': '🏕️ Camp de Base',
        'receleur': '🦊 Receleur',
        'trappeur': '🧥 Trappeur',
        'stock': '📦 Gestion du Stock',
        'hunting': '🎯 Liste de Chasse Globale',
        'map': '🗺️ Carte Interactive'
    };

    let title = titles[hash] || '🏠 Tableau de Bord';
    let navItems = document.querySelectorAll('.nav-item');
    let activeNav = Array.from(navItems).find(el => {
        let onClickAttr = el.getAttribute('onclick');
        return onClickAttr && onClickAttr.indexOf("'" + hash + "'") !== -1;
    });

    switchView(hash, title, activeNav, false);
});

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.history.replaceState(null, null, '#dashboard');
    }
    
    let initialTheme = 'theme-rdr2-light';
    try {
        let localValue = localStorage.getItem('app-theme');
        if (localValue) initialTheme = localValue;
    } catch(e) {
        initialTheme = window.memoryThemeFallback;
    }
    window.memoryThemeFallback = initialTheme;
    applyTheme(initialTheme);

    renderAll();
    initCustomAutocomplete();
});

// =========================================================
// --- MOBILES & INPUT TRIGGERS (ANDROID/IOS) ---
// =========================================================
const mySearchInputAndroid = document.getElementById('global-search');
if (mySearchInputAndroid) {
    mySearchInputAndroid.addEventListener('focus', function() {
        document.body.classList.add('search-typing');
    });
    
    mySearchInputAndroid.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            setTimeout(() => { document.body.classList.remove('search-typing'); }, 200);
        }
        
        setTimeout(() => {
            let dropdown = document.getElementById('global-search-dropdown');
            if (dropdown) dropdown.style.display = 'none';
            document.body.classList.remove('search-typing'); 
        }, 150);
    });

    mySearchInputAndroid.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27 || e.key === 'Enter') {
            let dropdown = document.getElementById('global-search-dropdown');
            if (dropdown) dropdown.style.display = 'none';
            this.blur();
        }
    });
}

document.addEventListener('touchmove', function() {
    let activeEl = document.activeElement;
    if (activeEl && activeEl.id === 'global-search') {
        activeEl.blur();
    }
}, { passive: true });

let lastWindowHeight = window.innerHeight;
window.addEventListener('resize', () => {
    if (window.innerHeight > lastWindowHeight + 80) { 
        let dropdown = document.getElementById('global-search-dropdown');
        if (dropdown) dropdown.style.display = 'none';
        let searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.blur();
    }
    lastWindowHeight = window.innerHeight;
});

// =========================================================
// --- CORRECTIF DES BOUTONS DE ZOOM SUR MOBILE ---
// =========================================================
document.addEventListener('touchend', function(e) {
    let zoomBtn = e.target.closest('.leaflet-bar a');
    if (zoomBtn) {
        // Laisse 150ms pour que l'animation d'enfoncement ait le temps de se faire
        setTimeout(() => {
            zoomBtn.blur(); // Retire le focus (désélectionne le bouton)
        }, 150);
    }
}, { passive: true });

// =========================================================
// --- GESTION DU MENU DÉROULANT ET RECHERCHE CARTE ---
// =========================================================

window.toggleMapSubMenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    let container = document.querySelector('.leaflet-control-layers-overlays');
    if(container) container.classList.toggle('force-show-children');
};

function filterMapMarkers(normQuery) {
    if (!window.allMapMarkersCollection || !rdr2Map) return;

    let isSearching = normQuery && normQuery.length > 0;
    
    let searchWords = isSearching ? normQuery.split(' ').filter(w => w.length > 0).map(w => w.startsWith('animau') ? 'animal' : w) : [];

    window.allMapMarkersCollection.forEach(item => {
        let nameNorm = normalizeStr(item.name);
        let catNorm = normalizeStr(item.cat);
        let combinedText = nameNorm + " " + catNorm;
        
        let isMatch = false;

        if (isSearching) {
            isMatch = searchWords.every(word => {
                if (!isNaN(word)) {
                    let regex = new RegExp(`\\b${word}\\b`);
                    return regex.test(combinedText);
                } else {
                    return combinedText.includes(word) || (word === 'tresor' && catNorm.includes('carte'));
                }
            });
        }

        if (isSearching) {
            if (item.parentLayer && item.parentLayer.hasLayer(item.marker)) {
                item.parentLayer.removeLayer(item.marker);
            }
            
            if (isMatch) {
                item.marker.addTo(rdr2Map); 
            } else {
                rdr2Map.removeLayer(item.marker);
            }
        } else {
            rdr2Map.removeLayer(item.marker); 
            if (item.parentLayer && !item.parentLayer.hasLayer(item.marker)) {
                item.parentLayer.addLayer(item.marker);
            }
        }
    });
}

function clearMapSearch() {
    let input = document.getElementById('map-custom-search');
    if (input) {
        input.value = "";
        filterMapMarkers();
    }
}

// --- ÉCOUTEURS POUR LES BOUTONS FILTRES DU CAMP ---
document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
        // On retire la couleur rouge de tous les boutons et on active le bon
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        // --- NOUVEAU : On vide la barre de recherche automatiquement ---
        let searchInput = document.getElementById('global-search');
        if (searchInput && searchInput.value !== '') {
            searchInput.value = ''; // Efface le texte
            
            // On simule une saisie clavier pour que l'application comprenne qu'il n'y a plus de texte
            searchInput.dispatchEvent(new Event('input')); 
            
            // On cache la petite croix de la barre de recherche si elle existe
            let clearBtn = document.getElementById('clear-search-btn');
            if (clearBtn) clearBtn.style.display = 'none';
        }

        // On redessine le tableau
        renderCamp();
    });
});

// --- FONCTION POUR LES CASES À COCHER DU CAMP ---
window.toggleCampCheckbox = function(id, isChecked) {
    let item = db.camp.find(i => i.id === id);
    if (!item) return;

    // Si on coche et qu'on n'a pas dépassé le max, on ajoute 1 au total global
    if (isChecked && item.current < item.total) {
        item.current++;
    } 
    // Si on décoche et qu'on est au-dessus de 0, on enlève 1 au total global
    else if (!isChecked && item.current > 0) {
        item.current--;
    }

    // On sauvegarde et on met à jour l'écran
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
    if (typeof saveData === 'function') saveData();
    renderCamp();
    if (typeof updateDashboard === 'function') updateDashboard();
    if (typeof renderGlobalHuntingList === 'function') renderGlobalHuntingList();
};