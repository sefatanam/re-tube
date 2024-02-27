import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, query, where, onSnapshot } from '@angular/fire/firestore';
import { VideoInfo, VideoInfoResponse } from "@interface/video-info.interface";
import { from, Observable, switchMap, tap, map } from "rxjs";
import { YoutubeUtil } from "@utils/youtube.util";
import { db } from "../indexDB/db";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;
import { addDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'videos';
type VideoDBType = 'publicVideos' | 'privateVideos';
@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  firestore: Firestore = inject(Firestore);
  youtubeUtil = inject(YoutubeUtil);
  private destroyVideosSnapshot !: Unsubscribe;

  async videosRealtimeUpdateInit() {
    const q = query(collection(this.firestore, COLLECTION_NAME));
    onSnapshot(q, async (snapshot) => {
      if (snapshot.docs.length > await this.countVideos('publicVideos')) {
        this.clearCache('publicVideos');
        this.getVideos(COLLECTION_NAME, 'publicVideos');
      }
    });
  }

  getVideos(collectioName: string, dbType: VideoDBType): Observable<VideoInfoResponse[]> {
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

  private async countVideos(dbType: VideoDBType): Promise<number> {
    return db.open().then(() => {
      return db[dbType].count();
    }).catch((error: any) => {
      console.warn(error)
      db.delete();
      return 0;
    })

  }

  private async getCacheVideos(dbType: VideoDBType) {
    return db.open().then(() => {
      return db[dbType].toArray();
    })
  }

  private async addVideosToCache(videos: VideoInfoResponse[], dbType: VideoDBType) {
    return db.open().then(async () => {
      await db[dbType].bulkAdd(videos);
    })
  }

  async clearCache(dbType: VideoDBType) {
    return db.open().then(async () => {
      await db[dbType].clear()
    }).catch((error: any) => {
      console.warn(error);
      db.delete()
    })
  }
}
