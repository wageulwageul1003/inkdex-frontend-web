export interface IConstant {
  value: string;
  label: string;
}

export interface IResponsePaged<T> {
  code: number;
  data: {
    content: T[];
    paging: {
      number: number; // 전체 페이지
      page: number; // 현재 페이지
      size: number;
      totalElements: number; // 전체 data 개수
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
