/**
 * Tawjih V4 — API Service Layer
 * Centralized fetch wrapper with JWT auth, error handling, and token refresh.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

// ── SPA-safe Navigation ─────────────────────────────────
// Instead of window.location.href (which triggers Caddy BasicAuth re-prompt),
// we dispatch a custom event that React components can listen to.

function navigateToLogin() {
    clearTokens();
    window.dispatchEvent(new CustomEvent('auth:expired'));
}

/**
 * Subscribe to auth expiry events. Call from a React component
 * (e.g. App.jsx) to redirect via React Router instead of hard reload.
 * Returns an unsubscribe function.
 */
export function onAuthExpired(callback) {
    window.addEventListener('auth:expired', callback);
    return () => window.removeEventListener('auth:expired', callback);
}

// ── Token Management ────────────────────────────────────

let accessToken = localStorage.getItem('tawjih_token');
let refreshToken = localStorage.getItem('tawjih_refresh');

export function setTokens(access, refresh) {
    accessToken = access;
    refreshToken = refresh;
    localStorage.setItem('tawjih_token', access);
    localStorage.setItem('tawjih_refresh', refresh);
}

export function clearTokens() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('tawjih_token');
    localStorage.removeItem('tawjih_refresh');
}

export function getAccessToken() {
    return accessToken;
}

export function isAuthenticated() {
    return !!accessToken;
}

/**
 * Decode the JWT payload and return the user role.
 * Returns 'student' as default if token is missing or invalid.
 */
export function getUserRole() {
    if (!accessToken) return null;
    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.role || 'student';
    } catch {
        return 'student';
    }
}

/**
 * Get the correct dashboard path based on user role.
 */
export function getDashboardPath() {
    return getUserRole() === 'admin' ? '/admin' : '/dashboard';
}

// ── Core Fetch Wrapper ──────────────────────────────────

export async function apiFetch(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    // Token expired → try refresh
    if (response.status === 401 && refreshToken) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            headers['Authorization'] = `Bearer ${accessToken}`;
            return fetch(url, { ...options, headers });
        } else {
            navigateToLogin();
            throw new Error('Session expired');
        }
    }

    return response;
}

async function tryRefreshToken() {
    try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (res.ok) {
            const data = await res.json();
            setTokens(data.access_token, data.refresh_token);
            return true;
        }
    } catch { }
    return false;
}

// ── Helpers ─────────────────────────────────────────────

async function get(path) {
    const res = await apiFetch(path);
    if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
    return res.json();
}

async function post(path, body) {
    const res = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `POST ${path}: ${res.status}`);
    }
    return res.json();
}

async function put(path, body) {
    const res = await apiFetch(path, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `PUT ${path}: ${res.status}`);
    }
    return res.json();
}

// ── Auth ────────────────────────────────────────────────

export async function register(email, password, full_name, role = 'student') {
    const data = await post('/api/auth/register', { email, password, full_name, role });
    setTokens(data.access_token, data.refresh_token);
    return data;
}

export async function login(email, password) {
    const data = await post('/api/auth/login', { email, password });
    setTokens(data.access_token, data.refresh_token);
    return data;
}

export async function getMe() {
    return get('/api/auth/me');
}

export function logout() {
    navigateToLogin();
}

// ── Profile ─────────────────────────────────────────────

export async function getProfile() {
    return get('/api/profile');
}

export async function updateProfile(data) {
    return put('/api/profile', data);
}

export async function updateStudentProfile(data) {
    return put('/api/profile/student', data);
}

export async function completeOnboarding(data) {
    return post('/api/profile/onboarding', data);
}

// ── Explore ─────────────────────────────────────────────

export async function getPrograms(params = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', params.page);
    if (params.per_page) qs.set('per_page', params.per_page);
    if (params.country) qs.set('country', params.country);
    if (params.field) qs.set('field', params.field);
    if (params.degree) qs.set('degree', params.degree);
    if (params.search) qs.set('search', params.search);
    if (params.is_moroccan !== undefined) qs.set('is_moroccan', params.is_moroccan);
    const query = qs.toString();
    return get(`/api/explore/programs${query ? '?' + query : ''}`);
}

export async function getProgram(id) {
    return get(`/api/explore/programs/${id}`);
}

