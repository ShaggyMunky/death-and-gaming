import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/configs/app.config';
import { AppComponent } from './app/app.component';

import { provideAnimations } from '@angular/platform-browser/animations';

// import { setLogLevel } from 'firebase/firestore';
// setLogLevel('debug');

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
