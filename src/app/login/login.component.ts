import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MihttpService } from '../mihttp.service';
import { environment } from '../enviroments/enviroment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable()
export class LoginComponent {

  error: String

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

  public login(nombre: string, contraseña: string) {
    const url = environment.APIurl+"usuarios/login"
    var datos = {
      correo: nombre,
      contraseña: contraseña
    }

    return this.http.login(datos).subscribe({
      next: (data: any) => {
        this.error = ""
        localStorage.setItem("jwt", JSON.parse(JSON.stringify(data)))
        this.router.navigate(["/inicio"])
      },
      error: (error: any) => {
        console.log(error)
        this.error = JSON.parse(JSON.stringify(error)).error.text
        
      }
    });
  }
}