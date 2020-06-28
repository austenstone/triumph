import { Component } from '@angular/core';
import { DevicewiseAuthService, DevicewiseApiService } from 'devicewise-angular';
import { StorageService } from "./storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'triumph';
  constructor(
    private dwApi: DevicewiseApiService,
    private storage: StorageService
  ) {
    const node = this.storage.getLastUsedNode();
    if (node?.dwNodeAddr) {
      this.dwApi.setEndpoint(this.storage.getLastUsedNode()?.dwNodeAddr);
    }
  }
}
