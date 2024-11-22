import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './pages/components/header/header.component';
import { SidebarComponent } from './pages/components/sidebar/sidebar.component';
import { VistaClienteOneComponent } from "./vista-cliente/components/vista-cliente-one/vista-cliente-one.component";
import { ClienteListaComponent } from './clientes/components/cliente-lista/cliente-lista.component';
import { ClienteFormComponent } from './clientes/components/cliente-form/cliente-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LenguageSelectorComponent } from "./internationalization/components/lenguage-selector/lenguage-selector.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, LenguageSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private translate:TranslateService) {
    translate.setDefaultLang('es');
    translate.use('es');
  }
  title = 'CONTROL_PRENDARIO';
  
}
