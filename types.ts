export interface User {
  id: string;
  nis: string;
  fullName: string;
  class: string;
}

export type Page = 'login' | 'dashboard' | 'upload';

export enum AttendanceType {
  MASUK = 'masuk',
  PULANG = 'pulang',
}