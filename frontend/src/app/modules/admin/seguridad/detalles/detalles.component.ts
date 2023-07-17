import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {detalleUsuario} from './detalle-usuarios.model';
import { detallesService } from './detalles.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'detalles',
  standalone   : true,
  imports: [ MatDividerModule,MatIconModule,RouterModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule],
  templateUrl: './detalles.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DetallesComponent implements OnInit {

  id: number;
  usuario: MatTableDataSource<detalleUsuario>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  

  constructor(
    private route: ActivatedRoute,
    private usuarioService: detallesService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.obtenerUsuarioPorId();
  }

  obtenerUsuarioPorId() {
    this.usuarioService.obtenerUsuarioPorId(this.id).subscribe(
      (usuario: detalleUsuario[]) => {
        this.usuario = new MatTableDataSource<detalleUsuario>(usuario);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }
}
