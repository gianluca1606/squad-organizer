import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { CreateEditTeamProps } from "~/interfaces/CreateEditTeamProps";
import { RouterInputs, api } from "~/utils/api";

type CreateTeamInput = RouterInputs["team"]["create"];

const CreateTeamForm: FC<CreateEditTeamProps> = ({ closeModal }) => {
  const createTeam = api.team.create.useMutation();
  const loadTeams = api.team.getTeamsForLoggedInUser.useQuery();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");

  const { register, handleSubmit } = useForm<CreateTeamInput>();

  const onSubmit = (formData: CreateTeamInput) => {
    createTeam.mutateAsync(formData).then((result) => {
      setActualTeamFunction(result.id);
      loadTeams.refetch();
      closeModal();
    });
  };
  //@ts-ignore
  //const t: any = useTranslations("Settings");

  return (
    <>
      <div className="w-full ">
        {/* Modal content */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create your team
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="space-y-6 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-1/2">
              <div className="mb-6">
                <label
                  htmlFor="teamname"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Team Name
                </label>
                <input
                  type="text"
                  id="nickname"
                  {...register("name", { required: true })}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
                <label
                  htmlFor="teamname"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="nickname"
                  {...register("location", { required: false })}
                  className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your description
                  </label>
                  <textarea
                    id="message"
                    {...register("description", { required: true })}
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Write your thoughts here..."
                    defaultValue={""}
                  />
                </div>
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600">
            <button
              onClick={handleSubmit(onSubmit)}
              data-modal-hide="defaultModal"
              type="submit"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              data-modal-hide="defaultModal"
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTeamForm;
