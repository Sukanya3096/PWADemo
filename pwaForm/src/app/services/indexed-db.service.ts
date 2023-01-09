import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { MyDB } from '../interfaces/indexdb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase<MyDB>;

  constructor() {
    this.connectDB();
  }

  async connectDB() {
    this.db = await openDB<MyDB>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('user-store');
      },
    });
  }

  addMessage(obj: any) {
    return this.db.put('user-store', JSON.stringify(obj), obj.email);
  }
}
