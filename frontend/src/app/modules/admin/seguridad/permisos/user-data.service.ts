import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuarios.model';
import { ServicesConfig } from 'app/services.config';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private _baseUrl: string = ServicesConfig.apiUrl;

  /**
     * Constructor
     */
    constructor(private http: HttpClient){}

    obtenerUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this._baseUrl + "/api/usuarios");
    }

    obtenerUsuario(id : string): Observable<Usuario> {
        return this.http.get<Usuario>(this._baseUrl + "/api/usuarios/" + id);
    }

    eliminarPersona(codUsuario: string): Observable<void> {
      return this.http.delete<void>(this._baseUrl + "/api/accionistas/borrar/" + codUsuario);
    }

}
