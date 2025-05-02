import { Component, type OnInit } from "@angular/core"
import { GamificationService } from "../../../core/services/gamification.service"
import { Badge, BadgeCategory } from "../../../core/models/badge.model"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-badges",
  templateUrl: "./badges.component.html",
  styleUrls: ["./badges.component.scss"],
  standalone: false
})
export class BadgesComponent implements OnInit {
  badgeCategories: BadgeCategory[] = []
  userBadges: Badge[] = []
  earnedBadges: Badge[] = []

  loading = false
  selectedCategory = "All"

  constructor(
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadBadges();
    this.earnedBadges = this.userBadges.filter(badge => badge.isEarned === true)
  }

  loadBadges(): void {
    this.loading = true

    // Load user badges
    this.gamificationService.getUserBadges().subscribe({
      next: (badges) => {
        this.userBadges = badges

        // Load badge categories
        this.gamificationService.getBadgeCategories().subscribe({
          next: (categories) => {
            this.badgeCategories = categories
            this.loading = false
          },
          error: (error) => {
            this.snackBar.open("Error loading badge categories", "Close", {
              duration: 5000,
            })
            this.loading = false
          },
        })
      },
      error: (error) => {
        this.snackBar.open("Error loading badges", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
  }

  getBadgeProgress(badge: Badge): number {
    // This would be replaced with actual progress logic
    return badge.isEarned ? 100 : Math.floor(Math.random() * 100)
  }

  getFilteredBadges(): Badge[] {
    if (this.selectedCategory === "All") {
      return this.userBadges
    } else if (this.selectedCategory === "Earned") {
      return this.userBadges.filter((badge) => badge.isEarned)
    } else if (this.selectedCategory === "Unearned") {
      return this.userBadges.filter((badge) => !badge.isEarned)
    } else {
      return this.userBadges.filter((badge) => badge.category === this.selectedCategory)
    }
  }
}