export async function getSchools(params = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', params.page);
    if (params.country) qs.set('country', params.country);
    if (params.type) qs.set('type', params.type);
    if (params.search) qs.set('search', params.search);
    const query = qs.toString();
    return get(`/api/explore/schools${query ? '?' + query : ''}`);
}

export async function getSchool(id) {
    return get(`/api/explore/schools/${id}`);
}

// ── Scholarships ────────────────────────────────────────

export async function getScholarships(params = {}) {
    const qs = new URLSearchParams();
    if (params.country) qs.set('country', params.country);
    if (params.search) qs.set('search', params.search);
    const query = qs.toString();
    return get(`/api/scholarships${query ? '?' + query : ''}`);
}

export async function getScholarship(id) {
    return get(`/api/scholarships/${id}`);
}

export async function matchScholarships() {
    return post('/api/scholarships/match', {});
}

// ── Roadmap ─────────────────────────────────────────────

export async function getRoadmapTemplates() {
    return get('/api/roadmap/templates');
}

export async function generateRoadmap(templateId, programId = null, targetDate = null) {
    return post('/api/roadmap/generate', {
        template_id: templateId,
        program_id: programId,
        target_date: targetDate,
    });
}

export async function getMyRoadmaps() {
    return get('/api/roadmap/mine');
}

export async function getRoadmap(id) {
    return get(`/api/roadmap/${id}`);
}

export async function updateRoadmapStep(roadmapId, stepId, status, notes = null) {
    return put(`/api/roadmap/${roadmapId}/step/${stepId}`, { status, notes });
}

// ── Financial ───────────────────────────────────────────

export async function calculateBudget(countryCode, options = {}) {
    return post('/api/financial/budget', {
        country_code: countryCode,
        program_type: options.programType,
        duration_months: options.durationMonths || 12,
        include_visa: options.includeVisa !== false,
        include_insurance: options.includeInsurance !== false,
        include_exams: options.includeExams !== false,
    });
}

export async function compareBudgets(countries, programType = null) {
    return post('/api/financial/compare', {
        countries,
        program_type: programType,
    });
}

// ── Documents ────────────────────────────────────────────

export async function getDocumentTemplates() {
    return get('/api/documents/templates');
}

export async function getDocumentChecklist(countryCode) {
    return get(`/api/documents/checklist/${countryCode}`);
}

export async function getAllChecklists() {
    return get('/api/documents/checklists');
}

// ── Visa Prep ────────────────────────────────────────────

export async function getVisaCountries() {
    return get('/api/visa-prep/countries');
}

export async function getVisaQuestions(countryCode) {
    return get(`/api/visa-prep/questions/${countryCode}`);
}

export async function getVisaTips() {
    return get('/api/visa-prep/tips');
}

// ── Community ────────────────────────────────────────────

export async function getCommunityFeed() {
    return get('/api/community/feed');
}

export async function getCommunityPosts() {
    return get('/api/community/posts');
}

export async function getCommunityGroups() {
    return get('/api/community/groups');
}

export async function getCommunityStories() {
    return get('/api/community/stories');
}

// ── Housing ──────────────────────────────────────────────

export async function getHousingCities() {
    return get('/api/housing/cities');
}

export async function getHousingByCountry(countryCode) {
    return get(`/api/housing/cities/${countryCode}`);
}

export async function getCityGuide(countryCode, cityName) {
    return get(`/api/housing/cities/${countryCode}/${cityName}`);
}

// ── Admin ─────────────────────────────────────────────────

export async function getAdminStats() {
    return get('/api/admin/stats');
}

export async function getAdminUsers() {
    return get('/api/admin/users');
}

export async function getAdminContentOverview() {
    return get('/api/admin/content/overview');
}

export async function getAdminRecentActivity() {
    return get('/api/admin/recent-activity');
}

// ── Career ──────────────────────────────────────────────

export async function getCareerPaths() {
    return get('/api/career/paths');
}

export async function getCareerPath(id) {
    return get(`/api/career/paths/${id}`);
}

export async function discoverCareers(data = {}) {
    return post('/api/career/discover', data);
}

export async function getMarketData(career, country) {
    return get(`/api/career/market/${career}/${country}`);
}

export async function compareCareers(careerIds) {
    return post('/api/career/compare', { career_ids: careerIds });
}

