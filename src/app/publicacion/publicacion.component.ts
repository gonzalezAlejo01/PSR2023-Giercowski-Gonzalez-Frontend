import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MihttpService } from '../mihttp.service';
import jwtDecode from 'jwt-decode';
import { environment } from '../enviroments/enviroment';
@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent {

  idPublicacion: string;
  publicacion: any;
  url = environment.APIurl;
  mailUsuario: string;
  comentarios: any;
  fotoComentarios: { foto: string }[] = []
  sosPropietario: boolean = false;
  mensajeComentario: string ;
  enCheckout: boolean = false;
  errorCompra: string
  ubicacionVendedor: string
  mailVendedor: string

  constructor(private route: ActivatedRoute, private http: MihttpService, private router: Router) {
    this.mailVendedor = ""
    this.ubicacionVendedor = ""
    this.errorCompra = ""
    this.idPublicacion = '';
    this.publicacion = {};
    this.mailUsuario = '';
    this.comentarios = "";
    this.mensajeComentario = "";
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idPublicacion = params.get('id')!;
    });
    this.http.verificarIdentidad(this.idPublicacion).subscribe((data: any) => {
     if (data) {
        this.sosPropietario = true;
      }
     })
    this.http.getPublicacionesId(this.idPublicacion).subscribe((data: any) => {
      this.publicacion = data;
      this.ubicacionVendedor = data.ubicacion
    })
    this.http.getUserData().subscribe((data: any) => {
      this.mailUsuario = data.correo;
    })
    this.http.getComentarios(this.idPublicacion).subscribe((data: any) => {
      this.comentarios = data;
      for (let i = 0; i < this.comentarios.length; i++) {
        this.http.getUsuario(this.comentarios[i].mailUsuario).subscribe((data: any) => {
          this.fotoComentarios[i] = data.foto;
        })
      }
    })
  }

  comentar(comentario: string) {
    this.http.verificarLogeado().subscribe({
      next: (data: any) => {
      },
      error: (error: any) => {
        console.log("Inicia sesion para comentar")
        this.mensajeComentario = "Inicia sesion para comentar";
      }
    })
    let body = {
      idPublicacion: this.idPublicacion,
      contenido: comentario,
      mailUsuario: this.mailUsuario,
    }
    this.http.postComentario(body).subscribe({
      next: (data: any) => {
        this.mensajeComentario = "";
        this.ngOnInit();
      },
      error: (error) => {
        this.mensajeComentario = error.error.text;
        console.log(error);
      }
    })
  }

  mostrarFormularioRespuesta(comentario: any){
    comentario.mostrandoFormularioRespuesta = !comentario.mostrandoFormularioRespuesta;
  }

  responder(id: any, respuesta: any){
    let body = {
      respuesta: respuesta,
    }
    this.http.responderComentario(id, body).subscribe({
      next: (data: any) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  checkOut(estado: boolean){
    if(estado){
      this.http.getPublicacionesId(this.idPublicacion).subscribe({
        next: (data:any) =>{
          this.mailVendedor = data.mailUsuario
          if(data.mailUsuario == this.mailUsuario){
            this.errorCompra = "No se puede comprar las publicaciones propias"
          }
          else{
            this.enCheckout = true;
          }
        }
      })
    }
    else{
      this.enCheckout = estado
    }
    
  }

  comprar(){
      let cuerpo = {
        mailUsuario1: this.mailUsuario,
        mailUsuario2: this.mailVendedor
      }
      this.http.postChat(cuerpo).subscribe({
        next: (data) => {
          console.log("se crea chat")
          console.log(data)
          this.http.getChat(cuerpo.mailUsuario1, cuerpo.mailUsuario2).subscribe({
            next: (data:any) =>{
              console.log("el id")
              console.log(data.id)
              let body = {
                "contenido":"Hola! Compré la publicación '"+this.publicacion.titulo+"', acordemos sobre la entrega",
                "mailUsuario": this.mailUsuario
              }
              this.http.subirMensaje(data.id, body).subscribe({
                next: (data:any) =>{
                  this.router.navigate(["/chat"])
                },
                error: (error:any) =>{
                  console.log("skill issue")
                  console.log(error)
                }
              })
            },
            error: (error:any) =>{
              console.log("//////////////////////////////////////////")
              console.log(error)
            }
          })
        },
        error: (error: any) => {
          console.log(error);
          this.http.getChat(cuerpo.mailUsuario1, cuerpo.mailUsuario2).subscribe({
            next: (data:any) =>{
              console.log("el id")
              console.log(data.id)
              let body = {
                "contenido":"Hola! Compré la publicación '"+this.publicacion.titulo+"', acordemos sobre la entrega",
                "mailUsuario": this.mailUsuario
              }
              this.http.subirMensaje(data.id, body).subscribe({
                next: (data:any) =>{
                  this.router.navigate(["/chat"])
                },
                error: (error:any) =>{
                  console.log("skill issue")
                  console.log(error)
                }
              })
            }
          })
        }
      })
      this.http.borrarPublicacionVenta(this.idPublicacion, this.mailVendedor).subscribe({})
    }
  }
