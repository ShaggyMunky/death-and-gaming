import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VodService } from './services/vod.service';
import { NewVodRequest, WatchPlatform } from './types/vod.types';
import { serverTimestamp } from '@angular/fire/firestore';
import { VodSignupComponent } from './components/vod-signup/vod-signup.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VodSignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Death and Gaming';
  links = [{ title: 'Live VOD Review Sign-up', link: 'https://angular.dev' }];

  vodService = inject(VodService);
  // vods$ = this.vodService.getVods().subscribe();

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
