export interface Opcion {
    codOpcion: string;
    nomOpcion: string;
  }
  
  export interface Modulo {
    codModulo: string;
    nomModulo: string;
    opciones: Opcion[];
  }