import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { DocumentData, serverTimestamp } from 'firebase/firestore';
import { NewVodRequest, WatchPlatform, VodRequest } from '../types/vod.types';

@Injectable({ providedIn: 'root' })
export class VodService {
  private readonly colName = 'VodRequests';
  private firestore = inject(Firestore);
  private vodsRef = collection(this.firestore, this.colName);

  getVods(): Observable<DocumentData[]> {
    return collectionData(this.vodsRef, { idField: 'id' }).pipe(
      tap((vods) => console.log('All vods:', vods))
    );
  }

  addVod(data: NewVodRequest) {
    return addDoc(this.vodsRef, data);
  }

  updateUser(id: string, data: Partial<{ name: string; age: number }>) {
    return updateDoc(doc(this.firestore, `${this.colName}/${id}`), data);
  }

  deleteUser(id: string) {
    return deleteDoc(doc(this.firestore, `${this.colName}/${id}`));
  }
}
