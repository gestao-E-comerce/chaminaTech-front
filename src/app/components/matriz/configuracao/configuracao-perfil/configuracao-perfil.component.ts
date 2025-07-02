import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Matriz } from '../../../../models/matriz';
import { MatrizService } from '../../../../services/matriz.service';
import { GlobalService } from '../../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-configuracao-perfil',
    imports: [FormsModule, NgClass],
    templateUrl: './configuracao-perfil.component.html',
    styleUrl: './configuracao-perfil.component.scss'
})
export class ConfiguracaoPerfilComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  matrizOriginal: Matriz = new Matriz();
  matriz: Matriz = new Matriz();

  matrizService = inject(MatrizService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = JSON.parse(JSON.stringify(matriz));
          this.matrizOriginal = JSON.parse(JSON.stringify(matriz));
        },
      });
  }

  isModified(): boolean {
    return JSON.stringify(this.matriz) !== JSON.stringify(this.matrizOriginal);
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

  buscarCEP() {
    if (this.matriz.cep && this.matriz.cep.length === 8) {
      this.globalService.buscarCEP(this.matriz.cep).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.matriz.rua = dados.logradouro;
            this.matriz.bairro = dados.bairro;
            this.matriz.cidade = dados.localidade;
            this.matriz.estado = dados.uf;
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

    // 7. Preparar endereço para geocodificação
    const enderecoCompleto = `${this.matriz.rua}, ${this.matriz.numero}, ${this.matriz.bairro}, ${this.matriz.cidade}, ${this.matriz.estado}`;

    // 6. Verifica se endereço foi alterado
    const enderecoAlterado =
      this.matriz.cep !== this.matriz.cep ||
      this.matriz.rua !== this.matriz.rua ||
      this.matriz.numero !== this.matriz.numero ||
      this.matriz.cidade !== this.matriz.cidade ||
      this.matriz.bairro !== this.matriz.bairro;

    // 8. Função de salvar final
    const salvarFinal = () => {
      this.matrizService.save(this.matriz).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.matrizOriginal = JSON.parse(JSON.stringify(this.matriz));
        },
        error: (erro) => {
          this.toastr.error('Erro ao salvar a configuração perfil: ' + erro.error.message);
        },
      });
    };

    // 8. Buscar coordenadas se cep, rua ou bairro mudaram
    if (enderecoAlterado) {
      this.globalService
        .buscarCoordenadasPorEndereco(enderecoCompleto)
        .subscribe({
          next: (coords) => {
            this.matriz.latitude = coords.lat;
            this.matriz.longitude = coords.lng;
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
}
