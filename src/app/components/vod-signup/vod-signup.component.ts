import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormGroup,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  NewVodRequest,
  WatchPlatform,
  VodRequestForm,
  GamePlatform,
  ReviewStatus,
  GameRank,
  RankRequest,
} from '../../types/vod.types';
import { VodService } from '../../services/vod.service';
import { Observable, Subscription } from 'rxjs';
import { PublicStatsService } from '../../services/public-stats.service';

@Component({
  standalone: true,
  selector: 'app-vod-signup',
  templateUrl: './vod-signup.component.html',
  styleUrl: './vod-signup.component.scss',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VodSignupComponent implements OnInit, OnDestroy {
  constructor() {
    this.formData = this.buildFormGroup();
  }

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;
  private remainingSignupSub!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly publicStats = inject(PublicStatsService);
  private readonly vodService = inject(VodService);
  protected readonly watchPlatforms = Object.values(WatchPlatform);
  protected readonly gamePlatforms = Object.values(GamePlatform);
  protected readonly ranks = Object.values(GameRank);
  formData: FormGroup;

  protected ranks$!: Observable<RankRequest[]>;
  protected remainingSignup: number = 0;

  protected readonly replayLength = signal(0);
  protected readonly submitting = signal(false);

  ngOnInit(): void {
    this.ranks$ = this.vodService.getGameRanks();

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

  get remainingSignup$(): Observable<number> {
    return this.publicStats.remainingSignup$;
  }

  onSubmit() {
    if (
      this.remainingSignup > 0 &&
      this.formData.valid &&
      this.formData.value.replayId
    ) {
      this.submitting.set(true);
      const data = this.formData.value as unknown as VodRequestForm;
      const payload: NewVodRequest = {
        replayId: data.replayId,
        ign: data.playerName,
        rank: data.rank,
        gamePlatform: data.gamePlatform,
        watchPlatform: data.watchPlatform,
        chatName: data.chatName,
        isLiveCoach: data.isLiveCoach,
        description: data.description,
        isPaid: false,
        requestDate: serverTimestamp(),
        reviewStatus: ReviewStatus.Pending,
      };
      console.log('Form Submitted', payload);
      setTimeout(() => {
        this.clearForm();
        this.submitting.set(false);
      }, 2000);
    }
  }

  protected onReplayInput(event: Event) {
    this.replayLength.set((event.target as HTMLInputElement).value.length);
  }

  private clearForm() {
    const resetValues = Object.fromEntries(
      Object.entries(this.formFieldConfig).map(([key, config]) => [
        key,
        config.default,
      ])
    );

    this.formDirective.resetForm(resetValues);

    this.replayLength.set(0);
    this.email.reset();
    console.log(this.formData);
  }

  private buildFormGroup(): FormGroup {
    const controls = Object.entries(this.formFieldConfig).reduce(
      (acc, [key, config]) => {
        acc[key] = this.fb.nonNullable.control(
          config.default,
          config.validators
        );
        return acc;
      },
      {} as { [key: string]: AbstractControl }
    );

    return this.fb.group(controls);
  }

  private restoreValidators() {
    for (const [key, config] of Object.entries(this.formFieldConfig)) {
      const control = this.formData.get(key);
      control?.setValidators(config.validators);
      control?.updateValueAndValidity();
    }
  }

  private readonly formFieldConfig: Record<
    string,
    { default: any; validators: ValidatorFn[] }
  > = {
    replayId: {
      default: null,
      validators: [Validators.required, Validators.pattern(/^\d{11}$/)],
    },
    playerName: {
      default: '',
      validators: [Validators.required],
    },
    gamePlatform: {
      default: '',
      validators: [Validators.required],
    },
    rank: {
      default: '',
      validators: [Validators.required],
    },
    watchPlatform: {
      default: '',
      validators: [Validators.required],
    },
    chatName: {
      default: '',
      validators: [Validators.required],
    },
    isLiveCoach: {
      default: false,
      validators: [],
    },
    description: {
      default: '',
      validators: [Validators.required],
    },
  } as const;

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');
}
