export interface IConstant {
  value: string;
  label: string;
}

export interface IResponsePaged<T> {
  code: number;
  data: {
    content: T[];
    paging: {
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
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
