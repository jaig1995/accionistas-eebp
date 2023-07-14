import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodicElement } from './periodic_element.model';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  /**
     * Constructor
     */
  constructor(private http: HttpClient){}

  obtenerDatos(): Observable<PeriodicElement[]> {
    const url = 'http://localhost:3000/registro/1010086199'; // 
    return this.http.get<PeriodicElement[]>(url);
  }
  
}
