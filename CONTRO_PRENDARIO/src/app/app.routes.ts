import { Routes  } from '@angular/router';
import { LoginOneComponent } from './pages/components/login-one/login-one.component';
import { LoginTwoComponent } from './pages/components/login-two/login-two.component';
import { VistaClienteOneComponent } from './pages/components/vista-cliente-one/vista-cliente-one.component';
import { ClienteFormComponent } from './clientes/components/cliente-form/cliente-form.component';
import { ClienteListaComponent } from './clientes/components/cliente-lista/cliente-lista.component';
import { ClienteEditarComponent } from './clientes/components/cliente-editar/cliente-editar.component';
import { HomeComponent } from './home/components/home/home.component';
import { PrestamosListaComponent } from './prestamos/components/prestamos-lista/prestamos-lista.component';
import { PagosListaComponent } from './pagos/components/pagos-lista/pagos-lista.component';
import { MovimientoListaComponent } from './movimientos/components/movimiento-lista/movimiento-lista.component';
import { PrestamosCrearComponent } from './prestamos/components/prestamos-crear/prestamos-crear.component';
import { PrestamosEditarComponent } from './prestamos/components/prestamos-editar/prestamos-editar.component';

export const routes: Routes = [
    {path:'login',component:LoginOneComponent},
    {path:'Administrador', component:LoginTwoComponent},
    {path: "Cliente", component: VistaClienteOneComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: "home", component: HomeComponent},
    {path: "prestamos", component: PrestamosListaComponent},
    {path: "movimientos", component: MovimientoListaComponent},
    {path: "pagos", component: PagosListaComponent},
    {path:'clientes', children: [
        {path:'nuevo', component:ClienteFormComponent},
        {path:'editar/:id', component:ClienteEditarComponent},
        {path: '', component:ClienteListaComponent }
    ]},
    { path: 'prestamos', 
        children: [
            { path: '', component: PrestamosListaComponent },
            { path: 'nuevo', component: PrestamosCrearComponent },
            { path: 'edit/:id', component: PrestamosEditarComponent },
        ]
    }

];
