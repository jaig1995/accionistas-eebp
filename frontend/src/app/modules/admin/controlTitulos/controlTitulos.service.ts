import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesConfig } from 'app/services.config';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AprobarTitulos } from './interfaces/aprobarTitulos.interface';
import { DocumentoTransaccion } from './interfaces/documentos.interface';
import { Accionista } from './interfaces/accionista.interface';

@Injectable({
    providedIn: 'root'
})
export class ControlTitulosService {

    // variable de entorno
    private _baseUrl: string = ServicesConfig.apiUrl;



    constructor(private http: HttpClient) { }


    obtenerTitulo(codUsuario: number): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/api/accionistas/${codUsuario}`).pipe(
            map(response => (
                {

                    codUsuario: response.codUsuario,
                    nomPri: response.nomPri,
                    nomSeg: response.nomSeg,
                    apePri: response.apePri,
                    apeSeg: response.apeSeg,
                    esAccionista: response.esAccionista,
                    titulos: response.titulos.map(titulo => ({
                        folio: titulo.folio,
                        editarTitulo: titulo,
                        estadoTitulo: titulo.estadoTitulo.descEstado,
                        conseTitulo: titulo.conseTitulo,
                        canAccTit: titulo.canAccTit,
                        valAccTit: titulo.valAccTit,
                    }))

                }
            ))
        );
    }

    enviarTransaccion(transaccion: any): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/api/transaccion`, transaccion).pipe(
            map(response => response.conseTrans),
            catchError(error => {
                console.error('Error al enviar la transacción:', error);
                return of(error);
            })
        );
    }


    enviarFormatoVenta(archivo: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', archivo);
        return this.http.post<any>(`${this._baseUrl}/api/transaccion/uploadFile`, formData);
    }

    enviarFormatosAprobados(archivo: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', archivo);
        return this.http.post<any>(`${this._baseUrl}/api/transaccion/uploadFile`, formData);
    }

    obtenerTransacciones(): Observable<AprobarTitulos[]> {
        return this.http.get<AprobarTitulos[]>(`${this._baseUrl}/api/transaccion`);
    }


    obtenerTransaccionesControlInterno(): Observable<AprobarTitulos[]> {
        return this.http.get<AprobarTitulos[]>(`${this._baseUrl}/api/transaccion/aprobado-controlInterno`);
    }
    obtenerTransaccionesJuridica(): Observable<AprobarTitulos[]> {
        return this.http.get<AprobarTitulos[]>(`${this._baseUrl}/api/transaccion/aprobado-juridica`);
    }


    aprobarTransaccion(transaccion: any): Observable<DocumentoTransaccion[]> {
        return this.http.post<DocumentoTransaccion[]>(`${this._baseUrl}/api/transaccion`, transaccion);
    }


    obtenerTransaccionesAprobadas(): Observable<AprobarTitulos[]> {
        return this.http.get<AprobarTitulos[]>(`${this._baseUrl}/api/transaccion/aprobado`).pipe(
            map(transacciones => transacciones.map(transaccion => ({ ...transaccion, selected: false })))
        );
    }

    comprarTitulo(titulos: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos/comprar`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulos, { headers });
    }


    donarTitulo(titulos: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos/donar`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulos, { headers });
    }

    sucesionTitulo(titulos: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos/sucesion`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulos, { headers });
    }

    endosarTitulo(titulos: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos/endosar`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulos, { headers });
    }

    embargarTitulo(titulos: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos/embargar`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulos, { headers });
    }

    editarTitulo(titulo: any): Observable<any> {
        const url = `${this._baseUrl}/api/titulos`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, titulo, { headers });
    }

    obtenerTituloPorId(id: number) {
        return this.http.get<any[]>(`${this._baseUrl}/api/transaccion/${id}`);

    }

    obtenerAccionistas(): Observable<any[]> {
        return this.http.get<any[]>(`${this._baseUrl}/api/accionistas`).pipe(
            map(accionistas => {
                console.log('💻🔥 132, controlTitulos.service.ts: ', accionistas);
                return accionistas.map(accionista => (
                    {
                        idPer: accionista.codUsuario,
                        Nombres: accionista.codUsuario + '-' + accionista.nomPri + ' ' + accionista.apePri,
                    }));
            })
        );
    }


    //devuelve todos
    obtenerAccionistasPersonas(): Observable<any[]> {
        return this.http.get<any[]>(`${this._baseUrl}/api/accionistas`).pipe(
            map(accionistas => {
                const esAccionistaN = accionistas.filter(usuario => usuario.esAccionista === "N");
                return esAccionistaN.map(accionista => (
                    {
                        idPer: accionista.codUsuario,
                        Nombres: accionista.codUsuario + '-' + accionista.nomPri + ' ' + accionista.apePri,
                    }));
            })
        );
    }


    obtenerPersonasNoEmpleados(): Observable<any[]> {
        return this.http.get<any[]>(`${this._baseUrl}/api/accionista/apoderados`).pipe(
            map(accionistas => {
                console.log('💻🔥 132, controlTitulos.service.ts: ', accionistas);
                return accionistas.map(accionista => (
                    {
                        idPer: accionista.codAccionista,
                        Nombres: accionista.codAccionista + '-' + accionista.nomAccionista,
                    }));
            })
        );
    }


    //accionistas
    obtenerAccionistasHabilitados(): Observable<any[]> {
        return this.http.get<any[]>(`${this._baseUrl}/api/accionista`).pipe(
            map(accionistas => {
                return accionistas.map(accionista => ({
                    idPer: accionista.codAccionista,
                    Nombres: accionista.codAccionista + '-' + accionista.nomAccionista,
                }));
            })
        );
    }



    descargarTitulo(idTitulo: string): Observable<Blob> {
        const url = `${this._baseUrl}/api/titulos/formatoTituloAcciones/${idTitulo}`;
        return this.http.get(url, { responseType: 'blob' });
    }

}
