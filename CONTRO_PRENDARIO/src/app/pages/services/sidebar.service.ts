import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsed = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.isCollapsed.asObservable();

  toggleSidebar(): void {
    this.isCollapsed.next(!this.isCollapsed.value);
  }

  setSidebarState(state: boolean): void {
    this.isCollapsed.next(state);
  }
}