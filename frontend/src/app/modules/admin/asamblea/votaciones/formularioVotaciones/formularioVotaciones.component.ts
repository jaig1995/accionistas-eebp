import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsambleaService } from '../../asamblea.service';
import { PlantillaPreguntas } from '../../creacionPlantillas/interfaces/asamblea.interface';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { SignosPipe } from 'app/shared/pipes/signos.pipe';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthService } from 'app/core/auth/auth.service';
import CryptoJS from 'crypto-js';

@Component({
    selector: 'app-formulario-votaciones',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SignosPipe,
        CdkAccordionModule,
        ScrollingModule,
        AngularMaterialModules
    ],
    templateUrl: './formularioVotaciones.component.html',

    changeDetection: ChangeDetectionStrategy.Default


})
export class FormularioVotacionesComponent implements OnInit {

    //Inyeccion de dependencias
    private asambleaService = inject(AsambleaService)
    private fb = inject(FormBuilder)
    private _authService = inject(AuthService)

    //Formulario Respuestas de la asamblea
    respuestasAsamblea: FormGroup

    // mostrar tamaño formulario
    claseActual: string = '';

    //recibir objeto con datos del accionista para el formulario
    @Input() datosVotante: string;


    ngOnInit(): void {


        this.inicializarFormularioVacio()
        this.obtenerFormularioAsociado()
        this.subscripcionFormularioRespuestaAsamblea()
        // console.log("token", this.decryptToken())

    }

