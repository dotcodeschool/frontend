type TypeFile = {
  fileName: string;
  code: string;
  language: string;
};

type TyleFiles = {
  source: TypeFile[];
  template: TypeFile[];
  solution: TypeFile[];
};

export type { TyleFiles, TypeFile };
