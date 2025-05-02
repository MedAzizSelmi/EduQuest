import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { Certificate } from "../../../../core/models/certificate.model"

@Component({
  selector: "app-certificate-viewer",
  templateUrl: "./certificate-viewer.component.html",
  styleUrls: ["./certificate-viewer.component.scss"],
  standalone: false
})
export class CertificateViewerComponent {
  @Inject(MAT_DIALOG_DATA) public certificate: Certificate;

  constructor(
    public dialogRef: MatDialogRef<CertificateViewerComponent>,
    @Inject(MAT_DIALOG_DATA) certificate: Certificate
  ) {
    this.certificate = certificate;
  }

  close(): void {
    this.dialogRef.close()
  }

  print(): void {
    window.print()
  }

  download(): void {
    window.open(this.certificate.certificateUrl, "_blank")
  }
}
