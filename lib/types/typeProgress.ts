type TypeProgressUpdate = {
  user: {
    email: string;
  };
  progress: TypeProgressData;
};

type TypeProgressData = Record<string, Record<string, Record<string, boolean>>>;

export type { TypeProgressData, TypeProgressUpdate };
