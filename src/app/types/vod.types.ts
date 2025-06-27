import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface VodRequest {
  id: string; // comes from Firestore doc metadata
  StreamName: string;
  Ign: string;
  IsLiveCoach: boolean;
  IsComplete: boolean;
  RequestDate: Timestamp;
  ReplayId: number;
  Platform: StreamPlatform;
  IsPaid: boolean;
  Description: string;
}

export interface NewVodRequest extends Omit<VodRequest, 'id' | 'RequestDate'> {
  RequestDate: Timestamp | FieldValue;
}

export enum StreamPlatform {
  Twitch = 'Twitch',
  YouTube = 'YouTube',
}
