type TypeFile = {
  fileName: string;
  code: string;
  language: string;
  path?: string;
  hasChanges?: boolean;
  diffToHighlight?: Array<{ value: string; added?: boolean; removed?: boolean }>;
};

type TyleFiles = {
  source: TypeFile[];
  template: TypeFile[];
  solution: TypeFile[];
};

export type { TyleFiles, TypeFile };
