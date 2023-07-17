import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from './usuarios.model';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  /**
     * Constructor
     */
  constructor(private http: HttpClient){}

  obtenerDatos(): Observable<Usuarios[]> {
    const url = 'http://localhost:3000/usuarios'; // 
    return this.http.get<Usuarios[]>(url);
  }

  //obtenerUsuarioPorId(id: number): Observable<PeriodicElement[]> {
    //const url = `http://localhost:3000/usuarios/${id}`; // Construye la URL con el ID proporcionado
    //return this.http.get<PeriodicElement[]>(url);
  //}
  
}
