import { Caixa } from "./caixa";
import { Funcionario } from "./funcionario";

export class Sangria {
  id!: number;
  ativo!: boolean;
  motivo!: string;
  valor!: number;
  dataSangria!: Date;
  nomeImpressora!: string | null;
  tipo!: string;
  nomeFuncionario!: string;
  funcionario!: Funcionario;
  caixa!: Caixa;
}
