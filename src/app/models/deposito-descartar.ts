import { Materia } from "./materia";
import { Matriz } from "./matriz";

export class DepositoDescartar {
    id!: number;
    quantidade!: number;
    dataDescartar!: Date;
    materia!: Materia;
    matriz!: Matriz;
    motivo!: string;
}