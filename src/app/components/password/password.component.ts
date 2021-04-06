import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { PasswordService } from '../../services/password/password.service';
import { GeneratedPassword } from '../../models/GeneratedPassword';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, startWith, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  readonly passwords: Observable<ReadonlyArray<string>>;
  error: string = '';
  passwordOptions = this.fb.group({
    limit: [
      1,
      [Validators.required, Validators.min(1), this.numberValidator()],
    ],
    length: [15, [Validators.min(8), Validators.max(32)]],
    hasNumbers: [true],
    hasUpperCase: [true],
    hasSymbols: [true],
  });

  constructor(
    private passwordService: PasswordService,
    private fb: FormBuilder
  ) {
    this.passwords = this.passwordOptions.valueChanges.pipe(
      startWith(this.onGenerate),
      debounceTime(500),
      switchMap(() => this.onGenerate())
    );
  }

  onGenerate(): Observable<string[]> {
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
          catchError((err: HttpErrorResponse) => {
            this.error = err.error.message;
            return [];
          })
        );
    }
    return of([]);
  }
  get passwordOptionsControl() {
    return this.passwordOptions.controls;
  }
  get length() {
    return this.passwordOptions.get('length');
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null;
      }
      return Number(control.value.toString()) ? null : { invalidNumber: true };
    };
  }
}
