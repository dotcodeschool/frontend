import { ReactElement } from "react";

export interface PreComponentChildProps {
  children: string;
  className?: string;
}

export interface IPreComponentProps {
  children: ReactElement<PreComponentChildProps>;
}
