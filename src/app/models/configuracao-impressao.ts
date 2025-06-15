import { Identificador } from './identificador';
import { Impressora } from './impressora';
import { Matriz } from './matriz';

export class ConfiguracaoImpressao {
  id!: number;
  usarImpressora: boolean = true;
  imprimirComprovanteRecebementoBalcao: boolean = true;
  imprimirComprovanteRecebementoEntrega: boolean = true;
  imprimirComprovanteRecebementoMesa: boolean = true;
  imprimirComprovanteRecebementoRetirada: boolean = true;
  imprimirNotaFiscal: number = 0;
  imprimirCadastrar: number = 0;
  imprimirDeletar: number = 0;
  imprimirComprovanteDeletarVenda: boolean = true;
  imprimirComprovanteDeletarProduto: boolean = true;
  imprimirConferenciaRetirada: boolean = true;
  imprimirConferenciaEntrega: boolean = true;
  imprimirConferenciaCaixa: boolean = true;
  imprimirAberturaCaixa: boolean = true;
  imprimirSangria: boolean = true;
  imprimirSuprimento: boolean = true;
  mostarMotivoDeletarVenda: boolean = true;
  mostarMotivoDeletarProduto: boolean = true;
  identificador: Identificador[] = [];
  impressoras: Impressora[] = [];
  matriz!: Matriz;
}
