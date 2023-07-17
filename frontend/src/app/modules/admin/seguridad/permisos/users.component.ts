import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { UserDataService } from 'app/modules/admin/seguridad/permisos/user-data.service';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Usuarios } from './usuarios.model';



@Component({
    selector     : 'permisos-usuarios',
    standalone   : true,
    imports: [ MatDividerModule,MatIconModule,RouterModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule],
    templateUrl  : './users.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit
{
  datos: MatTableDataSource<Usuarios>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'element'];

  constructor(private userDatos: UserDataService) {}

  ngOnInit() {
    this.userDatos.obtenerDatos().subscribe(
      (datos: Usuarios[]) => {
        this.datos = new MatTableDataSource<Usuarios>(datos);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filterPredicate = (data: Usuarios, filter: string) => {
      const idStr = data.id.toString();
      return idStr === filter;
    };
    this.datos.filter = filterValue.trim();
  }
}

