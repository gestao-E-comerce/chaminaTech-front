import { Matriz } from "./matriz";
import { Venda } from "./venda";

export class GestaoCaixa{
    id!: number;
    ativo!: boolean;
    cupom!: number;
    venda!: Venda;
    matriz!: Matriz;
}