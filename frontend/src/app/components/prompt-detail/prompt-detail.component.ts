import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promptService.getPrompt(id).subscribe({
        next: (data) => {
          this.prompt = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load prompt. It may not exist.';
          this.loading = false;
        }
      });
    }
  }

  getComplexityColor(complexity: number): string {
    if (complexity <= 3) return '#10b981';
    if (complexity <= 7) return '#f59e0b';
    return '#ef4444';
  }
}
