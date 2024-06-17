import { User } from "@prisma/client";

export interface LoginResponse {
  user: Omit<User, 'password'>, 
  token: string
}

export enum UserStatus {
  'Active',
  'Inactive'
}


export enum WorkType {
  'Rackbuild',
  'Engineering',
  'Programming',
  'CAD'
}
export interface O365LoginResponse {
  user: Omit<User, 'password'>, 
  token: string
}
