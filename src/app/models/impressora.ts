import { ConfiguracaoImpressao } from "./configuracao-impressao";

export class Impressora {
    id!: number;
    apelidoImpressora!: string;
    nomeImpressora!: string;
    configuracaoImpressao!: ConfiguracaoImpressao;
}