import { Component, OnInit } from "@angular/core"
import { GamificationService } from "../../../core/services/gamification.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatDialog } from "@angular/material/dialog"

@Component({
    selector: "app-coding-games",
    templateUrl: "./coding-games.component.html",
    styleUrls: ["./coding-games.component.scss"],
    standalone: false
})
export class CodingGamesComponent implements OnInit {
  codingGames: any[] = []
  loading = false
  selectedCategory = "All"
  categories = ["All", "JavaScript", "Python", "Java", "C#", "HTML/CSS"]

  constructor(
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadCodingGames()
  }

  loadCodingGames(): void {
    this.loading = true
    this.gamificationService.getCodingGames().subscribe({
      next: (games) => {
        this.codingGames = games
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading coding games", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
  }

  getFilteredGames(): any[] {
    if (this.selectedCategory === "All") {
      return this.codingGames
    } else {
      return this.codingGames.filter((game) => game.category === this.selectedCategory)
    }
  }

  playGame(game: any): void {
    // Navigate to the game detail page
    // In a real application, this would navigate to a dedicated game page
  }
}
