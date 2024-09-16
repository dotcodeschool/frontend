export type TypeFile = {
  fileName: string;
  code: string;
  language: string;
};

export type TyleFiles = {
  source: TypeFile[];
  template: TypeFile[];
  solution: TypeFile[];
};
