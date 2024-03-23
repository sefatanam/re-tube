/* import Dexie, { Table } from 'dexie';
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

  }
}
export const db = new AppDB()
 */