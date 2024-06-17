import { Request } from '@nestjs/common'

type ApiResponseSuccess<T> = {
  data: T;
  success: true;
  message?: string;
  count?: number;
};

type ApiResponseFailure = {
  success: false;
  message: string;
};

type StatusResponse<T> = {
  success: boolean;
  message: string;
};

type DataResponse<T> ={
  data: T;
  count?: number;
};

export type AllDataResponse<T> = DataResponse<T> ;
export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseFailure;
export type ApiStatusResponse<T> = StatusResponse<T>;

export interface CustomRequest extends Request {
  user: {
    username: string,
    id: string
  };
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role: string[];
  workType: string;
  updatedAt: Date;
  accessPermissions: Object[];
}

