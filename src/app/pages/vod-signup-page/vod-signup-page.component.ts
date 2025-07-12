import { Component } from '@angular/core';
import { VodSignupComponent } from '../../components/vod-signup/vod-signup.component';
import { VodQueueComponent } from '../../components/vod-queue/vod-queue.component';

@Component({
  selector: 'app-vod-signup-page',
  templateUrl: './vod-signup-page.component.html',
  styleUrl: './vod-signup-page.component.scss',
  imports: [VodSignupComponent, VodQueueComponent],
})
export class VodSignupPageComponent {}
