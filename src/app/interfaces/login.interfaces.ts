export interface LoginForm {
    usuario : string
    password: string;
    remember: boolean;
}

export interface LoginData {
    username: string,
    password: string
}

export interface RegisterData {
    username: string,
    email: string,
    password: string
}