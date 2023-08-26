import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoAccionistas } from './informacion-accionistas.model';
import { ServicesConfig } from 'app/services.config';


@Injectable({
  providedIn: 'root'
})
export class InformacionAccionistasService {
  private _baseUrl: string = ServicesConfig.apiUrl;

  /**
     * Constructor
     */
    constructor(private http: HttpClient){}

    obtenerUsuarios(): Observable<infoAccionistas[]> {
        return this.http.get<infoAccionistas[]>(this._baseUrl + "/api/accionistas");
    }

    obtenerUsuario(id : string): Observable<infoAccionistas> {
        return this.http.get<infoAccionistas>(this._baseUrl + "/api/accionistas/" + id);
    }

    pdfDatosPersonales(id : string): Observable<any> {
      return this.http.get<any>(this._baseUrl + "/api/accionistas/pdfDatosPersonales/" + id);
    }
    
    pdfAutorizacion(id : string): Observable<any> {
      return this.http.get<any>(this._baseUrl + "/api/accionistas/pdfAutorizacion/" + id);
    }
    
    pdfDeclaracion(id : string): Observable<any> {
      return this.http.get<any>(this._baseUrl + "/api/accionistas/pdfDeclaracion/" + id);
    }

}