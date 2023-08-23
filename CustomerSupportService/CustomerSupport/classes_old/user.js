class Message {
    constructor(_id, role, username, password,
        firstname, lastname, email, city, telephone) {
        this._id = _id;
        this.role = role;
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.city = city;
        this.telephone = telephone;
    }
}

// export class User {
//     _id: String;
//     role: String;
//     username: String;
//     password: String;
//     firstname: String;
//     lastname: String;
//     email: String;
//     city: String;
//     telephone: String;
// }