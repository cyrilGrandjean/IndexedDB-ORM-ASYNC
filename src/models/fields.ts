
enum FieldsTypes {
    string,
    number,
}

export class Fields {
    type!:  FieldsTypes;
    options: IDBIndexParameters;
    constructor(options: IDBIndexParameters) {
        this.options = options;
    }
}

export class StringFields extends Fields {
    type = FieldsTypes.string
}


export class NumberFields extends Fields {
    type = FieldsTypes.number
}
