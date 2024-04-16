import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicesConfig } from 'app/services.config';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsambleaService {

    private _baseUrl: string = ServicesConfig.apiUrl;

    private http = inject(HttpClient);

    constructor() { }


    enviarRegistroPoderesregistro(registro) {
        return this.http.post<any>(`${this._baseUrl}/api/registroPoder/`, registro)
    }

    enviarArchivo(archivo: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', archivo);
        return this.http.post<any>(`${this._baseUrl}/api/transaccion/uploadFile`, formData);
    }

}
