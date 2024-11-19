import { Component } from '@angular/core';
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LenguageSelectorComponent } from "../../../internationalization/components/lenguage-selector/lenguage-selector.component";
import { AuthService } from '../../../core/services/auth.service';
import { LogoutButtonComponent } from "../../../pages/components/logout-button/logout-button.component";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [RouterModule, FormsModule, SidebarComponent, HeaderComponent, LenguageSelectorComponent, CommonModule, LogoutButtonComponent],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

}
