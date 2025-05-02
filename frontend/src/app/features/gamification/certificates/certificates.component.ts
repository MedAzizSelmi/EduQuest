import { Component, type OnInit } from "@angular/core"
import { GamificationService } from "../../../core/services/gamification.service"
import { Certificate } from "../../../core/models/certificate.model"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatDialog } from "@angular/material/dialog"
import { CertificateViewerComponent } from "./certificate-viewer/certificate-viewer.component"

@Component({
    selector: "app-certificates",
    templateUrl: "./certificates.component.html",
    styleUrls: ["./certificates.component.scss"],
    standalone: false
})
export class CertificatesComponent implements OnInit {
  certificates: Certificate[] = []
  loading = false
  searchTerm = ""
  filteredCertificates: Certificate[] = []

  constructor(
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadCertificates()
  }

  loadCertificates(): void {
    this.loading = true
    this.gamificationService.getUserCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates
        this.filteredCertificates = certificates
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading certificates", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCertificates = this.certificates
      return
    }

    const search = this.searchTerm.toLowerCase()
    this.filteredCertificates = this.certificates.filter(
      (cert) => cert.title.toLowerCase().includes(search) || cert.courseTitle.toLowerCase().includes(search),
    )
  }

  viewCertificate(certificate: Certificate): void {
    this.dialog.open(CertificateViewerComponent, {
      width: "800px",
      data: certificate,
    })
  }

  downloadCertificate(certificate: Certificate): void {
    // In a real application, this would trigger a download
    window.open(certificate.certificateUrl, "_blank")
    this.snackBar.open("Certificate download started", "Close", {
      duration: 3000,
    })
  }

  shareCertificate(certificate: Certificate): void {
    // This would open a share dialog in a real application
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.verificationCode}`

    // For now, just copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        this.snackBar.open("Certificate verification link copied to clipboard", "Close", {
          duration: 3000,
        })
      },
      () => {
        this.snackBar.open("Failed to copy link", "Close", {
          duration: 3000,
        })
      },
    )
  }
}
