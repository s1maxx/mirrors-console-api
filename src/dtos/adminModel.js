export default class AdminDto {
    id;
    username;

    constructor(model) {
        this.id = model.id;
        this.username = model.name;
    }
}