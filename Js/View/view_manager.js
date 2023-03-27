// const views = document.querySelectorAll('.view');
var views = [];
var currentView = null;

/**
 * Afficher la vue qui a comme id le paramettre
 * @param view l'id de la vue sans le #
 */
function displayView(view){
    views.forEach(v => {
        if (v.name === view){
            v.Open();
            currentView = v;
        }
        else if (v.visible) v.Close();
    });
}
/**
 * afficher la vue Contact
 */
function displayContacts(){
    displayView('contacts');
}
/**
 * Afficher la vue Créer
 */
function displayCreate(){
    displayView('create');
}
/**
 * Afficher la vue Modifier
 */
function displayModify(){
    displayView('modify');
}