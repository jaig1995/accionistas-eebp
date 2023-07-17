import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Modulo, Opcion } from './asignar-permiso.model';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'asignar',
  standalone   : true,
  imports: [CommonModule,FormsModule, MatDividerModule, MatFormFieldModule,MatSelectModule,MatButtonModule],
  templateUrl: './asignar-permiso.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AsignarPermisoComponent {

  modulos: Modulo[] = [
    {
      codModulo: '1',
      nomModulo: 'SEGURIDAD',
      opciones: [
        {
          codOpcion: '1',
          nomOpcion: 'Crear usuario',
        },
        {
          codOpcion: '2',
          nomOpcion: 'Modificar permisos',
        },
      ],
    },
    {
      codModulo: '2',
      nomModulo: 'ACCIONISTAS',
      opciones: [
        {
          codOpcion: '3',
          nomOpcion: 'Registrar accionista',
        },
      ],
    },
  ];

  moduloSeleccionado: string;

  obtenerOpcionesModulo(codModulo: string): Opcion[] {
    const modulo = this.modulos.find(mod => mod.codModulo === codModulo);
    return modulo ? modulo.opciones : [];
  }

}
