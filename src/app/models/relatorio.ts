import { Matriz } from './matriz';

export class Relatorio {
  id!: number;
  nome!: string;
  matriz!: Matriz;
  tipoConsulta: string | null = null;
  deletado: boolean | null = null;
  ativo: boolean | null = null;
  funcionarioId: number | null = null;
  clienteId: number | null = null;
  balcao: boolean | null = null;
  retirada: boolean | null = null;
  entrega: boolean | null = null;
  mesa: boolean | null = null;
  dataInicio: string | null = null;
  dataFim: string | null = null;
  taxaEntrega: boolean | null = null;
  taxaServico: boolean | null = null;
  desconto: boolean | null = null;
  pix: boolean | null = null;
  debito: boolean | null = null;
  credito: boolean | null = null;
  dinheiro: boolean | null = null;
  periodoDia: string | null = null;
  tipo: string | null = null;
  caixaId: number | null = null;
  funcionarioNome: string | null = null;
  produtoId: number | null = null;
  materiaId: number | null = null;
  ordenacao: string | null = null;
  pagina: number = 0;
  tamanho: number = 20;

  agrupamento: string  | null = "DIA";
}
