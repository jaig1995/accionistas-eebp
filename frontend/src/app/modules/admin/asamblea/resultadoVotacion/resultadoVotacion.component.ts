import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-resultado-votacion',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules
    ],
    templateUrl:'resultadoVotacion.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoVotacionComponent {


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['PREGUNTA', 'AFAVOR', 'ENCONTRA', 'VOTACION', ];
    dataSource: MatTableDataSource<any>;
 }
