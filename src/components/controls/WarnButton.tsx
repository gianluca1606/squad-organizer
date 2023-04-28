import { FC } from "react";

export type ButtonProps = {
  text: string;
  onClick: () => void;
};

export const WarnButton: FC<ButtonProps> = ({ text, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className="mb-2 mr-2 rounded-full bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
  >
    {text}
  </button>
);
