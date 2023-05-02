import { PublicUser } from "~/interfaces/PublicUser";

export function getNameOrMail(member: PublicUser | any) {
  if (member.username) {
    return member.username;
  }
  if (member.firstName && member.lastName) {
    return member.firstName + " " + member.lastName;
  } else {
    return member.emailAddresses[0]?.emailAddress;
  }
}
