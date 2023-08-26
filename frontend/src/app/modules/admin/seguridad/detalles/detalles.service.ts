import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Navigation} from "../../../../core/navigation/navigation.types";
import {PermisoModel} from "../permisos/permiso.model";
import { ServicesConfig } from 'app/services.config';


@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private _baseUrl: string = ServicesConfig.apiUrl;

    /**
    * Constructor
    */
    constructor(private http: HttpClient){}

    obtenerPermisosPorUsuario(id: string): Observable<Navigation> {
      return this.http.get<Navigation>(this._baseUrl + "/api/seguridad/perfiles/navigation/" + id);
    }

    obtenerPermisos() : Observable<Navigation> {
      return this.http.get<Navigation>(this._baseUrl + "/api/seguridad/perfiles/navigation");
    }

    addPermiso(permiso : PermisoModel) : Observable<any> {
      return this.http.post(this._baseUrl + "/api/seguridad/perfiles/usuariosopciones", permiso);
    }

    deletePermiso(permiso : PermisoModel) : Observable<any> {
        return this.http.delete(this._baseUrl + "/api/seguridad/perfiles/usuariosopciones", {body : permiso});
    }

}
