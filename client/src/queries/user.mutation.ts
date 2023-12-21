import axios from "../lib/axios"

export type Location = {
    country: string;
    city: string;
}
export type  UserInput = {
    name: string;
    location: Location;
    email: string;
    username: string;
    password: string;
}

export type LoginInput = {
    usernameOrEmail: string;
    password: string;
}

export const registerUser = (userData: UserInput) => {
    return axios.post("/users", userData);
}

export const loginUser = (loginData: LoginInput) => {  
    return axios.post("/users/login", loginData);    
}