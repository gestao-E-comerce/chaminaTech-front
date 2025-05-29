import { Categoria } from "./categoria";
import { ObservacaoMateria } from "./observacao-materia";
import { ObservacaoProduto } from "./observacao-produto";
import { ProdutoVenda } from "./produto-venda";

export class Observacoes {
    id!: number;
    ativo: boolean = true;
    categoria!: Categoria;
    produtoVenda!: ProdutoVenda;
    observacao!: string;
    valor!: number;
    validarExestencia!: boolean;
    extra!: boolean;
    observacaoMaterias!: ObservacaoMateria[];
    observacaoProdutos!: ObservacaoProduto[];
}