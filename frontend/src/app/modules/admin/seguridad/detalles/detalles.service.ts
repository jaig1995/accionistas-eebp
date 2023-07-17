import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { detalleUsuario } from './detalle-usuarios.model';


@Injectable({
  providedIn: 'root'
})
export class detallesService {

  /**
     * Constructor
     */
  constructor(private http: HttpClient){}

  obtenerUsuarioPorId(id: number): Observable<detalleUsuario[]> {
    const url = `http://localhost:3000/api/usuarios/${id}`; // Construye la URL con el ID proporcionado
    return this.http.get<detalleUsuario[]>(url);
  }
  
}
