
import { addDoc } from 'firebase/firestore';
import { collection, collectionData, doc, Firestore, setDoc, query, where, onSnapshot } from '@angular/fire/firestore';
import { from, Observable, switchMap, tap, map } from "rxjs";
import { inject, Injectable } from '@angular/core';
import { RxdbProviderService, RxDbCollectionType } from './rxdb.service';
import { VideoInfo, VideoInfoResponse } from "@interface/video-info.interface";
import { YoutubeUtil } from "@utils/youtube.util";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;

const COLLECTION_NAME = 'videos';
// type VideoDBType = 'publicVideos' | 'privateVideos';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private destroyVideosSnapshot !: Unsubscribe;

  firestore: Firestore = inject(Firestore);
  youtubeUtil = inject(YoutubeUtil);
  private rxdbProvider = inject(RxdbProviderService);


  async videosRealtimeUpdateInit() {
    const q = query(collection(this.firestore, COLLECTION_NAME));
    onSnapshot(q, async (snapshot) => {
      if (snapshot.docs.length > await this.countVideos('public')) {
        this.clearCache('public');
        this.getVideos(COLLECTION_NAME, 'public');
      }
    });
  }

  getVideos(collectioName: string, dbType: RxDbCollectionType): Observable<VideoInfoResponse[]> {
    return from(this.countVideos(dbType)).pipe(
      switchMap((count) => {
        if (count > 0) {
          return from(this.getCacheVideos(dbType));
        } else {
          const aCollection = collection(this.firestore, collectioName);
          return (collectionData(aCollection) as Observable<VideoInfo[]>).pipe(
            map((response: VideoInfo[]) => response.map((d) => ({ videoId: d.videoId, title: d.title })))
          );
        }
      }),
      tap(async (videos) => {
        await this.clearCache(dbType);
        if (Array.isArray(videos)) {
          await this.addVideosToCache(videos, dbType);
        }
      })
    );
  }


  videoRealtimeUpdateDestroy() {
    this.destroyVideosSnapshot()
  }

  async saveVideo(videoInfo: VideoInfo, collectionName: string): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    await addDoc(collectionRef, videoInfo);
  }

  private async countVideos(dbType: RxDbCollectionType): Promise<number> {
    /* return db.open().then(() => {
      return db[dbType].count();
    }).catch((error: any) => {
      console.warn(error)
      db.delete();
      return 0;
    }) */

    return (await this.rxdbProvider.getDatabaseCollection(dbType).find().exec()).length;

  }

  private async getCacheVideos(dbType: RxDbCollectionType) {
    /* return db.open().then(() => {
      return db[dbType].toArray();
    }) */
    return (await this.rxdbProvider.getDatabaseCollection(dbType).find().exec());
  }

  private async addVideosToCache(videos: VideoInfoResponse[], dbType: RxDbCollectionType) {
    /* return db.open().then(async () => {
      await db[dbType].bulkAdd(videos);
    }) */
    return (await this.rxdbProvider.getDatabaseCollection(dbType).bulkInsert(videos));
  }

  async clearCache(dbType: RxDbCollectionType) {
    /* return db.open().then(async () => {
      await db[dbType].clear()
    }).catch((error: any) => {
      console.warn(error);
      db.delete()
    }) */

    return (await this.rxdbProvider.getDatabaseCollection(dbType).cleanup());
  }
}
