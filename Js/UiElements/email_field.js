class EmailField extends Field{


    constructor(value, parent) {
        super(value, parent);

    }
    get #inputType(){
        return 'email';
    }
    #Delete(){

    }

}