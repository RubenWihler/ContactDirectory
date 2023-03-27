class Field{
    /**
     * @type {HTMLDivElement}
     */
    #dom;
    /**
     * @type {string}
     */
    #value;
    /**
     * @type {HTMLDivElement}
     */
    #parent;

    constructor(value, parent) {
        this.#value = value;
        this.#parent = parent;
        this.#generateElement();
    }

    get #inputType(){
        return 'text';
    }

    #Delete(){}

    #generateElement(){
        let btn = document.createElement('button');
        btn.innerHTML = '-';
        btn.addEventListener('click', () => this.#Delete())

        let input = document.createElement('input');
        input.type = this.#inputType;
        input.value = this.#value;

        this.#dom = document.createElement('div');
        this.#dom.appendChild(input);
        this.#dom.appendChild(btn);
        this.#parent.appendChild(this.#dom);
    }
}