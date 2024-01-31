import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, query, where, onSnapshot } from '@angular/fire/firestore';
import { VideoInfo } from "@interface/video-info.interface";
import { from, Observable, switchMap, tap } from "rxjs";
import { YoutubeUtil } from "@utils/youtube.util";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;
import { DexieService } from './dexie.service';

const COLLECTION_NAME = 'videos';
const DEXIE_TABLE = 'videos';


@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  firestore: Firestore = inject(Firestore);
  youtubeUtil = inject(YoutubeUtil);
  dexieService = inject(DexieService);
  private destroyVideosSnapshot !: Unsubscribe;

  async videosRealtimeUpdateInit() {
    const q = query(collection(this.firestore, COLLECTION_NAME));
    onSnapshot(q, async (snapshot) => {
      if (snapshot.docs.length > await this.dexieService.countItems('videos')) {
        this.dexieService.clearTable('video')
        this.getVideos();
      }
    });
  }

  getVideos(): Observable<VideoInfo[]> {
    return from(this.dexieService.countItems(DEXIE_TABLE)).pipe(
      switchMap((count) => {
        if (count > 0) {
          return from(this.dexieService.getItems<VideoInfo>(DEXIE_TABLE));
        } else {
          const aCollection = collection(this.firestore, COLLECTION_NAME);
          return collectionData(aCollection) as Observable<VideoInfo[]>;
        }
      }),
      tap(async (videos) => {
        await this.dexieService.clearTable(DEXIE_TABLE);
        if (Array.isArray(videos)) {
          await this.dexieService.blukAdd(DEXIE_TABLE, videos);
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
      .finally(async () => await this.dexieService.clearTable(DEXIE_TABLE));
  }

}
