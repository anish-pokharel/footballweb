import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatchService } from '../../app/service/match.service';
interface Bet {
  fixtures: string;
  selection: string;
  league: string;
  odd: number;
}

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  bettingForm!: FormGroup;
  betData: any[] = [];
  editMode: boolean = false; // Flag for edit mode
  currentBetId: string | null = null;
  constructor(private fb: FormBuilder,private matchService:MatchService) {

    this.bettingForm = this.fb.group({
      fixture: ['', Validators.required],
      selection: ['', Validators.required],
      league: ['', Validators.required],
      odds: ['', [Validators.required, Validators.pattern("^[0-9]*$")]] 
    });
  }
  ngOnInit(): void {
    this.getSavedBetDetails();
  }
  submitBettingForm(): void {
    if (this.bettingForm.valid) {
      const betData = this.bettingForm.value;

      if (this.editMode && this.currentBetId) {
        // If in edit mode, update the existing bet
        this.matchService.updateMatch(this.currentBetId, betData).subscribe({
          next: (res) => {
            alert('Bet updated successfully!');
            this.resetForm();
            this.getSavedBetDetails(); // Refresh saved bets
          },
          error: (err) => {
            console.error('Error updating bet:', err);
            alert('Failed to update bet.');
          }
        });
      } else {
        // Otherwise, create a new bet
        this.matchService.postBet(betData).subscribe({
          next: (res) => {
            alert('Bet submitted successfully!');
            this.resetForm();
            this.getSavedBetDetails(); // Refresh saved bets
          },
          error: (err) => {
            console.error('Error submitting bet:', err);
            alert('Failed to submit bet.');
          }
        });
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }
  getSavedBetDetails(): void {
    this.matchService.getAnswerAssignment().subscribe({
      next: (res) => {
        this.betData = res;
        console.log('Bet data:', this.betData);
      },
      error: (err) => {
        console.error('Error fetching bet data:', err);
      }
    });
  }
  editBet(bet: any): void {
    this.editMode = true;
    this.currentBetId = bet._id;

    // Populate form with the selected bet details
    this.bettingForm.patchValue({
      fixture: bet.fixture,
      selection: bet.selection,
      league: bet.league,
      odds: bet.odds
    });
  }

  // Method to handle deleting a bet
  deleteBet(id: string): void {
    if (confirm('Are you sure you want to delete this bet?')) {
      this.matchService.deleteMatch(id).subscribe({
        next: (res) => {
          alert('Bet deleted successfully!');
          this.getSavedBetDetails(); // Refresh saved bets
        },
        error: (err) => {
          console.error('Error deleting bet:', err);
          alert('Failed to delete bet.');
        }
      });
    }
  }

  // Method to reset the form after submission or cancel
  resetForm(): void {
    this.bettingForm.reset();
    this.editMode = false;
    this.currentBetId = null;
  }
}  