import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {NgIf} from "@angular/common";
import { TransaccionesService } from '../transacciones.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Archivos } from '../../control-accionistas/aprobaraccionista/archivos.model';
import { TramiteTransaccion } from '../tramitetransacciones/tramitetransacciones.model';
import { transaccionesPendientes } from '../aprobacionespendientes/aprobacionespendientes.model';
import { Titulos } from './aprobaciones.model';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  standalone   : true,
  imports: [  ReactiveFormsModule,MatSelectModule,MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class AprobacionesComponent {

  archivosAccionista: Archivos[];
  titulos: Titulos[];
  id: string;

  displayedColumns: string[] = ['titulo', 'cantidad'];
  displayedColumnsArchivos: string[] = ['archivos', 'descarga'];

  private _fuseConfirmationService;
  datosTransaccion: transaccionesPendientes;


  constructor(private route: ActivatedRoute,private router: Router,private transaccionesService: TransaccionesService, fuseConfirmationService: FuseConfirmationService) {
    this._fuseConfirmationService = fuseConfirmationService;
  }

  transaccionesForm = new FormGroup({
    'idTransaccion':  new FormControl({ value: '', disabled: true }),
    'tipoTransaccion': new FormControl('', Validators.required),
    'fecTrans': new FormControl({ value: '', disabled: true }),
    'idSolicitante': new FormControl('', Validators.required),
  });

  onSubmit(){

    const formDataAprobacion = {

      idTransaccion: this.transaccionesForm.get('idTransaccion').value,
      
    }; 

    this.transaccionesService.enviarTransaccionAprobada(formDataAprobacion).subscribe(
      (response) => {
        console.log(formDataAprobacion);
      },
      (error) => {
        console.error('Error al cargar la foto', error);
      }
    );

  }

  obtenerDatosAprobacion() {
    this.transaccionesService.obtenerDatosAprobacion(this.id).subscribe(
      (datos: transaccionesPendientes) => {
        console.log(datos);
        this.datosTransaccion = datos;
      
        this.transaccionesForm.patchValue({
          idTransaccion: datos.idTransaccion,
          idSolicitante: datos.persona,
          fecTrans: datos.fecTrans,
          tipoTransaccion: datos.tipoTransaccion,

        });
      
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }

  datosTablas() {

    this.transaccionesService.obtenerTitulosComprados(this.id).subscribe(
      (data: Titulos[]) => {
        this.titulos = data;
        
          this.transaccionesService.obtenerArchivos(this.id).subscribe(
            (dataArchivos: Archivos[]) => {
              this.archivosAccionista = dataArchivos;
            }
            
          );
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        const confirmation = this._fuseConfirmationService.open({

          "title": "Usuario no encontrado",
          "message": "Verifique el código de usuario.",
          "icon": {
            "show": true,
            "name": "heroicons_outline:exclamation-triangle",
            "color": "warn"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Aceptar",
              "color": "warn"
            },
            "cancel": {
              "show": false,
              "label": "Cancel"
            }
          },
          "dismissible": true
  
        });
      }
    );
  }

}
