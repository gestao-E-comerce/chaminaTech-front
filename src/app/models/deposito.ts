import { Materia } from "./materia";
import { Matriz } from "./matriz";

export class Deposito {
    id!: number;
    ativo!: boolean;
    quantidade!: number;
    quantidadeVendido!: number;
    valorTotal!: number;
    dataCadastrar!: Date;
    dataDesativar!: Date;
    materia!: Materia;
    matriz!: Matriz;
}
