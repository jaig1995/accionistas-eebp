import { Component, ViewEncapsulation,OnInit, ViewChild } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { InformacionAccionistasService } from '../informacion-accionistas/accionistas-data.service';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { infoAccionistas } from './informacion-accionistas.model';
import {NgIf} from "@angular/common";
import { ServicesConfig } from 'app/services.config';



@Component({
    selector     : 'informacion-accionistas',
    standalone   : true,
    imports: [MatSortModule,MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
    templateUrl  : './informacion-accionistas.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class InformacionAccionistasComponent implements OnInit
{
  @ViewChild(MatSort) sort: MatSort;
  private _baseUrl: string = ServicesConfig.apiUrl;
  datos: MatTableDataSource<infoAccionistas>;
  displayedColumns: string[] = [ 'avatar', 'accionista', 'codUsuario', 'nomPri', 'modificarFormatos',  'pdf_datos', 'pdf_autorizacion', 'pdf_declaracion','actualizar'];

  constructor(private userDatos: InformacionAccionistasService) {}

  ngOnInit() {
    this.userDatos.obtenerUsuarios().subscribe(
      (datos: infoAccionistas[]) => {
        this.datos = new MatTableDataSource<infoAccionistas>(datos);
        this.datos.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.datos) {
      this.datos.sort = this.sort;
    }
  }

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filterPredicate = (data: infoAccionistas, filter: string) => {
      const idStr = data.codUsuario;
      return idStr.includes(filterValue);
    };
    this.datos.filter = filterValue.trim();
  }


}