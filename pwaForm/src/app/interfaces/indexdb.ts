import { DBSchema } from 'idb';

export interface MyDB extends DBSchema {
  'user-store': {
    key: string;
    value: string;
  };
}
