export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    imageUrl?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    CreatedAt?: Date;
    UpdatesAt?: Date;
}