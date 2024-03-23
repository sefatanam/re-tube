import { Injectable, isDevMode } from '@angular/core';
import { RxDatabase, RxJsonSchema, addRxPlugin, createRxDatabase } from 'rxdb';

import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { BehaviorSubject } from 'rxjs';
import { VideoInfoResponse } from "@interface/video-info.interface";
import { environment } from 'environments/environment.dev';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
export type RxDbCollectionType = "private" | "public";
// Create Collection
const videoInfoSchema: RxJsonSchema<VideoInfoResponse> = {
    version: 0,
    primaryKey: "videoId",
    type: 'object',
    properties: {
        videoId: {
            type: 'string',
            maxLength: 200
        },
        title: {
            type: 'string',
        }
    },
    required: ['videoId', 'title']
}


@Injectable({ providedIn: 'root' })
export class RxdbProviderService {

    public rxDatabase !: RxDatabase;
    private rxDatabaseReadySubject = new BehaviorSubject<boolean>(false);
    public rxDatabaseReady$ = this.rxDatabaseReadySubject.asObservable();


    public async intiRxDatabase(databaseName: string): Promise<RxDatabase> {
        if (this.rxDatabase && this.rxDatabase.name === databaseName && !this.rxDatabase.destroyed) {
            return this.rxDatabase;
        }

        await this.createRxDatabase(databaseName);
        this.rxDatabaseReadySubject.next(true);
        return this.rxDatabase;
    }


    private async createRxDatabase(databaseName: string) {
        this.rxDatabase = await createRxDatabase({
            name: databaseName,
            storage: getRxStorageDexie(),
            password: environment.firebaseConfig.appId
        })

        if (isDevMode()) {
            addRxPlugin(RxDBDevModePlugin);
        }
        addRxPlugin(RxDBCleanupPlugin);
        addRxPlugin(RxDBLeaderElectionPlugin);

        await this.rxDatabase.addCollections({
            public: {
                schema: videoInfoSchema,
            },
            private: {
                schema: videoInfoSchema
            }
        })
    }

    public getDatabaseCollection(collectionName: RxDbCollectionType) {
        /* if (!this.rxDatabase) {
            throw new Error(
                'Database is not initialized. Please make sure the database is initialized before getting the collection',
            );
        } */
        return this.rxDatabase[collectionName];
    }

}