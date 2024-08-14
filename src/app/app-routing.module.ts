import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdopcionComponent } from './adopcion/adopcion.component';
import { ExtravioComponent } from './extravio/extravio.component';
import { MercadoComponent } from './mercado/mercado.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PublicacionComponent } from './publicacion/publicacion.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [{
  path: "registro",
  component: RegistroComponent,
  title: "Registro"
},{
  path: "login",
  component: LoginComponent,
  title: "Inicio de sesion"
},{
  path: "inicio",
  component: InicioComponent,
  title: "Inicio"
},
{
  path: "adopcion",
  component: AdopcionComponent,
  title: "Adopcion"
},
{
  path: "extravio",
  component: ExtravioComponent,
  title: "Mascotas perdidas"
},
{
  path: "mercado",
  component: MercadoComponent,
  title: "Compra y venta"
},
{
    path: 'usuario',
    component: UsuarioComponent,
    title: 'Vos'
},
{
  path: "publicacion/:id",
  component: PublicacionComponent,
  title: "Publicacion"
},{
  path: "chat",
  component: ChatComponent
},
{
  path: "**",
  component: InicioComponent
}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
