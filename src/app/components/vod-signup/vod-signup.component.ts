import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
} from '../../types/vod.types';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VodSignupComponent {
  constructor() {
    this.formData = this.buildFormGroup();
    console.log(this.formData);
  }

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  private fb = inject(FormBuilder);
  protected readonly watchPlatforms = Object.values(WatchPlatform);
  protected readonly gamePlatforms = Object.values(GamePlatform);
  formData: FormGroup;

  protected readonly replayLength = signal(0);
  protected readonly submitting = signal(false);

  onSubmit() {
    if (this.formData.valid && this.formData.value.replayId) {
      this.submitting.set(true);
      const data = this.formData.value as unknown as VodRequestForm;
      const payload: NewVodRequest = {
        ReplayId: data.replayId,
        Ign: data.streamName,
        GamePlatform: data.gamePlatform,
        WatchPlatform: data.watchPlatform,
        StreamName: data.streamName,
        IsLiveCoach: data.isLiveCoach,
        Description: data.description,
        IsComplete: false,
        IsPaid: false,
        RequestDate: serverTimestamp(),
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
    watchPlatform: {
      default: '',
      validators: [Validators.required],
    },
    streamName: {
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
