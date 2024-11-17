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
import { ClienteViewComponent } from './clientes/components/cliente-view/cliente-view.component';
import { PrestamosViewComponent } from './prestamos/components/prestamos-view/prestamos-view.component';
import { PagosCrearComponent } from './pagos/components/pagos-crear/pagos-crear.component';
import { MovimientosCrearComponent } from './movimientos/components/movimiento-crear/movimiento-crear.component';

import { AdminComponent } from './admin/components/admin/admin.component';
import { authGuard } from './core/guards/auth.guard';
import { homeGuard } from './core/guards/home.guard';
import { UsuariosCrearComponent } from './admin/components/usuarios-crear/usuarios-crear.component';
import { ConfiguracionComponent } from './config/components/configuracion/configuracion.component';
import { UsuariosListaComponent } from './admin/components/usuarios-lista/usuarios-lista.component';

export const routes: Routes = [
    {path: "Cliente", component: VistaClienteOneComponent},
    {path: "configuracion", component: ConfiguracionComponent},


    {
      path: '',
      canActivate: [homeGuard],
      component: HomeComponent
    },

    { path: 'login', component: LoginTwoComponent },  

    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },

    {
      path: 'usuarios/crear',
      component: UsuariosCrearComponent,
      canActivate: [authGuard],
      data: { role: 'ADMIN' }
    },

    {
      path: 'usuarios',
      component: UsuariosListaComponent,
      canActivate: [authGuard],
      data: { role: 'ADMIN' }
    },

    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
        data: { role: 'GERENTE' }
    },

    {
        path: 'clientes',
        canActivate: [authGuard],
        data: { role: 'GERENTE' },
        children: [
        { path: '', component: ClienteListaComponent },
        { path: 'nuevo', component: ClienteFormComponent },
        { path: 'editar/:id', component: ClienteEditarComponent },
        { path: 'ver/:id', component: ClienteViewComponent }
    ]
    },

    {
        path: 'prestamos',
        canActivate: [authGuard],
        data: { role: 'GERENTE' },
        children: [
          { path: '', component: PrestamosListaComponent },
          { path: 'nuevo', component: PrestamosCrearComponent },
          { path: 'edit/:id', component: PrestamosEditarComponent },
          { path: 'ver/:id', component: PrestamosViewComponent }
        ]
    },

    {
        path: 'pagos',
        canActivate: [authGuard],
        data: { role: 'GERENTE' },
        children: [
          { path: '', component: PagosListaComponent },
          { path: 'nuevo', component: PagosCrearComponent }
        ]
    },

    {
        path: 'movimientos',
        canActivate: [authGuard],
        data: { role: 'GERENTE' },
        children: [
          { path: '', component: MovimientoListaComponent },
          { path: 'nuevo', component: MovimientosCrearComponent }
        ]
      },

    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },



    {
    path: '**',
    canActivate: [homeGuard],
    component: HomeComponent
    }
];
