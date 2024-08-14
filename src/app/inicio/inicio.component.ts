import { Component } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../enviroments/enviroment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  logeado: boolean;
  foto: string; 
  usuario: any;
  url: any = environment.APIurl;

  constructor(private http: MihttpService,public sanitizer: DomSanitizer){
    this.logeado=false;
    //@ts-ignore
    this.foto = localStorage.getItem('foto');
  
  }


  ngOnInit(){
    if(localStorage.getItem("jwt") != null){
      this.logeado=true ;
    }
    this.http.getUserData().subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.usuario.foto = this.url + this.usuario.foto
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  
  
  
  cerrarSesion(){
    localStorage.clear();
    window.location.reload()
  }

}
