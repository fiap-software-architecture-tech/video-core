export type UserPayload = {
    id?: string;
    email: string;
    password: string;
};

export class User {
    public readonly id: string;
    public email: string;
    public password: string;

    constructor(payload: UserPayload) {
        this.id = payload.id || crypto.randomUUID();
        this.email = payload.email;
        this.password = payload.password;
    }
}
