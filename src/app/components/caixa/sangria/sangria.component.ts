import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sangria } from '../../../models/sangria';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from '../../../models/funcionario';
import { LoginService } from '../../../services/login.service';
import { SangriaService } from '../../../services/sangria.service';

@Component({
  selector: 'app-sangria',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './sangria.component.html',
  styleUrl: './sangria.component.scss',
})
export class SangriaComponent {
  @Output() retorno = new EventEmitter<any>();
  @Input() sangria: Sangria = new Sangria();
  funcionario: Funcionario = new Funcionario();

  toastr = inject(ToastrService);
  sangriaService = inject(SangriaService);
  loginService = inject(LoginService);
  modalService = inject(NgbModal);

  modalRef!: NgbModalRef;

  salvar(modalConfermacao: any, formulario: any) {
    if (!formulario.valid) {
      this.toastr.error('Formulário inválido. Preencha os campos corretamente');
      Object.keys(formulario.controls).forEach((campo) => {
        formulario.controls[campo].markAsTouched();
      });
    } else {
      this.modalRef = this.modalService.open(modalConfermacao, { size: 'mm' });
    }
  }
  confirmarSangria() {
    this.funcionario.id = this.loginService.getUser().id;
    this.funcionario.nome = this.loginService.getUser().nome;
    this.sangria.funcionario = this.funcionario;
    this.sangria.nomeImpressora = this.getNomeImpressora();
    this.sangriaService.save(this.sangria).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalService.dismissAll();
        this.retorno.emit('ok');
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
        this.modalRef.close();
      },
    });
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }
}
