import { Injectable } from '@angular/core';

export interface ConnectionSettings {
  dwNodeAddr: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  static readonly lastUsedNodeKey = 'last-used-node';

  constructor() { }

  storeLastUsedNode(connectionSettings: ConnectionSettings) {
    try {
      window.localStorage[StorageService.lastUsedNodeKey] = JSON.stringify(connectionSettings);
    } catch { }
  }

  getLastUsedNode(): ConnectionSettings | null {
    try {
      return JSON.parse(window.localStorage[StorageService.lastUsedNodeKey]) || null;
    } catch {
      return null;
    }
  }
}
