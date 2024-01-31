import { Injectable } from '@angular/core';
import { db } from "../indexDB/db";

@Injectable({
  providedIn: 'root'
})
export class DexieService {

  private async openDatabase() {
    return db.open();
  }

  async countItems(tableName: string): Promise<number> {
    return this.openDatabase().then(() => db.table(tableName).count());
  }

  async getItems<T>(tableName: string): Promise<T[]> {
    return this.openDatabase().then(() => db.table(tableName).toArray());
  }

  async blukAdd<T>(tableName: string, items: T[]): Promise<void> {
    return this.openDatabase().then(async () => {
      await db.table(tableName).bulkAdd(items);
    });
  }

  async clearTable(tableName: string): Promise<void> {
    return this.openDatabase().then(async () => {
      await db.table(tableName).clear();
    });
  }
}
