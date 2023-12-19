import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from 'app/services.config';
import { TramiteTransaccion } from './tramitetransacciones/tramitetransacciones.model';
import { Observable } from 'rxjs';
import { transaccionesPendientes } from './aprobacionespendientes/aprobacionespendientes.model';
import { Titulos } from './aprobaciones/aprobaciones.model';
import { Archivos } from '../control-accionistas/aprobaraccionista/archivos.model';


  @Injectable({
    providedIn: 'root'
  })

  export class TransaccionesService {

    private _baseUrl: string = ServicesConfig.apiUrl;

    /**
       * Constructor
       */
    constructor(private http: HttpClient){}

    //obtener información

    obtenerDatosTransaccion(): Observable<TramiteTransaccion> {
      return this.http.get<TramiteTransaccion>(this._baseUrl + '/api/transacciones');
    }

    obtenerTitulosVenta(id: string): Observable<TramiteTransaccion[]> {
      return this.http.get<TramiteTransaccion[]>(this._baseUrl + '/api/titulos/' + id);
    }

    obtenerTitulosCompra(): Observable<any[]> {
      return this.http.get<any[]>(this._baseUrl + '/api/titulos');
    }

    obtenerTransaccionesPendientes(): Observable<transaccionesPendientes[]> {
      return this.http.get<transaccionesPendientes[]>(this._baseUrl + "/api/transacciones/pendientesAprobacion");
    }

    obtenerTitulosComprados(id: string): Observable<Titulos[]> {
      return this.http.get<Titulos[]>(this._baseUrl + '/api/transacciones/' + id);
    }

    obtenerArchivos(id: string): Observable<Archivos[]> {
      return this.http.get<Archivos[]>(this._baseUrl + '/api/transacciones/' + id);
    }

     obtenerDatosAprobacion(id: string): Observable<transaccionesPendientes> {
       return this.http.get<transaccionesPendientes>(this._baseUrl + '/api/transacciones/' + id);
     }

    //enviar información

    enviarDatosTramiteVenta(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/venta', formData);
    }

    enviarDatosTramiteCompra(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/compra', formData);
    }

    enviarDatosTramiteDonacion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/donacion', formData);
    }

    enviarDatosTramiteEndoso(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/endoso', formData);
    }

    enviarDatosTramiteSucesion(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/sucesion', formData);
    }

    enviarDatosTramiteEmbargo(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transaccion/embargo', formData);
    }

    enviarArchivosTramite(formDataArchivo: FormData): Observable<FormData> {
      return this.http.post<any>(this._baseUrl + '/api/uploadFile', formDataArchivo);
    }

    enviarTransaccionAprobada(formData: any): Observable<any> {
      return this.http.post<any>(this._baseUrl + '/api/transacciones/aprobar', formData);
    }


  }
