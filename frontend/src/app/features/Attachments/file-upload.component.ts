import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: false,
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() accept: string = '*';
  @Input() multiple: boolean = false;
  @Input() buttonLabel: string = 'Choose Files';
  @Output() fileChange = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  id = `file-upload-${Math.random().toString(36).substring(2)}`;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.fileChange.emit(this.selectedFiles);
    }
  }
}
