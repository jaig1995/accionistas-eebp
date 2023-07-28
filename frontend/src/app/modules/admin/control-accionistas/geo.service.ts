import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class GeoService {
    private _baseUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDepartamentos(): Observable<any> {
    return this.http.get<any>(`${this._baseUrl}/api/geo/departamentos`);
  }

  getMunicipiosByDepartamento(departamentoId: number): Observable<any> {
    return this.http.get<any>(`${this._baseUrl}/api/geo/departamentos/${departamentoId}/municipios`);
  }
}