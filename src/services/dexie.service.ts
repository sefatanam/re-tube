import { Injectable } from '@angular/core';
import { db } from "../indexDB/db";

// TODO: Will be removed all ts-ignores comment
@Injectable({
  providedIn: 'root'
})
export class DexieService {

  private async openDatabase() {
    return await db.open();
  }

  async countItems(tableName: string): Promise<number> {
    //@ts-ignore
    return await this.openDatabase().then(() => db[tableName]?.count());
  }

  async getItems<T>(tableName: string): Promise<T[]> {
    //@ts-ignore
    return await this.openDatabase().then(() => db[tableName]?.toArray());
  }

  async blukAdd<T>(tableName: string, items: T[]): Promise<void> {
    return await this.openDatabase().then(async () => {
      // @ts-ignore
      await db[tableName]?.bulkAdd(items);
    });
  }

  async clearTable(tableName: string): Promise<void> {
    return await this.openDatabase().then(async () => {
      // @ts-ignore
      await db[tableName]?.clear();

    });
  }
}
