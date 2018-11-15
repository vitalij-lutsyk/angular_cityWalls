import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { MapComponent } from './main/map/map.component';
import { GalleryComponent } from './main/gallery/gallery.component';
// import { AuthorsComponent } from './authors/authors.component';
// import { AuthorComponent } from './author/author.component';
import { AddNewCompositionComponent } from './main/add-new-composition/add-new-composition.component';
import { SignInComponent } from './registration/sign-in/sign-in.component';
import { SignUpComponent } from './registration/sign-up/sign-up.component';
import { DbService } from './services/db.service';

// import { MapDataService } from './services/map-data.service';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'main', component: MainComponent },
  { path: 'map', component: MapComponent },
  { path: 'gallery', component: GalleryComponent },
  // { path: 'authors', component: AuthorsComponent },
  // { path: 'author', component: AuthorComponent },
  { path: 'addNew', component: AddNewCompositionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    // AuthorsComponent,
    // AuthorComponent,
    MapComponent,
    GalleryComponent,
    AddNewCompositionComponent,
    SignInComponent,
    SignUpComponent
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
