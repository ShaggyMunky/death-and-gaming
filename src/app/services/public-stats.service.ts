import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { CountDoc } from '../models/public-stats.types';
import { countConverter } from '../helpers/firestore.converters';

@Injectable({ providedIn: 'root' })
export class PublicStatsService {
  private firestore = inject(Firestore);

  public signupLimit$: Observable<CountDoc | undefined>;
  public paidSignupsCount$: Observable<CountDoc | undefined>;
  public pendingSignupsCount$: Observable<CountDoc | undefined>;
  public remainingSignup$: Observable<number>;

  constructor() {
    const signupLimitDocRef = doc(
      this.firestore,
      'app_settings',
      'signup_limit'
    ).withConverter(countConverter);
    this.signupLimit$ = docData(signupLimitDocRef).pipe(shareReplay(1));

    const paidSignupsDocRef = doc(
      this.firestore,
      'public_stats',
      'paid_signups'
    ).withConverter(countConverter);
    this.paidSignupsCount$ = docData<CountDoc>(paidSignupsDocRef).pipe(
      shareReplay(1)
    );

    const pendingSignupsDocRef = doc(
      this.firestore,
      'public_stats',
      'pending_signups'
    ).withConverter(countConverter);
    this.pendingSignupsCount$ = docData(pendingSignupsDocRef).pipe(
      shareReplay(1)
    );

    this.remainingSignup$ = combineLatest([
      this.paidSignupsCount$.pipe(startWith(undefined)),
      this.signupLimit$.pipe(startWith(undefined)),
    ]).pipe(
      map(([paidData, limitData]) => {
        if (
          paidData &&
          paidData.count !== undefined &&
          limitData &&
          limitData !== undefined
        ) {
          return limitData.count - paidData.count;
        }

        return 0;
      })
    );
  }
}
