import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [
        CommonModule,
        InputAutocompleteComponent,
        AngularMaterialModules
    ],
    templateUrl: 'asistencia.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsistenciaComponent {

    loading: boolean;
    showAlert: any;
    poderdante: string;
    valorInput: string

    displayedColumns: string[] = ['NUMERO', 'ASISTENCIA', 'IDENTIFICACION', 'NOMBRES', 'APELLIDOS', 'TELEFONO', 'CORREO'];
    dataSource: MatTableDataSource<any>;

    obtenerPoderdante(valor: string) {
        this.poderdante = valor;
        console.log("desde obtenerPoderdante", valor)
    }
    obtenerValorInput(valor: string) {
        this.valorInput = valor
        console.log("desde obtenerValorInput", valor)
    }

    buscarAccionista() {

    }
}
