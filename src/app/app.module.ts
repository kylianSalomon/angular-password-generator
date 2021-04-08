import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppComponent } from './app.component';
import { PasswordComponent } from './components/password/password.component';
import { PasswordOptionsComponent } from './components/password-options/password-options.component';

@NgModule({
  declarations: [AppComponent, PasswordComponent, PasswordOptionsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
