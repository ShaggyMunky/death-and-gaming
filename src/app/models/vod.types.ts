import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface VodRequest {
  id: string; // comes from Firestore doc metadata
  chatName: string;
  description: string;
  gamePlatform: GamePlatform;
  ign: string;
  isLiveCoach: boolean;
  isPaid: boolean;
  rank: GameRank;
  replayId: number;
  requestDate: Timestamp;
  reviewStatus: ReviewStatus;
  statusTimestamps: StatusTimestamps | null;
  watchPlatform: WatchPlatform;
}

export interface NewVodRequest
  extends Omit<VodRequest, 'id' | 'requestDate' | 'statusTimestamps'> {
  requestDate: Timestamp | FieldValue;
}

export interface VodRequestForm {
  replayId: number;
  playerName: string;
  rank: GameRank;
  gamePlatform: GamePlatform;
  watchPlatform: WatchPlatform;
  chatName: string;
  isLiveCoach: boolean;
  description: string;
}

export interface NamedItem {
  id: string;
  name: string;
  order: number;
}

export interface StatusTimestamps {
  completed: Timestamp | null;
  in_progress: Timestamp | null;
}

export enum ReviewStatus {
  Cancelled = 'cancelled',
  Completed = 'completed',
  InProgress = 'in_progress',
  Pending = 'pending',
}

export enum WatchPlatform {
  Twitch = 'twitch',
  YouTube = 'youtube',
}

export enum GamePlatform {
  Pc = 'pc',
  Playstation = 'playstation',
  Xbox = 'xbox',
}

export enum GameRank {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'plat',
  Diamoond = 'diamond',
  GrandMaster = 'gm',
  Celestial = 'celes',
}
