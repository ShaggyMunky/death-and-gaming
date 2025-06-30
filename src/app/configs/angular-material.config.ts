import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const materialErrorHandling = {
  provide: ErrorStateMatcher,
  useClass: ShowOnDirtyErrorStateMatcher,
};

export const materialFoamAppearance = {
  provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
  useValue: { appearance: 'outline' },
};
