import { Component, OnInit } from '@angular/core';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;

  constructor(private promptService: PromptService) { }

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getComplexityColor(complexity: number): string {
    if (complexity <= 3) return '#10b981'; // Green
    if (complexity <= 7) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  }
}
