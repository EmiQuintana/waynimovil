import { http } from "./http";

const DIRECTORY_URL =
  "https://randomuser.me/api/?results=11&seed=wayniwallet&inc=name,picture,login,location,email,phone";

type RandomUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  picture: { large: string; medium: string; thumbnail: string };
  location?: {
    city?: string;
    state?: string;
    street?: { number?: number; name?: string };
  };
  email?: string;
  phone?: string;
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
  city: string;
  state: string;
  street: string;
  email: string;
  phone: string;
};

export type Directory = {
  currentUser: AppUser;
  contacts: AppUser[];
};

const LOCAL_PROFILE = {
  city: "Buenos Aires",
  state: "CABA",
  street: "Av. Corrientes 1234",
  phone: "+54 11 5555-1234",
};

function fallbackText(...values: Array<string | number | undefined>) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) {
      return text;
    }
  }

  return "";
}

function mapUser(user: RandomUser): AppUser {
  const firstName = user.name.first;
  const lastName = user.name.last;
  const streetName = user.location?.street?.name;
  const streetNumber = user.location?.street?.number;

  return {
    id: user.login.uuid,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    avatar: user.picture.large,
    city: fallbackText(user.location?.city, LOCAL_PROFILE.city),
    state: fallbackText(user.location?.state, LOCAL_PROFILE.state),
    street: fallbackText(
      streetName && streetNumber !== undefined
        ? `${streetName} ${streetNumber}`
        : streetName,
      LOCAL_PROFILE.street,
    ),
    email: fallbackText(
      user.email,
      `${firstName}.${lastName}@example.com`.toLowerCase(),
    ),
    phone: fallbackText(user.phone, LOCAL_PROFILE.phone),
  };
}

export function withLocalProfile(user: AppUser): AppUser {
  return {
    ...user,
    city: fallbackText(user.city, LOCAL_PROFILE.city),
    state: fallbackText(user.state, LOCAL_PROFILE.state),
    street: fallbackText(user.street, LOCAL_PROFILE.street),
    email: fallbackText(
      user.email,
      `${user.firstName}.${user.lastName}@example.com`.toLowerCase(),
    ),
    phone: fallbackText(user.phone, LOCAL_PROFILE.phone),
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
