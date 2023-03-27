class ContactProcessor{
    static getContacts(){
        return SaveSystem.loadedDatas;
    }

    /**
     * Créer un nouveau contact
     * @param contactData {Contact}
     * @param onError {function}
     * @returns {boolean}
     */
    static createContact(contactData, onError){
        let errors = ContactProcessor.checkCreateValues(contactData);

        if (errors.length > 0){
            errors.forEach(err => {
                onError(err);
            });

            return false;
        }

        SaveSystem.loadedDatas.contacts.push(contactData);
        SaveSystem.pushDatas();

        return true;
    }

    /**
     * Modifier un contact
     * @param oldName {string}
     * @param contactData {Contact}
     * @param onError {function}
     * @returns {boolean}
     */
    static modifyContact(oldName, contactData, onError){
        let errors = ContactProcessor.checkModifyValues(oldName, contactData);

        if (errors.length > 0){
            errors.forEach(err => {
                onError(err);
            });

            return false;
        }

        let obj = SaveSystem.loadedDatas.contacts[oldName];
        obj.name = contactData.name;
        obj.contacts = contactData.contacts;
        SaveSystem.pushDatas();

        return true;
    }
    static deleteContact(contactName){
        if (!ContactProcessor.isNameExist()){
            console.error('contact name is invalid !');
            return false;
        }

        let new_set = new Set(SaveSystem.loadedDatas.contacts);
        new_set.delete(SaveSystem.nameMap[contactName]);
        SaveSystem.pushDatas();
        return true;
    }

    /**
     * Verifie que les valeurs sont valides
     * @param contactData {Contact}
     * @returns {*[]}
     */
    static checkCreateValues(contactData){
        let errors = [];

        //le nom existe-t-il deja pour un autre contact
        if (ContactProcessor.isNameExist(contactData.name))
            errors.push("le nom du contact est deja utilisé !");

        //validité des emails et num de tel
        contactData.contacts.forEach(c => {
            if (c.includes('@')){
                if (!ContactProcessor.isEmailValid(c))
                    errors.push(c + " n'est pas une address email valide !");

                if (ContactProcessor.isEmailUsed(c))
                    errors.push(c + " est deja utilisé comme email pour un autre contact !");
            }
            else{
                if (!ContactProcessor.isPhoneValid(c))
                    errors.push(c + " n'est un numéro de téléphone valide!");

                if (ContactProcessor.isPhoneUsed(c))
                    errors.push(c + " est deja utilisé comme numéro de téléphone pour un autre contact !");
            }
        });

        return errors;
    }

    /**
     * Verifie que les valeurs sont valides
     * @param oldName {string}
     * @param contactData {Contact}
     * @returns {*[]}
     */
    static checkModifyValues(oldName, contactData){
        let errors = [];

        if (contactData.name !== oldName){
            //le nom existe-t-il deja pour un autre contact
            if (!ContactProcessor.isNameExist(contactData.name))
                errors.push("le nom du contact est deja utilisé !");
        }

        //validité des emails et num de tel
        contactData.contacts.forEach(c => {
            if (c.includes('@')){
                if (ContactProcessor.isEmailValid(c))
                    errors.push(c + " est deja utilisé comme email pour un autre contact !");

                if (!SaveSystem.emailMap.has(c) &&
                    SaveSystem.loadedDatas.contacts[SaveSystem.emailMap.get(c)].name !== oldName)
                    errors.push(c + " n'est pas une address email valide !");
            }
            else{
                if (!ContactProcessor.isPhoneValid(c))
                    errors.push(c + " n'est un numéro de téléphone valide!");

                if (SaveSystem.phoneMap.has(c) &&
                    SaveSystem.loadedDatas.contacts[SaveSystem.phoneMap.get(c)].name !== oldName)
                    errors.push(c + " est deja utilisé comme numéro de téléphone pour un autre contact !");
            }
        });

        return errors;
    }

    static isNameExist(name){
        return SaveSystem.nameMap.has(name.toLowerCase());
    }
    static isEmailUsed(email){
        return SaveSystem.emailMap.has(email);
    }
    static isPhoneUsed(phone){
        return SaveSystem.phoneMap.has(phone);
    }
    static isEmailValid(email){
        return validateEmail(email)
    }
    static isPhoneValid(phone){
        try{
            let phoneNumber = libphonenumber.parsePhoneNumber(phone);
            return phoneNumber && phoneNumber.isValid();
        }catch{
            return false;
        }
    }

}