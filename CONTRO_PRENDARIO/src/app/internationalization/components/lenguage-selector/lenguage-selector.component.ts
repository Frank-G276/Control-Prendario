import { Component } from '@angular/core';
import { TranslationService } from '../../services/Translation.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lenguage-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './lenguage-selector.component.html',
  styleUrl: './lenguage-selector.component.css'
})
export class LenguageSelectorComponent  {
  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService
  ) {}

  switchLang(lang: string) {
    this.translationService.switchLang(lang);
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }
}