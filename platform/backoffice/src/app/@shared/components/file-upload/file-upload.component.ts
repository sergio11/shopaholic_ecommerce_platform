import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {

  @Input() fileSelected: File | undefined;
  @Output() fileSelectedChange = new EventEmitter<File | undefined>();

  previewVisible = false;
  previewImage: string | undefined;
  fileList: NzUploadFile[] = [];
  pendingFile: NzUploadFile | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.fileSelected.currentValue) {
      this._reset();
    }
  }

  hasAnyFileSelected(): boolean {
    return this.fileList.length > 0 && this.fileList[0].originFileObj != undefined;
  }

  handleUploadChange(event: NzUploadChangeParam): void {
    const { file } = event;
    if (file.originFileObj) {
      this.previewImage = URL.createObjectURL(file.originFileObj);
      this.previewVisible = true;
      this.pendingFile = file;
    }
  }

  getOriginalFileSelected(): File | undefined {
    return this.fileList[0].originFileObj;
  }

  onConfirmImage(): void {
    if (this.pendingFile && this.previewImage) {
      this.pendingFile.thumbUrl = this.previewImage;
      URL.revokeObjectURL(this.previewImage);
      this.fileSelected = this.pendingFile.originFileObj;
      this.fileSelectedChange.emit(this.fileSelected);
      this.pendingFile = undefined;
      this.previewVisible = false;
    }
  }

  onCancelImage(): void {
    this._reset()
  }

  private _reset(): void {
    this.fileList = [];
    if(this.previewImage) {
      URL.revokeObjectURL(this.previewImage);
    }
    this.pendingFile = undefined;
    this.previewVisible = false;
  }
}