import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accionistas } from './accionistas.model';
import { Autorizacion } from '../autorizacion/autorizacion.model';
import { Declaracion } from '../declaracion/declaracion.model';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { ServicesConfig } from 'app/services.config';
import { RegAccionistas } from '../registraraccionista/registraraccionista.model';
import { HojaDeRuta } from '../hojaderuta/hojaderuta.model';
import { modificarRepresentante } from '../modificarapoderado/modificarapoderado.model';

  @Injectable({
    providedIn: 'root'
  })

  

  export class AccionistasService {

    private _baseUrl: string = ServicesConfig.apiUrl;

    /**
       * Constructor
       */
    constructor(private http: HttpClient){}

    //envio de informacion

    enviarDatos(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionistas', formData);
    }

    enviarDatosAutorizacion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionistas/autorizacion', formData);
    }

    enviarDatosDeclaracion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionistas/declaracion', formData);
    }

    //Obtener la infromacion para los fomrularios

    obtenerDatosAutorizacion(id: string): Observable<Autorizacion> {
      return this.http.get<Autorizacion>(this._baseUrl + '/api/accionistas/' + id);
    }

    obtenerDatosDeclaracion(id: string): Observable<Declaracion> {
      return this.http.get<Declaracion>(this._baseUrl + '/api/accionistas/' + id);
    }

    obtenerDatosActualizar(id: string): Observable<Actualizar> {
      return this.http.get<Actualizar>(this._baseUrl + '/api/accionistas/' + id);
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

    enviarFotografia(formDataFotografia: FormData): Observable<FormData> {
      return this.http.post<any>(this._baseUrl + '/api/uploadFile', formDataFotografia);
    }

    enviarDatosRegistro(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista', formData);
    }

    obtenerDatosRegistro(id: string): Observable<RegAccionistas> {
      return this.http.get<RegAccionistas>(this._baseUrl + '/api/accionistas/' + id);
    }

    aprobar(codUsuario : string) : Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/aprobar', {"codUsuario": codUsuario});
    }

    rechazar(codUsuario : string, descripcionRechazo: string) : Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/rechazar', {"codUsuario": codUsuario, "descripcionRechazo": descripcionRechazo});
    }

    obtenerDatosHojaDeRuta(id: string): Observable<HojaDeRuta[]> {
      return this.http.get<HojaDeRuta[]>(this._baseUrl + '/api/accionista/ruta/' + id);
    }

    obtenerBancos(): Observable<any[]> {
      return this.http.get<any[]>(this._baseUrl + '/api/bancos');
    }

    obtenerDatosModificacion(id: string): Observable<modificarRepresentante> {
      return this.http.get<modificarRepresentante>(this._baseUrl + '/api/accionista/accionistaRepresentante/' + id);
    }

    enviarDatosModificacion(formDataAccionista: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/actualizarRepresentante', formDataAccionista);
    }

  } 