import { useLocalStorage } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";

export const SelectTeamComponent = () => {
  const teams = api.team.getTeamsForLoggedInUser.useQuery();

  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const handleSelectTeamChange = (value: string): void => {
    setActualTeamFunction(value);
  };

  const getTeamNameForId = (id: string) => {
    return teams.data?.find((team) => team.id === id)?.name || "Select Team";
  };
  return (
    <Select
      disabled={teams.data?.length === 0}
      value={actualTeam}
      onValueChange={handleSelectTeamChange}
    >
      <SelectTrigger className="w-full  sm:w-full lg:w-8/12 2xl:w-6/12">
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
