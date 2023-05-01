import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { api } from "~/utils/api";

import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { Button } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";

const AccountSettingsForm: FC = () => {
  const teams = api.team.getTeamsForLoggedInUser.useQuery();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const deleteUser = api.user.delete.useMutation();
  const [cookies, setCookie, removeCookie] = useCookies(["locale"]);
  const [localeCookie, setLocaleCookie] = useState("");
  //@ts-ignore
  const t: any = useTranslations("Settings");
  const router = useRouter();

  useEffect(() => {
    if (!cookies.locale) {
      setLocaleCookie("en");
      setCookie("locale", "en", { path: "/" });
    } else {
      setLocaleCookie(cookies.locale);
    }
  }, []);

  const handleChange = (value: string): void => {
    setLocaleCookie(value);
    setCookie("locale", value, { path: "/" });

    router.reload();
  };

  // todo add dialog for confirmation
  const deleteUserFn = () => {
    deleteUser.mutate();
    router.push("/");
  };

  const setActualTeam = (id: string) => {
    setActualTeamFunction(id);
  };

  const handleSelectTeamChange = (value: string): void => {
    setActualTeam(value);
  };

  const getTeamNameForId = (id: string) => {
    return teams.data?.find((team) => team.id === id)?.name || "Select Team";
  };

  return (
    <>
      <form className="w-full sm:w-1/2">
        <div className="mb-6">
          <div>
            <Label
              htmlFor="language"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {"Select your default team"}
            </Label>

            <Select
              disabled={teams.data?.length === 0}
              value={actualTeam}
              onValueChange={handleChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your preffered language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teams.data?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {" "}
                      {getTeamNameForId(team.id)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label
              htmlFor="language"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("select")}
            </Label>

            <Select value={localeCookie} onValueChange={handleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your preffered language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="de"> {t("german")}</SelectItem>
                  <SelectItem value="en">{t("english")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteUser.isLoading}>
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteUserFn}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </>
  );
};

export default AccountSettingsForm;
