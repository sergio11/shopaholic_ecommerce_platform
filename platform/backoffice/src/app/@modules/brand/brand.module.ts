import { AntDesignModule } from 'src/app/@core/ant-design.module';
import { BrandCreateComponent } from './components/brand-create/brand-create-component';
import { BrandItemComponent } from './components/brand-item/brand-item.component';
import { BrandPageComponent } from './brand-page/brand-page.component';
import { BrandRoutingModule } from './brand-routing.module';
import { BrandUpdateComponent } from './components/brand-update/brand-update.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    BrandPageComponent,
    BrandItemComponent,
    BrandCreateComponent,
    BrandUpdateComponent,
    FileUploadComponent
  ],
  imports: [
    BrandRoutingModule,
    CommonModule,
    AntDesignModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class BrandModule {}
