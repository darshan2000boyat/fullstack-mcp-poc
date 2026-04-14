export interface SearchProps {
  data: { [key: string]: SearchData };
}

export interface SearchData {
  title?: string;
  data: any[];
  meta: {
    totalCount: number;
  };
}
