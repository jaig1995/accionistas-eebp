import { Component, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators,FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { Declaracion } from '../declaracion/declaracion.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GeoService } from '../addaccionista/geo.service';
import { Observable, map } from 'rxjs';
import { Representante } from '../declaracion/representante.model';


@Component({
  selector: 'app-actualizardeclaracion',
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
  templateUrl: './actualizardeclaracion.component.html',
  encapsulation: ViewEncapsulation.None,
  
})
export class ActualizardeclaracionComponent {
  datosDeclaracion: Declaracion;
  datosRepresentante: Representante;
  private _fuseConfirmationService;
  id : string;
  public lugarExp: string;
  public nombreCompleto: string;
  public nombreCompletoRepresentante: string;

  constructor(private route: ActivatedRoute, private router: Router, private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService, private geoService: GeoService) {
    this._fuseConfirmationService = fuseConfirmationService;
    // Se obtienen los departamentos 
  }

  declaracionForm = new FormGroup({
    
    'nomPri':  new FormControl({ value: '', disabled: true },),
    'codUsuario':  new FormControl({ value: '', disabled: true },),
    'tipDocumento':  new FormControl({ value: '', disabled: true },),
    'departamentoExp':  new FormControl({ value: '', disabled: true },),
    'nomRepresentante':  new FormControl({ value: '', disabled: true },),
    'codRepresentante':  new FormControl({ value: '', disabled: true },),
    'recursos':  new FormControl('', Validators.required),
    'ingresos':  new FormControl(''),
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.obtenerDatos(); // Llamado del método al inicializar el componente
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosDeclaracion(this.id).subscribe(
      async (datos: Declaracion) => {
        this.datosDeclaracion = datos;

        //this.nombreCompleto = datos.nomPri + ' ' + datos.nomSeg + ' ' + datos.apePri + ' ' + datos.apeSeg;
        this.lugarExp = await this.obtenerMunicipioById(Number(datos.municipioExp)).toPromise();
        this.declaracionForm.patchValue({
          // codUsuario: datos.codUsuario,
          // nomPri: this.nombreCompleto,
          departamentoExp: this.lugarExp,
          // nomRepresentante: datos.nomRepresentante,
          // codRepresentante: datos.codRepresentante,
          // tipDocumento: datos.tipDocumento,
        });
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
    this.accionistasService.obtenerRepresentante(this.id).subscribe(
      (datos: Representante) => {
        this.datosRepresentante = datos;
        // if (datos.nomRepresentante !== null) {
        //   this.declaracionForm.patchValue({
        //     nomRepresentante: datos.nomRepresentante,
        //   });
        // } else {
        //   this.declaracionForm.patchValue({
        //     nomRepresentante: datos.nomAccionista,
        //   });
        // }
        this.declaracionForm.patchValue({
          nomPri: datos.nomAccionista,
          codUsuario: datos.codAccionista,
          tipDocumento: datos.tipoDocRepresentante,
          nomRepresentante: datos.nomRepresentante,
          codRepresentante: datos.codRepresentante,
        });
      }
    );
  }

  onSubmit() { 
    if (this.declaracionForm.valid) {
      const formData = {
        codUsuario: this.declaracionForm.get('codUsuario').value,
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

  obtenerMunicipioById(id: number): Observable<string> {
    return this.geoService.getMunicipioById(id).pipe(
      map(response => response.nombreMunicipio + " - " + response.departamento.nombreDepartamento)
    );
  }

  convertToUpperCase() {
    this.declaracionForm.get('recursos').setValue(this.declaracionForm.get('recursos').value.toUpperCase());
    this.declaracionForm.get('ingresos').setValue(this.declaracionForm.get('ingresos').value.toUpperCase());
  }
}
