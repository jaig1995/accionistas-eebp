import { Component, ViewEncapsulation, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup, AbstractControl} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AccionistasService } from '../../control-accionistas/addaccionista/accionistas.service';
import { GeoService } from '../../control-accionistas/addaccionista/geo.service';
import { Actualizar } from '../../control-accionistas/actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { forEach } from 'lodash';

@Component({
  selector: 'actualizarinfopersona',
  standalone   : true,
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
    NgIf
  ],
  templateUrl: './actualizarinfopersona.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ActualizarinfopersonaComponent implements OnInit{

  showAdditionalField: boolean = false;
  showAdditionalFieldDir: boolean = false;
  showAdditionalFieldUrb: boolean = false;
  showAdditionalFieldDirLab: boolean = false;
  showAdditionalFieldUrbLab: boolean = false;
  showAdditionalFieldCorrespondencia: boolean = false;
  areFieldsDisabled: boolean = false;

 //----------------------------
  
  private _fuseConfirmationService;
  datosActualizar: Actualizar;
  codUsuario: number;
  
  constructor(private route: ActivatedRoute,private router: Router,private accionistasService: AccionistasService, private geoService: GeoService, fuseConfirmationService: FuseConfirmationService, private cdRef: ChangeDetectorRef, private cd: ChangeDetectorRef) {
    
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

    this.accionistasService.obtenerBancos().subscribe(
      (data) => {
        this.bancos = data;
      }
    );
  }
    id: string;
    message: any;

    bancos: any[];
    departamentos: any[];
    municipios: any[];
    municipiosDomicilio: any[];
    municipiosLaboral: any[];
    
    municipiosPersona: any[];
   

    selectDepartamento: FormControl = new FormControl('');
    selectMunicipio: FormControl = new FormControl('');

   accionistasForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'tipDocumento':  new FormControl('', Validators.required),
    'razonSocial':  new FormControl (''),
    'nomPri':  new FormControl('', Validators.required),
    'nomSeg': new FormControl(''),
    'apePri':new FormControl('', Validators.required),
    'apeSeg':new FormControl(''),
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
    'actEcoPersona': new FormControl(''),
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
    'nomEmpresa': new FormControl(''),
    'tipoDireccionLaboral': new FormControl(''),
    'calleLaboral': new FormControl(''),
    'numLaboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letraLaboral': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num2Laboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'letra2Laboral': new FormControl('', [Validators.pattern(/^[A-Za-z]*$/)]),
    'num3Laboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'dirLaboral': new FormControl(''),
    'barrioLaboral': new FormControl(''),
    'municipioLaboral': new FormControl(''),
    'departamentoLaboral': new FormControl(''),
    'paisLaboral': new FormControl(''),
    'telfLaboral': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'extLaboral': new FormControl(''),
    'dirCorrespondencia': new FormControl(''),
    'otraDirLaboral': new FormControl(''),
    'numCuentaBancaria': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'tipoCuentaBancaria': new FormControl('', Validators.required),
    'entidadBancaria': new FormControl('', Validators.required),
    'numSuscripcion': new FormControl(''),
    'tipoVivienda': new FormControl(''),
    'numPersonas': new FormControl(''),
    'autorizaCorreo': new FormControl(''),
    'autorizaLlamada': new FormControl(''),
    'autorizaTodas': new FormControl(''),
    'autorizaMensaje': new FormControl(''),
    'autorizaFisico': new FormControl(''),
    'recursos': new FormControl(''),
    'ingresos': new FormControl(''),
    'firma': new FormControl(''),
    'huella': new FormControl(''),
    'huella2': new FormControl(''),
  });

  onBancos(){
    this.accionistasService.obtenerBancos().subscribe(data =>{
      this.bancos = data;
    });
  }


  ngOnInit() {
      this.id = this.route.snapshot.paramMap.get('id');
      this.obtenerDatos(); // Llama al método para obtener los datos
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosActualizar(this.id).subscribe(
      (datos: Actualizar) => {
        this.datosActualizar = datos;
        // Establecer el valor de los campos con el valor obtenido de la API
        this.accionistasForm.patchValue({
          tipDocumento: datos.tipDocumento,
          nomPri: datos.nomPri,
          nomSeg: datos.nomSeg,
          apePri: datos.apePri,
          apeSeg: datos.apeSeg,
          codUsuario: datos.codUsuario,
          departamentoExp: datos.departamentoExp,
          municipioExp: datos.municipioExp,
          fecNacimiento: datos.fecNacimiento,
          genPersona: datos.genPersona,
          depNacimiento: datos.depNacimiento,
          lugNacimiento: datos.lugNacimiento,
          estCivPersona: datos.estCivPersona,
          celPersona: datos.celPersona,
          profPersona: datos.profPersona,
          actEcoPersona: datos.actEcoPersona,
          correoPersona: datos.correoPersona,
          tipoDireccionDomicilio: datos.tipoDireccionDomicilio,
          calle: datos.calle,
          numDomicilio: datos.numDomicilio,
          letraDomicilio: datos.letraDomicilio,
          num2Domicilio: datos.num2Domicilio,
          letra2Domicilio: datos.letra2Domicilio,
          num3Domicilio: datos.num3Domicilio,
          dirDomicilio: datos.dirDomicilio,
          barrioDomicilio: datos.barrioDomicilio,
          departamentoDomicilio: datos.departamentoDomicilio,
          municipioDomicilio: datos.municipioDomicilio,
          paisDomicilio: datos.paisDomicilio,
          telfDomicilio: datos.telfDomicilio,
          indTelDomicilio: datos.indTelDomicilio,
          nomEmpresa: datos.nomEmpresa,
          tipoDireccionLaboral: datos.tipoDireccionLaboral,
          calleLaboral: datos.calleLaboral,
          numLaboral: datos.numLaboral,
          letraLaboral: datos.letraLaboral,
          num2Laboral: datos.num2Laboral,
          letra2Laboral: datos.letra2Laboral,
          num3Laboral: datos.num3Laboral,
          dirLaboral: datos.dirLaboral,
          barrioLaboral: datos.barrioLaboral,
          departamentoLaboral: datos.departamentoLaboral,
          municipioLaboral: datos.municipioLaboral,
          paisLaboral: datos.paisLaboral,
          telfLaboral: datos.telfLaboral,
          extLaboral: datos.extLaboral,
          dirCorrespondencia: datos.dirCorrespondencia,
          otraDirLaboral: datos.otraDirLaboral,
          numSuscripcion: datos.numSuscripcion ,
          tipoVivienda: datos.tipoVivienda,
          numPersonas: datos.numPersonas ,
          autorizaCorreo: datos.autorizaCorreo,
          autorizaLlamada: datos.autorizaLlamada,
          autorizaTodas: datos.autorizaTodas,
          autorizaMensaje: datos.autorizaMensaje,
          autorizaFisico: datos.autorizaFisico,
          recursos: datos.recursos,
          ingresos: datos.ingresos,
          firma: datos.firma,
          huella: datos.huella,
          numCuentaBancaria: datos.numCuentaBancaria,
          tipoCuentaBancaria: datos.tipoCuentaBancaria,
          entidadBancaria: datos.entidadBancaria

        });
        this.onDepartamentoChange(null);
        this.onDepartamentoNacimiento(null);
        
        this.onDepartamentoChangeDomicilio(null);
        this.onDepartamentoChangeLaboral(null);
        
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }
   
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
    console.log(this.accionistasForm);
    if (this.accionistasForm.valid) {
      console.log('Datos del formulario:', this.accionistasForm.value);
      const formData = this.accionistasForm.value;
      this.accionistasService.enviarDatos(formData).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);

          const confirmation = this._fuseConfirmationService.open({

            "title": "Datos actualizados exitosamente!",
            "message": "Los datos fueron actualizados.",
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

          this.router.navigate(['/persona/actualizar']);
        },
        (error) => {
          // Manejo de errores si la petición falla
          console.error('Error en la petición:', error);
          const confirmation = this._fuseConfirmationService.open({

            "title": "Los datos no han sido actualizados",
            "message": "Verifique que los campos esten diligenciasdos según corresponde.",
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

  // tarjetaIdentidad() {
  //   const tipDocumentoControl = this.accionistasForm.get('tipDocumento');

  //   tipDocumentoControl.valueChanges.subscribe((value) => {
  //     if (value === 'TI') {
  //       this.accionistasForm.get('opcPotestad').setValidators([Validators.required]);
  //       this.accionistasForm.get('nomRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('tipoDocRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('codRepresentante').setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
  //       this.accionistasForm.get('municipioRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('departamentoRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('fecNacRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('depNacRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('lugNacRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('genRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('estCivRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('celRepresentante').setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
  //       this.accionistasForm.get('profActRepresentante').setValidators([Validators.required]);
  //       this.accionistasForm.get('correoRepresentante').setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]);
  //     } else {
  //       this.accionistasForm.get('opcPotestad').clearValidators();
  //       this.accionistasForm.get('nomRepresentante').clearValidators();
  //       this.accionistasForm.get('tipoDocRepresentante').clearValidators();
  //       this.accionistasForm.get('codRepresentante').clearValidators();
  //       this.accionistasForm.get('municipioRepresentante').clearValidators();
  //       this.accionistasForm.get('departamentoRepresentante').clearValidators();
  //       this.accionistasForm.get('fecNacRepresentante').clearValidators();
  //       this.accionistasForm.get('depNacRepresentante').clearValidators();
  //       this.accionistasForm.get('lugNacRepresentante').clearValidators();
  //       this.accionistasForm.get('genRepresentante').clearValidators();
  //       this.accionistasForm.get('estCivRepresentante').clearValidators();
  //       this.accionistasForm.get('celRepresentante').clearValidators();
  //       this.accionistasForm.get('profActRepresentante').clearValidators();
  //       this.accionistasForm.get('correoRepresentante').clearValidators();
  //     }

  //     this.accionistasForm.get('opcPotestad').updateValueAndValidity();
  //     this.accionistasForm.get('nomRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('tipoDocRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('codRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('municipioRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('departamentoRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('fecNacRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('depNacRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('lugNacRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('genRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('estCivRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('celRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('profActRepresentante').updateValueAndValidity();
  //     this.accionistasForm.get('correoRepresentante').updateValueAndValidity();
  //   });
  // }

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

  tarjetaIdentidad() {
    const tipDocumentoControl = this.accionistasForm.get('tipDocumento');
    const fieldsToDisable = [
      'nomEmpresa',
      'telfLaboral',
      'extLaboral',  // Quitamos 'extLaboral' de los campos requeridos
      'tipoDireccionLaboral',
      'dirLaboral',
      'barrioLaboral',
      'departamentoLaboral',
      'municipioLaboral',
      'paisLaboral',
      'dirCorrespondencia',
      'otraDirCorrespondencia',
    ];
  
    tipDocumentoControl.valueChanges.subscribe((value) => {
      for (const field of fieldsToDisable) {
        const control = this.accionistasForm.get(field);
        if (control) {
          if (value === 'TI') {
            control.disable();
            control.clearValidators();
          } else {
            control.enable();
            control.clearValidators();
            // if (field === 'extLaboral') {
            //   control.clearValidators();
            // } else {
            //   control.setValidators([Validators.required]);
            // }
          }
          control.updateValueAndValidity();
        }
      }
    });
  }
  
  updateValidatorsAndValidity(fieldsToUpdate: string[]) {
    for (const field of fieldsToUpdate) {
      this.accionistasForm.get(field).updateValueAndValidity();
    }
  }

  convertToUpperCase() {
    this.accionistasForm.get('nomPri').setValue(this.accionistasForm.get('nomPri').value.toUpperCase());
    this.accionistasForm.get('nomSeg').setValue(this.accionistasForm.get('nomSeg').value.toUpperCase());
    this.accionistasForm.get('apePri').setValue(this.accionistasForm.get('apePri').value.toUpperCase());
    this.accionistasForm.get('apeSeg').setValue(this.accionistasForm.get('apeSeg').value.toUpperCase());
    this.accionistasForm.get('profPersona').setValue(this.accionistasForm.get('profPersona').value.toUpperCase());
    this.accionistasForm.get('correoPersona').setValue(this.accionistasForm.get('correoPersona').value.toUpperCase());
    //this.accionistasForm.get('letraDomicilio').setValue(this.accionistasForm.get('letraDomicilio').value.toUpperCase());
    //this.accionistasForm.get('letra2Domicilio').setValue(this.accionistasForm.get('letra2Domicilio').value.toUpperCase());
    this.accionistasForm.get('barrioDomicilio').setValue(this.accionistasForm.get('barrioDomicilio').value.toUpperCase());
    this.accionistasForm.get('nomEmpresa').setValue(this.accionistasForm.get('nomEmpresa').value.toUpperCase());
    //this.accionistasForm.get('letraLaboral').setValue(this.accionistasForm.get('letraLaboral').value.toUpperCase());
    //this.accionistasForm.get('letra2Laboral').setValue(this.accionistasForm.get('letra2Laboral').value.toUpperCase());
    this.accionistasForm.get('barrioLaboral').setValue(this.accionistasForm.get('barrioLaboral').value.toUpperCase());
    this.accionistasForm.get('otraDirLaboral').setValue(this.accionistasForm.get('otraDirLaboral').value.toUpperCase());
  }

  maxLengthValidator(maxLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.length > maxLength) {
        return { 'maxLengthExceeded': true };
      }
      return null;
    };
  }

  dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora actual a las 00:00:00 para comparaciones de fecha.

    // Comprobar si la fecha seleccionada es mayor que la fecha actual
    if (selectedDate > currentDate) {
      return { 'invalidDateOfBirth': true };
    }

    return null; // La fecha es válida
  }

}
