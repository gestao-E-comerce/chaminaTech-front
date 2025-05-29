import { Caixa } from "./caixa";
import { Funcionario } from "./funcionario";

export class Suprimento {
  id!: number;
  ativo!: boolean;
  motivo!: string;
  valor!: number;
  dataSuprimento!: Date;
  nomeImpressora!: string | null;
  funcionario!: Funcionario;
  caixa!: Caixa;
}
