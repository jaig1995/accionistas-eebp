import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ControlTitulosService } from 'app/modules/admin/controlTitulos/controlTitulos.service';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-input-autocomplete',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        FuseAlertComponent,
        InputAutocompleteComponent,
        AngularMaterialModules
    ],
    templateUrl: 'inputAutocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class InputAutocompleteComponent implements OnInit {
    private controlTitulosService = inject(ControlTitulosService);

    @Output() accionista = new EventEmitter<string>();
    @Input() labelInput: string;

    //autocomplete para accionistas
    accionistas: any[] = [];
    filtroAccionistas: Observable<any[]>;

    //formularios
    buscarAccionista = new FormControl('', [Validators.required]);

    ngOnInit(): void {
        this.obtenerAccionistas()
        this.filtroPoderdante()
    }


    obtenerAccionistas() {
        this.controlTitulosService.obtenerAccionistas().subscribe(data => {
            this.accionistas = data;
        });
    }

    filtroPoderdante() {
        this.filtroAccionistas = this.buscarAccionista.valueChanges.pipe(
            startWith(''),
            map(value => this._filtroAccionista(value))
        );
    }

    private _filtroAccionista(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    mostrarAccionistas(poderdante: any): string {
        return poderdante && poderdante.Nombres ? poderdante.Nombres : '';
    }

    //envia al padre
    accionistaSeleccionado(event: MatAutocompleteSelectedEvent) {
        const poderdanteSeleccionado = event.option.value;
        if(!poderdanteSeleccionado) return console.log("hola")
        this.accionista.emit(poderdanteSeleccionado);
      }
}
