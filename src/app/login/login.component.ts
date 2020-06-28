import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DevicewiseAuthService } from 'devicewise-angular';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../snackbar.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('admin'),
    password: new FormControl('admin'),
    nodeAddress: new FormControl('http://localhost:8081'),
  });

  constructor(
    private dwAuth: DevicewiseAuthService,
    private router: Router,
    private snackBarService: SnackbarService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    const nodeAddress = this.storageService.getLastUsedNode();
    if (nodeAddress) {
      this.loginForm.get('nodeAddress').setValue(nodeAddress.dwNodeAddr);
    }
  }

  onLogin() {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    const nodeAddress = this.loginForm.get('nodeAddress').value;
    this.dwAuth.login(nodeAddress, username, password).subscribe({
      next: (loginResult) => {
        if (loginResult.success) {
          this.storageService.storeLastUsedNode({ dwNodeAddr: nodeAddress });
          this.snackBarService.openSuccess('Login Successful');
          this.router.navigate(['/reports']);
        }
      },
      error: (message) => {
        this.snackBarService.openFailure(message)
      }
    });
  }
}
