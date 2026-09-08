import type { AppUser } from "@/services/users";

export const mockCurrentUser: AppUser = {
  id: "user-1",
  firstName: "Tom",
  lastName: "Fleury",
  fullName: "Tom Fleury",
  avatar: "/avatar-user.jpg",
  city: "Buenos Aires",
  state: "CABA",
  street: "Av. Corrientes 1234",
  email: "tom.fleury@example.com",
  phone: "+54 11 5555-1234",
};

export const mockContact: AppUser = {
  id: "contact-1",
  firstName: "Alonso",
  lastName: "Diaz",
  fullName: "Alonso Diaz",
  avatar: "/avatar-contact.jpg",
  city: "Cordoba",
  state: "Cordoba",
  street: "San Martin 100",
  email: "alonso.diaz@example.com",
  phone: "+54 351 555-0000",
};
