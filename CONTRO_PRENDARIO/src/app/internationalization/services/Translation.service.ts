import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    translate.addLangs(['es', 'en', 'pt']); 
    translate.setDefaultLang('es');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}