import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {NgIf} from "@angular/common";
import { TransaccionesService } from '../transacciones.service';
import { transaccionesPendientes } from './aprobacionespendientes.model';


@Component({
  selector: 'app-aprobacionespendientes',
  templateUrl: './aprobacionespendientes.component.html',
  standalone   : true,
  imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class AprobacionespendientesComponent {

  datos: MatTableDataSource<transaccionesPendientes>;
  displayedColumns: string[] = ['idTransaccion', 'fecTrans', 'persona', 'tipoTransaccion'];

  constructor(private transaccionesService: TransaccionesService) {}

  ngOnInit() {
    this.transaccionesService.obtenerTransaccionesPendientes().subscribe(
      (datos: transaccionesPendientes[]) => {
        this.datos = new MatTableDataSource<transaccionesPendientes>(datos);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filterPredicate = (data: transaccionesPendientes, filter: string) => {
      const idStr = data.idTransaccion;
      return idStr.includes(filterValue);
    };
    this.datos.filter = filterValue.trim();
  }

}
