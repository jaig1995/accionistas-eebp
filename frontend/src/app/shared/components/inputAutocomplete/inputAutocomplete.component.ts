import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

import { FuseAlertComponent } from '@fuse/components/alert';
import { ControlTitulosService } from 'app/modules/admin/controlTitulos/controlTitulos.service';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AccionistaInputAutoComplete } from '../interfaces/accionista.interface';

@Component({
    selector: 'app-input-autocomplete',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        FuseAlertComponent,
        AngularMaterialModules
    ],
    templateUrl: 'inputAutocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class InputAutocompleteComponent implements OnInit {

    // inyeccion de dependencias
    private controlTitulosService = inject(ControlTitulosService);

    //variables para los componentes padres
    @Output() accionista = new EventEmitter<AccionistaInputAutoComplete>();
    @Output() valorInput = new EventEmitter<string>();
    @Output() errorFormulario = new EventEmitter<boolean>();
    @Input() asociados: boolean | null ;

    //variables comunicacion desde el PADRE (nombre del label)
    @Input() labelInput: string;

    //autocomplete para accionistas
    accionistas: any[] = [];
    filtroAccionistas: Observable<any[]>;

    //formulario para ingresar datos accionista a buscar
    buscarAccionista = new FormControl('', [Validators.required]);

    ngOnInit(): void {
        this.obtenerAccionistas();
        this.filtroPoderdante();
        this.obtenerErroresFormulario();

        this.buscarAccionista.valueChanges.subscribe(value =>{
            if(this.buscarAccionista.invalid) this.errorFormulario.emit(true)
        })
    }

    /**
     * Método para obtener la lista de accionistas mediante una solicitud al servicio controlTitulosService.
     * Los datos obtenidos se asignan a la propiedad accionistas del componente.
     */
    obtenerAccionistas() {

        // true para listar accionistas
        // false para listar no accionistas
        // null para listar solo personas
        if(this.asociados === true){
            this.controlTitulosService.obtenerAccionistasHabilitados().subscribe(data => {
                this.accionistas = data;
            });
        }else if(this.asociados === false){
            this.controlTitulosService.obtenerAccionistasPersonas().subscribe(data => {
                this.accionistas = data;
            });
        }else if(this.asociados === null){
            this.controlTitulosService.obtenerPersonasNoEmpleados().subscribe(data => {
                this.accionistas = data;
            });
        }
    }


    /**
     * Método para configurar un filtro para la búsqueda de accionistas.
     * Utiliza el valor del formulario buscarAccionista para filtrar la lista de accionistas disponibles.
     * El resultado del filtro se asigna a la propiedad filtroAccionistas.
     */
    filtroPoderdante() {
        this.filtroAccionistas = this.buscarAccionista.valueChanges.pipe(
            startWith(''),
            map(value => this._filtroAccionista(value))
        );
    }


    /**
     * Método privado utilizado para filtrar la lista de accionistas.
     * @param value El valor utilizado como criterio de búsqueda.
     * @returns Un array que contiene los accionistas cuyos nombres incluyen total o parcialmente el valor de búsqueda especificado.
     */
    private _filtroAccionista(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    /**
     * Método utilizado para mostrar el nombre de un accionista en la interfaz de usuario.
     * @param poderdante El accionista del cual se desea mostrar el nombre.
     * @returns El nombre del accionista, o una cadena vacía si no se proporciona un accionista válido.
     */
    mostrarAccionistas(poderdante: any): string {
        return poderdante && poderdante.Nombres ? poderdante.Nombres : '';
    }

    /**
     * Método utilizado para manejar el cambio en el valor del input de búsqueda de accionistas.
     * Emite el valor del input para que otros componentes puedan reaccionar a él.
     */
    cambioInput() {
        const valorInput = this.buscarAccionista.value;
        this.valorInput.emit(valorInput);
    }


    /**
     * Método utilizado para manejar la selección de un accionista en el autocompletado.
     * Emite el accionista seleccionado para que otros componentes puedan reaccionar a él.
     * @param event - Evento de selección del autocompletado.
     */
    accionistaSeleccionado(event: MatAutocompleteSelectedEvent) {
        const poderdanteSeleccionado = event.option.value as AccionistaInputAutoComplete;
        this.accionista.emit(poderdanteSeleccionado);

    }


    /**
     * Método para suscribirse a los cambios de estado del formulario buscarAccionista
     * y emitir un evento errorFormulario con un valor booleano que indica si el formulario es válido o no.
     */
    obtenerErroresFormulario() {
        this.buscarAccionista.statusChanges.subscribe((status) => {
            let validacion = status === 'VALID' ? true : false
            this.errorFormulario.emit(validacion)
        });
    }

    borrarFormulario(){
        this.buscarAccionista.reset()

    }
}
