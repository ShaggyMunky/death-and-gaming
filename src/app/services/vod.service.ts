import { Injectable, NgZone, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { map, Observable, tap } from 'rxjs';
import { DocumentData, serverTimestamp } from '@angular/fire/firestore';
import {
  NewVodRequest,
  WatchPlatform,
  VodRequest,
  RankRequest,
} from '../types/vod.types';
import { rankRequestConverter } from '../helpers/firestore.converters';

@Injectable({ providedIn: 'root' })
export class VodService {
  private readonly vodCollection = 'vod_requests';
  private readonly rankCollection = 'vod_request_ranks';
  private firestore: Firestore;
  private vodsRef;
  private rankRef;

  constructor() {
    this.firestore = inject(Firestore);
    this.vodsRef = collection(this.firestore, this.vodCollection);
    this.rankRef = collection(
      this.firestore,
      this.rankCollection
    ).withConverter(rankRequestConverter);
  }

  getVods(): Observable<DocumentData[]> {
    return collectionData(this.vodsRef, { idField: 'id' }).pipe(
      tap((vods) => console.log('All vods:', vods))
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

  getGameRanks(): Observable<RankRequest[]> {
    return collectionData<RankRequest>(this.rankRef, { idField: 'id' }).pipe(
      map((ranks: RankRequest[]) => {
        return ranks.sort((a, b) => a.order - b.order);
      })
    );
  }
}
