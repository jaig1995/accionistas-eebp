import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accionistas } from './accionistas.model';
import { Autorizacion } from './autorizacion/autorizacion.model';
import { Declaracion } from './declaracion/declaracion.model';

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

    enviarDatosAutorizacion(formDataAutorizacion: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/autorizacion', formDataAutorizacion);
    }

    enviarDatosDeclaracion(formDataDeclaracion: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/autorizacion/declaracion', formDataDeclaracion);
    }

    //Obtener la infromacion para los fomrularios

    obtenerDatosAutorizacion(): Observable<Autorizacion> {
      return this.http.get<Autorizacion>(this._baseUrl + '/api/accionista/autorizacion');
    }

    obtenerDatosDeclaracion(): Observable<Declaracion> {
      return this.http.get<Declaracion>(this._baseUrl + '/api/accionista/autorizacion/declaracion');
    }
    
  }