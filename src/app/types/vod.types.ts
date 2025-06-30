import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface VodRequest {
  id: string; // comes from Firestore doc metadata
  StreamName: string;
  Ign: string;
  GamePlatform: string;
  IsLiveCoach: boolean;
  IsComplete: boolean;
  RequestDate: Timestamp;
  ReplayId: number;
  WatchPlatform: WatchPlatform;
  IsPaid: boolean;
  Description: string;
}

export interface NewVodRequest extends Omit<VodRequest, 'id' | 'RequestDate'> {
  RequestDate: Timestamp | FieldValue;
}

export interface VodRequestForm {
  replayId: number;
  playerName: string;
  gamePlatform: string;
  watchPlatform: WatchPlatform;
  streamName: string;
  isLiveCoach: boolean;
  description: string;
}

export enum WatchPlatform {
  Twitch = 'Twitch',
  YouTube = 'YouTube',
}

export enum GamePlatform {
  Pc = 'PC',
  Playstation = 'Playstation',
  Xbox = 'Xbox',
}
