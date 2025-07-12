import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { RankRequest } from '../types/vod.types';
import { CountDoc } from '../types/public-stats.types';

export const rankRequestConverter: FirestoreDataConverter<RankRequest> = {
  toFirestore: (rank: RankRequest): DocumentData => {
    const { id, ...data } = rank;
    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): RankRequest => {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...data } as RankRequest;
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
