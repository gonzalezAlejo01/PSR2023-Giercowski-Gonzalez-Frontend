import { Component } from '@angular/core';
import { MihttpService } from '../mihttp.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../enviroments/enviroment';
@Component({
  selector: 'app-extravio',
  templateUrl: './extravio.component.html',
  styleUrls: ['./extravio.component.css']
})
export class ExtravioComponent {
  nominatimBaseUrl: string = "https://nominatim.openstreetmap.org/search";
  map: any;
  pagina: number = 1;
  url = environment.APIurl
  extravios: any[] = []
  infoContacto: any
  alternarInfo: boolean

  constructor(private httpClient: HttpClient,private http: MihttpService) { 
    this.alternarInfo = false;
  }

  async ngOnInit() {
    this.getExtravios()
  }


  empezarmapita(Dirección: string){
    this.getGeocodedData(Dirección).subscribe((data: any) => {
      if(this.map != null){
        this.map.remove();
      }
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const address = result.display_name;
        this.initializeMap(lat, lon, address);
      } else {
        console.error("No se encontraron coordenadas para la dirección proporcionada.");
      }
    });
  }
  getExtravios(){
    return this.http.getPublicacionesXtipo(1, this.pagina).subscribe({
      next: (data: any) => {
        this.extravios = data;
        this.empezarmapita(data[0].ubicacion);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getGeocodedData(address: string) {
    const apiUrl = `${this.nominatimBaseUrl}?q=${encodeURI(address)}&format=json`;
    return this.httpClient.get(apiUrl);
  }

  initializeMap(lat: number, lon: number, address: string) {
    this.map = L.map('map').setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    const marker = L.marker([lat, lon]).addTo(this.map);
    marker.bindPopup(`<b>Dirección:</b> ${address}`).openPopup();
  }

  verInfoContacto(mailUsuario: any){
    return this.http.getUsuario(mailUsuario).subscribe({
      next: (data: any) => {
        this.infoContacto = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  alternarInfoContacto(extravio: any) {
    this.extravios.forEach(e => e.alternarInfo = e === extravio ? !e.alternarInfo : false);
  }


}