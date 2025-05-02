import { Component, type OnInit } from "@angular/core"
import { GamificationService } from "../../../core/services/gamification.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
    selector: "app-levels",
    templateUrl: "./levels.component.html",
    styleUrls: ["./levels.component.scss"],
    standalone: false
})
export class LevelsComponent implements OnInit {
  levelDetails: any = null
  loading = false
  leaderboard: any[] = []
  leaderboardType = "global"

  constructor(
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadLevelDetails()
    this.loadLeaderboard()
  }

  loadLevelDetails(): void {
    this.loading = true
    this.gamificationService.getUserLevelDetails().subscribe({
      next: (details) => {
        this.levelDetails = details
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading level details", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  loadLeaderboard(): void {
    this.gamificationService.getLeaderboard(this.leaderboardType).subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard
      },
      error: (error) => {
        this.snackBar.open("Error loading leaderboard", "Close", {
          duration: 5000,
        })
      },
    })
  }

  changeLeaderboardType(type: string): void {
    this.leaderboardType = type
    this.loadLeaderboard()
  }

  getProgressToNextLevel(): number {
    if (!this.levelDetails) return 0

    const { currentPoints, pointsForCurrentLevel, pointsForNextLevel } = this.levelDetails
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel
    const pointsEarned = currentPoints - pointsForCurrentLevel

    return Math.floor((pointsEarned / pointsNeeded) * 100)
  }

  getPointsToNextLevel(): number {
    if (!this.levelDetails) return 0

    return this.levelDetails.pointsForNextLevel - this.levelDetails.currentPoints
  }
}
