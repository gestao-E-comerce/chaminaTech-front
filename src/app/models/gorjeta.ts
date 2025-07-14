import { Caixa } from './caixa';
import { Funcionario } from './funcionario';

export class Gorjeta {
  id!: number;
  ativo!: boolean;
  dinheiro!: number;
  debito!: number;
  credito!: number;
  pix!: number;
  dataGorjeta!: Date;
  nomeImpressora!: string | null;
  funcionario!: Funcionario;
  caixa!: Caixa;
}
