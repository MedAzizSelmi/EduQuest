import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { HomeComponent } from "./features/home/home.component"
import { LoginComponent } from "./features/auth/login/login.component"
import { RegisterComponent } from "./features/auth/register/register.component"
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
import { AuthGuard } from "./core/guards/auth.guard"
import { RoleGuard } from "./core/guards/role.guard"

// Gamification Components
import { BadgesComponent } from "./features/gamification/badges/badges.component"
import { CertificatesComponent } from "./features/gamification/certificates/certificates.component"
import { LevelsComponent } from "./features/gamification/levels/levels.component"
import { CodingGamesComponent } from "./features/gamification/coding-games/coding-games.component"
import { CodingGameDetailComponent } from "./features/gamification/coding-games/coding-game-detail/coding-game-detail.component"
import {LessonCreateComponent} from './features/lessons/lesson-create/lesson-create.component';
import {ModuleListComponent} from './features/modules/module-list/module-list.component';
import {ModuleCreateComponent} from './features/modules/module-create/module-create.component';
import {LessonListComponent} from './features/lessons/lesson-list/lesson-list.component';
import {ModuleEditComponent} from './features/modules/module-edit/module-edit.component';
import {LessonEditComponent} from './features/lessons/lesson-edit/lesson-edit.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: "admin",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Admin"] },
    children: [
      { path: "", component: AdminDashboardComponent },
      { path: "users", component: UserManagementComponent },
    ],
  },
  {
    path: "teacher",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher"] },
    children: [{ path: "", component: TeacherDashboardComponent }],
  },
  {
    path: "student",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Student"] },
    children: [{ path: "", component: StudentDashboardComponent }],
  },
  { path: "courses", component: CourseListComponent },
  {
    path: "courses/create",
    component: CourseCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  { path: "courses/:id", component: CourseDetailComponent },
  {
    path: "courses/:id/edit",
    component: CourseEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  { path: "courses/:courseId/quizzes", component: QuizListComponent },
  { path: "quizzes/:id", component: QuizDetailComponent },
  {
    path: "courses/:courseId/quizzes/create",
    component: QuizCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  {
    path: "quizzes/:id/edit",
    component: QuizEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  {
    path: "quizzes/:id/take",
    component: QuizTakeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Student"] },
  },
  { path: "courses/:courseId/exams", component: ExamListComponent },
  { path: "exams/:id", component: ExamDetailComponent },
  {
    path: "courses/:courseId/exams/create",
    component: ExamCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  {
    path: "exams/:id/edit",
    component: ExamEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  {
    path: "exams/:id/take",
    component: ExamTakeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Student"] },
  },
  {
    path: "courses/:courseId/modules",
    component: ModuleListComponent
  },
  {
    path: 'courses/:courseId/modules/create',
    component: ModuleCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher', 'Admin'] }
  },
  {
    path: "courses/:courseId/modules/:moduleId/edit",
    component: ModuleEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  {
    path: "courses/:courseId/modules/:moduleId/lessons",
    component: LessonListComponent
  },
  {
    path: 'courses/:courseId/modules/:moduleId/lessons/new',
    component: LessonCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher', 'Admin'] }
  },
  {
    path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/edit",
    component: LessonEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Teacher", "Admin"] },
  },
  /*{
    path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/read",
    component: LessonReadComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["Student"] },
  },*/
  // Gamification Routes
  {
    path: "gamification",
    canActivate: [AuthGuard],
    children: [
      { path: "badges", component: BadgesComponent },
      { path: "certificates", component: CertificatesComponent },
      { path: "levels", component: LevelsComponent },
      { path: "coding-games", component: CodingGamesComponent },
      { path: "coding-games/:id", component: CodingGameDetailComponent },
    ],
  },
  { path: "**", component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
