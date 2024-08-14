import { Component } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { Router } from '@angular/router';
import { environment } from '../enviroments/enviroment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  logeado: boolean = false;
  usuario: any;
  url: string = environment.APIurl;


  constructor(private router: Router, private http: MihttpService) { 

  }

  ngOnInit(): void {
    if(localStorage.getItem('jwt') != null){
      this.logeado = true;
    }
    this.http.getUserData().subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.usuario.foto = this.url + this.usuario.foto
        console.log(this.usuario.foto);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(["/inicio"])
    window.location.reload()
  }
}
