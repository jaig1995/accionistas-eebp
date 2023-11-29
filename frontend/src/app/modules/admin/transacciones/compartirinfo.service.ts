import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private datosTablaSource = new BehaviorSubject<any[]>([]);
  datosTabla$ = this.datosTablaSource.asObservable();

  actualizarDatosTabla(datos: any[]): void {
    this.datosTablaSource.next(datos);
  }
}