export default class UserDto {
    id;
    uuid;
    role;

    constructor(model) {
        this.id = model.id;
        this.uuid = model.uuid;
        this.role = model.role;
    }
}