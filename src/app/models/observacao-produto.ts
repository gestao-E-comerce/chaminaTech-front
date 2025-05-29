import { Observacoes } from "./observacoes";
import { Produto } from "./produto";

export class ObservacaoProduto {
    id!: number;
    ativo: boolean = true;
    observacoes!: Observacoes;
    produto!: Produto;
    quantidadeGasto!: number;
}