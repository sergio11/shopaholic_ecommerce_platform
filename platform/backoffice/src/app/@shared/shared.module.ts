import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { AntDesignModule } from 'src/app/@core/ant-design.module';
import { HttpClientModule } from '@angular/common/http';
import { IconsProviderModule } from '../@core/icons-provider.module';
import { LayoutContentComponent } from './components/layout/layout-content.component';
import { NgModule } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LayoutContentComponent, FileUploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzLayoutModule,
    NzMenuModule,
    IconsProviderModule,
    AntDesignModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  exports: [FileUploadComponent]
})
export class SharedModule {}
