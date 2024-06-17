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
import { RegAccionistas } from '../registraraccionista/registraraccionista.model';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { NgFor, NgIf } from '@angular/common';
import { items } from 'app/mock-api/apps/file-manager/data';
import { MatSelectModule } from '@angular/material/select';

import { startWith, map, switchMap } from 'rxjs/operators';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { Observable } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Accionista } from '../aprobaraccionista/aprobaraccionista.model';
import { Archivos } from '../aprobaraccionista/archivos.model';
import { EsAccionistas } from './modificaraccionista.model';

@Component({
  selector: 'registroaccionista',
  standalone   : true,
  templateUrl: './modificaraccionista.component.html',
  imports: [MatDividerModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
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
export class ModificaraccionistaComponent implements OnInit {

  datosAccionista: RegAccionistas[];
  datosRepresentante: RegAccionistas[];
  displayedColumns: string[] = ['avatar', 'tipDocumento', 'codUsuario', 'nombreUsuario', 'email', 'estadoCivil', 'celular', 'profesion', 'direccionDomicilio'];
  displayedColumnsArchivos: string[] = ['archivos', 'descarga'];
  private _fuseConfirmationService;
  mostrarCampoAdicionalFueraTabla: boolean = false;
  mostrarTablas: boolean = false;
  codigoUsuarioAccionista: string;
  codigoUsuarioRepresentante: string;
  errorMessage: string | undefined; 
  selectedFileMultiple: File[] = [];
  datosAutocompletado: EsAccionistas[] = []; 
  valorSeleccionado: string = '';
  opcionesFiltradas: Observable<EsAccionistas[]>;
  opcionesFiltradasRepresentante: Observable<Actualizar[]>;
  datosActualizar: Accionista;
  archivosAccionista: Archivos[];

  constructor(private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
  }
  
  registroForm = new FormGroup({
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'tipoAccionista': new FormControl('', Validators.required),
    'aprobado': new FormControl('', Validators.required),
    'numCarnet': new FormControl({ value: '', disabled: true },[Validators.required,Validators.pattern('^[0-9]*$')]),
    'file': new FormControl(''),
  })

  ngOnInit() {
    this.registroForm = new FormGroup({
      'codUsuario': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      'tipoAccionista': new FormControl('', Validators.required),
      'aprobado': new FormControl('', Validators.required),
      'numCarnet': new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'file': new FormControl('')
    });

    this.accionistasService.obtenerAccionistasAprobadosRechazados().subscribe((datos: EsAccionistas[]) => {
      const datosFiltrados = datos.filter(item => item.codAccionista);
      this.datosAutocompletado = datosFiltrados;
      this.opcionesFiltradas = this.registroForm.get('codUsuario').valueChanges.pipe(
        startWith(''),
        map(value => this._filtrarOpciones(value))
      );
    });

    // Suscripción al cambio de valor del control 'aprobado'
    this.registroForm.get('aprobado').valueChanges.subscribe(value => {
      if (value === 'S') {
        // Si 'aprobado' es 'Aprobado', deshabilitar el control
        this.registroForm.get('aprobado').disable();
      } else {
        // Si 'aprobado' es diferente de 'Aprobado', habilitar el control
        this.registroForm.get('aprobado').enable();
      }
    });
  }

  private _filtrarOpciones(value: string): EsAccionistas[] {
    
    const filtro = value.toLowerCase();
    return this.datosAutocompletado.filter(opcion => opcion.codAccionista.toLowerCase().includes(filtro));
  }


  onSubmit(){
      
    const formDataAccionista = {

      codUsuario: this.registroForm.get('codUsuario').value,
      tipoAccionista: this.registroForm.get('tipoAccionista').value,
      aprobado: this.registroForm.get('aprobado').value,
    };

    console.log(this.registroForm)
    if (this.registroForm.valid) {
      this.accionistasService.enviarRegistroActualizado(formDataAccionista).subscribe(
        (response) => {

          for (const selectedFile of this.selectedFileMultiple) {
            const formDataArchivo = new FormData();
            formDataArchivo.append("file", selectedFile, "raccionista_" + formDataAccionista.codUsuario + "_" + selectedFile.name); 
            this.accionistasService.enviarArchivo(formDataArchivo).subscribe(
              (response) => {
                console.log(formDataArchivo);
                
              },
              (error) => {
                console.error('Error al cargar la foto', error);
              }
            );
          }

          const confirmation = this._fuseConfirmationService.open({

            "title": "Datos actualizados exitosamente!",
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

          this.mostrarTablas = false;
          this.registroForm.get('codUsuario').setValue('');
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      const confirmation = this._fuseConfirmationService.open({

        "title": "Los datos no fueron enviados!",
        "message": "Por favor revisa que los campos estén diligenciados de forma correcta.",
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
    }
  }
   
  eliminarArchivo(fileName: string) {
    const codUsuario = this.registroForm.get('codUsuario').value; 
    this.accionistasService.eliminarArchivo(fileName).subscribe(
      (archivos: Archivos[]) => {
        
        this.accionistasService.obtenerArchivos(codUsuario).subscribe(
          (dataArchivos: Archivos[]) => {
            this.archivosAccionista = dataArchivos;
            this.mostrarTablas = true;
          }
          
        );
      },
      (error) => {
        console.error('Error al eliminar el archivo', error);
      }
    );
  }

  consultarUsuario() {
    const codUsuario = this.registroForm.get('codUsuario').value; 
  
    this.accionistasService.obtenerDatosRegistro(codUsuario).subscribe(
      (data: RegAccionistas) => {
        console.log(data);
          this.accionistasService.obtenerAccionista(codUsuario).subscribe(
            (datos: Accionista) => {
              console.log(datos);
              this.datosActualizar = datos;
              this.registroForm.patchValue({
                
                tipoAccionista: datos.tipoAccionista,
                numCarnet: datos.numCarnet,
                aprobado: datos.aprobado
      
              });
          });
          this.codigoUsuarioAccionista = codUsuario;
          this.datosAccionista = [data];
          this.mostrarTablas = true;
          this.accionistasService.obtenerArchivos(codUsuario).subscribe(
            (dataArchivos: Archivos[]) => {
              this.archivosAccionista = dataArchivos;
              this.mostrarTablas = true;
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
        this.registroForm.get('codUsuario').setValue('');
      }
    );
  }

  onFileSelectedMultiple(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFileMultiple.push(files[i]);
    }
    console.log(files);
  }

  tablas() {
    this.mostrarTablas = true;
  }

}
