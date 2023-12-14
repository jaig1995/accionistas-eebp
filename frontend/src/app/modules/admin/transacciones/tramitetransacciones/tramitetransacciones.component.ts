import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup, AbstractControl, FormArray} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AccionistasService } from 'app/modules/admin/control-accionistas/addaccionista/accionistas.service';
import { CommonModule } from '@angular/common';
import { TransaccionesService } from '../transacciones.service';
import { TramiteTransaccion } from './tramitetransacciones.model';
import { Observable, map, startWith } from 'rxjs';
import { EsAccionistas } from '../../control-accionistas/modificaraccionista/modificaraccionista.model';
import { TablaventaComponent } from '../tablaventa/tablaventa.component';
import { TablaventaModule } from '../tablaventa/tablaventa.component';
import { TablacompraModule } from '../tablacompra/tablacompra.component';
import { SharedDataService } from '../compartirinfo.service';

@Component({
  selector: 'app-tramitetansacciones',
  standalone   : true,
  templateUrl: './tramitetransacciones.component.html',
  imports: [
    TablaventaModule,
    TablacompraModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule, 
    MatAutocompleteModule, 
    MatButtonModule, 
    NgFor, 
    NgIf,
  ],
  encapsulation: ViewEncapsulation.None,
  
})
export class TramitetransaccionesComponent {

  private _fuseConfirmationService;
  datosTramite: TramiteTransaccion;
  selectedFileMultiple: File[] = [];
  envioEnProgreso: boolean = false;

  datosTabla: TramiteTransaccion[];
  datosCompra: any[];
  mostrarTabla: boolean = false;
  mostrarTablaCompra: boolean = false;

  opcionesFiltradas: Observable<EsAccionistas[]>;
  datosAutocompletado: EsAccionistas[] = []; 
  
  
  constructor(private sharedDataService: SharedDataService, private accionistasService: AccionistasService, private transaccionesService: TransaccionesService, fuseConfirmationService: FuseConfirmationService,){
    this._fuseConfirmationService = fuseConfirmationService;
    this.setearFechaActual();
    this.configurarCamposTomador();
  }

  transaccionesForm = new FormGroup({

    'idTransaccion':  new FormControl({ value: '', disabled: true }),
    'tipoTransaccionLV': new FormControl('', Validators.required),
    'fechaTransaccion': new FormControl({ value: '', disabled: true }),
    'idSolicitante': new FormControl('', Validators.required),
    'numAcciones': new FormControl(''),
    'idTomador': new FormControl(''),
    'nomTomador': new FormControl(''),
    'tomadores': new FormArray([]),
  });

  get tomadoresFormArray() {
    return this.transaccionesForm.get('tomadores') as FormArray;
  }

  configurarCamposTomador(): boolean {
    const tipoTransaccionLV = this.transaccionesForm.get('tipoTransaccionLV')?.value;
    return tipoTransaccionLV === 'CO' || tipoTransaccionLV === 'EN' || tipoTransaccionLV === 'DO' || tipoTransaccionLV === 'SU';
  }

  agregarTomador() {
    const nuevoTomador = new FormGroup({
      idTomador: new FormControl(''),
      nomTomador: new FormControl(''),
    });
  
    this.tomadoresFormArray.push(nuevoTomador);
  }

  onSubmit(){

    if (this.transaccionesForm.valid) {
      const tipoTransaccionLV = this.transaccionesForm.get('tipoTransaccionLV')?.value;

      console.log(this.transaccionesForm)
      if(tipoTransaccionLV === 'VE'){
        this.transaccionesService.enviarDatosTramiteVenta(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }else if(tipoTransaccionLV === 'CO'){
        this.transaccionesService.enviarDatosTramiteCompra(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }else if(tipoTransaccionLV === 'DO'){
        this.transaccionesService.enviarDatosTramiteDonacion(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }else if(tipoTransaccionLV === 'EN'){
        this.transaccionesService.enviarDatosTramiteEndoso(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }else if(tipoTransaccionLV === 'SU'){
        this.transaccionesService.enviarDatosTramiteSucesion(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }else if(tipoTransaccionLV === 'EM'){
        this.transaccionesService.enviarDatosTramiteEmbargo(this.transaccionesForm.value).subscribe(
          (response) => {
  
            for (const selectedFile of this.selectedFileMultiple) {
              const formDataArchivo = new FormData();
              formDataArchivo.append("file", selectedFile, "raccionista_" + this.transaccionesForm.get('idSolicitante').value + "_" + selectedFile.name); 
        
              this.transaccionesService.enviarArchivosTramite(formDataArchivo).subscribe(
                (response) => {
                  console.log(formDataArchivo);
                },
                (error) => {
                  console.error('Error al cargar la foto', error);
                }
              );
            }
  
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
          },
          (error) => {
            console.log(error);
          }
        );
      }     
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

  ngOnInit() {
  
    this.accionistasService.obtenerAccionistas().subscribe((datos: EsAccionistas[]) => {
      
      const datosFiltrados = datos.filter(item => item.codAccionista);
      this.datosAutocompletado = datosFiltrados;
      this.opcionesFiltradas = this.transaccionesForm.get('idSolicitante').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpciones(value))
      );

    });
  }

  private _filtrarOpciones(value: string): EsAccionistas[] {
    
    const filtro = value.toLowerCase();
    return this.datosAutocompletado.filter(opcion => opcion.codAccionista.toLowerCase().includes(filtro));
  }

  obtenerDatosFormulario() {
    this.transaccionesService.obtenerDatosTransaccion().subscribe(
      (datos: TramiteTransaccion) => {
        this.datosTramite = datos;

        this.transaccionesForm.patchValue({
          idTransaccion: datos.idTransaccion,
        });
      },
      error => {
        console.error('Error en la solicitud GET:', error);
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

  setearFechaActual() {
    const fechaActual = new Date();
    const fechaFormateada = this.formatoFecha(fechaActual);
    this.transaccionesForm.get('fechaTransaccion').setValue(fechaFormateada);
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = this.padLeft(fecha.getMonth() + 1, 2);
    const day = this.padLeft(fecha.getDate(), 2);

    return `${year}-${month}-${day}`;
  }

  padLeft(value: number, width: number): string {
    return value.toString().padStart(width, '0');
  }

  consultarUsuario() {
    const codUsuario = this.transaccionesForm.get('idSolicitante').value;
    const tipoTransaccionLV = this.transaccionesForm.get('tipoTransaccionLV')?.value;
    
    if(tipoTransaccionLV === 'VE'){
      this.transaccionesService.obtenerTitulosVenta(codUsuario).subscribe(
        (data: TramiteTransaccion[]) => {
          this.datosTabla = data;
          console.log("hola" + data);
          this.sharedDataService.actualizarDatosTabla(data);
          this.mostrarTabla = true;
          
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }else if(tipoTransaccionLV === 'CO'){


      this.transaccionesService.obtenerTitulosCompra().subscribe(
        (data) => {
          this.datosCompra = data;
          console.log("hola" + data);
          this.sharedDataService.actualizarDatosTabla(data);
          this.mostrarTablaCompra = true;
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
    
  }

  tablas(){
    this.mostrarTabla = true;
  }

  tablaCompra(){
    this.mostrarTablaCompra = true;
  }

}
