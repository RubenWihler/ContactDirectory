class ContactElement {
    static get ContactElementContainer() {
        return document.querySelector('#contact_grid');
    }

    /**
     * @type {Contact}
     */
    contactData;
    /**
     * @type {HTMLButtonElement}
     */
    #dom;
    /**
     * @param type {function}
     */
    onClick;

    constructor(contactData, onClick) {
        this.contactData = contactData;
        this.onClick = onClick;
        this.#generateElement();
    }

    #generateElement(){
        let span_ele = document.createElement('span');
        span_ele.innerHTML = this.contactData.name;

        this.#dom = document.createElement('button');
        this.#dom.classList.add('contact_card');
        this.#dom.appendChild(span_ele);
        this.#dom.addEventListener('click', () => this.onClick(this));
        ContactElement.ContactElementContainer.appendChild(this.#dom);
    }
}