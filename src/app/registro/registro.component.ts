import { Component } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  error: string;
  constructor(private http: MihttpService, private router: Router) { 
    this.error = ""
  }
  ngOnInit(): void {
    this.http.verificarLogeado().subscribe({
     next: (data: any) => {
       this.router.navigate(["/inicio"])
     },
     error: (error: any) => {
       console.log(error)
     }
   })
 }

  public registro(correo: string, contraseña: string, nombre: string, direccion: string, telefono: string){

    var body = {
      correo: correo,
      contraseña: contraseña,
      nombre: nombre,
      telefono: telefono,
      direccion: direccion
    }

    this.http.registrarse(body).subscribe({
      next: (data: any) => {
        this.router.navigate(["/login"]);
       },
      error: (error: any) => {
        console.log(error);
        this.error = JSON.parse(JSON.stringify(error.error)).text;
      }

    })
    



  }

}
