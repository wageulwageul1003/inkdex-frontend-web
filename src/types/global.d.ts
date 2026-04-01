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
  data: T[];
  message: string;
  error: null | string;
}

export interface IResponseDetail<T> {
  code: number;
  data: T;
  message: string;
  error: null | string;
}

export type TInfiniteListResult<T> = {
  content: T[];
  paging: IResponsePaged<T>['data']['paging'];
};
