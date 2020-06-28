import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DevicewiseAuthService, DevicewiseApiService } from 'devicewise-angular';
import { map, tap, catchError, timeout } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private dwAuth: DevicewiseAuthService,
    private dwApi: DevicewiseApiService,
    private router: Router
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.dwAuth.easyLogin(this.dwApi.getEndpoint(), null, null).pipe(
      timeout(5000),
      map((loginResponse) => loginResponse.success),
      tap((success) => success === true ? null : this.router.navigate(['/login'])),
      catchError(() => this.router.navigate(['/login']))
    )
  }

}
