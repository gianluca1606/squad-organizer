import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FC } from "react";
import { api } from "~/utils/api";

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
import { useLocalStorage } from "usehooks-ts";

const AccountSettingsForm: FC = () => {
  const deleteUser = api.user.delete.useMutation();
  //@ts-ignore
  const t: any = useTranslations("Settings");
  const router = useRouter();

  // todo add dialog for confirmation
  const deleteUserFn = () => {
    deleteUser.mutate();
    router.push("/");
  };

  return (
    <>
      <form className="absolute bottom-0 right-0 ">
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
