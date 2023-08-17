import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accionistas } from './accionistas.model';
import { Autorizacion } from '../autorizacion/autorizacion.model';
import { Declaracion } from '../declaracion/declaracion.model';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';

  @Injectable({
    providedIn: 'root'
  })

  

  export class AccionistasService {

    private _baseUrl: string = 'http://localhost:3000';

    /**
       * Constructor
       */
    constructor(private http: HttpClient){}

    //envio de informacion

    enviarDatos(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/agregar/accionistas', formData);
    }

    enviarDatosAutorizacion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/autorizacion', formData);
    }

    enviarDatosDeclaracion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/autorizacion/declaracion', formData);
    }

    //Obtener la infromacion para los fomrularios

    obtenerDatosAutorizacion(): Observable<Autorizacion> {
      return this.http.get<Autorizacion>(this._baseUrl + '/api/accionista/autorizacion');
    }

    obtenerDatosDeclaracion(): Observable<Declaracion> {
      return this.http.get<Declaracion>(this._baseUrl + '/api/accionista/autorizacion/declaracion');
    }

    obtenerDatosActualizar(id: string): Observable<Actualizar> {
      return this.http.get<Actualizar>(this._baseUrl + '/api/accionista/actualizar/' + id);
    }

    peticionGetHuella(): Observable<any> {
      return this.http.get<any>( 'http://192.168.100.15:9090/fingerprint');
    }

    peticionGetFirma(): Observable<any> {
      return this.http.get<any>( 'http://192.168.100.15:9090/sigplus/start');
    }

    peticionGetFirmaCaptura(): Observable<any> {
      return this.http.get<any>( 'http://192.168.100.15:9090/sigplus/stop');
    }

    enviarFotografia(formDataFotografia: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/uploadFileAccionista', formDataFotografia);
    }

  }