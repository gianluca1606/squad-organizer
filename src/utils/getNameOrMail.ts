import { PublicUser } from "@/interfaces/PublicUser";

export function getNameOrMail(member: PublicUser | null) {
  if (!member) {
    return "Unknown";
  }
  if (member.username) {
    return member.username;
  }
  if (member.firstName && member.lastName) {
    return member.firstName + " " + member.lastName;
  }
  if (member.emailAddresses.length > 0) {
    return member.emailAddresses[0]?.emailAddress;
  }
  return "Unknown";
}
