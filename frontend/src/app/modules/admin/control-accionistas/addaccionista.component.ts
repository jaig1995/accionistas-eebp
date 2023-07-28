import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, RouterLink } from '@angular/router';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AccionistasService } from './accionistas.service';
import { GeoService } from './geo.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Accionistas } from './accionistas.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  areFieldsDisabled: boolean = false;

 //----------------------------
  
  private _fuseConfirmationService;
  

  constructor(private router: Router,private accionistasService: AccionistasService, private geoService: GeoService, fuseConfirmationService: FuseConfirmationService, private cdRef: ChangeDetectorRef, private cd: ChangeDetectorRef) {

    this.watchTipDocumentoChanges();
    this.tarjetaIdentidad();
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

    departamentos: any[];
    municipios: any[];
    municipiosDomicilio: any[];
    municipiosLaboral: any[];
    municipiosRepresentante: any[];

    selectDepartamento: FormControl = new FormControl('');
    selectMunicipio: FormControl = new FormControl('');

   accionistasForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'tipDocumento':  new FormControl('', Validators.required),
    'razonSocial':  new FormControl ('asdas', Validators.required),
    'nomPri':  new FormControl('Juan', Validators.required),
    'nomSeg': new FormControl('Camilo', Validators.required),
    'apePri':new FormControl('Insuasty', Validators.required),
    'apeSeg':new FormControl('Gomez', Validators.required),
    'codUsuario': new FormControl('123456748', Validators.required),
    'selectDepartamento': new FormControl('', Validators.required),
    'selectMunicipio': new FormControl('', Validators.required),
    'fecNacimiento': new FormControl('7/24/2023', Validators.required),
    'genPersona': new FormControl('Masculino', Validators.required),
    'lugNacimiento': new FormControl('Yacuanquer', Validators.required),
    'estCivPersona': new FormControl('Soltero', Validators.required),
    'celPersona': new FormControl('12354562', Validators.required),
    'profPersona': new FormControl('Abogado', Validators.required),
    'actEcoPersona': new FormControl('empresa', Validators.required),
    'correoPersona': new FormControl('jksjdk@gmail.com', Validators.required),
    'dirPerDomicilio': new FormControl('b/santaclara', Validators.required),
    'barrio': new FormControl('santaclara', Validators.required),
    'selectDepartamentoDomicilio': new FormControl('', Validators.required),
    'selectMunicipioDomicilio': new FormControl('', Validators.required),
    'paisDomicilio': new FormControl('', Validators.required),
    'telfDomicilio': new FormControl('785216', Validators.required),
    'indTelDomicilio': new FormControl('+57', Validators.required),
    'nomEmpresa': new FormControl('chay', Validators.required),
    'dirLaboral': new FormControl('b/mirador', Validators.required),
    'barLab': new FormControl('mirador', Validators.required),
    'selectMunicipioLaboral': new FormControl('', Validators.required),
    'selectDepartamentoLaboral': new FormControl('', Validators.required),
    'paisLaboral': new FormControl('', Validators.required),
    'telfLaboral': new FormControl('75458512', Validators.required),
    'extLaboral': new FormControl('+57', Validators.required),
    'dirCorrespondencia': new FormControl('Direccion laboral', Validators.required),
    'cualLaboratorio': new FormControl('asd', Validators.required),
    'opcPotestad': new FormControl('Si', Validators.required),
    'nomRepresentante': new FormControl('sdfsdf', Validators.required),
    'docRepresentante': new FormControl('CC', Validators.required),
    'codRepresentante': new FormControl('46465', Validators.required),
    'selectMunicipioRepresentante': new FormControl('asdasd', Validators.required),
    'selectDepartamentoRepresentante': new FormControl('', Validators.required),
    'fecNacRepresentante': new FormControl('', Validators.required),
    'lugNacRepresentante': new FormControl('asdasd', Validators.required),
    'genRepresentante': new FormControl('Masculino', Validators.required),
    'estCivRepresentante': new FormControl('Soltero', Validators.required),
    'celRepresentante': new FormControl('454486', Validators.required),
    'profActRepresentante': new FormControl('empresa', Validators.required),
    'correoRepresentante': new FormControl('asd@gmail.com', Validators.required)
  });

  onDepartamentoChange(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.selectDepartamento;
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

  onDepartamentoChangeDomicilio(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.selectDepartamentoDomicilio;
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
    const departamentoId = +this.accionistasForm.value.selectDepartamentoLaboral;
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

  onDepartamentoChangeRepresentante(event: MatSelectChange) {
    const departamentoId = +this.accionistasForm.value.selectDepartamentoRepresentante;
    if (departamentoId) { // Si departamentoId tiene un valor asignado, se ejecuta la solicitud
      this.geoService.getMunicipiosByDepartamento(departamentoId).subscribe(
        (data) => {
          this.municipiosRepresentante = data;
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
      const formData = this.accionistasForm.value;
      this.accionistasService.enviarDatos(formData).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);

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

          this.router.navigate(['control-accionistas/agregar-accionistas/autorizacion']);
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
    this.showAdditionalField = selectedValue === 'RC';
    this.cdRef.detectChanges();
  }

  createPdf(){

    const pdfDefinition: any = {

      content:[
       
      ],
    };

    

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();

  }

  watchTipDocumentoChanges() {
    const tipDocumentoControl = this.accionistasForm.get('tipDocumento');
    const nomPriControl = this.accionistasForm.get('nomPri');
    const nomSegControl = this.accionistasForm.get('nomSeg');
    const apePriControl = this.accionistasForm.get('apePri');
    const apeSegControl = this.accionistasForm.get('apeSeg');

    tipDocumentoControl.valueChanges.subscribe((value) => {
      if (value === 'RC') {
        nomPriControl.disable();
        nomSegControl.disable();
        apePriControl.disable();
        apeSegControl.disable();
      } else {
        nomPriControl.enable();
        nomSegControl.enable();
        apePriControl.enable();
        apeSegControl.enable();
      }
    });
  }

  tarjetaIdentidad() {
    const tipDocumentoControl = this.accionistasForm.get('tipDocumento');

    tipDocumentoControl.valueChanges.subscribe((value) => {
      if (value === 'TI') {
        this.accionistasForm.get('opcPotestad').setValidators([Validators.required]);
        this.accionistasForm.get('nomRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('docRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('codRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('selectMunicipioRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('selectDepartamentoRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('fecNacRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('lugNacRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('genRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('estCivRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('celRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('profActRepresentante').setValidators([Validators.required]);
        this.accionistasForm.get('correoRepresentante').setValidators([Validators.required]);
      } else {
        this.accionistasForm.get('opcPotestad').clearValidators();
        this.accionistasForm.get('nomRepresentante').clearValidators();
        this.accionistasForm.get('docRepresentante').clearValidators();
        this.accionistasForm.get('codRepresentante').clearValidators();
        this.accionistasForm.get('selectMunicipioRepresentante').clearValidators();
        this.accionistasForm.get('selectDepartamentoRepresentante').clearValidators();
        this.accionistasForm.get('fecNacRepresentante').clearValidators();
        this.accionistasForm.get('lugNacRepresentante').clearValidators();
        this.accionistasForm.get('genRepresentante').clearValidators();
        this.accionistasForm.get('estCivRepresentante').clearValidators();
        this.accionistasForm.get('celRepresentante').clearValidators();
        this.accionistasForm.get('profActRepresentante').clearValidators();
        this.accionistasForm.get('correoRepresentante').clearValidators();
      }

      this.accionistasForm.get('opcPotestad').updateValueAndValidity();
      this.accionistasForm.get('nomRepresentante').updateValueAndValidity();
      this.accionistasForm.get('docRepresentante').updateValueAndValidity();
      this.accionistasForm.get('codRepresentante').updateValueAndValidity();
      this.accionistasForm.get('selectMunicipioRepresentante').updateValueAndValidity();
      this.accionistasForm.get('selectDepartamentoRepresentante').updateValueAndValidity();
      this.accionistasForm.get('fecNacRepresentante').updateValueAndValidity();
      this.accionistasForm.get('lugNacRepresentante').updateValueAndValidity();
      this.accionistasForm.get('genRepresentante').updateValueAndValidity();
      this.accionistasForm.get('estCivRepresentante').updateValueAndValidity();
      this.accionistasForm.get('celRepresentante').updateValueAndValidity();
      this.accionistasForm.get('profActRepresentante').updateValueAndValidity();
      this.accionistasForm.get('correoRepresentante').updateValueAndValidity();
    });
  }

}
