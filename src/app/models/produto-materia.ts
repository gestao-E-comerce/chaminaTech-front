import { Materia } from "./materia";
import { Produto } from "./produto";

export class ProdutoMateria {
    id!: number;
    ativo: boolean = true;
    produto!: Produto;
    materia!: Materia;
    quantidadeGasto!: number;
}
