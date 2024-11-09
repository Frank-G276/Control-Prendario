import { Routes  } from '@angular/router';
import { LoginOneComponent } from './pages/login-one/login-one.component';
import { LoginTwoComponent } from './pages/login-two/login-two.component';
import { VistaClienteOneComponent } from './pages/vista-cliente-one/vista-cliente-one.component';
import { ClienteFormComponent } from './clientes/components/cliente-form/cliente-form.component';
import { ClienteListaComponent } from './clientes/components/cliente-lista/cliente-lista.component';
import { ClienteEditarComponent } from './clientes/components/cliente-editar/cliente-editar.component';

export const routes: Routes = [
    {path:'login',component:LoginOneComponent},
    {path:'Administrador', component:LoginTwoComponent},
    {path: "Cliente", component: VistaClienteOneComponent},
    {path: '', redirectTo: '/clientes', pathMatch: 'full' },
    {path:'clientes', children: [
        {path:'nuevo', component:ClienteFormComponent},
        {path:'editar/:id', component:ClienteEditarComponent},
        {path: '', component:ClienteListaComponent }
    ]}

];
