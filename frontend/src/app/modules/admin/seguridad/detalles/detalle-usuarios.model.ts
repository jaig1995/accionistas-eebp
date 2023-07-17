export interface detalleUsuario {
    codUsuario: number;
    nomUsuario: string;
    apeUsuario: string;
    perfil: string;
    modulos: {
        codModulo: string;
        nomModulo: string;
        opciones: {
          codOpcion: string;
          nomOpcion: string;
        }[];
    }[];
}