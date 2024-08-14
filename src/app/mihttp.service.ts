import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MihttpService {

  url = "http://localhost:3000/";

  constructor(private http: HttpClient) { }

  registrarse(body: any) {
    return this.http.post(this.url + "usuarios", body);
  }

  login(body: any) {
    return this.http.post(this.url + "usuarios/login", body);
  }

  getPublicaciones() {
    return this.http.get(this.url + "publicaciones");
  }
  getUserData() {
    return this.http.get(this.url + "usuariosToken/userData", { headers: { Authorization: localStorage["jwt"] } });
  }
  getPublicacionesUsuario(mail: any) {
    return this.http.get(this.url + "publicaciones/usuario/" + mail, { headers: { Authorization: localStorage["jwt"] } });
  }
  getPublicacionesId(id: any) {
    return this.http.get(this.url + "publicaciones/" + id);
  }
  publicar(body: any) {
    return this.http.post(this.url + "publicaciones", body, { headers: { Authorization: localStorage["jwt"] } });
  }
  borrarPublicacion(id: any) {
    console.log(typeof(id))
    console.log(this.url+"publicaciones/"+id)
    return this.http.delete(this.url + "publicaciones/" + id, { headers: { Authorization: localStorage["jwt"] } });
  }
  borrarPublicacionVenta(id: any, mailVendedor: any){
    console.log("httpService")
    console.log(id)
    console.log(mailVendedor)
    return this.http.delete(this.url + "publicacionesVenta/" + id, { headers: { Authorization: localStorage["jwt"] } });
  }
  modificarUsuario(mailUsuario: any, body: any) {
    return this.http.patch(this.url + "usuarios/" + mailUsuario, body, { headers: { Authorization: localStorage["jwt"] } })
  }
  postComentario(body: any) {
    return this.http.post(this.url + "comentarios", body, { headers: { Authorization: localStorage["jwt"] } });
  }
  getComentarios(idPublicacion: any) {
    return this.http.get(this.url + "comentariosXpublicacion/" + idPublicacion);
  }
  getUsuario(correo: any) {
    return this.http.get(this.url + "usuarios/" + correo);
  }
  verificarIdentidad(id: any) {
    return this.http.get(this.url + "publicaciones/verificarIdentidad/" + id, { headers: { Authorization: localStorage["jwt"] } });
  }
  responderComentario(idComentario: any, body: any) {
    return this.http.patch(this.url + "comentarios/" + idComentario, body, { headers: { Authorization: localStorage["jwt"] } });
  }
  modificarPublicacion(idPublicacion: any, body: any) { 
    return this.http.patch(this.url + "publicaciones/" + idPublicacion, body, { headers: { Authorization: localStorage["jwt"] } });
  }
  getPublicacionesXtipo(tipo: any,pagnina: any) {
    return this.http.get(this.url + "publicaciones/tipo/" + tipo + "/" + pagnina);
  }  
  verificarLogeado(){
    return this.http.get(this.url + "verificarLogeado", { headers: { Authorization: localStorage["jwt"] } });
  }
  getChats(body: any){
    return this.http.post(this.url + "getchats", body, { headers: { Authorization: localStorage["jwt"] } });
  }
  subirMensaje(idChat: any ,body: any){
    return this.http.patch(this.url + "chats/" + idChat, body, { headers: { Authorization: localStorage["jwt"] } });
  }
  getMensajes(idChat: any){
    return this.http.get(this.url + "mensajes/" + idChat, { headers: { Authorization: localStorage["jwt"] } });
  }
  postChat(body: any){ 
    return this.http.post(this.url + "chats", body, { headers: { Authorization: localStorage["jwt"] } });
  }
  getChat(mail1: any, mail2: any){
    return this.http.get(this.url + "chats/"+mail1+"/"+mail2)
  }
}