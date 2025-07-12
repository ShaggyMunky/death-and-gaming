import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface VodRequest {
  id: string; // comes from Firestore doc metadata
  chatName: string;
  ign: string;
  gamePlatform: GamePlatform;
  isLiveCoach: boolean;
  requestDate: Timestamp;
  replayId: number;
  watchPlatform: WatchPlatform;
  isPaid: boolean;
  description: string;
  rank: GameRank;
  reviewStatus: ReviewStatus;
}

export interface NewVodRequest extends Omit<VodRequest, 'id' | 'requestDate'> {
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

export interface RankRequest {
  id: string;
  name: string;
  order: number;
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
