import { Component } from '@angular/core';
import { TranslationService } from '../../services/Translation.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lenguage-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './lenguage-selector.component.html',
  styleUrl: './lenguage-selector.component.css'
})
export class LenguageSelectorComponent {

  constructor(private translationService: TranslationService) {}

  switchLang(lang: string) {
    this.translationService.switchLang(lang);
  }

}
