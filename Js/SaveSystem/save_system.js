class SaveSystem {
    static #loadedDatas = null;
    static #loadedNameMap = null;
    static #loadedEmailMap = null;
    static #loadedPhoneMap = null;

    /**
     * retourne le tableau qui contient les données des contacts
     * @returns {SaveData}
     */
    static get loadedDatas(){
        if (SaveSystem.#loadedDatas === null)
            SaveSystem.pullDatas();

        return SaveSystem.#loadedDatas;
    }

    /**
     * Map qui contient les noms des contacts en clef et leur index dans le tableau principal loadedDatas
     * @returns {Map<string, number>}
     */
    static get nameMap(){
        if (SaveSystem.#loadedNameMap === null)
            SaveSystem.pullDatas();

        return SaveSystem.#loadedNameMap;
    }

    /**
     *
     * @returns {Map<string, number>}
     */
    static get emailMap(){
        if (SaveSystem.#loadedEmailMap === null)
            SaveSystem.pullDatas();

        return SaveSystem.#loadedEmailMap;
    }

    /**
     *
     * @returns {Map<string, number>}
     */
    static get phoneMap(){
        if (SaveSystem.#loadedPhoneMap === null)
            SaveSystem.pullDatas();

        return SaveSystem.#loadedPhoneMap;
    }

    static pullDatas(){
        let json_data = localStorage.getItem('contacts') || '{"contacts":[]}';
        SaveSystem.#loadedDatas = JSON.parse(json_data);

        let nameMap = new Map();
        let emailMap = new Map();
        let phoneMap = new Map();

        //maps
        for (let i = 0; i < SaveSystem.#loadedDatas.contacts.length; i++) {
            nameMap.set(SaveSystem.#loadedDatas.contacts[i].name.toLowerCase(), i);

            SaveSystem.#loadedDatas.contacts[i].contacts.forEach(c =>{
                if (c.includes('@')) emailMap.set(c, i);
                else phoneMap.set(c, i);
            });
        }

        SaveSystem.#loadedNameMap = nameMap;
        SaveSystem.#loadedEmailMap = emailMap;
        SaveSystem.#loadedPhoneMap = phoneMap;
        // console.log('contact data pulled from localstorage');
    }
    static pushDatas(){
        let json_data = JSON.stringify(SaveSystem.loadedDatas);
        localStorage.setItem('contacts', json_data);
        // console.log('contact data pushed to localstorage');
        SaveSystem.pullDatas();
    }
}