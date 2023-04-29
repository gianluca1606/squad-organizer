import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { CreateEditTeamProps } from "~/interfaces/CreateEditTeamProps";
import { RouterInputs, api } from "~/utils/api";
import { PrimaryButton } from "../controls/PrimaryButton";
import { AlternativeButton } from "../controls/AlternativeButton";

type CreateTeamInput = RouterInputs["team"]["create"];

const CreateTeamForm: FC<CreateEditTeamProps> = ({
  closeModal,
  edit,
  data,
}) => {
  const createTeam = api.team.create.useMutation();
  const editTeam = api.team.update.useMutation();
  const getTeamById = api.team.getTeamData.useQuery({ teamId: data?.id });
  const loadTeams = api.team.getTeamsForLoggedInUser.useQuery();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");

  const { register, handleSubmit, setValue } = useForm<CreateTeamInput>();

  if (edit) {
    useEffect(() => {
      setValue("name", data!.name);
      setValue("description", data?.description ? data?.description : "");
      setValue("location", data?.location ? data?.location : "");
    }, [data]);
  }
  const onSubmit = (formData: CreateTeamInput) => {
    if (edit) {
      editTeam.mutateAsync({ ...formData, teamId: data!.id }).then((result) => {
        getTeamById.refetch();
        setActualTeamFunction(result.id);
        loadTeams.refetch();
        closeModal();
      });
    } else {
      createTeam.mutateAsync(formData).then((result) => {
        setActualTeamFunction(result.id);
        loadTeams.refetch();
        closeModal();
      });
    }
  };

  const save = () => {
    handleSubmit(onSubmit)();
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
              {edit ? "Edit team" : "Create team"}
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
            <PrimaryButton
              isDisabled={editTeam.isLoading || createTeam.isLoading}
              isLoading={editTeam.isLoading || createTeam.isLoading}
              onClick={save}
              text="Save"
            />
            <AlternativeButton
              isLoading={null}
              isDisabled={editTeam.isLoading || createTeam.isLoading}
              onClick={closeModal}
              text="Close"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTeamForm;
