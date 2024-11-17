import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {
    private document = inject(DOCUMENT);
    private storage = this.document.defaultView?.localStorage;
  
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
  }