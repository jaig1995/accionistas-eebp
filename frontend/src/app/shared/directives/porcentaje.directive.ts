import { Directive, ElementRef, Input,} from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[porcentaje]',
  standalone: true,
})
export class PorcentajeDirective {
    @Input() porcentaje: string;
    control: FormControl;

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
      this.control = this.el.nativeElement.control;
      if (!this.control) {
        console.error('El elemento no tiene un FormControl asociado.');
        return;
      }

      this.control.valueChanges.subscribe((valorActual: any) => {
        const esPorcentaje = typeof valorActual === 'string' && valorActual.includes('%');
        let valorVisual = esPorcentaje ? valorActual : valorActual + '%';
        this.el.nativeElement.value = valorVisual;
      });
    }
}
