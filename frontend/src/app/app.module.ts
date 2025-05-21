import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { JwtInterceptor } from "./core/interceptors/jwt.interceptor"
import { ErrorInterceptor } from "./core/interceptors/error.interceptor"
import { SafePipe } from "./core/pipes/safe.pipe"

// Material Modules
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatExpansionModule } from "@angular/material/expansion"
import {MatChip, MatChipListbox, MatChipsModule} from "@angular/material/chips"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDialogModule } from "@angular/material/dialog"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import {MatLine, MatNativeDateModule} from "@angular/material/core"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatMenuModule } from "@angular/material/menu"
import { MatButtonToggleModule } from "@angular/material/button-toggle"

// Components
import { NavbarComponent } from "./core/components/navbar/navbar.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { LoginComponent } from "./features/auth/login/login.component"
import { RegisterComponent } from "./features/auth/register/register.component"
import { HomeComponent } from "./features/home/home.component"
import { ProfileComponent } from "./features/profile/profile.component"
import { CourseListComponent } from "./features/courses/course-list/course-list.component"
import { CourseDetailComponent } from "./features/courses/course-detail/course-detail.component"
import { CourseCreateComponent } from "./features/courses/course-create/course-create.component"
import { CourseEditComponent } from "./features/courses/course-edit/course-edit.component"
import { QuizListComponent } from "./features/quizzes/quiz-list/quiz-list.component"
import { QuizDetailComponent } from "./features/quizzes/quiz-detail/quiz-detail.component"
import { QuizCreateComponent } from "./features/quizzes/quiz-create/quiz-create.component"
import { QuizEditComponent } from "./features/quizzes/quiz-edit/quiz-edit.component"
import { QuizTakeComponent } from "./features/quizzes/quiz-take/quiz-take.component"
import { ExamListComponent } from "./features/exams/exam-list/exam-list.component"
import { ExamDetailComponent } from "./features/exams/exam-detail/exam-detail.component"
import { ExamCreateComponent } from "./features/exams/exam-create/exam-create.component"
import { ExamEditComponent } from "./features/exams/exam-edit/exam-edit.component"
import { ExamTakeComponent } from "./features/exams/exam-take/exam-take.component"
import { DashboardComponent } from "./features/dashboard/dashboard.component"
import { AdminDashboardComponent } from "./features/admin/admin-dashboard/admin-dashboard.component"
import { UserManagementComponent } from "./features/admin/user-management/user-management.component"
import { TeacherDashboardComponent } from "./features/teacher/teacher-dashboard/teacher-dashboard.component"
import { StudentDashboardComponent } from "./features/student/student-dashboard/student-dashboard.component"
import { NotFoundComponent } from "./core/components/not-found/not-found.component"

// Gamification Components
import { BadgesComponent } from "./features/gamification/badges/badges.component"
import { CertificatesComponent } from "./features/gamification/certificates/certificates.component"
import { CertificateViewerComponent } from "./features/gamification/certificates/certificate-viewer/certificate-viewer.component"
import { LevelsComponent } from "./features/gamification/levels/levels.component"
import { CodingGamesComponent } from "./features/gamification/coding-games/coding-games.component"
import { CodingGameDetailComponent } from "./features/gamification/coding-games/coding-game-detail/coding-game-detail.component"
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FileSizePipe} from './core/pipes/size.pipe';
import {FileUploadComponent} from './features/Attachments/file-upload.component';
import {TruncatePipe} from './core/pipes/truncate.pipe';
import {LessonCreateComponent} from './features/lessons/lesson-create/lesson-create.component';
import {ModuleListComponent} from './features/modules/module-list/module-list.component';
import {ModuleCreateComponent} from './features/modules/module-create/module-create.component';
import {LessonListComponent} from './features/lessons/lesson-list/lesson-list.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ModuleEditComponent} from './features/modules/module-edit/module-edit.component';
import {LessonEditComponent} from './features/lessons/lesson-edit/lesson-edit.component';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {QuestionManagementComponent} from './features/questions/question-management/question-management.component';
import {ConfirmDialogComponent} from './core/components/confirm-dialog/confirm-dialog.component';
import {QuestionFormComponent} from './features/questions/question-form/question-form.component';
import {QuestionEditComponent} from './features/questions/question-edit/question-edit.component';
import {QuestionCreateComponent} from './features/questions/question-create/question-create.component';
import {LessonReadComponent} from './features/lessons/lesson-read/lesson-read.component';
import {ChatComponent} from './core/components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    CourseListComponent,
    CourseDetailComponent,
    CourseCreateComponent,
    CourseEditComponent,
    QuizListComponent,
    QuizDetailComponent,
    QuizCreateComponent,
    QuizEditComponent,
    QuizTakeComponent,
    ExamListComponent,
    ExamDetailComponent,
    ExamCreateComponent,
    ExamEditComponent,
    ExamTakeComponent,
    DashboardComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent,
    NotFoundComponent,
    SafePipe,
    BadgesComponent,
    CertificatesComponent,
    CertificateViewerComponent,
    LevelsComponent,
    CodingGamesComponent,
    CodingGameDetailComponent,
    FileSizePipe,
    FileUploadComponent,
    TruncatePipe,
    LessonCreateComponent,
    ModuleListComponent,
    ModuleCreateComponent,
    LessonListComponent,
    ModuleEditComponent,
    LessonEditComponent,
    QuestionManagementComponent,
    ConfirmDialogComponent,
    QuestionFormComponent,
    QuestionEditComponent,
    QuestionCreateComponent,
    LessonReadComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatRadioGroup,
    MatRadioButton,
    MatLine,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
