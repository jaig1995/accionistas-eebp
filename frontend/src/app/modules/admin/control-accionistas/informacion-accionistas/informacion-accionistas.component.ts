import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { InformacionAccionistasService } from '../informacion-accionistas/accionistas-data.service';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { infoAccionistas } from './informacion-accionistas.model';
import {NgIf} from "@angular/common";



@Component({
    selector     : 'informacion-accionistas',
    standalone   : true,
    imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
    templateUrl  : './informacion-accionistas.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class InformacionAccionistasComponent implements OnInit
{
  datos: MatTableDataSource<infoAccionistas>;
  displayedColumns: string[] = [ 'avatar', 'codUsuario', 'nomPri', 'apePri', 'correoPersona', 'permisos'];

  constructor(private userDatos: InformacionAccionistasService) {}

  ngOnInit() {
    this.userDatos.obtenerUsuarios().subscribe(
      (datos: infoAccionistas[]) => {
        console.log(datos);
        this.datos = new MatTableDataSource<infoAccionistas>(datos);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.datos.filterPredicate = (data: infoAccionistas, filter: string) => {
      const idStr = data.codUsuario;
      return idStr.includes(filterValue);
    };
    this.datos.filter = filterValue.trim();
  }
}