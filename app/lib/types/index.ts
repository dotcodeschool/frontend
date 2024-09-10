export interface SetupQuestion {
  id: string;
  question: string;
  description: string;
  options?: string[];
  isCustom?: boolean;
  steps?: { title: string; code: string | React.ReactElement }[];
}
