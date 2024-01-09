import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {VideoInfo} from "@interface/video-info.interface";
import {Observable, tap} from "rxjs";
import {YoutubeUtil} from "@utils/youtube.util";

const COLLECTION_NAME = 'videos';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  firestore: Firestore = inject(Firestore);
  youtubeUtil = inject(YoutubeUtil)

  getVideos() {
    const aCollection = collection(this.firestore, COLLECTION_NAME);
    return collectionData(aCollection) as Observable<VideoInfo[]>;
  }

  async saveVideo(videoInfo: VideoInfo) {
    const docId = this.youtubeUtil.generateVideoInfoId(videoInfo);
    await setDoc(doc(this.firestore, COLLECTION_NAME, docId), videoInfo);
  }
}
