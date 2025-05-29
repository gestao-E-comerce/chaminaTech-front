import { Matriz } from "./matriz";
import { Produto } from "./produto";

export class EstoqueDescartar {
    id!: number;
    quantidade!: number;
    dataDescartar!: Date;
    produto!: Produto;
    matriz!: Matriz;
    motivo!: string;
}