import { Matriz } from "./matriz";
import { Produto } from "./produto";

export class Estoque {
    id!: number;
    ativo!: boolean;
    quantidade!: number;
    quantidadeVendido!: number;
    valorTotal!: number;
    dataCadastrar!: Date;
    dataDesativar!: Date;
    produto!: Produto;
    matriz!: Matriz;
}