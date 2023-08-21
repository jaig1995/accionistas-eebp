import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoAccionistas } from './informacion-accionistas.model';


@Injectable({
  providedIn: 'root'
})
export class InformacionAccionistasService {
  private _baseUrl: string = 'http://localhost:3000';

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

}