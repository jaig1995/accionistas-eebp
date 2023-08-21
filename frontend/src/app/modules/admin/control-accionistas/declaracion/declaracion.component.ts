import { Component, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators,FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { Declaracion } from './declaracion.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'autorizacion',
  standalone   : true,
  imports: [MatDividerModule, 
    RouterModule,
    ReactiveFormsModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
   ],
  templateUrl: './declaracion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DeclaracionComponent {
  datosDeclaracion: Declaracion;
  private _fuseConfirmationService;

  constructor(private router: Router, private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService) {
    this._fuseConfirmationService = fuseConfirmationService;
    // Se obtienen los departamentos 
  }

  declaracionForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'nomPri':  new FormControl(''),
    'codUsuario':  new FormControl(''),
    'departamentoExp':  new FormControl(''),
    'nomRepresentante':  new FormControl(''),
    'codRepresentante':  new FormControl(''),
    'recursos':  new FormControl('', Validators.required),
    'ingresos':  new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.obtenerDatos(); // Llamado del método al inicializar el componente
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosDeclaracion().subscribe(
      (datos: Declaracion) => {
        this.datosDeclaracion = datos;

        const nombreCompleto = datos.nomPri + ' ' + datos.nomSeg + ' ' + datos.apePri + ' ' + datos.apeSeg;
        const lugarExp = datos.departamentoExp + ' ' + datos.municipioExp;
        // Establecer el valor de los campos con el valor obtenido de la API
        this.declaracionForm.patchValue({
          codUsuario: datos.codUsuario,
          nomPri: nombreCompleto,
          departamentoExp: lugarExp,
          nomRepresentante: nombreCompleto,
          codRepresentante: datos.codRepresentante,
        });
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }

  onSubmit() { 
    console.log('Datos del formulario:', this.declaracionForm.value);
    if (this.declaracionForm.valid) {
      const formData = {
        recursos: this.declaracionForm.get('recursos').value,
        ingresos: this.declaracionForm.get('ingresos').value,
      };
      this.accionistasService.enviarDatosDeclaracion(formData).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);

          const confirmation = this._fuseConfirmationService.open({

            "title": "Envio de datos exitoso!",
            "message": "Pendiente de aprobación.",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "success"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "Aceptar",
                "color": "primary"
              },
              "cancel": {
                "show": false,
                "label": "Cancel"
              }
            },
            "dismissible": false
    
          });
          this.router.navigate(['inicio']);
        },
        (error) => {
          // Manejo de errores si la petición falla
          console.error('Error en la petición:', error);
        }
      );
    }
  }

}
