import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Endereco } from '../../../models/endereco';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../../services/global.service';
import { NgClass } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-endereco-detalhes',
  standalone: true,
  imports: [FormsModule, NgClass, NgxMaskDirective],
  templateUrl: './endereco-detalhes.component.html',
  styleUrl: './endereco-detalhes.component.scss',
})
export class EnderecoDetalhesComponent implements OnInit {
  @Input() endereco: Endereco = new Endereco();
  @Output() retorno = new EventEmitter<Endereco>();
  private enderecoOriginal: Partial<Endereco> = {};

  toastr = inject(ToastrService);
  globalService = inject(GlobalService);

  ngOnInit() {
    // salva os dados originais para comparar depois
    this.enderecoOriginal = {
      rua: this.endereco.rua,
      numero: this.endereco.numero,
      bairro: this.endereco.bairro,
      cidade: this.endereco.cidade,
      estado: this.endereco.estado,
    };
  }

  buscarCEP() {
    if (this.endereco.cep && this.endereco.cep.length === 8) {
      this.globalService.buscarCEP(this.endereco.cep).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.endereco.rua = dados.logradouro;
            this.endereco.bairro = dados.bairro;
            this.endereco.cidade = dados.localidade;
            this.endereco.estado = dados.uf;
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

  salvar() {
    if (this.endereco.cep == null) {
      this.toastr.error('Cep invalido!');
      return;
    } else if (this.endereco.rua == null) {
      this.toastr.error('Rua invalido!');
      return;
    } else if (this.endereco.numero == null) {
      this.toastr.error('Número invalido!');
      return;
    } else if (this.endereco.bairro == null) {
      this.toastr.error('Bairro invalido!');
      return;
    } else if (this.endereco.estado == null) {
      this.toastr.error('Estado invalido!');
      return;
    } else if (this.endereco.cidade == null) {
      this.toastr.error('Cidade invalido!');
      return;
    }

    const enderecoCompleto = `${this.endereco.rua}, ${this.endereco.numero}, ${this.endereco.bairro}, ${this.endereco.cidade}, ${this.endereco.estado}`;

    const mesmoEndereco =
      this.endereco.rua === this.enderecoOriginal.rua &&
      this.endereco.bairro === this.enderecoOriginal.bairro &&
      this.endereco.cidade === this.enderecoOriginal.cidade &&
      this.endereco.estado === this.enderecoOriginal.estado &&
      this.endereco.numero === this.enderecoOriginal.numero;

    this.globalService
      .buscarCoordenadasPorEndereco(enderecoCompleto)
      .subscribe({
        next: (coords) => {
          this.endereco.latitude = coords.lat;
          this.endereco.longitude = coords.lng;

          this.toastr.success('Endereço salvo com sucesso');
          this.retorno.emit(this.endereco);
        },
        error: () => {
          this.toastr.error(
            'Endereço inválido ou não encontrado. Verifique os dados.'
          );
        },
      });
    if (mesmoEndereco && this.endereco.latitude && this.endereco.longitude) {
      this.toastr.success('Endereço salvo com sucesso');
      this.retorno.emit(this.endereco);
      return;
    }
  }
}
