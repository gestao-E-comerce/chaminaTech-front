import { Matriz } from "./matriz";

export class Relatorio {
  id!: number;
  nome!: string;
  matriz!: Matriz;
  tipoConsulta!: string;
  deletado: boolean | null = null;
  funcionarioId!: number;
  tiposVenda: string[] = [];
  dataInicio!: Date;
  dataFim!: Date;
  taxaEntrega: boolean | null = null;
  taxaServico: boolean | null = null;
  desconto: boolean | null = null;
  formasPagamento: string[] = [];
  ordenacao!: string;
}
