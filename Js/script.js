var currentCreateContactData = null;

function init(){
    initViews();
    initEvents();
    displayContacts();
    ContactProcessor.createContact(new Contact('Ruben', ['wihlerruben@gmail.com', 'ruben.whlr@eduge.ch', '+41763607720', '0783093294509357403']), (err) => console.warn(err));
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
    document.querySelector('#btn_create_back').addEventListener('click', () => displayContacts());
    document.querySelector('#create_email_btn').addEventListener('click', addCreateEmail);
    document.querySelector('#create_tel_btn').addEventListener('click', addCreateTel);

    //modify view elements
    document.querySelector('#btn_modify_back').addEventListener('click', () => displayContacts());
}


/*---------------- Show Contacts ----------------*/
function onDisplayContact(){
    fillContacts();
}
function fillContacts(){
    ContactElement.ContactElementContainer.innerHTML = '';
    SaveSystem.loadedDatas.contacts.forEach((c) => {
        new ContactElement(c, (param) => modifyContact(param));
    });
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
    document.querySelector('#errors_container_create').innerHTML = '';
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
        if (c.includes('@')) new EmailField(c, email_parent);
        else new TelField(c, tel_parent);
    });
}
function showCreateErrorMessage(msg){
    let ele = document.createElement('span');
    ele.innerHTML = msg;
    document.querySelector('#errors_container_create').appendChild(ele);
}
function setCreateName(){
    const input = document.querySelector('#create_contact_name');
    currentCreateContactData.name = input.value;
    fillCreateFields();
}
function addCreateEmail(){
    const input = document.querySelector('#create_email_input');

    if (!input.value.includes('@')){
        showCreateErrorMessage('un email doit contenir un @');
        return;
    }

    currentCreateContactData.contacts.push(input.value);
    input.value = '';
    fillCreateFields();
}
function addCreateTel(){
    const input = document.querySelector('#create_tel_input');

    if (input.value.includes('@')){
        showCreateErrorMessage('un numéro de tel. ne doit pas contenir un @');
        return;
    }

    currentCreateContactData.contacts.push(input.value);
    input.value = '';
    fillCreateFields();
}

/*---------------- Modify Contact ----------------*/
function onDisplayModifyContact(contactData){
    fillContactFields(contactData);
    displayModify();
}
function fillContactFields(contactData){
    document.querySelector('#modify_contact_name').value = contactData.name;

    const email_parent = document.querySelector('#modify_emails_container');
    const tel_parent = document.querySelector('#modify_tel_container');

    email_parent.innerHTML = '';
    tel_parent.innerHTML = '';

    contactData.contacts.forEach(c => {
       if (c.includes('@')) new EmailField(c, email_parent);
       else new TelField(c, tel_parent);
    });
}


init();
