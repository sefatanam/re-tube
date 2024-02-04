import Dexie, { Table } from 'dexie';
import { VideoInfoResponse } from "@interface/video-info.interface";
export class AppDB extends Dexie {
  publicVideos!: Table<VideoInfoResponse, "title">;
  privateVideos!: Table<VideoInfoResponse, "title">;

  constructor() {
    super('ReTube');
    this.version(1).stores({
      publicVideos: 'title',
      privateVideos: 'title'
    })

    /*     this.open()
          .then(() => console.log('Opened'))
          .catch((err) => console.error(err))
          .finally(() => {
            if (this.isOpen()) {
              console.log('Connected to IndexDB');
            } else {
              console.log('IndexDB instance error');
            }
          }); */
  }
}
export const db = new AppDB()
