export type ButtonProps = {
  className?: string;
  text: string;
  isLoading: boolean | undefined | null;
  isDisabled: boolean | undefined | null;
  onClick: () => void;
};
