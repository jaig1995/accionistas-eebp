import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsambleaService } from '../../asamblea.service';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { SignosPipe } from 'app/shared/pipes/signos.pipe';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthService } from 'app/core/auth/auth.service';
import CryptoJS from 'crypto-js';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    @Input() datosVotante: any | undefined;
    @Input() poderDantes: any;
    consecutivoAsamblea: any;


    //bandera de inicializacion
    private formInitialized = false;



    ngOnInit(): void {
        this.inicializarFormularioVacio()
        this.obtenerFormularioAsociado()
        this.subscripcionFormularioRespuestaAsamblea()
    }

    subscripcionFormularioRespuestaAsamblea() {
        this.respuestasAsamblea.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
            .subscribe(formulario => {
                if (this.formInitialized) {
                    this.enviarFormularioVotaciones(formulario);

                } else {
                    this.formInitialized = true;
                }
            });

        // Establecer la bandera a true después de la inicialización completa

    }


    enviarFormularioVotaciones(formulario) {
        this.asambleaService.votar(formulario).subscribe({
            next: (value) => {
                console.log(value)
            }, error: (err) => {
                console.log(err)
            },
        })
    }

    inicializarFormularioVacio() {
        this.respuestasAsamblea = this.fb.group({
            datosPoderdantes: [this.poderDantes ? this.poderDantes : []],
            datosVotante: [[this.datosVotante]],
            juntaDirectiva: this.fb.array([]),
            reformaEstatutos: this.fb.array([]),
            distribucionUtilidades: this.fb.array([]),
            revisoriaFiscal: this.fb.array([]),
            estadosFinancieros: this.fb.array([]),
            proposicionesVarios: this.fb.array([]),
        });
    }


    obtenerFormularioAsociado() {

        const codigoUsuarioVotante = this.datosVotante.codUsuario

        this.asambleaService.obtenerFormularioAccionista2(codigoUsuarioVotante).subscribe(
            {
                next: (data: any) => {
                    this.insertarPreguntasFormularioAsamblea(data?.juntaDirectiva, 'juntaDirectiva');
                    this.insertarPreguntasFormularioAsamblea(data?.revisoriaFiscal, 'revisoriaFiscal');
                    this.insertarPreguntasFormularioAsamblea(data.reformaEstatutos, 'reformaEstatutos');
                    this.insertarPreguntasFormularioAsamblea(data.distribucionUtilidades, 'distribucionUtilidades');
                    this.insertarPreguntasFormularioAsamblea(data.proposicionesVarios, 'proposicionesVarios');
                    if(this.datosVotante?.validacion === 'SI'){
                        this.insertarPreguntasFormularioAsamblea([], 'estadosFinancieros');
                    }else{
                        this.insertarPreguntasFormularioAsamblea(data.estadosFinancieros, 'estadosFinancieros');
                    }
                },
                error: (error) => {
                    this.asambleaService.obtenerConsecutivoAsamblea().subscribe({
                        next: (data) => {
                            this.consecutivoAsamblea = data.ultimoConsecutivo
                            this.asambleaService.obtenerPreguntasAsamblea2(this.consecutivoAsamblea).subscribe(
                                {
                                    next: (data) => {
                                        this.insertarPreguntasFormularioAsamblea(data.juntaDirectiva, 'juntaDirectiva');
                                        this.insertarPreguntasFormularioAsamblea(data.distribucionUtilidades, 'distribucionUtilidades');
                                        this.insertarPreguntasFormularioAsamblea(data.revisoriaFiscal, 'revisoriaFiscal');
                                        this.insertarPreguntasFormularioAsamblea(data.reformaEstatutos, 'reformaEstatutos');
                                        this.insertarPreguntasFormularioAsamblea(data.proposicionesVarios, 'proposicionesVarios');
                                        if(this.datosVotante?.validacion === 'SI'){
                                            this.insertarPreguntasFormularioAsamblea([], 'estadosFinancieros');
                                        }else{
                                            this.insertarPreguntasFormularioAsamblea(data.estadosFinancieros, 'estadosFinancieros');
                                        }
                                        const { value: formulario } = this.respuestasAsamblea;
                                        this.asambleaService.inicializarFormularioAccionista(formulario);
                                    }
                                }
                            )
                        },
                        error: (error) => {
                            this.consecutivoAsamblea = ''
                            console.log('💻🔥 140, formularioVotaciones.component.ts: ', error);
                        }
                    })

                }
            }
        )
    }


    //metodo desemcriptar y  obtener informacion del usuario desde el token y el localstorage
    decryptToken(): string {
        const encryptedToken = localStorage.getItem('encryptedToken');
        if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, 'secret-key');
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
        if (!data) return
        data.forEach(item => {
            const nuevoFormGroup = this.fb.group({
                id: [item.id],
                tipoRespuesta: [item.tipoRespuesta],
                pregunta: [item.pregunta],
                opcionesRespuesta: [item.opcionesRespuesta],
                respuestaAccionista: [item.respuestaAccionista, Validators.required]
                // respuestaAccionista: [!!item.respuestaAccionista ? item.respuestaAccionista : '', !!item.opcionesRespuesta.opcRespuesta ? Validators.required : null]
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

