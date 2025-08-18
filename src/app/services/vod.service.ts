import { Injectable, NgZone, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  FirestoreDataConverter,
  CollectionReference,
} from '@angular/fire/firestore';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { DocumentData, serverTimestamp } from '@angular/fire/firestore';
import {
  NewVodRequest,
  WatchPlatform,
  VodRequest,
  NamedItem,
} from '../models/vod.types';
import {
  convertCollection,
  namedItemConverter,
} from '../helpers/firestore.converters';

@Injectable({ providedIn: 'root' })
export class VodService {
  private readonly vodCollection = 'vod_requests';
  private readonly rankCollection = 'vod_request_ranks';
  private readonly watchCollection = 'watch_platforms';
  private readonly gameCollection = 'game_platforms';
  private firestore: Firestore;
  private vodsRef;
  private rankRef;
  private watchRef;
  private gameRef;

  public gameRanks$?: Observable<NamedItem[]>;
  public watchPlatforms$?: Observable<NamedItem[]>;
  public gamePlatforms$?: Observable<NamedItem[]>;

  constructor() {
    this.firestore = inject(Firestore);
    this.vodsRef = collection(this.firestore, this.vodCollection);
    this.rankRef = convertCollection(
      this.firestore,
      this.rankCollection,
      namedItemConverter
    );
    this.watchRef = convertCollection(
      this.firestore,
      this.watchCollection,
      namedItemConverter
    );
    this.gameRef = convertCollection(
      this.firestore,
      this.gameCollection,
      namedItemConverter
    );
  }

  getPublicVods(): Observable<Partial<DocumentData[]>> {
    return collectionData(this.vodsRef, { idField: 'id' }).pipe(
      map((vods) =>
        vods.map((vod) => ({
          id: vod['id'],
          chatName: vod['chatName'],
          watchPlatform: vod['watchPlatform'],
        }))
      ),
      tap((vods) => console.log('All public vods:', vods))
    );
  }

  getAdminVods(): Observable<DocumentData[]> {
    return collectionData(this.vodsRef, { idField: 'id' }).pipe(
      tap((vods) => console.log('All admin vods:', vods))
    );
  }

  addVod(data: NewVodRequest) {
    return addDoc(this.vodsRef, data);
  }

  updateUser(id: string, data: Partial<{ name: string; age: number }>) {
    return updateDoc(doc(this.firestore, `${this.vodCollection}/${id}`), data);
  }

  deleteUser(id: string) {
    return deleteDoc(doc(this.firestore, `${this.vodCollection}/${id}`));
  }

  // getGameRanks(): Observable<RankRequest[]> {
  //   return collectionData<RankRequest>(this.rankRef, { idField: 'id' }).pipe(
  //     map((ranks: RankRequest[]) => {
  //       return ranks.sort((a, b) => a.order - b.order);
  //     })
  //   );
  // }

  initGameRanks(): void {
    if (!this.gameRanks$) {
      this.gameRanks$ = collectionData<NamedItem>(this.rankRef, {
        idField: 'id',
      }).pipe(
        map((ranks: NamedItem[]) => ranks.sort((a, b) => a.order - b.order)),
        shareReplay(1)
      );
    }
  }

  initWatchPlatforms(): void {
    if (!this.watchPlatforms$) {
      this.watchPlatforms$ = collectionData<NamedItem>(this.watchRef, {
        idField: 'id',
      }).pipe(
        map((wp: NamedItem[]) => wp.sort((a, b) => a.order - b.order)),
        shareReplay(1)
      );
    }
  }

  initGamePlatforms(): void {
    if (!this.gamePlatforms$) {
      this.gamePlatforms$ = collectionData<NamedItem>(this.gameRef, {
        idField: 'id',
      }).pipe(
        map((g: NamedItem[]) => g.sort((a, b) => a.order - b.order)),
        tap((a) => {
          console.log(a);
        }),
        shareReplay(1)
      );
    }
  }
}
