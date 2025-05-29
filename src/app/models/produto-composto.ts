import { Produto } from "./produto";

export class ProdutoComposto {
    id!: number;
    ativo: boolean = true;
    produto!: Produto;
    produtoComposto!: Produto;
    quantidadeGasto!: number;
}