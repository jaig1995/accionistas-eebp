import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AccionistasService } from './accionistas.service';
import { GeoService } from './geo.service';
import { UserDataService } from '../../seguridad/permisos/user-data.service';
import { Usuario } from '../../seguridad/permisos/usuarios.model';

@Component({
  selector: 'agregar-accionista',
  standalone   : true,
  templateUrl: './addaccionista.component.html',
  imports: [MatDatepickerModule,
    RouterModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDividerModule,
    FormsModule, 
    ReactiveFormsModule, 
    NgFor, 
    NgIf],
  encapsulation: ViewEncapsulation.None,
})


export class AddaccionistaComponent {

  showAdditionalField: boolean = false;
  showAdditionalFieldDir: boolean = false;
  showAdditionalFieldUrb: boolean = false;
  showAdditionalFieldDirLab: boolean = false;
  showAdditionalFieldUrbLab: boolean = false;
  showAdditionalFieldCorrespondencia: boolean = false;
  areFieldsDisabled: boolean = false;

 //----------------------------
  
  private _fuseConfirmationService;
  codUsuario: any;

  constructor(private userService: UserDataService, private router: Router,private accionistasService: AccionistasService, private geoService: GeoService, fuseConfirmationService: FuseConfirmationService, private cdRef: ChangeDetectorRef, private cd: ChangeDetectorRef) {
    
    this.accionistasForm.get('calle').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());
    this.accionistasForm.get('numDomicilio').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());
    this.accionistasForm.get('letraDomicilio').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());
    this.accionistasForm.get('num2Domicilio').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());
    this.accionistasForm.get('letra2Domicilio').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());
    this.accionistasForm.get('num3Domicilio').valueChanges.subscribe(() => this.actualizarDireccionDomicilio());

    this.accionistasForm.get('calleLaboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());
    this.accionistasForm.get('numLaboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());
    this.accionistasForm.get('letraLaboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());
    this.accionistasForm.get('num2Laboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());
    this.accionistasForm.get('letra2Laboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());
    this.accionistasForm.get('num3Laboral').valueChanges.subscribe(() => this.actualizarDireccionLaboral());

    this.watchTipDocumentoChanges();

    this._fuseConfirmationService = fuseConfirmationService;
    // Se obtienen los departamentos 
    this.geoService.getDepartamentos().subscribe(
      (data) => {
        this.departamentos = data;
      },
      (error) => {
        console.log('Error al obtener departamentos desde la API');
      }
    );
   }
   codUsuarioPersona: string = '';
   //variable para la huella
    message: any;
    message_2: any;
    base64: any;
    base64_2: any;

    //variables para la firma
    messageFirma: any;
    base64Firma: any;
   
    departamentos: any[];
    municipios: any[];
    municipiosDomicilio: any[];
    municipiosLaboral: any[];
    municipiosRepresentante: any[];
    municipiosPersona: any[];
    municipiosRepresentanteNacimiento: any[];

    selectedFile: File;

    selectDepartamento: FormControl = new FormControl('');
    selectMunicipio: FormControl = new FormControl('');

   accionistasForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'tipDocumento':  new FormControl('', Validators.required),
    'razonSocial':  new FormControl ('', Validators.required),
    'nomPri':  new FormControl('', Validators.required),
    'nomSeg': new FormControl('', Validators.required),
    'apePri':new FormControl('', Validators.required),
    'apeSeg':new FormControl('', Validators.required),
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'departamentoExp': new FormControl('', Validators.required),
    'municipioExp': new FormControl('', Validators.required),
    'fecNacimiento': new FormControl('', Validators.required),
    'genPersona': new FormControl('', Validators.required),
    'depNacimiento': new FormControl('', Validators.required),
    'lugNacimiento': new FormControl('', Validators.required),
    'estCivPersona': new FormControl('', Validators.required),
    'celPersona': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'profPersona': new FormControl('', Validators.required),
    'actEcoPersona': new FormControl('', Validators.required),
    'correoPersona': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    'tipoDireccionDomicilio': new FormControl('', Validators.required),
    'calle': new FormControl(''),
    'numDomicilio': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letraDomicilio': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num2Domicilio': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letra2Domicilio': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num3Domicilio': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'dirDomicilio': new FormControl('', Validators.required),
    'barrioDomicilio': new FormControl('', Validators.required),
    'departamentoDomicilio': new FormControl('', Validators.required),
    'municipioDomicilio': new FormControl('', Validators.required),
    'paisDomicilio': new FormControl('', Validators.required),
    'telfDomicilio': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'indTelDomicilio': new FormControl('', Validators.required),
    'nomEmpresa': new FormControl('', Validators.required),
    'tipoDireccionLaboral': new FormControl('', Validators.required),
    'calleLaboral': new FormControl(''),
    'numLaboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letraLaboral': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num2Laboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letra2Laboral': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num3Laboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'dirLaboral': new FormControl('', Validators.required),
    'barrioLaboral': new FormControl('', Validators.required),
    'municipioLaboral': new FormControl('', Validators.required),
    'departamentoLaboral': new FormControl('', Validators.required),
    'paisLaboral': new FormControl('', Validators.required),
    'telfLaboral': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'extLaboral': new FormControl('', Validators.required),
    'dirCorrespondencia': new FormControl('', Validators.required),
    'otraDirLaboral': new FormControl(''),

    'huella': new FormControl(''),
    'huella2': new FormControl(''),
    'firma': new FormControl(''),
    'file': new FormControl(''),
  });

  onDepartamentoChange(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.departamentoExp;
    if (departamentoId) { // Si departamentoId tiene un valor asignado, se ejecuta la solicitud
      this.geoService.getMunicipiosByDepartamento(departamentoId).subscribe(
        (data) => {
          this.municipios = data;
          this.cd.markForCheck();
        },
        (error) => {
          console.log('Error al obtener municipios desde la API');
        }
      );
    } 
  }

  onDepartamentoNacimiento(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.depNacimiento;
    if (departamentoId) { // Si departamentoId tiene un valor asignado, se ejecuta la solicitud
      this.geoService.getMunicipiosByDepartamento(departamentoId).subscribe(
        (data) => {
          this.municipiosPersona = data;
          this.cd.markForCheck();
        },
        (error) => {
          console.log('Error al obtener municipios desde la API');
        }
      );
    } 
  }

  onDepartamentoChangeDomicilio(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.departamentoDomicilio;
    if (departamentoId) { // Si departamentoId tiene un valor asignado, se ejecuta la solicitud
      this.geoService.getMunicipiosByDepartamento(departamentoId).subscribe(
        (data) => {
          this.municipiosDomicilio = data;
          this.cd.markForCheck();
        },
        (error) => {
          console.log('Error al obtener municipios desde la API');
        }
      );
    } 
  }

  onDepartamentoChangeLaboral(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.departamentoLaboral;
    if (departamentoId) { // Si departamentoId tiene un valor asignado, se ejecuta la solicitud
      this.geoService.getMunicipiosByDepartamento(departamentoId).subscribe(
        (data) => {
          this.municipiosLaboral = data;
          this.cd.markForCheck();
        },
        (error) => {
          console.log('Error al obtener municipios desde la API');
        }
      );
    } 
  }

  onSubmit() { 
    if (this.accionistasForm.valid) {
      console.log('Datos del formulario:', this.accionistasForm.value);
      const formData = this.accionistasForm.value;
      this.accionistasService.enviarDatos(formData).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);

          const formDataFotografia = new FormData();
          formDataFotografia.append("file", this.selectedFile, formData.codUsuario + ".jpg");
          this.accionistasService.enviarFotografia(formDataFotografia).subscribe(
            (response) => {
              console.log('Respuesta del servidor: Foto Cargada', response);
            }
          );
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

          this.router.navigate(['accionistas/agregar/autorizacion/' + this.accionistasForm.get('codUsuario').value]);
        },
        (error) => {
          // Manejo de errores si la petición falla
          console.error('Error en la petición:', error);
        }
      );
    }
  }

  onSelectChange(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showAdditionalField = selectedValue === 'NIT';
    this.cdRef.detectChanges();
  }

  onSelectChangeDireccion(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showAdditionalFieldDir = selectedValue === 'Rural';
    this.showAdditionalFieldUrb = selectedValue === 'Urbana';
    this.cdRef.detectChanges();
  }

  onSelectChangeDireccionLaboral(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showAdditionalFieldDirLab = selectedValue === 'Rural';
    this.showAdditionalFieldUrbLab = selectedValue === 'Urbana';
    this.cdRef.detectChanges();
  }

  onSelectChangeCorrespondencia(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showAdditionalFieldCorrespondencia = selectedValue === 'Otra';
    this.cdRef.detectChanges();
  }

  watchCorrespondencia() {
    const tipoCorrespondencia = this.accionistasForm.get('otraDirLaboral');
    const otraDirLaboral = this.accionistasForm.get('Otra')

    tipoCorrespondencia.valueChanges.subscribe((value) => {
      if (value === 'Otra') {
        otraDirLaboral.enable();
      } else if (value === 'Direccion Laboral' || value === 'Direccion Domicilio'){
        otraDirLaboral.disable();
      }
      
    });
  }

  watchTipDocumentoChanges() {
    const tipDocumentoControl = this.accionistasForm.get('tipDocumento');
    const nomPriControl = this.accionistasForm.get('nomPri');
    const nomSegControl = this.accionistasForm.get('nomSeg');
    const apePriControl = this.accionistasForm.get('apePri');
    const apeSegControl = this.accionistasForm.get('apeSeg');
    const razonSocialControl = this.accionistasForm.get('razonSocial');
  

    tipDocumentoControl.valueChanges.subscribe((value) => {
      if (value === 'NIT') {
        nomPriControl.disable();
        nomSegControl.disable();
        apePriControl.disable();
        apeSegControl.disable();
        razonSocialControl.enable();
      } else if (value === 'CC' || value === 'CE' || value === 'TI' || value === 'RC'){
        nomPriControl.enable();
        nomSegControl.enable();
        apePriControl.enable();
        apeSegControl.enable();
        razonSocialControl.disable();
      }
    });
  }

  opcDomicilio() {
    const tipDocumentoControl = this.accionistasForm.get('tipoDireccionDomicilio');

    tipDocumentoControl.valueChanges.subscribe((value) => {
      if (value === 'Urbana') {
        this.accionistasForm.get('calle').setValidators([Validators.required]);
        this.accionistasForm.get('numDomicilio').setValidators([Validators.required]);
        this.accionistasForm.get('letraDomicilio').setValidators([Validators.required]);
        this.accionistasForm.get('num2Domicilio').setValidators([Validators.required]);
        this.accionistasForm.get('letra2Domicilio').setValidators([Validators.required]);
        this.accionistasForm.get('num3Domicilio').setValidators([Validators.required]);
      } else {
        this.accionistasForm.get('calle').clearValidators();
        this.accionistasForm.get('numDomicilio').clearValidators();
        this.accionistasForm.get('letraDomicilio').clearValidators();
        this.accionistasForm.get('num2Domicilio').clearValidators();
        this.accionistasForm.get('letra2Domicilio').clearValidators();
        this.accionistasForm.get('num3Domicilio').clearValidators();
      }

      this.accionistasForm.get('calle').updateValueAndValidity();;
      this.accionistasForm.get('numDomicilio').updateValueAndValidity();;
      this.accionistasForm.get('letraDomicilio').updateValueAndValidity();;
      this.accionistasForm.get('num2Domicilio').updateValueAndValidity();;
      this.accionistasForm.get('letra2Domicilio').updateValueAndValidity();;
      this.accionistasForm.get('num3Domicilio').updateValueAndValidity();;
    });
  }

  opcLaboral() {
    const tipDocumentoControl = this.accionistasForm.get('tipoDireccionLaboral');

    tipDocumentoControl.valueChanges.subscribe((value) => {
      if (value === 'Urbana') {
        this.accionistasForm.get('calleLaboral').setValidators([Validators.required]);
        this.accionistasForm.get('numLaboral').setValidators([Validators.required]);
        this.accionistasForm.get('letraLaboral').setValidators([Validators.required]);
        this.accionistasForm.get('num2Lboral').setValidators([Validators.required]);
        this.accionistasForm.get('letra2Laboral').setValidators([Validators.required]);
        this.accionistasForm.get('num3Laboral').setValidators([Validators.required]);
      } else {
        this.accionistasForm.get('calleLaboral').clearValidators();
        this.accionistasForm.get('numLaboral').clearValidators();
        this.accionistasForm.get('letraLaboral').clearValidators();
        this.accionistasForm.get('num2Laboral').clearValidators();
        this.accionistasForm.get('letra2Laboral').clearValidators();
        this.accionistasForm.get('num3Laboral').clearValidators();
      }

      this.accionistasForm.get('calleLaboral').updateValueAndValidity();;
      this.accionistasForm.get('numLaboral').updateValueAndValidity();;
      this.accionistasForm.get('letraLaboral').updateValueAndValidity();;
      this.accionistasForm.get('num2Laboral').updateValueAndValidity();;
      this.accionistasForm.get('letra2Laboral').updateValueAndValidity();;
      this.accionistasForm.get('num3Laboral').updateValueAndValidity();;
    });
  }

  private actualizarDireccionDomicilio(){

    const calle = this.accionistasForm.get('calle').value;
    const numero = this.accionistasForm.get('numDomicilio').value;
    const letra = this.accionistasForm.get('letraDomicilio').value;
    const numero2 = this.accionistasForm.get('num2Domicilio').value;
    const letra2 = this.accionistasForm.get('letra2Domicilio').value;
    const numero3 = this.accionistasForm.get('num3Domicilio').value;
    
    this.accionistasForm.get('dirDomicilio').setValue(calle + ' ' + numero + '' + letra + ' ' + numero2 + '' + letra2+ '-' + numero3);
  }

  private actualizarDireccionLaboral(){

    const calleLaboral = this.accionistasForm.get('calleLaboral').value;
    const numeroLaboral = this.accionistasForm.get('numLaboral').value;
    const letraLaboral = this.accionistasForm.get('letraLaboral').value;
    const numero2Laboral = this.accionistasForm.get('num2Laboral').value;
    const letra2Laboral = this.accionistasForm.get('letra2Laboral').value;
    const numero3Laboral = this.accionistasForm.get('num3Laboral').value;
    
    this.accionistasForm.get('dirLaboral').setValue(calleLaboral + ' ' + numeroLaboral + '' + letraLaboral + ' ' + numero2Laboral + '' + letra2Laboral+ '-' + numero3Laboral);
  }

  obtenerHuella() {
    this.accionistasService.peticionGetHuella().subscribe(
      (response) => {
        const base64Data = response.fingerprint.message;
        this.message = 'data:image/png;base64,' + base64Data;
        this.base64 = base64Data;
        this.accionistasForm.get('huella').setValue(this.base64);
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }

  obtenerHuella2() {
    this.accionistasService.peticionGetHuella().subscribe(
      (response) => {
        const base64Data = response.fingerprint.message;
        this.message_2 = 'data:image/png;base64,' + base64Data;
        this.base64_2 = base64Data;
        this.accionistasForm.get('huella2').setValue(this.base64_2);
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }

  obtenerFirma() {
    this.accionistasService.peticionGetFirma().subscribe(
      (response) => {
        const base64DataFirma = response.sign.message;
        this.messageFirma = 'data:image/png;base64,' + base64DataFirma;
        this.base64Firma = base64DataFirma;
        this.accionistasForm.get('firma').setValue(this.base64Firma);
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }

  capturarFirma(){
    this.accionistasService.peticionGetFirmaCaptura().subscribe();
  }

  onChange(){
    const codUsuarioValue = this.accionistasForm.get('codUsuario').value;
    this.userService.obtenerUsuario(codUsuarioValue).subscribe(response => {
        const confirmation = this._fuseConfirmationService.open({
            "title": "La persona ya existe!",
            "message": "Verifica su identificación",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "warn"
            },
            "actions": {
                "confirm": {
                "show": false,
                "label": "Remove",
                "color": "warn"
                },
                "cancel": {
                "show": false,
                "label": "Cancel"
                }
            },
            "dismissible": true
        });
        this.accionistasForm.get('codUsuario').setValue('');
    });

  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
  }

}
