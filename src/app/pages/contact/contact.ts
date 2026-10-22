import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  contactForm!: FormGroup;
  submitted = false;
  messageSent = false;
  sending = false;
  errorMessage = '';

  private readonly apiUrl =
    'https://websitelr-backend-gtf3b7agczdcbpdz.westus3-01.azurewebsites.net/api/contact';

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.messageSent = false;
    this.errorMessage = '';

    if (this.contactForm.invalid || this.sending) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending = true;

    this.http.post(this.apiUrl, this.contactForm.value).subscribe({
      next: () => {
        this.messageSent = true;
        this.contactForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.messageSent = false;
        }, 5000);

        this.sending = false;
      },
      error: (error) => {
        console.error('Fehler beim Kontaktformular:', error);

        this.errorMessage =
          'Deine Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.';

        this.sending = false;
      }
    });
  }

  get f() {
    return this.contactForm.controls;
  }
}