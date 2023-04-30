import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { api } from "~/utils/api";

import { useOnClickOutside } from "usehooks-ts";
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

const AccountSettingsForm: FC = () => {
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

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocaleCookie(event.target.value);
    setCookie("locale", event.target.value, { path: "/" });

    router.reload();
  };

  // todo add dialog for confirmation
  const deleteUserFn = () => {
    deleteUser.mutate();
    router.push("/");
  };

  return (
    <>
      <form className="w-full sm:w-1/2">
        <div className="mb-6">
          <div>
            <label
              htmlFor="countries"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("select")}
            </label>
            <select
              id="countries"
              value={localeCookie}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option>Choose a language</option>
              <option value="de"> {t("german")}</option>
              <option value="en">{t("english")}</option>
            </select>
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
