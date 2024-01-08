export type User = {
  email: string;
  _id: string;
  username: string;
  location: Location;
  isActive: boolean;
};

export type Location = {
  country: string;
  city: string;
};
