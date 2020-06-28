import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  readonly snackBarConfig: MatSnackBarConfig = { duration: 5000 };

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  open(message: string, action?: string) {
    this._snackBar.open(message, action || `OK`, this.snackBarConfig);
  }

  openSuccess(message: string, action?: string) {
    this._snackBar.open(`${message} ✔️`, action || `OK`, this.snackBarConfig);
  }

  openFailure(message: string, action?: string) {
    this._snackBar.open(`${message} ❌`, action || `OK`, this.snackBarConfig);
  }
}
