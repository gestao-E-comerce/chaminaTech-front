import { ConfiguracaoImpressao } from "./configuracao-impressao";
import { Matriz } from "./matriz";

export class Identificador {
    id!: number;
    impressoraNome!: string;
    identificadorNome!: string;
    configuracaoImpressao!: ConfiguracaoImpressao;
}