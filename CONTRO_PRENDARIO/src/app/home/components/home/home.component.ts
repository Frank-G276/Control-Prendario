import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  private router = inject(Router);

}
