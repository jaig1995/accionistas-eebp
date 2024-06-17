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
import { InputAutocompleteComponent } from "../../../../shared/components/inputAutocomplete/inputAutocomplete.component";
import { ServicesConfig } from 'app/services.config';



@Component({
    selector: 'informacion-accionistas',
    standalone: true,
    templateUrl: './informacion-accionistas.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatSortModule, MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf, InputAutocompleteComponent]
})
export class InformacionAccionistasComponent implements OnInit
{
  @ViewChild(MatSort) sort: MatSort;
  private _baseUrl: string = ServicesConfig.apiUrl;
  dataSource: MatTableDataSource<infoAccionistas>;
  displayedColumns: string[] = [ 'avatar', 'accionista', 'codUsuario', 'nomPri', 'modificarFormatos',  'pdf_datos', 'pdf_autorizacion', 'pdf_declaracion','actualizar'];

  accionistaAutoComplete: any;
  //dataSource: any;

  constructor(private userDatos: InformacionAccionistasService) {}

  ngOnInit() {
    this.userDatos.obtenerUsuarios().subscribe(
      (datos: infoAccionistas[]) => {
        this.dataSource = new MatTableDataSource<infoAccionistas>(datos);
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

 
  /**
     * Método que se ejecuta cuando se aplica un filtro en el campo de búsqueda.
     * Aplica el filtro a los datos de la tabla según el valor ingresado en el campo de búsqueda,
     * convirtiendo el valor a minúsculas y eliminando los espacios en blanco al principio y al final.
     * Además, navega a la primera página del paginador si está disponible.
     * @param {Event} event - Evento que contiene el valor ingresado en el campo de búsqueda.
     */
  applyFilter(event): void {
    const filterValue = event
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

///INCIO SECCION COMPONENTE HIJO
obtenerAccionista(valor) {
    this.accionistaAutoComplete = valor.idPer;
    console.log(this.accionistaAutoComplete)
    this.applyFilter(this.accionistaAutoComplete)
}


}