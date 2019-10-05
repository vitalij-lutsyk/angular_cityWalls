import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/main/main.component';
import { MapComponent } from './components/map/map.component';
import { GalleryComponent } from './components/gallery/gallery.component';

import { AddNewCompositionComponent } from './components/add-new-composition/add-new-composition.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { DbService } from './services/db.service';
import { HeaderComponent } from './components/header/header.component';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'main', component: MainComponent },
  { path: 'map', component: MapComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'addNew', component: AddNewCompositionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    MapComponent,
    GalleryComponent,
    AddNewCompositionComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [DbService],
  bootstrap: [AppComponent]
})
export class AppModule {}
