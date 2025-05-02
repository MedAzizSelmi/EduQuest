import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { Badge, BadgeCategory } from "../models/badge.model"
import { Certificate } from "../models/certificate.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class GamificationService {
  private apiUrl = `${environment.apiUrl}/api/gamification`

  constructor(private http: HttpClient) {}

  // Badges
  getUserBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges`)
  }

  getBadgeCategories(): Observable<BadgeCategory[]> {
    return this.http.get<BadgeCategory[]>(`${this.apiUrl}/badges/categories`)
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.http.get<Badge>(`${this.apiUrl}/badges/${id}`)
  }

  // Certificates
  getUserCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/certificates`)
  }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/${id}`)
  }

  verifyCertificate(verificationCode: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/verify/${verificationCode}`)
  }

  // Levels
  getUserLevelDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/levels`)
  }

  // Leaderboard
  getLeaderboard(type = "global", limit = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard?type=${type}&limit=${limit}`)
  }

  // Coding Games
  getCodingGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coding-games`)
  }

  getCodingGameById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coding-games/${id}`)
  }

  submitCodingGameSolution(id: number, solution: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/coding-games/${id}/submit`, { solution })
  }
}
