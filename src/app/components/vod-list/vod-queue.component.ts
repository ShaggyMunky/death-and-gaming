import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'app-vod-queue',
  templateUrl: './vod-queue.component.html',
  styleUrl: './vod-queue.component.scss',
  imports: [MatCardModule, MatDividerModule],
})
export class VodQueueComponent {}
