export interface IConstant {
  value: string;
  label: string;
}

export interface IResponsePaged<T> {
  code: number;
  data: {
    content: T[];
    paging: {
      currentPage: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  message: string;
  error: null | string;
}

export interface IResponse<T> {
  code: number;
  data: {
    content: T[];
  };
  message: string;
  error: null | string;
}

export type TInfiniteListResult<T> = {
  content: T[];
  paging: IResponsePaged<T>['data']['paging'];
};
