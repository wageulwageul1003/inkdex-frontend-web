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

// 리스트 형태의 응답
export interface IResponse<T> {
  code: number;
  data: T[];
  message: string;
  error: null | string;
}

// 상세 형태의 응답
export interface IResponseDetail<T> {
  code: number;
  data: T;
  message: string;
  error: null | string;
}

// 페이징 또는 무한 스크롤용 응답
export type TInfiniteListResult<T> = {
  content: T[];
  paging: IResponsePaged<T>['data']['paging'];
};
