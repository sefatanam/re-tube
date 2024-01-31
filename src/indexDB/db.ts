import Dexie, { Table } from 'dexie';
import { VideoInfo } from "@interface/video-info.interface";
export class AppDB extends Dexie {
  videos!: Table<VideoInfo, "title">;
  constructor() {
    super('ReTube');
    this.version(1).stores({
      videos: 'title'
    })

    this.open()
      .then(() => console.log('Opened'))
      .catch((err) => console.error(err))
      .finally(() => {
        if (this.isOpen()) {
          console.log('Connected to IndexDB');
        } else {
          console.log('IndexDB instance error');
        }
      });
  }
}
export const db = new AppDB()
