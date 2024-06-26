import { AntDesignModule } from './../../@core/ant-design.module';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryUpdateComponent } from './components/category-update/category-update.component';
import { CommonModule } from '@angular/common';
import { CreateCategoryComponent } from './components/create-category/create-category-component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [
    CategoryComponent,
    CreateCategoryComponent,
    CategoryUpdateComponent,
  ],
  imports: [
    SharedModule,
    CategoryRoutingModule,
    CommonModule,
    AntDesignModule,
    ReactiveFormsModule,
  ],
})
export class CategoryModule {}
