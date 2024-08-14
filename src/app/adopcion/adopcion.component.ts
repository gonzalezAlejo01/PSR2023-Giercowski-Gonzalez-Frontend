import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../enviroments/enviroment';

@Component({
  selector: 'app-adopcion',
  templateUrl: './adopcion.component.html',
  styleUrls: ['./adopcion.component.css']
})
export class AdopcionComponent {
  imagen: any
  logeado: boolean = false;
  pagina: number = 0;
  hayMas: boolean = false;
  publicaciones: any[] = []
  url = environment.APIurl;
  constructor(public sanitizer: DomSanitizer, private renderer: Renderer2, private http: MihttpService) {
  }
  getPublicaciones() {
    return this.http.getPublicacionesXtipo(0, this.pagina).subscribe({
      next: (data: any) => {
        this.publicaciones = this.publicaciones.concat(data.pubs);
        this.hayMas = data.hayMas;
        console.log(data)
        console.log(this.publicaciones);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  ngOnInit(){
    this.getPublicaciones();
    if(localStorage.getItem("jwt") != null){
      this.logeado=true ;
    }
  }
  
  cerrarSesion(){
    localStorage.clear();
    window.location.reload()
  }
  cargarMas(){
    this.pagina++;
    this.getPublicaciones();
  }
}