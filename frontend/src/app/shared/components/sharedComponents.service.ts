import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicesConfig } from 'app/services.config';
import { Observable } from 'rxjs';
import { Accionista } from './interfaces/accionista.interface';

@Injectable({
    providedIn: 'root'
})
export class SharedComponentsService {
    // variable de entorno
    private _baseUrl: string = ServicesConfig.apiUrl;

    private http = inject(HttpClient);

    obtenerInformacionAccionista(codUsuario: number): Observable<Accionista> {
        return this.http.get<Accionista>(`${this._baseUrl}/api/accionistas/${codUsuario}`)
    }



}