    subscripcionFormularioRespuestaAsamblea() {
        this.respuestasAsamblea.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                console.log('El formulario es VALIDO');
                const { value: formulario } = this.respuestasAsamblea;
                this.asambleaService.inicializarFormularioAccionista(formulario)
                // console.log('FORMULARIO FINAL cvalido', this.respuestasAsamblea.value)
            } else {
                console.log('El formulario no es válido');
                const { value: formulario } = this.respuestasAsamblea;
                this.asambleaService.inicializarFormularioAccionista(formulario)
                console.log('FORMULARIO FINAL invludo', this.respuestasAsamblea.value)
            }
        });
    }

    inicializarFormularioVacio() {
        this.respuestasAsamblea = this.fb.group({
            datosVotante: [this.datosVotante],
            juntaDirectiva: this.fb.array([]),
            reformaEstatutos: this.fb.array([]),
            distribucionUtilidades: this.fb.array([]),
            revisoriaFiscal: this.fb.array([]),
            estadosFinancieros: this.fb.array([]),
            proposicionesVarios: this.fb.array([]),
        });
    }


    obtenerFormularioAsociado() {
        this.asambleaService.obtenerFormularioAccionista(this.datosVotante).subscribe(
            {
                next: (data:any) => {
                    this.insertarPreguntasFormularioAsamblea(data.juntaDirectiva, 'juntaDirectiva');
                    this.insertarPreguntasFormularioAsamblea(data.reformaEstatutos, 'reformaEstatutos');
                    this.insertarPreguntasFormularioAsamblea(data.distribucionUtilidades, 'distribucionUtilidades');
                    this.insertarPreguntasFormularioAsamblea(data.revisoriaFiscal, 'revisoriaFiscal');
                    this.insertarPreguntasFormularioAsamblea(data.estadosFinancieros, 'estadosFinancieros');
                    this.insertarPreguntasFormularioAsamblea(data.proposicionesVarios, 'proposicionesVarios');
                },
                error: () => {
                    this.asambleaService.obtenerPreguntasAsamblea().subscribe(
                        {
                            next: (data) => {
                                this.insertarPreguntasFormularioAsamblea(data.juntaDirectiva, 'juntaDirectiva');
                                this.insertarPreguntasFormularioAsamblea(data.reformaEstatutos, 'reformaEstatutos');
                                this.insertarPreguntasFormularioAsamblea(data.distribucionUtilidades, 'distribucionUtilidades');
                                this.insertarPreguntasFormularioAsamblea(data.revisoriaFiscal, 'revisoriaFiscal');
                                this.insertarPreguntasFormularioAsamblea(data.estadosFinancieros, 'estadosFinancieros');
                                this.insertarPreguntasFormularioAsamblea(data.proposicionesVarios, 'proposicionesVarios');
                                const { value: formulario } = this.respuestasAsamblea;
                                this.asambleaService.inicializarFormularioAccionista(formulario);
                            }
                        }
                    )
                }
            }
        )
    }


    //metodo pruebas obtener informacion del usuario
    decryptToken(): string {
        const encryptedToken = localStorage.getItem('encryptedToken');
        if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, 'secret-key');
            console.log(bytes)
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            return null;
        }
    }

    // recuperar controls

    get obtenerJuntaDirectiva() {
        return (this.respuestasAsamblea.get('juntaDirectiva') as FormArray)
    }
    get obtenerReformaEstatutos() {
        return (this.respuestasAsamblea.get('reformaEstatutos') as FormArray)
    }
    get obtenerDistribucionUtilidades() {
        return (this.respuestasAsamblea.get('distribucionUtilidades') as FormArray)
    }
    get obtenerRevisoriaFiscal() {
        return (this.respuestasAsamblea.get('revisoriaFiscal') as FormArray)
    }
    get obtenerEstadosFinancieros() {
        return (this.respuestasAsamblea.get('estadosFinancieros') as FormArray)
    }
    get obtenerProposicionesVarios() {
        return (this.respuestasAsamblea.get('proposicionesVarios') as FormArray)
    }

    //validaciones para secciones formulario

    get validacionCheckJuntaDirectivas() {
        return this.respuestasAsamblea.get('juntaDirectiva')
    }
    get validacionCheckReformaEstatutos() {
        return this.respuestasAsamblea.get('reformaEstatutos')
    }
    get validacionCheckDistribucionUtilidades() {
        return this.respuestasAsamblea.get('distribucionUtilidades')
    }
    get validacionCheckRevisoriaFiscal() {
        return this.respuestasAsamblea.get('revisoriaFiscal')
    }
    get validacionCheckEstadosFinanciero() {
        return this.respuestasAsamblea.get('estadosFinancieros')
    }
    get validacionCheckProposicionesVarios() {
        return this.respuestasAsamblea.get('proposicionesVarios')
    }

    // validaciones mostrar seccion

    get mostrarSeccionJuntaDirectiva() {
        let validar = this.respuestasAsamblea.get('juntaDirectiva').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    get mostrarSeccionReformaEstatutos() {
        let validar = this.respuestasAsamblea.get('reformaEstatutos').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    get mostrarSeccionDistribucionUtilidades() {
        let validar = this.respuestasAsamblea.get('distribucionUtilidades').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    get mostrarSeccionrevisoriaFiscal() {
        let validar = this.respuestasAsamblea.get('revisoriaFiscal').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    get mostrarSeccionEstadosFinancieros() {
        let validar = this.respuestasAsamblea.get('estadosFinancieros').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    get mostrarSeccionProposicionesVarios() {
        let validar = this.respuestasAsamblea.get('proposicionesVarios').value
        let opt = validar.length === 0 ? false : true
        return opt
    }

    insertarPreguntasFormularioAsamblea(data: any[], contextoPregunta: string) {
        const controlSubFormularioRespuestasAsamblea = this.respuestasAsamblea.get(contextoPregunta) as FormArray;
        data.forEach(item => {
            const nuevoFormGroup = this.fb.group({
                id: [item.id],
                tipoRespuesta: [item.tipoRespuesta],
                pregunta: [item.pregunta],
                respuestas: [item.respuestas],
                respuestaAccionista: [!!item.respuestaAccionista ? item.respuestaAccionista : '', !!item.respuestas ? Validators.required : null]
            });
            controlSubFormularioRespuestasAsamblea.push(nuevoFormGroup);
        });
    }

    cambiarClase() {
        if (this.claseActual === '') {
            this.claseActual = 'h-160';
        } else {
            this.claseActual = '';
        }
    }
}

