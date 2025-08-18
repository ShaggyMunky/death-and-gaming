import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Observable, Subscription } from 'rxjs';

import { CountDoc } from '../../models/public-stats.types';

import { PublicStatsService } from '../../services/public-stats.service';
import { VodService } from '../../services/vod.service';

@Component({
  standalone: true,
  selector: 'app-vod-queue',
  templateUrl: './vod-queue.component.html',
  styleUrl: './vod-queue.component.scss',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule],
})
export class VodQueueComponent implements OnInit, OnDestroy {
  private readonly publicStats = inject(PublicStatsService);
  private readonly vodService = inject(VodService);
  private remainingSignupSub!: Subscription;
  protected remainingSignup: number | null = null;

  readonly vods$ = this.vodService.getAdminVods();

  ngOnInit(): void {
    this.remainingSignupSub = this.publicStats.remainingSignup$.subscribe(
      (value) => {
        if (typeof value === 'number') {
          this.remainingSignup = value;
        } else {
          this.remainingSignup = 0;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.remainingSignupSub) {
      this.remainingSignupSub.unsubscribe();
    }
  }

  get activeCount$(): Observable<CountDoc | undefined> {
    return this.publicStats.paidSignupsCount$;
  }

  get pendingCount$(): Observable<CountDoc | undefined> {
    return this.publicStats.pendingSignupsCount$;
  }

  get remainingCount$(): Observable<number | undefined> {
    return this.publicStats.remainingSignup$;
  }

  setPillStatus() {
    if (this.remainingSignup !== null) {
      return {
        success: this.remainingSignup > 0,
        error: this.remainingSignup <= 0,
      };
    }
    return '';
  }
}
