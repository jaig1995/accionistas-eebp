import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesConfig } from 'app/services.config';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Parametrizacion } from './parametrizacion.interface';

@Injectable({
    providedIn: 'root'
})
export class ParametrizacionService {

    private _baseUrl: string = ServicesConfig.apiUrl;

    private parametrosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    parametros$: Observable<any[]> = this.parametrosSubject.asObservable();

    obtenerParametros(): Observable<any> {
        return this.http.get<any>(this._baseUrl + '/api/parametros');
    }

    obtenerParametroPorId(id: number): Observable<any> {
        return this.parametros$.pipe(map(parametros => parametros.find(parametro => parametro.idParametro === id)));
      }

    editarParametros(data: Parametrizacion): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/api/parametros`, data).pipe(
            catchError(this.handleError)
        );;
    }

    eliminarParametros(id: number): Observable<any> {
        return this.http.delete<any>(`${this._baseUrl}/api/parametros/${id}`);
    }

    crearParametro(data: Parametrizacion): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/api/parametros`, data);
    }

    private handleError(error: HttpErrorResponse) {
        // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
        console.error('Ocurrió un error:', error);
        return throwError('Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
    }


    constructor(private http: HttpClient) {
        this.obtenerParametros().subscribe(data => {
            this.parametrosSubject.next(data);
        });
    }

}
