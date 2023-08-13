import { useLocalStorage } from "@mantine/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";

export const SelectTeamComponent = () => {
  const teams = api.team.getTeamsForLoggedInUser.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [actualTeam, setActualTeamFunction] = useLocalStorage({
    defaultValue: "",
    key: "teamId",
  });
  const handleSelectTeamChange = (value: string): void => {
    setActualTeamFunction(value);
  };

  const getTeamNameForId = (id: string) => {
    return teams.data?.find((team) => team.id === id)?.name || "Select Team";
  };

  if (teams.isLoading) return null;
  return (
    <Select
      disabled={teams.data?.length === 0}
      value={actualTeam}
      onValueChange={handleSelectTeamChange}
    >
      <SelectTrigger className="mb-2  w-full sm:w-full xl:w-10/12 2xl:w-8/12">
        <SelectValue placeholder="Select your preffered language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {teams.data?.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {getTeamNameForId(team.id)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
