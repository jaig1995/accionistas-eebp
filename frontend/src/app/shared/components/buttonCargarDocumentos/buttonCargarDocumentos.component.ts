import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-button-cargar-documentos',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule
    ],
    templateUrl: 'buttonCargarDocumentos.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ButtonCargarDocumentosComponent implements OnInit {

    @Output() archivo: EventEmitter<any> = new EventEmitter();
    @Output() contieneArchivo: EventEmitter<boolean> = new EventEmitter(false);
    @Input() nombreBoton: string;
    @Input() formatosAceptados: string;

    archivoSeleccionado: any;
    error: string | null = null;
    readonly maxFileSize: number = 2 * 1024 * 1024;

    ngOnInit(): void {
        // console.log('💻🔥 31, buttonCargarDocumentos.component.ts: ', this.archivo);
    }


    archivoSelecionado(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            if (file.size > this.maxFileSize) {
                this.error = 'Tamaño máximo permitido de 2 MB.';
                this.contieneArchivo.emit(false);
            } else {
                this.archivoSeleccionado = file;
                this.contieneArchivo.emit(true);
                this.error = null; // Clear any previous error
            }
        }
    }

    emitirContieneArchivo(valor: boolean) {
        this.contieneArchivo.emit(valor);
    }

    reset() {
        this.archivoSeleccionado = null;
        this.error = null;
        this.contieneArchivo.emit(false);
    }

    enviarArchivo(nuevoNombre: string) {
        if (!this.archivoSeleccionado) return;

        const fileExtension = this.archivoSeleccionado.name.split('.').pop();
        const nuevoArchivo = new File([this.archivoSeleccionado], nuevoNombre + '.' + fileExtension, {
            type: this.archivoSeleccionado.type,
            lastModified: this.archivoSeleccionado.lastModified
        });

        this.archivoSeleccionado = nuevoArchivo;
        this.archivo.emit(this.archivoSeleccionado)
    }
}
