import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VodService } from './services/vod.service';
import { NewVodRequest, WatchPlatform } from './types/vod.types';
import { serverTimestamp } from '@angular/fire/firestore';
import { VodSignupPageComponent } from './pages/vod-signup-page/vod-signup-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VodSignupPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  links = [{ title: 'Live VOD Review Sign-up', link: 'https://angular.dev' }];

  ngOnInit(): void {
    // const data: NewVodRequest = {
    //   StreamName: 'you tube name',
    //   Ign: 'user name',
    //   IsLiveCoach: true,
    //   IsComplete: false,
    //   RequestDate: serverTimestamp(),
    //   ReplayId: 10929809,
    //   Platform: WatchPlatform.YouTube,
    //   IsPaid: true,
    //   Description: 'I suck',
    // };
    // this.vodService
    //   .addVod(data)
    //   .then((docRef) => console.log('VOD added with ID: ', docRef.id))
    //   .catch((err) => console.error('Error adding VOD: ', err));
  }
}
