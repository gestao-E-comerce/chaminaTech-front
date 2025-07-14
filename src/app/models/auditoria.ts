export class Auditoria {
  id!: number;
  matrizId!: number;
  operacao: string | null = null;;
  tipo: string | null = null;;
  descricao!: string;
  usuario: string | null = null;
  dataHora!: string;
}
