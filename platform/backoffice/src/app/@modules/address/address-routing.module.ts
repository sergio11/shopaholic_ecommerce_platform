import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { AddressListComponent} from './address-list-page/address-list-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: AddressListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AddressRoutingModule {}
