import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { PasswordService } from '../../services/password/password.service';
import { InputValidationService } from '../../services/inputValidation/inputValidation.service';
import { GeneratedPassword } from '../../models/GeneratedPassword';
import { PasswordState } from '../../models/PasswordState';
import { Observable, of, interval } from 'rxjs';
import {
  switchMap,
  debounceTime,
  startWith,
  catchError,
  retryWhen,
} from 'rxjs/operators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  readonly componentState: Observable<PasswordState>;
  passwordOptions: FormGroup = this.fb.group({
    limit: [
      1,
      [
        Validators.required,
        Validators.min(1),
        this.validationService.numberValidator(),
      ],
    ],
    length: [15, [Validators.min(8), Validators.max(32)]],
    hasNumbers: [true],
    hasUpperCase: [true],
    hasSymbols: [true],
  });

  constructor(
    private passwordService: PasswordService,
    private fb: FormBuilder,
    private validationService: InputValidationService
  ) {
    this.componentState = this.passwordOptions.valueChanges.pipe(
      debounceTime(500),
      startWith(this.onGenerate),
      switchMap(() => this.onGenerate()),
      startWith({ passwords: ['Your password is coming'], state: 'LOADING' })
    );
  }

  onGenerate(): Observable<PasswordState> {
    const {
      limit,
      length,
      hasNumbers,
      hasUpperCase,
      hasSymbols,
    } = this.passwordOptions.value;
    if (this.passwordOptions.valid) {
      return this.passwordService
        .getPassword(limit, length, hasNumbers, hasUpperCase, hasSymbols)
        .pipe(
          catchError((err: Error) => {
            return of({
              passwords: [],
              errorMessage: err.message,
              state: 'ERROR',
            });
          })
        );
    }
    return of({
      passwords: [],
      errorMessage: 'Invalid inputs',
      state: 'ERROR',
    });
  }
  get passwordOptionsControl() {
    return this.passwordOptions.controls;
  }
  get length() {
    return this.passwordOptions.get('length');
  }
}
