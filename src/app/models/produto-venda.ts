import { Funcionario } from "./funcionario";
import { Observacoes } from "./observacoes";
import { Produto } from "./produto";
import { Venda } from "./venda";

export class ProdutoVenda {
    id!: number;
    ativo!: boolean;
    quantidade!: number;
    valor!: number;
    observacaoProdutoVenda!: string;
    motivoExclusao!: string;
    venda!: Venda;
    data!: Date;
    produto!: Produto;
    funcionario!: Funcionario;
    observacoesProdutoVenda!: Observacoes[];
    selecionado: boolean = false;
    quantidadeTransferir!: number;
}