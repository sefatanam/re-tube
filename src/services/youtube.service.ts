import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, query, where, onSnapshot } from '@angular/fire/firestore';
import { VideoInfo } from "@interface/video-info.interface";
import { from, Observable, switchMap, tap } from "rxjs";
import { YoutubeUtil } from "@utils/youtube.util";
import { db } from "../indexDB/db";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;

const COLLECTION_NAME = 'videos';

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
      if (snapshot.docs.length > await this.countVideos()) {
        this.clearCache();
        this.getVideos();
      }
    });
  }

  getVideos(): Observable<VideoInfo[]> {
    return from(this.countVideos()).pipe(
      switchMap((count) => {
        if (count > 0) {
          return from(this.getCacheVideos());
        } else {
          const aCollection = collection(this.firestore, COLLECTION_NAME);
          return collectionData(aCollection) as Observable<VideoInfo[]>;
        }
      }),
      tap(async (videos) => {
        await this.clearCache();
        if (Array.isArray(videos)) {
          await this.addVideosToCache(videos);
        }
      })
    );
  }

  videoRealtimeUpdateDestroy() {
    this.destroyVideosSnapshot()
  }

  async saveVideo(videoInfo: VideoInfo) {
    const docId = this.youtubeUtil.generateVideoInfoId(videoInfo);
    await setDoc(doc(this.firestore, COLLECTION_NAME, docId), videoInfo)
  }

  private async countVideos() {
    return db.open().then(() => {
      return db.videos.count();
    })

  }

  private async getCacheVideos() {
    return db.open().then(() => {
      return db.videos.toArray();
    })

  }

  private async addVideosToCache(videos: VideoInfo[]) {
    return db.open().then(async () => {
      await db.videos.bulkAdd(videos);
    })
  }

  private async clearCache() {
    return db.open().then(async () => {
      await db.videos.clear()
    })
  }
}
