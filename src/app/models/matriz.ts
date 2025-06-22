import { ConfiguracaoEntrega } from './configuracao-entrega';
import { ConfiguracaoImpressao } from './configuracao-impressao';
import { ConfiguracaoRetirada } from './configuracao-retirada';
import { ConfiguracaoTaxaServico } from './configuracao-taxa-servico';
import { Usuario } from './usuario';

export class Matriz extends Usuario {
  matriz!: Matriz;
  estado!: string;
  cidade!: string;
  bairro!: string;
  cep!: string;
  rua!: string;
  numero!: number;
  latitude?: number;
  longitude?: number;
  limiteFuncionarios!: number;

  configuracaoEntrega!: ConfiguracaoEntrega;
  configuracaoRetirada!: ConfiguracaoRetirada;
  configuracaoImpressao!: ConfiguracaoImpressao;
  configuracaoTaxaServicio!: ConfiguracaoTaxaServico;
}
