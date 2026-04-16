import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-form',
  templateUrl: './prompt-form.component.html',
  styleUrls: ['./prompt-form.component.css']
})
export class PromptFormComponent implements OnInit {
  promptForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  get f() {
    return this.promptForm.controls;
  }

  onSubmit(): void {
    if (this.promptForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.promptService.createPrompt(this.promptForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/prompts']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('An error occurred while creating the prompt.');
      }
    });
  }
}
