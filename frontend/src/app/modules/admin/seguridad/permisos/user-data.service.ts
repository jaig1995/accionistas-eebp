import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuarios.model';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
    private base_url = 'http://localhost:8081'

  /**
     * Constructor
     */
    constructor(private http: HttpClient){}

    obtenerUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.base_url + "/api/usuarios");
    }

    obtenerUsuario(id : string): Observable<Usuario> {
        return this.http.get<Usuario>(this.base_url + "/api/usuarios/" + id);
    }

}
