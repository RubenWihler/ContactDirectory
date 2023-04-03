var currentCreateContactData = null;
var currentModifyContactData = null;
var currentModifyContactOldName = '';

function init(){
    initViews();
    initEvents();
    displayContacts();
}
function initViews(){
    views = [
        new View('contacts', () => {onDisplayContact()}, () => {}),
        new View('create', () => {onDisplayCreateContact()}, () => {}),
        new View('modify', () => {}, () => {})
    ];
}
function initEvents(){
    //contact view elements
    document.querySelector('#btn_addContact').addEventListener('click', () => displayCreate());

    //create view elements
    document.querySelector('#create_contact_name').addEventListener('change', setCreateName);
    document.querySelector('#btn_create_contact').addEventListener('click', submitCreateContact);
    document.querySelector('#btn_create_back').addEventListener('click', () => displayContacts());
    document.querySelector('#create_email_btn').addEventListener('click', addCreateEmail);
    document.querySelector('#create_tel_btn').addEventListener('click', addCreateTel);

    //modify view elements
    document.querySelector('#btn_modify_back').addEventListener('click', () => displayContacts());
    document.querySelector('#btn_modify_contact').addEventListener('click', () => submitModifyContact());
    document.querySelector('#btn_delete_contact').addEventListener('click', () => submitDeleteContact());
    document.querySelector('#modify_contact_name').addEventListener('change', setModifyName);
    document.querySelector('#modify_email_btn').addEventListener('click', addModifyEmail);
    document.querySelector('#modify_tel_btn').addEventListener('click', addModifyTel);
}

/*---------------- Show Contacts ----------------*/
function onDisplayContact(){
    currentCreateContactData = null;
    currentModifyContactData = null;
    currentModifyContactOldName = '';
    SaveSystem.pullDatas();
    fillContacts();
}
function fillContacts(){
    ContactElement.ContactElementContainer.innerHTML = '';
    var datas = SaveSystem.loadedDatas.contacts;
    datas
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((c) => {
        new ContactElement(c, (param) => modifyContact(param));
    });
}

function sortContact(a, b){
    return a.name.localeCompare(b.name);
}
/**
 * Appelée quand un ContactElement est cliqué
 * @param contactElement {ContactElement}
 */
function modifyContact(contactElement){
    onDisplayModifyContact(contactElement.contactData);
}

/*---------------- Create Contact ----------------*/
function onDisplayCreateContact(){
    currentCreateContactData = new Contact('', []);
    clearCreateErrorMessages();
    fillCreateFields();
}
function fillCreateFields(){
    const email_parent = document.querySelector('#create_contact_email_container');
    const tel_parent = document.querySelector('#create_contact_tel_container');

    document.querySelector('#create_contact_name').value = currentCreateContactData.name;
    document.querySelector('#create_email_input').value = '';
    document.querySelector('#create_tel_input').value = '';

    email_parent.innerHTML = '';
    tel_parent.innerHTML = '';

    currentCreateContactData.contacts.forEach(c => {
        if (c.includes('@')) new EmailField(c, email_parent, removeCreateField,  modifyCreateField);
        else new TelField(c, tel_parent, removeCreateField, modifyCreateField);
    });
}
function showCreateErrorMessage(msg){
    let ele = document.createElement('span');
    ele.innerHTML = msg;
    document.querySelector('#errors_container_create').appendChild(ele);
}
function clearCreateErrorMessages(){
    document.querySelector('#errors_container_create').innerHTML = '';
}
function setCreateName(){
    const input = document.querySelector('#create_contact_name');
    currentCreateContactData.name = input.value.trim();
    fillCreateFields();
}
function addCreateEmail(){
    const input = document.querySelector('#create_email_input');
    input.value = input.value.trim().toLowerCase();
    let errors = checkCreateField(input.value, 'email');

    if (errors.length > 0){
        errors.forEach(err => {
            showCreateErrorMessage(err);
        });

        return;
    }

    currentCreateContactData.contacts.push(input.value);
    input.value = '';
    clearCreateErrorMessages();
    fillCreateFields();
}
function addCreateTel(){
    const input = document.querySelector('#create_tel_input');
    input.value = input.value.trim();
    let errors = checkCreateField(input.value, 'tel');

    if (errors.length > 0){
        errors.forEach(err => {
            showCreateErrorMessage(err);
        });

        return;
    }

    currentCreateContactData.contacts.push(input.value);
    input.value = '';
    clearCreateErrorMessages();
    fillCreateFields();
}
function checkCreateField(value, target_type){
    let errors = [];

    if (target_type === 'email'){

        if (value.trim().length === 0){
            errors.push('l\' email est vide!');
            return errors;
        }

        if (currentCreateContactData.contacts.includes(value))
            errors.push('l\' email "' + value + '" est deja associé a ce contact !');

        if (!value.includes('@'))
            errors.push('un email doit contenir un @');

    }else{
        if (value.trim().length === 0){
            errors.push('le numéro de téléphone est vide!');
            return errors;
        }

        if (currentCreateContactData.contacts.includes(value))
            errors.push('le numéro de téléphone "' + value + '" est deja associé a ce contact !');

        if (value.includes('@'))
            errors.push('un numéro de tel. ne doit pas contenir un @');
    }

    return errors;
}
function modifyCreateField(old_value, new_value){
    if (old_value === new_value) return;
    let errors = checkCreateField(new_value, old_value.includes('@') ? 'email' : 'tel');

    if (errors.length > 0){
        errors.forEach(err => {
            showCreateErrorMessage(err);
        });

        fillCreateFields();
        return;
    }

    currentCreateContactData.contacts[currentCreateContactData.contacts.indexOf(old_value)] = new_value;
    fillCreateFields();
}
function removeCreateField(field){
    let tmp_contact_set = new Set(currentCreateContactData.contacts);
    tmp_contact_set.delete(field.value);
    currentCreateContactData.contacts = Array.from(tmp_contact_set);
    fillCreateFields();
}


