import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { VodSignupComponent } from '../../components/vod-signup/vod-signup.component';
import { VodQueueComponent } from '../../components/vod-queue/vod-queue.component';

import { VodService } from '../../services/vod.service';

@Component({
  selector: 'app-vod-signup-page',
  standalone: true,
  templateUrl: './vod-signup-page.component.html',
  styleUrl: './vod-signup-page.component.scss',
  imports: [VodSignupComponent, VodQueueComponent],
})
export class VodSignupPageComponent implements OnInit {
  private readonly vodService = inject(VodService);

  ngOnInit(): void {
    this.vodService.initGameRanks();
    this.vodService.initWatchPlatforms();
    this.vodService.initGamePlatforms();
  }
}
