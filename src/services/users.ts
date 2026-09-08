import { http } from "./http";

const DIRECTORY_URL =
  "https://randomuser.me/api/?results=11&seed=wayniwallet&inc=name,picture,login";

type RandomUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  picture: { large: string; medium: string; thumbnail: string };
};

type RandomUserResponse = {
  results: RandomUser[];
};

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
};

export type Directory = {
  currentUser: AppUser;
  contacts: AppUser[];
};

function mapUser(user: RandomUser): AppUser {
  return {
    id: user.login.uuid,
    firstName: user.name.first,
    lastName: user.name.last,
    fullName: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.medium,
  };
}

export async function getDirectory(): Promise<Directory> {
  const data = await http<RandomUserResponse>(DIRECTORY_URL);

  if (!data.results?.length) {
    throw new Error("No users returned");
  }

  const [currentUser, ...contacts] = data.results.map(mapUser);

  return { currentUser, contacts };
}
