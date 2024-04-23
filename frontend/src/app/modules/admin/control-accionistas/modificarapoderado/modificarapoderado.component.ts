import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { NgFor, NgIf } from '@angular/common';
import { items } from 'app/mock-api/apps/file-manager/data';
import { MatSelectModule } from '@angular/material/select';
import { RegAccionistas } from '../registraraccionista/registraraccionista.model';
import { modificarRepresentante } from './modificarapoderado.model';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { startWith, map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Accionista } from '../aprobaraccionista/aprobaraccionista.model';

@Component({
  selector: 'modificarapoderado',
  standalone   : true,
  templateUrl: './modificarapoderado.component.html',
  imports: [MatDividerModule,
    CommonModule,
    MatAutocompleteModule,
    MatDividerModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
  
})
export class ModificarapoderadoComponent implements OnInit {

  datosAccionista: modificarRepresentante[];
  datosRepresentante: modificarRepresentante[];
  datosRepresentanteNuevo: RegAccionistas[];
  displayedColumns: string[] = ['avatar', 'codUsuario', 'nombreUsuario'];
  mostrarTablas: boolean = false;
  private _fuseConfirmationService;

  codigoUsuarioAccionista: string;
  codigoUsuarioRepresentante: string;
  mostrarCampoAdicionalFueraTabla: boolean = false;

  datosAutocompletado: modificarRepresentante[] = []; 
  valorSeleccionado: string = '';
  
  opcionesFiltradas: Observable<modificarRepresentante[]>;
  opcionesFiltradasRepresentante: Observable<modificarRepresentante[]>;

  constructor(private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
  }

  modificacionForm = new FormGroup({
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'codRepresentante': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
  })

  
  
  onSubmit(){
      
    const formDataAccionista = {
      codUsuario: this.codigoUsuarioAccionista,
      codRepresentante: this.codigoUsuarioRepresentante,
    };

    if (this.modificacionForm.valid) {
      this.accionistasService.enviarDatosModificacion(formDataAccionista).subscribe(
        (response) => {
          console.log('Respuesta del servidor - Accionista: Datos enviados', response);
          const confirmation = this._fuseConfirmationService.open({

            "title": "Datos enviados exitosamente!",
            "message": "Los datos fueron enviados.",
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
          

        }
      );
    }else{
      const confirmation = this._fuseConfirmationService.open({

        "title": "No se puede asignar un representante!",
        "message": "",
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
      this.router.navigate(['inicio']);
    }
  }

  ngOnInit() {

    this.accionistasService.obtenerCodigosAccionistas().subscribe((datos: modificarRepresentante[]) => {
      this.datosAutocompletado = datos;
      this.opcionesFiltradas = this.modificacionForm.get('codUsuario').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpciones(value))
      );
    });
    this.accionistasService.obtenerCodigosAccionistas().subscribe((datos: modificarRepresentante[]) => {
      this.datosAutocompletado = datos;
      this.opcionesFiltradasRepresentante = this.modificacionForm.get('codRepresentante').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpcionesRepresentante(value))
      );
    });
  }

  private _filtrarOpciones(value: string): modificarRepresentante[] {
      const filtro = value.toLowerCase();
      return this.datosAutocompletado.filter(opcion => opcion.codAccionista.toLowerCase().includes(filtro));
  }
  private _filtrarOpcionesRepresentante(value: string): modificarRepresentante[] {
    const filtro = value.toLowerCase();
    return this.datosAutocompletado.filter(opcion => opcion.codAccionista.toLowerCase().includes(filtro));
}

  consultarUsuario() {
    const codUsuario = this.modificacionForm.get('codUsuario').value; 
  
    this.accionistasService.obtenerDatosModificacion(codUsuario).subscribe(
      
      (data: modificarRepresentante) => {
        if (data.tipoDocAccionista === 'CC' || data.tipoDocAccionista === 'CE' || data.tipoDocAccionista === 'NIT') {
          const confirmation = this._fuseConfirmationService.open({

            "title": "El usuario es su propio representante",
            "message": "",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "warn"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "Aceptar",
                "color": "succes"
              },
              "cancel": {
                "show": false,
                "label": "Cancel"
              }
            },
            "dismissible": true
    
          });
          this.modificacionForm.get('codUsuario').setValue('');
        }else{
          this.codigoUsuarioAccionista = codUsuario;
          this.datosAccionista = [data];
          this.datosRepresentante = [data];
          this.mostrarCampoAdicionalFueraTabla = true;
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
    
  }

  consultarRepresentante() {
    const codRepresentante = this.modificacionForm.get('codRepresentante').value;
    const codUsuario = this.modificacionForm.get('codUsuario').value;
    if (codRepresentante === codUsuario) {

      const confirmation = this._fuseConfirmationService.open({
  
        "title": "El usuario no puede ser su propio representante.",
        "message": "Intente con otro código de usuario.",
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
      
      this.modificacionForm.get('codRepresentante').setValue('');
      
      
    }else{

      this.accionistasService.obtenerDatosRegistro(codRepresentante).subscribe(
        (data: RegAccionistas) => {
          this.mostrarCampoAdicionalFueraTabla = data.codUsuario !== null;
          if (data.tipDocumento === 'TI' || data.tipDocumento === 'RC') {
            const confirmation = this._fuseConfirmationService.open({
              "title": "El representante no puede ser menor de edad.",
              "message": "Asigne un representante mayor de edad.",
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
              "dismissible": false
            });
            this.modificacionForm.get('codRepresentante').setValue('');
          } else {
            // 
            this.codigoUsuarioRepresentante = codRepresentante;
            this.datosRepresentanteNuevo = [data];
          }
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
          this.modificacionForm.get('codRepresentante').setValue('');
        }
      );

    }
    
  }

}
