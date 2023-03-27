class View{
    #name;
    #visible = false;
    /**
     * @type {HTMLDivElement}
     */
    #dom;
    /**
     * @type {function}
     */
    onOpen;
    /**
     * @type {function}
     */
    onClose;

    constructor(name, onOpen, onClose) {
        this.#name = name;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.#dom = document.querySelector('#' + this.#name);
        this.visible = false;
    }

    get name(){
        return this.#name;
    }
    get visible(){
        return this.#visible;
    }
    set visible(value){
        this.#visible = value;
        this.#dom.style.display = value ? 'flex' : 'none';
    }

    Open(){
        this.visible = true;
        this.onOpen();
    }
    Close(){
        this.visible = false;
        this.onClose();
    }
}