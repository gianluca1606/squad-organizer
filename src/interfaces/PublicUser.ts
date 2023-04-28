import { EmailAddress } from "@clerk/nextjs/api";

export type PublicUser = {
  id: string;
  createdAt: number;
  updatedAt: number;
  gender: string;
  birthday: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: EmailAddress[];
  profileImageUrl: string;
  primaryEmailAddressId: string | null;
};
