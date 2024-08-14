import { Component, ElementRef, ViewChild } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

interface Tipo {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],

})

export class UsuarioComponent {
  @ViewChild('nombreModificar') nombreModificarInput: ElementRef;
  @ViewChild('direccionModificar') direccionModificarInput: ElementRef;
  @ViewChild('fotoModificar') fotoModificarInput: ElementRef;
  @ViewChild('telefonoModificar') telefonoModificarInput: ElementRef;

  err: string
  usuario: any
  publicaciones: any
  verFormsBool: boolean
  esVenta: boolean = false
  selectedValue: string
  url = environment.APIurl
  editar: boolean
  nombreEditar = ""
  direccionEditar = ""
  success: boolean
  formsAdopcion: boolean
  errorEditar: string
  formsExtravio: boolean
  confirmacion: boolean

  constructor(private http: MihttpService, public sanitizer: DomSanitizer,private router: Router) {
    this.success = false;
    this.usuario = ""
    this.verFormsBool = false
    this.errorEditar = ""
    this.selectedValue = ""
    this.err = ""
    this.editar = false
    this.nombreModificarInput = ElementRef.prototype
    this.direccionModificarInput = ElementRef.prototype
    this.fotoModificarInput = ElementRef.prototype
    this.telefonoModificarInput = ElementRef.prototype
    this.confirmacion = false
    this.formsExtravio = false
    this.formsAdopcion = false
  }


  tipos: Tipo[] = [
    { value: 'Adopcion', viewValue: 'Adopcion' },
    { value: 'Extravio', viewValue: 'Extravio' },
  ];
  @ViewChild('fotos') fileInput: any;
  selectedPhoto!: File;
  selectedEditPhoto!: File;
  selectedProfilePhoto!: File;
  onFileSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
  }
  onProfilePhotoSelected(event: any) {
    this.selectedProfilePhoto = event.target.files[0];
  }
  onEditPhotoSelected(event: any) {
    this.selectedEditPhoto = event.target.files[0];
  }

  ngOnInit() {
    this.http.verificarLogeado().subscribe({
      next: (data: any) => {
        console.log(data)
      },
      error: (error: any) => {
        console.log(error)
        this.router.navigate(['/login']);
      }
    })
    this.http.getUserData().subscribe({
      next: (data: any) => {
        console.log("a:" + data);
        this.usuario = data;
        this.usuario.foto = this.url + this.usuario.foto
        localStorage.setItem('foto', data.foto);
        this.http.getPublicacionesUsuario(this.usuario.correo).subscribe({
          next: (data: any) => {
            this.publicaciones = data
          },
          error: (error: any) => {
            console.log(error)
          }
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })
    const phoneInputField = document.querySelector("#phone");
   const phoneInput = (<any>window).intlTelInput(phoneInputField, {
     utilsScript:
       "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });
  }
  
  verFormsAdopcion(){
    this.formsAdopcion = true
    this.formsExtravio = false
  }
  verFormsExtravio(){
    this.formsExtravio = true
    this.formsAdopcion = false
  }
  

  publicar(titulo: string, descripcion: string, precio: string, foto: string, ubicacion: string, tipo: Number) {

   const body = new FormData()
    body.append("tipo", tipo.toString())
    body.append("titulo", titulo)
    body.append("precio", precio)
    body.append("ubicacion", ubicacion)
    body.append("descripcion", descripcion)
    body.append("mailUsuario", this.usuario.correo)
    console.log(this.selectedPhoto)
    if (this.selectedPhoto) {
      const extension = this.selectedPhoto.name.split('.').pop();
      const type = 'image/${extension}';
      const blob = new Blob([this.selectedPhoto], { type });
      body.append('publicaciones',blob, this.selectedPhoto.name);
      console.log(body);
    }

    this.err=""
    this.http.publicar(body).subscribe({
      next: (data: any) => {
        //console.log(data);
        console.log(body)
        this.err = data.text
      },
      error: (error: any) => {
        console.log(error);
        this.err = error.error.text
        this.success = false
      }
    })
    this.success = true
    this.ngOnInit()
  }
  borrarPublicacion(id: any) {
    this.http.borrarPublicacion(id).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
    this.ngOnInit()
  }

  modificarUsuario(){
    const nuevoNombre = this.nombreModificarInput.nativeElement.value;
    const nuevaDireccion = this.direccionModificarInput.nativeElement.value;
    const nuevoTelefono = this.telefonoModificarInput.nativeElement.value;
    var body = new FormData() 
      body.append("nombre", nuevoNombre)
      body.append("direccion", nuevaDireccion)
      body.append("telefono", nuevoTelefono)
      if (this.selectedProfilePhoto) {
        const extension = this.selectedProfilePhoto.name.split('.').pop();
        const type = 'image/${extension}';
        const blob = new Blob([this.selectedProfilePhoto], { type });
        body.append('perfil',blob, this.selectedProfilePhoto.name);
        console.log(body);
      }
    
    this.http.modificarUsuario(this.usuario.correo, body).subscribe({
      next: (data: any) => {
        console.log(data);
        this.errorEditar = ""
        this.verEdicion()
      },
      error: (error: any) => {
        console.log(error);
        this.errorEditar = error.error.text
      }

    })
    this.ngOnInit()
  }

  verForms() {
    this.verFormsBool = !this.verFormsBool
  }
  venta() {
    this.esVenta = true
  }
  extravio() {
    this.esVenta = false
  }
  adopcion() {
    this.esVenta = false
  }
  verEdicion(){
    this.editar = !this.editar
  }
  mostrarFormularioEditar(publicacion: any){
    publicacion.mostrandoFormularioEditar = !publicacion.mostrandoFormularioEditar
  }
  editarPublicacion(id: any, nombre: any, descripcion: any, precio: any){
    
    const body  = new FormData()
    body.append("titulo", nombre)
    body.append("descripcion", descripcion)
    body.append("precio", precio)
    if (this.selectedEditPhoto) {
      const extension = this.selectedEditPhoto.name.split('.').pop();
      const type = 'image/${extension}';
      const blob = new Blob([this.selectedEditPhoto], { type });
      body.append('publicaciones',blob, this.selectedEditPhoto.name);
      console.log(body);
    }
    this.http.modificarPublicacion(id ,body).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      }

    })
    this.ngOnInit()
  }

  
}