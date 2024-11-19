import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private storage: Storage | null = null;
  

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = this.document.defaultView?.localStorage || null;
    }
  }

  setItem(key: string, value: string): void {
    if (this.storage) {
      this.storage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.storage) {
      return this.storage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.storage) {
      this.storage.removeItem(key);
    }
  }

  clear(): void {
    if (this.storage) {
      this.storage.clear();
    }
  }

  isAvailable(): boolean {
    return this.storage !== null;
  }
}