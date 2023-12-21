export type User = {
    email: string;
    _id: string;
    username: string;
    location: Location
}

export type Location = {
    country: string;
    city: string;
}