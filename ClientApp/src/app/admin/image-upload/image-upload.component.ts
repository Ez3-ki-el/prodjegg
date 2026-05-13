import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Input() currentImage: string = '';
  @Input() folder: string = 'general';
  @Input() label: string = 'Image';
  @Output() imageUploaded = new EventEmitter<string>();

  uploading = false;
  dragOver = false;

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.uploadFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  private uploadFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez JPG, PNG, GIF ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop volumineux. Maximum 5 Mo.');
      return;
    }

    this.uploading = true;
    this.uploadService.uploadImage(file, this.folder).subscribe({
      next: (res) => {
        this.currentImage = res.path;
        this.imageUploaded.emit(res.path);
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Erreur lors du téléversement.');
        this.uploading = false;
      }
    });
  }

  removeImage(): void {
    this.currentImage = '';
    this.imageUploaded.emit('');
  }
}
