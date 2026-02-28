import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { onAuthExpired } from './api'
import ProtectedRoute from './pages/ProtectedRoute'

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
import AICopilot from './pages/AICopilot'
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
import StubPage from './pages/StubPage'

/* Helper — shorthand for protected routes */
function P({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
    const navigate = useNavigate()

    // Listen for auth expiry events from api.js and redirect via SPA navigation
    // This prevents Caddy BasicAuth re-prompts that would occur with window.location.href
    useEffect(() => {
        return onAuthExpired(() => navigate('/login', { replace: true }))
    }, [navigate])

    return (
        <Routes>
            {/* ── Public — no login required ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Public browsing */}
            <Route path="/explore" element={<ExplorePrograms />} />
            <Route path="/explore/compare" element={<ComparePrograms />} />
            <Route path="/explore/program/:id" element={<ProgramDetail />} />
            <Route path="/explore/school/:id" element={<SchoolDetail />} />
            <Route path="/explore/:countryCode" element={<CountryDetail />} />
            <Route path="/career" element={<CareerAdvisor />} />
            <Route path="/career/path/:id" element={<CareerPathDetail />} />
            <Route path="/prep" element={<ExamPrepHome />} />
            <Route path="/prep/leaderboard" element={<GlobalLeaderboard />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/community/stories" element={<SuccessStories />} />
            <Route path="/community/mentors" element={<FindMentors />} />
            <Route path="/scholarships" element={<ScholarshipSearch />} />
            <Route path="/housing" element={<HousingGuides />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/learn" element={<LanguageLearning />} />

            {/* ── Protected — login required ── */}

            {/* Dashboard & Profile */}
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/onboarding/step/:step" element={<P><Onboarding /></P>} />
            <Route path="/profile" element={<P><Profile /></P>} />
            <Route path="/settings" element={<P><Settings /></P>} />
            <Route path="/settings/notifications" element={<P><NotificationSettings /></P>} />
            <Route path="/notifications" element={<P><NotificationCenter /></P>} />

            {/* Exam Prep — practice/interactive */}
            <Route path="/prep/:examCode" element={<P><ExamDashboard /></P>} />
            <Route path="/prep/:examCode/diagnostic" element={<P><DiagnosticTest /></P>} />
            <Route path="/prep/:examCode/simulation" element={<P><ExamSimulation /></P>} />
            <Route path="/prep/:examCode/practice" element={<P><SectionPractice /></P>} />
            <Route path="/prep/:examCode/writing" element={<P><WritingPractice /></P>} />
            <Route path="/prep/:examCode/speaking" element={<P><SpeakingPractice /></P>} />
            <Route path="/prep/:examCode/results/:attemptId" element={<P><ResultsDetail /></P>} />

            {/* Career — interactive */}
            <Route path="/career/discover" element={<P><CareerDiscovery /></P>} />
            <Route path="/career/compare" element={<P><CompareCareers /></P>} />

            {/* Roadmap */}
            <Route path="/roadmap" element={<P><RoadmapList /></P>} />
            <Route path="/roadmap/:id" element={<P><RoadmapDetail /></P>} />
            <Route path="/roadmap/:id/step/:stepId" element={<P><StepDetail /></P>} />

            {/* Documents */}
            <Route path="/documents" element={<P><DocumentVault /></P>} />
            <Route path="/documents/generate" element={<P><GenerateDocument /></P>} />

            {/* Community — interactive */}
            <Route path="/community/qa" element={<P><QAForum /></P>} />

            {/* Financial */}
            <Route path="/budget" element={<P><BudgetCalculator /></P>} />

            {/* Visa Prep — interactive */}
            <Route path="/visa-prep" element={<P><VisaPrep /></P>} />
            <Route path="/visa-prep/:country" element={<P><MockVisaInterview /></P>} />

            {/* Language Learning — interactive */}
            <Route path="/learn/:lang" element={<P><LanguageDashboard /></P>} />
            <Route path="/learn/:lang/lesson/:id" element={<P><Lesson /></P>} />

            {/* AI Copilot */}
            <Route path="/copilot" element={<P><AICopilot /></P>} />

            {/* Admin */}
            <Route path="/admin" element={<P><AdminDashboard /></P>} />
            <Route path="/admin/users" element={<P><AdminUsers /></P>} />
            <Route path="/admin/users/:id" element={<P><AdminUserDetail /></P>} />
            <Route path="/admin/questions" element={<P><AdminQuestions /></P>} />
            <Route path="/admin/content/exams" element={<P><AdminExams /></P>} />
            <Route path="/admin/content/schools" element={<P><AdminSchools /></P>} />
            <Route path="/admin/content/programs" element={<P><AdminPrograms /></P>} />
            <Route path="/admin/content/roadmaps" element={<P><AdminRoadmaps /></P>} />
            <Route path="/admin/content/scholarships" element={<P><AdminScholarships /></P>} />
            <Route path="/admin/analytics" element={<P><AdminAnalytics /></P>} />
            <Route path="/admin/translations" element={<P><AdminTranslations /></P>} />

            {/* 404 */}
            <Route path="*" element={<StubPage title="Page Not Found" />} />
        </Routes>
    )
}
