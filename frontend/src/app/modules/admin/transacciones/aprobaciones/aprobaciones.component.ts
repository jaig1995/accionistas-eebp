import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {NgIf} from "@angular/common";
import { TransaccionesService } from '../transacciones.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  standalone   : true,
  imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class AprobacionesComponent {
  private _fuseConfirmationService;
  constructor(private route: ActivatedRoute,private router: Router,private transaccionesService: TransaccionesService, fuseConfirmationService: FuseConfirmationService) {
    this._fuseConfirmationService = fuseConfirmationService;
  }

  transaccionesForm = new FormGroup({

    'idTransaccion':  new FormControl({ value: '', disabled: true }),
    'tipoTransaccion': new FormControl('', Validators.required),
    'fechaTransaccion': new FormControl({ value: '', disabled: true }),
    'idSolicitante': new FormControl('', Validators.required),
    'tomadores': new FormArray([]),
    'acciones': new FormArray([]),
    'accionesCompra': new FormArray([]),
  });

  // obtenerDatosAprobacion() {
  //   this.transaccione.subscribe(
  //     (datos: Actualizar) => {
  //       console.log(datos);
  //       this.datosActualizar = datos;
       
  //       this.transaccionesForm.patchValue({
  //         tipDocumento: datos.tipDocumento,

  //       });
        
  //     },
  //     error => {
  //       console.error('Error en la solicitud GET:', error);
  //     }
  //   );
  // }

}
