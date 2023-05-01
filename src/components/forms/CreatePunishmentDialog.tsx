import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export const CreatePunishmentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="h-5 w-5 " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Strafe</DialogTitle>
          <DialogDescription>
            Create a new punishment or contribution type for your squad
          </DialogDescription>
        </DialogHeader>
        <form className="w-full sm:w-1/2">
          <div className="mb-6">
            <Label htmlFor="teamname">Team Name</Label>
            <Input
              type="text"
              id="punishmentName"
              placeholder="Punishment name"
              required
              // {...register("name", { required: true })}
            />

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Your description
              </label>
              <Textarea
                id="message"
                placeholder="Write your thoughts here.."
                //   {...register("description", { required: true })}
                rows={4}
              />
            </div>

            <Label htmlFor="teamname">Price</Label>
            <Input
              type="text"
              id="price"
              placeholder="price"
              required
              // {...register("location", { required: true })}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
