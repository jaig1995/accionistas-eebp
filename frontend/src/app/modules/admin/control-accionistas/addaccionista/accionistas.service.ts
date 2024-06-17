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
import { Accionista } from '../aprobaraccionista/aprobaraccionista.model';
import { Representante } from '../declaracion/representante.model';
import { Archivos } from '../aprobaraccionista/archivos.model';
import { ActEcoPer } from './actEcoPer.model';
import { EsAccionistas } from '../modificaraccionista/modificaraccionista.model';

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
      return this.http.get<any>( 'http://localhost:9090/fingerprint');
    }

    peticionGetFirma(): Observable<any> {
      return this.http.get<any>( 'http://localhost:9090/sigplus/start');
    }

    peticionGetFirmaCaptura(): Observable<any> {
      return this.http.get<any>( 'http://localhost:9090/sigplus/stop');
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

    obtenerActividadEconomica(): Observable<ActEcoPer[]> {
      return this.http.get<ActEcoPer[]>(this._baseUrl + '/api/actividadEconomica');
    }

    obtenerDatosModificacion(id: string): Observable<modificarRepresentante> {
      return this.http.get<modificarRepresentante>(this._baseUrl + '/api/accionista/accionistaRepresentante/' + id);
    }

    enviarDatosModificacion(formDataAccionista: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/actualizarRepresentante', formDataAccionista);
    }

    enviarArchivo(formDataArchivo: FormData): Observable<FormData> {
      return this.http.post<any>(this._baseUrl + '/api/uploadFile', formDataArchivo);
    }

    obtenerPersona(id: string): Observable<Actualizar> {
      return this.http.get<Actualizar>(this._baseUrl + '/api/accionistas/' + id);
    }

    obtenerAccionista(id: string): Observable<Accionista> {
      return this.http.get<Accionista>(this._baseUrl + '/api/accionista/' + id);
    }

    obtenerRepresentante(id: string): Observable<Representante> {
      return this.http.get<Representante>(this._baseUrl + '/api/accionista/accionistaRepresentante/' + id);
    }

    obtenerCodigos(): Observable<Actualizar[]> {
      return this.http.get<Actualizar[]>(this._baseUrl + '/api/accionistas');
    }

    obtenerCodigosAccionistas(): Observable<modificarRepresentante[]> {
      return this.http.get<modificarRepresentante[]>(this._baseUrl + '/api/accionista');
    }

    obtenerArchivos(id: string): Observable<Archivos[]> {
      return this.http.get<Archivos[]>(this._baseUrl + '/api/accionista/aprobar/archivos/' + id);
    }

    eliminarArchivo(fileName: string): Observable<Archivos[]> {
      return this.http.get<Archivos[]>(this._baseUrl + '/api/accionista/aprobar/archivos/eliminar/' + fileName);
    }

    obtenerAccionistas(): Observable<EsAccionistas[]> {
      return this.http.get<EsAccionistas[]>(this._baseUrl + '/api/accionista');
    }

    obtenerAccionistasAprobadosRechazados(): Observable<EsAccionistas[]> {
      return this.http.get<EsAccionistas[]>(this._baseUrl + '/api/accionista/aprobados-rechazados');
    }

    enviarRegistroActualizado(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/accionista/actualizarTipoAccionista', formData);
    }

  } 
