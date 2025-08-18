import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { VodSignupPageComponent } from './pages/vod-signup-page/vod-signup-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  {
    path: 'vod-signup',
    component: VodSignupPageComponent,
    title: 'VOD Signup',
  },
  { path: '**', redirectTo: '' },
];