/*---------------- Modify Contact ----------------*/
function onDisplayModifyContact(contactData){
    currentModifyContactOldName = contactData.name;
    currentModifyContactData = new Contact(contactData.name, contactData.contacts);
    clearModifyErrorMessages();
    fillModifyFields();
    displayModify();
}
function fillModifyFields(){
    document.querySelector('#modify_contact_name').value = currentModifyContactData.name;

    const email_parent = document.querySelector('#modify_emails_container');
    const tel_parent = document.querySelector('#modify_tel_container');

    email_parent.innerHTML = '';
    tel_parent.innerHTML = '';

    currentModifyContactData.contacts.forEach(c => {
       if (c.includes('@')) new EmailField(c, email_parent, removeModifyField, modifyModifyField);
       else new TelField(c, tel_parent, removeModifyField, modifyModifyField);
    });
}
function showModifyErrorMessage(msg){
    let ele = document.createElement('span');
    ele.innerHTML = msg;
    document.querySelector('#errors_container_modify').appendChild(ele);
}
function clearModifyErrorMessages(){
    document.querySelector('#errors_container_modify').innerHTML = '';
}
function setModifyName(){
    const input = document.querySelector('#modify_contact_name');
    currentModifyContactData.name = input.value.trim();
    fillModifyFields();
}
function addModifyEmail(){
    const input = document.querySelector('#modify_email_input');
    input.value = input.value.trim().toLowerCase();
    let errors = checkModifyField(input.value, 'email');

    if (errors.length > 0){
        errors.forEach(err => {
            showModifyErrorMessage(err);
        });

        return;
    }

    currentModifyContactData.contacts.push(input.value);
    input.value = '';
    clearModifyErrorMessages();
    fillModifyFields();
}
function addModifyTel(){
    const input = document.querySelector('#modify_tel_input');
    input.value = input.value.trim();
    let errors = checkModifyField(input.value, 'tel');

    if (errors.length > 0){
        errors.forEach(err => {
            showModifyErrorMessage(err);
        });

        return;
    }

    currentModifyContactData.contacts.push(input.value);
    input.value = '';
    clearModifyErrorMessages();
    fillModifyFields();
}
function checkModifyField(value, target_type){
    let errors = [];

    if (target_type === 'email'){

        if (value.trim().length === 0){
            errors.push('l\' email est vide!');
            return errors;
        }

        if (currentModifyContactData.contacts.includes(value))
            errors.push('l\' email "' + value + '" est deja associé a ce contact !');

        if (!value.includes('@'))
            errors.push('un email doit contenir un @');

    }else{
        if (value.trim().length === 0){
            errors.push('le numéro de téléphone est vide!');
            return errors;
        }

        if (currentModifyContactData.contacts.includes(value))
            errors.push('le numéro de téléphone "' + value + '" est deja associé a ce contact !');

        if (value.includes('@'))
            errors.push('un numéro de tel. ne doit pas contenir un @');
    }

    return errors;
}
function modifyModifyField(old_value, new_value){
    if (old_value === new_value) return;
    let errors = checkModifyField(new_value, old_value.includes('@') ? 'email' : 'tel');

    if (errors.length > 0){
        errors.forEach(err => {
            showModifyErrorMessage(err);
        });

        fillModifyFields();
        return;
    }

    currentModifyContactData.contacts[currentModifyContactData.contacts.indexOf(old_value)] = new_value;
    fillModifyFields();
}
function removeModifyField(field){
    let tmp_contact_set = new Set(currentModifyContactData.contacts);
    tmp_contact_set.delete(field.value);
    currentModifyContactData.contacts = Array.from(tmp_contact_set);
    fillModifyFields();
}

/*---------------- Submit Contacts----------------*/
function submitCreateContact(){
    clearCreateErrorMessages();
    if (!ContactProcessor.createContact(currentCreateContactData, showCreateErrorMessage)) return;

    displayContacts();
}
function submitModifyContact(){
    if (!ContactProcessor.modifyContact(currentModifyContactOldName, currentModifyContactData, showModifyErrorMessage))
        return;

    displayContacts();
}
function submitDeleteContact(){
    if (!ContactProcessor.deleteContact(currentModifyContactOldName)){
        showModifyErrorMessage('Une erreur s\'est produite !');
        return;
    }

    displayContacts();
}



init();
