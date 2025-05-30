import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { OperatorService, Operator } from '../../services/operator.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {tap} from "rxjs/operators";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-operator-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    NgOptimizedImage
  ],
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss']
})
export class OperatorListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(OperatorService);

  form!: FormGroup;
  operators: any[] = [];
  loading = false;
  page = 1;
  size = 10;
  totalPages = 0;
  viewMode: 'table' | 'cards' = 'table';

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [''],
      lastName: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.page = 1;
      this.load();
    });

    this.load();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  load() {
    this.loading = true;
    const { firstName, lastName } = this.form.value;
    this.svc.list(this.page, this.size, 'lastName', { firstName, lastName })
      .pipe(tap(() => this.loading = false))
      .subscribe(res => {
        this.operators = res.items;
        this.totalPages = res.totalPages;
      });
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  delete(id: number) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този оператор?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

  getOperatorImage(): string {
    return 'assets/images/person_icon.png';
  }
}
