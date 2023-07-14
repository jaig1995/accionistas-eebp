import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { UserDataService } from 'app/modules/admin/seguridad/user-data.service';
import { PeriodicElement } from './periodic_element.model';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';



@Component({
    selector     : 'seguridad/usuarios',
    standalone   : true,
    imports: [ MatDividerModule,MatIconModule,RouterModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule],
    templateUrl  : './users.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit
{
  datos: MatTableDataSource<PeriodicElement>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'element'];

  constructor(private userDatos: UserDataService) {}

  ngOnInit() {
    this.userDatos.obtenerDatos().subscribe(
      (datos: PeriodicElement[]) => {
        this.datos = new MatTableDataSource<PeriodicElement>(datos);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filterPredicate = (data: PeriodicElement, filter: string) => {
      const idStr = data.id.toString();
      return idStr === filter;
    };
    this.datos.filter = filterValue.trim();
  }
}

