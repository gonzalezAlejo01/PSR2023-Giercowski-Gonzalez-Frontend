// chat.component.ts

import { Component } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { Router } from '@angular/router';
import { environment } from '../enviroments/enviroment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  chats: any = [];
  mailUsuario: any;
  url = environment.APIurl;
  crearChatError: string
  usuarioSeleccionadoIndex: number | null = null;
  verParticipantes: boolean = false;
  constructor(private http: MihttpService, private router: Router) { 
    this.crearChatError = "";
  }

  ngOnInit() {
    this.http.verificarLogeado().subscribe({
      next: (data: any) => {
      },
      error: (error: any) => {
        this.router.navigate(['/login']);
      }
    })
    return this.http.getUserData().subscribe((data: any) => {
      this.mailUsuario = data.correo;
      this.getChats();
    })
  }

  getChats() {
    this.http.getChats({ mail: this.mailUsuario}).subscribe((data: any) => {
      this.chats = data;
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].mailUsuario2 == this.mailUsuario) {
          this.chats[i].mailUsuario2 = this.chats[i].mailUsuario1;
          this.chats[i].mailUsuario1 = this.mailUsuario;
        }
        this.chats[i].showChat = false;
      }
      console.log(this.chats);
    });
   }

  showChat(chat: any, index: number) {
    this.chats.forEach((c: { showChat: boolean; }) => c.showChat = false);
    chat.showChat = !chat.showChat;
    this.usuarioSeleccionadoIndex = index;
  }

  toggleParticipantes() {
    const div = document.querySelector('.particpantes');
    if (div?.getAttribute('style') !== 'display: none') {
      div?.setAttribute('style', 'display: none');
    }
    else {
      div?.setAttribute('style', 'display: block');
    }
    this.verParticipantes = !this.verParticipantes;
  }
 

  subirMensaje(chat: any, contenido: any) {
    let body = {
      contenido: contenido,
      mailUsuario: this.mailUsuario,
    }
    this.http.subirMensaje(chat, body).subscribe((data: any) => {
      this.getMensajes(chat);
    })
    
  }

  getMensajes(idChat: any) {
    return this.http.getMensajes(idChat).subscribe((data: any) => {
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].id == idChat) {
          this.chats[i].mensajes = data;
        }
      }
    })
  }

  crearChat(mailUsuario2: any) {
    let body = {
      mailUsuario1: this.mailUsuario,
      mailUsuario2: mailUsuario2
    }
    this.http.postChat(body).subscribe({
      next: (data: any) => {
        this.getChats();
        this.crearChatError = "";
      },
      error: (error: any) => {
        console.log(error);
        this.crearChatError = error.error;
      }
    })
  }
}
