import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  messageSent = false;

  constructor(private fb: FormBuilder) {}

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
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form submitted with data:', formData);
      
      // Show success message
      this.messageSent = true;
      
      // Reset form
      this.contactForm.reset();
      this.submitted = false;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.messageSent = false;
      }, 5000);
    }
  }

  get f() {
    return this.contactForm.controls;
  }
}
