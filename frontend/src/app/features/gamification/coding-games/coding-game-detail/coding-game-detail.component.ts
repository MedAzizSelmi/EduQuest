import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { GamificationService } from "../../../../core/services/gamification.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
    selector: "app-coding-game-detail",
    templateUrl: "./coding-game-detail.component.html",
    styleUrls: ["./coding-game-detail.component.scss"],
    standalone: false
})
export class CodingGameDetailComponent implements OnInit {
  game: any = null
  loading = false
  code = ""
  output = ""
  isRunning = false
  isSubmitting = false
  testResults: any[] = []
  allTestsPassed = false

  constructor(
    private route: ActivatedRoute,
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadGame()
  }

  loadGame(): void {
    this.loading = true
    const gameId = +this.route.snapshot.paramMap.get("id")!

    this.gamificationService.getCodingGameById(gameId).subscribe({
      next: (game) => {
        this.game = game
        this.code = game.starterCode || ""
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading game", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  runCode(): void {
    this.isRunning = true
    this.output = "Running code..."

    // In a real application, this would send the code to a backend service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      this.output = "Code executed successfully!\n\nOutput:\nHello, World!"
      this.isRunning = false
    }, 1500)
  }

  submitSolution(): void {
    this.isSubmitting = true
    this.output = "Testing solution..."

    this.gamificationService.submitCodingGameSolution(this.game.id, this.code).subscribe({
      next: (result) => {
        this.testResults = result.testResults
        this.allTestsPassed = result.allTestsPassed

        if (this.allTestsPassed) {
          this.output = "Congratulations! All tests passed. You've earned " + this.game.pointsToEarn + " points!"
          this.snackBar.open("Challenge completed successfully!", "Close", {
            duration: 5000,
          })
        } else {
          this.output = "Some tests failed. Keep trying!"
        }

        this.isSubmitting = false
      },
      error: (error) => {
        this.output = "Error submitting solution."
        this.snackBar.open("Error submitting solution", "Close", {
          duration: 5000,
        })
        this.isSubmitting = false
      },
    })
  }

  resetCode(): void {
    if (confirm("Are you sure you want to reset your code to the starter code?")) {
      this.code = this.game.starterCode || ""
      this.output = ""
      this.testResults = []
    }
  }
}
