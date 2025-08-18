import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { NamedItem } from '../models/vod.types';
import { CountDoc } from '../models/public-stats.types';

export const namedItemConverter: FirestoreDataConverter<NamedItem> = {
  toFirestore: (rank: NamedItem): DocumentData => {
    const { id, ...data } = rank;
    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): NamedItem => {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...data } as NamedItem;
  },
};

export const countConverter: FirestoreDataConverter<CountDoc> = {
  toFirestore: (count: CountDoc): DocumentData => {
    return count;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CountDoc => {
    const { id, ...data } = snapshot.data(options);
    return data as CountDoc;
  },
};

export function convertCollection<T>(
  firestore: Firestore,
  collectionType: string,
  converter: FirestoreDataConverter<T>
): CollectionReference<T> {
  return collection(firestore, collectionType).withConverter(converter);
}
