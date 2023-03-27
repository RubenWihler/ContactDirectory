class Contact{
    name;
    contacts = [];

    constructor(name, contacts) {
        this.name = name;
        this.contacts = contacts;
    }

    get name(){
        return this.name;
    }
    set name(value){
        this.name = value;
    }
    get contacts(){
        return this.contacts;
    }
    set contacts(value){
        this.contacts = value;
    }



}