export async function calculateROI(careerId, programCost, years = 10) {
    return post('/api/career/roi', { career_id: careerId, program_cost_mad: programCost, years });
}

export async function getTrendingCareers() {
    return get('/api/career/trending');
}

// ── Exam Prep ───────────────────────────────────────────

export async function getExams() {
    return get('/api/prep/exams');
}

export async function startDiagnostic(examCode) {
    return post('/api/prep/diagnostic', { exam_code: examCode });
}

export async function startSimulation(examCode, section = null) {
    return post('/api/prep/simulation', { exam_code: examCode, section });
}

export async function startPractice(examCode, section, questionCount = 10) {
    return post('/api/prep/practice', { exam_code: examCode, section, question_count: questionCount });
}

export async function submitAnswers(attemptId, answers) {
    return post('/api/prep/submit', { attempt_id: attemptId, answers });
}

export async function getExamResults(attemptId) {
    return get(`/api/prep/results/${attemptId}`);
}

export async function getExamProgress(examCode) {
    return get(`/api/prep/progress/${examCode}`);
}

export async function getStudyPlan(examCode) {
    return get(`/api/prep/study-plan/${examCode}`);
}

export async function getLeaderboard() {
    return get('/api/prep/leaderboard');
}

// ── Health ───────────────────────────────────────────────

export async function healthCheck() {
    return get('/api/health');
}

// ── AI Copilot ──────────────────────────────────────────

export async function copilotSendMessage(message, sessionId = null) {
    return post('/api/copilot/message', { message, session_id: sessionId });
}

export async function copilotGetSessions() {
    return get('/api/copilot/sessions');
}

export async function copilotGetSession(sessionId) {
    return get(`/api/copilot/sessions/${sessionId}`);
}

export async function copilotDeleteSession(sessionId) {
    const res = await apiFetch(`/api/copilot/sessions/${sessionId}`, { method: 'DELETE' });
    return res.json();
}

// ── Language Learning ───────────────────────────────────

export async function getLanguages() {
    return get('/api/learn/languages');
}

export async function getLearningPath(lang) {
    return get(`/api/learn/${lang}/path`);
}

export async function getLesson(lang, unit, lesson) {
    return get(`/api/learn/${lang}/lesson/${unit}/${lesson}`);
}

export async function completeLesson(lang, unit, lesson) {
    return post(`/api/learn/${lang}/lesson/${unit}/${lesson}/complete`, {});
}

export async function getVocabReview(lang) {
    return get(`/api/learn/${lang}/vocabulary/review`);
}

export async function languageAIChat(lang, message, history = null) {
    return post(`/api/learn/${lang}/ai-chat`, { message, history });
}

// ── Gamification ────────────────────────────────────────

export async function getGamificationStats() {
    return get('/api/gamification/me');
}

export async function getGamificationBadges() {
    return get('/api/gamification/badges');
}

export async function getGamificationLeaderboard() {
    return get('/api/gamification/leaderboard');
}

export async function getStudyGroups() {
    return get('/api/gamification/study-groups');
}

// ── Notifications ───────────────────────────────────────

export async function getNotificationHistory() {
    return get('/api/notifications/history');
}

export async function getNotificationPreferences() {
    return get('/api/notifications/preferences');
}

// ── Document Generation ─────────────────────────────────

export async function generateDocument(templateId, data) {
    return post(`/api/documents/templates/${templateId}/generate`, { template_id: templateId, ...data });
}

// ── Writing / Speaking Evaluation ───────────────────────

export async function evaluateWriting(essay, examType = 'ielts', taskPrompt = null) {
    return post('/api/prep/writing/evaluate', { essay, exam_type: examType, task_prompt: taskPrompt });
}

export async function evaluateSpeaking(transcript, examType = 'ielts') {
    return post('/api/prep/speaking/upload', { transcript, exam_type: examType });
}

// ── Mentors ─────────────────────────────────────────────

export async function getMentors() {
    return get('/api/mentors');
}

// ── Marketplace ─────────────────────────────────────────

export async function getMarketplaceCategories() {
    return get('/api/marketplace/categories');
}

export async function getMarketplaceProviders(params = {}) {
    const qs = new URLSearchParams();
    if (params.category) qs.set('category', params.category);
    const query = qs.toString();
    return get(`/api/marketplace/providers${query ? '?' + query : ''}`);
}

