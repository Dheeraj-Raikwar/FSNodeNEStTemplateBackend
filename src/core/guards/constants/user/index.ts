export enum USER_STATUS {
  CREATED = 'CREATED',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
}

export enum USER_TYPE {
  PE_ADMIN = 'PE_ADMIN',
  PORTCO_USER = 'PORTCO_USER'
}

export enum USER_MESSAGE {
  PASSWORD_CREATED = 'Password created successfully',
  PASSWORD_NOT_CREATED = 'Cannot create password',
  USER_ERROR_NT_FOUND = 'Cannot find user',
  USER_ERROR = "User doesn't exit or account is blocked"
}