import {
  Component,
  HostListener,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Matriz } from '../../../models/matriz';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatrizService } from '../../../services/matriz.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Impressora } from '../../../models/impressora';
import { ImpressorasMatrizComponent } from './impressoras-matriz/impressoras-matriz.component';
import { GlobalService } from '../../../services/global.service';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EntregaConfComponent } from './entrega-conf/entrega-conf.component';
import { NgClass } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import saveAs from 'file-saver';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';
import { Identificador } from '../../../models/identificador';
import { FuncionarioService } from '../../../services/funcionario.service';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [
    FormsModule,
    ImpressorasMatrizComponent,
    RouterLink,
    EntregaConfComponent,
    NgClass,
    NgxMaskDirective,
  ],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss',
})
export class ConfiguracaoComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  matrizOriginal: Matriz = new Matriz();
  matriz: Matriz = new Matriz();
  identificador: Identificador = new Identificador();
  impressora: Impressora = new Impressora();

  gestaoCaixaService = inject(GestaoCaixaService);
  funcionarioService = inject(FuncionarioService);
  matrizService = inject(MatrizService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  modalRef!: NgbModalRef;

  tipoImpressora!: boolean;
  indice!: number;
  tituloModal!: string;

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          this.matrizOriginal = JSON.parse(JSON.stringify(matriz));
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

  buscarCEP() {
    if (this.matrizOriginal.cep && this.matrizOriginal.cep.length === 8) {
      this.globalService.buscarCEP(this.matrizOriginal.cep).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.matrizOriginal.rua = dados.logradouro;
            this.matrizOriginal.bairro = dados.bairro;
            this.matrizOriginal.cidade = dados.localidade;
            this.matrizOriginal.estado = dados.uf;
          }
        },
        error: () => {
          this.toastr.error('Erro ao buscar CEP.');
        },
      });
    } else {
      this.toastr.warning('Digite um CEP válido com 8 dígitos.');
    }
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
    this.matrizOriginal.impressoras.splice(index, 1);
  }
  retornoImpressora(impressora: Impressora) {
    if (this.matrizOriginal.impressoras == null)
      this.matrizOriginal.impressoras = [];
    if (this.indice == -1) this.matrizOriginal.impressoras.push(impressora);
    else {
      this.matrizOriginal.impressoras[this.indice] = impressora;
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
    this.matrizOriginal.identificador.splice(index, 1);
  }
  retornoIdentificador(identificador: Identificador) {
    if (this.matrizOriginal.identificador == null)
      this.matrizOriginal.identificador = [];
    if (this.indice == -1)
      this.matrizOriginal.identificador.push(identificador);
    else {
      this.matrizOriginal.identificador[this.indice] = identificador;
    }
    this.modalService.dismissAll();
  }
  abrirModalEntregaConf(modalEntregaConf: any) {
    this.modalRef = this.modalService.open(modalEntregaConf, {
      size: 'fullscreen',
    });
    this.tituloModal = 'Configurar Taxas De Entrega';
  }

  verificaEscolhaCadastrar(
    id: number
  ): 'SEMPRE' | 'NUNCA' | 'PERGUNTAR' | undefined {
    const funcionario = this.matrizOriginal.funcionarios.find(
      (f) => f.id === id
    );
    return funcionario?.preferenciaImpressaoProdutoNovo as
      | 'SEMPRE'
      | 'NUNCA'
      | 'PERGUNTAR'
      | undefined;
  }

  atualizarEscolhaCadastrar(
    id: number,
    escolha: 'SEMPRE' | 'NUNCA' | 'PERGUNTAR'
  ) {
    const funcionario = this.matrizOriginal.funcionarios.find(
      (f) => f.id === id
    );
    if (funcionario) {
      funcionario.preferenciaImpressaoProdutoNovo = escolha;
    }
  }

  verificaEscolhaDeletar(
    id: number
  ): 'SEMPRE' | 'NUNCA' | 'PERGUNTAR' | undefined {
    const funcionario = this.matrizOriginal.funcionarios.find(
      (f) => f.id === id
    );
    return funcionario?.preferenciaImpressaoProdutoDeletado as
      | 'SEMPRE'
      | 'NUNCA'
      | 'PERGUNTAR'
      | undefined;
  }

  atualizarEscolhaDeletar(
    id: number,
    escolha: 'SEMPRE' | 'NUNCA' | 'PERGUNTAR'
  ) {
    const funcionario = this.matrizOriginal.funcionarios.find(
      (f) => f.id === id
    );
    if (funcionario) {
      funcionario.preferenciaImpressaoProdutoDeletado = escolha;
    }
  }
  salvar(formulario: any) {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }

    // 1. Validação do formulário
    if (!formulario.valid) {
      this.toastr.error('Formulário inválido. Preencha os campos corretamente');
      Object.keys(formulario.controls).forEach((campo) => {
        formulario.controls[campo].markAsTouched();
      });
      return;
    }

    // 2. Validação de caracteres inválidos
    const invalido = this.matrizOriginal.identificador?.find(
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
    const repetido = this.matrizOriginal.identificador?.find((i) => {
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
    const existeIdentificador = this.matrizOriginal.identificador?.some(
      (i) =>
        `${i.impressoraNome}/${i.identificadorNome}` ===
        identificadorAtual
    );

    if (identificadorAtual && !existeIdentificador) {
      localStorage.removeItem('identificador');
    }

    // 5. Resetar configurações de impressão se uso de impressora estiver desativado
    if (!this.matrizOriginal.usarImpressora) {
      this.matrizOriginal.imprimirComprovanteRecebementoBalcao = false;
      this.matrizOriginal.imprimirComprovanteRecebementoEntrega = false;
      this.matrizOriginal.imprimirComprovanteRecebementoMesa = false;
      this.matrizOriginal.imprimirComprovanteRecebementoRetirada = false;
      this.matrizOriginal.imprimirComprovanteDeletarVenda = false;
      this.matrizOriginal.imprimirComprovanteDeletarProduto = false;
      this.matrizOriginal.imprimirConferenciaEntrega = false;
      this.matrizOriginal.imprimirConferenciaRetirada = false;
      this.matrizOriginal.imprimirNotaFiscal = 1;
      this.matrizOriginal.imprimirCadastrar = 1;
      this.matrizOriginal.imprimirDeletar = 1;
      localStorage.removeItem('identificador');
    }

    // 7. Preparar endereço para geocodificação
    const enderecoCompleto = `${this.matrizOriginal.rua}, ${this.matrizOriginal.numero}, ${this.matrizOriginal.bairro}, ${this.matrizOriginal.cidade}, ${this.matrizOriginal.estado}`;

    // 6. Verifica se endereço foi alterado
    const enderecoAlterado =
      this.matriz.cep !== this.matrizOriginal.cep ||
      this.matriz.rua !== this.matrizOriginal.rua ||
      this.matriz.numero !== this.matrizOriginal.numero ||
      this.matriz.cidade !== this.matrizOriginal.cidade ||
      this.matriz.bairro !== this.matrizOriginal.bairro;

    // 8. Função de salvar final
    const salvarFinal = () => {
      this.matrizService.save(this.matrizOriginal).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          const funcionariosModificados =
            this.matrizOriginal.funcionarios.filter((funcAtual) => {
              const funcOriginal = this.matriz.funcionarios.find(
                (f) => f.id === funcAtual.id
              );
              return (
                funcOriginal &&
                (funcAtual.preferenciaImpressaoProdutoNovo !==
                  funcOriginal.preferenciaImpressaoProdutoNovo ||
                  funcAtual.preferenciaImpressaoProdutoDeletado !==
                    funcOriginal.preferenciaImpressaoProdutoDeletado)
              );
            });

          if (funcionariosModificados.length > 0) {
            this.funcionarioService
              .salvarPreferenciasFuncionarios(funcionariosModificados)
              .subscribe({
                next: () => {
                  this.matriz = JSON.parse(JSON.stringify(this.matrizOriginal)); // aqui sim!
                  this.globalService.limparMatrizSalva();
                },
                error: () =>
                  this.toastr.error(
                    'Erro ao salvar preferências dos funcionários.'
                  ),
              });
          } else {
            this.matriz = JSON.parse(JSON.stringify(this.matrizOriginal)); // aqui também, se nenhum funcionário tiver sido alterado
            this.globalService.limparMatrizSalva();
          }
        },
        error: (erro) => {
          if (erro.status === 409) {
            const confirmar = window.confirm(
              erro.error.message + ' Deseja forçar a remoção?'
            );
            if (confirmar) {
              this.matrizOriginal.forcarRemocaoImpressora = true;
              this.matrizService.save(this.matrizOriginal).subscribe({
                next: (mensagem) => {
                  this.toastr.success(mensagem.mensagem);
                  const funcionariosModificados =
                    this.matrizOriginal.funcionarios.filter((funcAtual) => {
                      const funcOriginal = this.matriz.funcionarios.find(
                        (f) => f.id === funcAtual.id
                      );
                      return (
                        funcOriginal &&
                        (funcAtual.preferenciaImpressaoProdutoNovo !==
                          funcOriginal.preferenciaImpressaoProdutoNovo ||
                          funcAtual.preferenciaImpressaoProdutoDeletado !==
                            funcOriginal.preferenciaImpressaoProdutoDeletado)
                      );
                    });

                  if (funcionariosModificados.length > 0) {
                    this.funcionarioService
                      .salvarPreferenciasFuncionarios(funcionariosModificados)
                      .subscribe({
                        next: () => {
                          this.matriz = JSON.parse(
                            JSON.stringify(this.matrizOriginal)
                          );
                        },
                        error: () =>
                          this.toastr.error(
                            'Erro ao salvar preferências dos funcionários.'
                          ),
                      });
                  } else {
                    this.matriz = JSON.parse(
                      JSON.stringify(this.matrizOriginal)
                    ); // aqui também, se nenhum funcionário tiver sido alterado
                  }
                },
                error: (erroConfirmacao) => {
                  this.toastr.error(
                    'Erro ao forçar a remoção: ' + erroConfirmacao.mensagem
                  );
                },
              });
            } else {
              this.toastr.info('Remoção cancelada pelo usuário.');
            }
          } else {
            this.toastr.error('Erro ao salvar a matriz: ' + erro.error.message);
          }
        },
      });
    };

    // 8. Buscar coordenadas se cep, rua ou bairro mudaram
    if (enderecoAlterado) {
      this.globalService
        .buscarCoordenadasPorEndereco(enderecoCompleto)
        .subscribe({
          next: (coords) => {
            this.matrizOriginal.latitude = coords.lat;
            this.matrizOriginal.longitude = coords.lng;
            salvarFinal();
          },
          error: () => {
            this.toastr.error(
              'Endereço inválido ou não encontrado. Verifique os dados.'
            );
          },
        });
    } else {
      salvarFinal();
    }
  }

  isModified(): boolean {
    return JSON.stringify(this.matriz) !== JSON.stringify(this.matrizOriginal);
  }

  downloadInstaller() {
    this.matrizService.instalar(this.matriz.id).subscribe({
      next: (response: Blob) => {
        saveAs(response, 'installer.zip');
      },
      error: () => {
        console.error('Erro ao baixar o instalador');
      },
    });
  }

  zerarCupons() {
    this.gestaoCaixaService.zerarCupons().subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
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
  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(event: BeforeUnloadEvent): void {
    if (this.isModified()) {
      event.preventDefault();
      event.returnValue = ''; // necessário para mostrar o alerta do navegador
    }
  }
}
