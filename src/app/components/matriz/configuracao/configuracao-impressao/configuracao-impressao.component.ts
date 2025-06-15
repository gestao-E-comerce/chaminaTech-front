import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracaoImpressao } from '../../../../models/configuracao-impressao';
import { ConfiguracaoImpressaoService } from '../../../../services/configuracaoImpressao.service';
import { GlobalService } from '../../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { ImpressorasMatrizComponent } from '../impressoras-matriz/impressoras-matriz.component';
import { Identificador } from '../../../../models/identificador';
import { Impressora } from '../../../../models/impressora';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Funcionario } from '../../../../models/funcionario';
import { MatrizService } from '../../../../services/matriz.service';
import { saveAs } from 'file-saver';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-configuracao-impressao',
  standalone: true,
  imports: [FormsModule, NgClass, ImpressorasMatrizComponent],
  templateUrl: './configuracao-impressao.component.html',
  styleUrl: './configuracao-impressao.component.scss',
})
export class ConfiguracaoImpressaoComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  confImpressaoOriginal: ConfiguracaoImpressao = new ConfiguracaoImpressao();
  confImpressao: ConfiguracaoImpressao = new ConfiguracaoImpressao();
  identificador: Identificador = new Identificador();
  impressora: Impressora = new Impressora();
  funcionarios: Funcionario[] = [];

  confImpressaoService = inject(ConfiguracaoImpressaoService);
  funcionarioService = inject(FuncionarioService);
  matrizService = inject(MatrizService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  tipoImpressora!: boolean;
  indice!: number;
  tituloModal!: string;

  ngOnInit() {
    this.buscarConfiguracaoImpressao();
    this.buscarFuncionarios();
  }

  buscarConfiguracaoImpressao() {
    this.confImpressaoService.buscarConfiguracaoImpressao().subscribe({
      next: (conf) => {
        this.confImpressaoOriginal = JSON.parse(JSON.stringify(conf));
        this.confImpressao = JSON.parse(JSON.stringify(conf));
      },
    });
  }

  buscarFuncionarios() {
    this.funcionarioService.listarFuncionarios().subscribe({
      next: (list) => {
        this.funcionarios = list.filter((f) => !f.deletado);
      },
    });
  }

  usarImpressora(impressora: Identificador) {
    localStorage.setItem(
      'identificador',
      `${impressora.impressoraNome}/${impressora.identificadorNome}`
    );

    this.toastr.success(
      `Impressora "${impressora.identificadorNome}" definida como em uso.`
    );
  }

  isImpressoraEmUso(impressora: Identificador): boolean {
    return (
      localStorage.getItem('identificador') ===
      `${impressora.impressoraNome}/${impressora.identificadorNome}`
    );
  }

  adicionarImpressora(modalListarImpressoras: any) {
    this.impressora = new Impressora();
    this.indice = -1;
    this.tipoImpressora = false;
    this.modalRef = this.modalService.open(modalListarImpressoras, {
      size: 'lg',
    });

    this.tituloModal = 'Adicionar Impressora Produto';
  }
  editarIdentificador(
    modal: any,
    identificador: Identificador,
    indice: number
  ) {
    this.identificador = Object.assign({}, identificador);
    this.indice = indice;
    this.tipoImpressora = true;
    this.modalService.open(modal, { size: 'lg' });

    this.tituloModal = 'Editar Impressora Caixa';
  }
  deletarImpressora(index: number) {
    this.confImpressao.impressoras.splice(index, 1);
  }
  retornoImpressora(impressora: Impressora) {
    if (this.confImpressao.impressoras == null)
      this.confImpressao.impressoras = [];
    if (this.indice == -1) this.confImpressao.impressoras.push(impressora);
    else {
      this.confImpressao.impressoras[this.indice] = impressora;
    }
    this.modalService.dismissAll();
  }

  adicionarIdentificador(modalListarImpressoras: any) {
    this.identificador = new Identificador();
    this.indice = -1;
    this.tipoImpressora = true;
    this.modalRef = this.modalService.open(modalListarImpressoras, {
      size: 'lg',
    });

    this.tituloModal = 'Adicionar Impressora Caixa';
  }

  editarImpressora(modal: any, impressora: Impressora, indice: number) {
    this.impressora = Object.assign({}, impressora);
    this.indice = indice;
    this.tipoImpressora = false;
    this.modalService.open(modal, { size: 'lg' });

    this.tituloModal = 'Editar Impressora Produto';
  }

  deletarImpressoraCaixa(index: number) {
    this.confImpressao.identificador.splice(index, 1);
  }
  retornoIdentificador(identificador: Identificador) {
    if (this.confImpressao.identificador == null)
      this.confImpressao.identificador = [];
    if (this.indice == -1) this.confImpressao.identificador.push(identificador);
    else {
      this.confImpressao.identificador[this.indice] = identificador;
    }
    this.modalService.dismissAll();
  }
  verificaEscolhaCadastrar(
    id: number
  ): 'SEMPRE' | 'NUNCA' | 'PERGUNTAR' | undefined {
    const funcionario = this.funcionarios.find((f) => f.id === id);
    const valor = funcionario?.preferenciaImpressaoProdutoNovo;
    if (valor === 'SEMPRE' || valor === 'NUNCA' || valor === 'PERGUNTAR') {
      return valor;
    }
    return undefined;
  }
  atualizarEscolhaCadastrar(
    id: number,
    escolha: 'SEMPRE' | 'NUNCA' | 'PERGUNTAR'
  ) {
    const funcionario = this.funcionarios.find((f) => f.id === id);
    if (funcionario) {
      funcionario.preferenciaImpressaoProdutoNovo = escolha;
    }
  }

  verificaEscolhaDeletar(
    id: number
  ): 'SEMPRE' | 'NUNCA' | 'PERGUNTAR' | undefined {
    const funcionario = this.funcionarios.find((f) => f.id === id);
    const valor = funcionario?.preferenciaImpressaoProdutoDeletado;
    if (valor === 'SEMPRE' || valor === 'NUNCA' || valor === 'PERGUNTAR') {
      return valor;
    }
    return undefined;
  }

  atualizarEscolhaDeletar(
    id: number,
    escolha: 'SEMPRE' | 'NUNCA' | 'PERGUNTAR'
  ) {
    const funcionario = this.funcionarios.find((f) => f.id === id);
    if (funcionario) {
      funcionario.preferenciaImpressaoProdutoDeletado = escolha;
    }
  }
  isModified(): boolean {
    return (
      JSON.stringify(this.confImpressaoOriginal) !==
      JSON.stringify(this.confImpressao)
    );
  }

  salvar() {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }

    const invalido = this.confImpressao.identificador?.find(
      (i) => i.impressoraNome.includes('/') || i.identificadorNome.includes('/')
    );
    if (invalido) {
      this.toastr.error(
        'O nome da impressora ou apelido do caixa contém o caractere "/" que não é permitido.'
      );
      return;
    }

    // 3. Validação de apelidos duplicados
    const apelidos = new Set<string>();
    const repetido = this.confImpressao.identificador?.find((i) => {
      const nome = i.identificadorNome.toUpperCase();
      if (apelidos.has(nome)) return true;
      apelidos.add(nome);
      return false;
    });
    if (repetido) {
      this.toastr.error(
        `Já existe outra impressora de caixa com o apelido "${repetido.identificadorNome}". Os apelidos devem ser únicos.`
      );
      return;
    }

    // 4. Remoção do identificador do localStorage se não existir mais
    const identificadorAtual = localStorage.getItem('identificador');
    const existeIdentificador = this.confImpressao.identificador?.some(
      (i) => `${i.impressoraNome}/${i.identificadorNome}` === identificadorAtual
    );

    if (identificadorAtual && !existeIdentificador) {
      localStorage.removeItem('identificador');
    }

    // 5. Resetar configurações de impressão se uso de impressora estiver desativado
    if (!this.confImpressao.usarImpressora) {
      this.confImpressao.imprimirComprovanteRecebementoBalcao = false;
      this.confImpressao.imprimirComprovanteRecebementoEntrega = false;
      this.confImpressao.imprimirComprovanteRecebementoMesa = false;
      this.confImpressao.imprimirComprovanteRecebementoRetirada = false;
      this.confImpressao.imprimirComprovanteDeletarVenda = false;
      this.confImpressao.imprimirComprovanteDeletarProduto = false;
      this.confImpressao.imprimirConferenciaEntrega = false;
      this.confImpressao.imprimirConferenciaRetirada = false;
      this.confImpressao.imprimirNotaFiscal = 1;
      this.confImpressao.imprimirCadastrar = 1;
      this.confImpressao.imprimirDeletar = 1;
      localStorage.removeItem('identificador');
    }

    this.confImpressaoService.salvar(this.confImpressao).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        const funcionariosModificados = this.funcionarios.filter(
          (funcAtual) => {
            const funcOriginal = this.funcionarios.find(
              (f) => f.id === funcAtual.id
            );
            return (
              funcOriginal &&
              (funcAtual.preferenciaImpressaoProdutoNovo !==
                funcOriginal.preferenciaImpressaoProdutoNovo ||
                funcAtual.preferenciaImpressaoProdutoDeletado !==
                  funcOriginal.preferenciaImpressaoProdutoDeletado)
            );
          }
        );

        if (funcionariosModificados.length > 0) {
          this.funcionarioService
            .salvarPreferenciasFuncionarios(funcionariosModificados)
            .subscribe({
              next: () => {
                this.confImpressaoOriginal = JSON.parse(
                  JSON.stringify(this.confImpressao)
                );
                this.globalService.limparMatrizSalva();
              },
              error: () =>
                this.toastr.error(
                  'Erro ao salvar preferências dos funcionários.'
                ),
            });
        } else {
          this.confImpressaoOriginal = JSON.parse(
            JSON.stringify(this.confImpressao)
          );
          this.globalService.limparMatrizSalva();
        }
        this.globalService.limparMatrizSalva();
      },
      error: (erro) => {
        this.toastr.error(
          'Erro ao salvar a configuração entrega: ' + erro.error.message
        );
      },
    });
  }

  downloadInstaller() {
    this.matrizService.instalar().subscribe({
      next: (response: Blob) => {
        saveAs(response, 'installer.zip');
      },
      error: () => {
        console.error('Erro ao baixar o instalador');
      },
    });
  }

  cancelar(): Observable<boolean> {
    if (this.isModified()) {
      return from(
        this.modalService.open(this.modalCancelar, {
          size: 'md',
          backdrop: 'static',
          keyboard: false,
        }).result
      ).pipe(
        take(1),
        switchMap((result) => of(result === 'confirmado')),
        catchError(() => of(false))
      );
    }

    return of(true);
  }
}
