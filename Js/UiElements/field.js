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
    /**
     * @type {function}
     */
    #onDelete;
    /**
     * @type {function}
     */
    #onChange;

    constructor(value, parent, onDelete, onChange) {
        this.#value = value;
        this.#parent = parent;
        this.#onDelete = onDelete;
        this.#onChange = onChange;
        this.#generateElement();
    }

    get #inputType(){
        return 'text';
    }
    get value(){
        return this.#value;
    }

    #changed(value){
        value = value.trim().toLowerCase();
        this.#onChange(this.#value.trim().toLowerCase(), value);
        this.#value = value;
    }

    #generateElement(){
        let btn = document.createElement('button');
        btn.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

        let input = document.createElement('input');
        input.type = this.#inputType;
        input.value = this.#value;

        btn.addEventListener('click', () => this.#onDelete(this))
        input.addEventListener('change', () => this.#changed(input.value))

        this.#dom = document.createElement('div');
        this.#dom.appendChild(input);
        this.#dom.appendChild(btn);
        this.#parent.appendChild(this.#dom);
    }
}