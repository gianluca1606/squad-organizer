import Link from "next/link";
import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import ReactModal from "react-modal";

import Modal from "react-modal";
import ConfirmDeleteDialog from "~/dialogs/ConfirmDeleteDialog";
ReactModal.setAppElement("#modals");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "0",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const AccountSettingsForm: FC = () => {
  const deleteUser = api.user.delete.useMutation();
  const [cookies, setCookie, removeCookie] = useCookies(["locale"]);
  const [localeCookie, setLocaleCookie] = useState("");
  //@ts-ignore
  const t: any = useTranslations("Settings");
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
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
  useEffect(() => {
    setLocaleCookie(cookies.locale);
  }, []);

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

          <label
            htmlFor="nickname"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your nickname
          </label>
          <input
            type="text"
            id="nickname"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="button"
          onClick={deleteUserFn}
          disabled={deleteUser.isLoading}
          className="mb-2 mr-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Delete Account
        </button>

        <button
          type="submit"
          onClick={openModal}
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Save
        </button>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        // className="rounded-lg"
        // overlayClassName="rounded-lg"
        contentLabel="Example Modal"
      >
        <ConfirmDeleteDialog closeModal={closeModal}></ConfirmDeleteDialog>
      </Modal>
    </>
  );
};

export default AccountSettingsForm;
