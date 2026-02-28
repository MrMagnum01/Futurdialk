import { Routes, Route } from 'react-router-dom'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import ExplorePrograms from './pages/ExplorePrograms'
import ProgramDetail from './pages/ProgramDetail'
import SchoolDetail from './pages/SchoolDetail'
import ComparePrograms from './pages/ComparePrograms'
import CountryDetail from './pages/CountryDetail'
import Profile from './pages/Profile'
import ExamPrepHome from './pages/ExamPrepHome'
import ExamDashboard from './pages/ExamDashboard'
import DiagnosticTest from './pages/DiagnosticTest'
import ExamSimulation from './pages/ExamSimulation'
import SectionPractice from './pages/SectionPractice'
import WritingPractice from './pages/WritingPractice'
import SpeakingPractice from './pages/SpeakingPractice'
import ResultsDetail from './pages/ResultsDetail'
import GlobalLeaderboard from './pages/GlobalLeaderboard'
import ScholarshipSearch from './pages/ScholarshipSearch'
import CareerAdvisor from './pages/CareerAdvisor'
import CareerPathDetail from './pages/CareerPathDetail'
import CareerDiscovery from './pages/CareerDiscovery'
import CompareCareers from './pages/CompareCareers'
import CommunityHub from './pages/CommunityHub'
import QAForum from './pages/QAForum'
import SuccessStories from './pages/SuccessStories'
import FindMentors from './pages/FindMentors'
import RoadmapList from './pages/RoadmapList'
import RoadmapDetail from './pages/RoadmapDetail'
import StepDetail from './pages/StepDetail'
import BudgetCalculator from './pages/BudgetCalculator'
import DocumentVault from './pages/DocumentVault'
import GenerateDocument from './pages/GenerateDocument'
import VisaPrep from './pages/VisaPrep'
import MockVisaInterview from './pages/MockVisaInterview'
import LanguageLearning from './pages/LanguageLearning'
import LanguageDashboard from './pages/LanguageDashboard'
import Lesson from './pages/Lesson'
import Settings from './pages/Settings'
import NotificationSettings from './pages/NotificationSettings'
import NotificationCenter from './pages/NotificationCenter'
import HousingGuides from './pages/HousingGuides'
import Marketplace from './pages/Marketplace'
import AdminDashboard from './pages/AdminDashboard'
import AdminTranslations from './pages/AdminTranslations'
import AdminUsers from './pages/AdminUsers'
import AdminUserDetail from './pages/AdminUserDetail'
import AdminQuestions from './pages/AdminQuestions'
import AdminExams from './pages/AdminExams'
import AdminSchools from './pages/AdminSchools'
import AdminPrograms from './pages/AdminPrograms'
import AdminRoadmaps from './pages/AdminRoadmaps'
import AdminScholarships from './pages/AdminScholarships'
import AdminAnalytics from './pages/AdminAnalytics'
import AICopilot from './pages/AICopilot'
import StubPage from './pages/StubPage'

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Onboarding */}
            <Route path="/onboarding/step/:step" element={<Onboarding />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Explore */}
            <Route path="/explore" element={<ExplorePrograms />} />
            <Route path="/explore/compare" element={<ComparePrograms />} />
            <Route path="/explore/program/:id" element={<ProgramDetail />} />
            <Route path="/explore/school/:id" element={<SchoolDetail />} />
            <Route path="/explore/:countryCode" element={<CountryDetail />} />

            {/* Career */}
            <Route path="/career" element={<CareerAdvisor />} />
            <Route path="/career/discover" element={<CareerDiscovery />} />
            <Route path="/career/compare" element={<CompareCareers />} />
            <Route path="/career/path/:id" element={<CareerPathDetail />} />

            {/* Exam Prep */}
            <Route path="/prep" element={<ExamPrepHome />} />
            <Route path="/prep/leaderboard" element={<GlobalLeaderboard />} />
            <Route path="/prep/:examCode" element={<ExamDashboard />} />
            <Route path="/prep/:examCode/diagnostic" element={<DiagnosticTest />} />
            <Route path="/prep/:examCode/simulation" element={<ExamSimulation />} />
            <Route path="/prep/:examCode/practice" element={<SectionPractice />} />
            <Route path="/prep/:examCode/writing" element={<WritingPractice />} />
            <Route path="/prep/:examCode/speaking" element={<SpeakingPractice />} />
            <Route path="/prep/:examCode/results/:attemptId" element={<ResultsDetail />} />

            {/* Roadmap */}
            <Route path="/roadmap" element={<RoadmapList />} />
            <Route path="/roadmap/:id" element={<RoadmapDetail />} />
            <Route path="/roadmap/:id/step/:stepId" element={<StepDetail />} />

            {/* Documents */}
            <Route path="/documents" element={<DocumentVault />} />
            <Route path="/documents/generate" element={<GenerateDocument />} />

            {/* Community */}
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/community/qa" element={<QAForum />} />
            <Route path="/community/stories" element={<SuccessStories />} />
            <Route path="/community/mentors" element={<FindMentors />} />

            {/* Financial */}
            <Route path="/budget" element={<BudgetCalculator />} />
            <Route path="/scholarships" element={<ScholarshipSearch />} />

            {/* Housing */}
            <Route path="/housing" element={<HousingGuides />} />

            {/* Marketplace */}
            <Route path="/marketplace" element={<Marketplace />} />

            {/* Visa Prep */}
            <Route path="/visa-prep" element={<VisaPrep />} />
            <Route path="/visa-prep/:country" element={<MockVisaInterview />} />

            {/* Language Learning */}
            <Route path="/learn" element={<LanguageLearning />} />
            <Route path="/learn/:lang" element={<LanguageDashboard />} />
            <Route path="/learn/:lang/lesson/:id" element={<Lesson />} />

            {/* Settings & Profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/notifications" element={<NotificationCenter />} />

            {/* AI Copilot */}
            <Route path="/copilot" element={<AICopilot />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/content/exams" element={<AdminExams />} />
            <Route path="/admin/content/schools" element={<AdminSchools />} />
            <Route path="/admin/content/programs" element={<AdminPrograms />} />
            <Route path="/admin/content/roadmaps" element={<AdminRoadmaps />} />
            <Route path="/admin/content/scholarships" element={<AdminScholarships />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/translations" element={<AdminTranslations />} />

            {/* 404 */}
            <Route path="*" element={<StubPage title="Page Not Found" />} />
        </Routes>
    )
}
