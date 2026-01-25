Hey claude.
i have a project i want to work using react ts + tailwind and django drf
for frontend i want to use react query, axios, zod, react-hook-form, zustand (if needed) and others.

it is an school system which has the public website content for advertising and social communication, and management part which has scheduals, attendance, teacher student parent portals and other things.

school name: Sultan Zoy High School

first i want to make the front end public website content which is relatively easier.

i want you to generate some of the parts of the project with beautiful UI/UX and typed functions(rcf) and components.
and also make the static data into sprate(bro sprate) part file , i want to add translation to data that after comning from api like this
==========
in component:> const { t, i18n } = useTranslation();
const lang = i18n.language as "en" | "da" | "pa";

<h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {trip.title[lang]}
            </h3>
            
type:> title: { en: string; da: string; pa: string };
Data:>
title: {
en: "National Museum of Afghanistan Visit",
da: "بازدید از موزیم ملی افغانستان",
pa: "د افغانستان ملي موزیم لیدنه",
},
==============================

and also define t for the all text(static content) like this format in
en.json
{
"explorePrograms": "Explore Programs",
"scheduleVisit": "Schedule a Visit", in json like this> "about.awards.viewMore": "View All Awards",
}
in file i use like this const {t}= useTranslatio();
it be for 3 language en,da(dari afg) and pa(pashto afg) the jsone must be in sprate file

---

structure pattern:
theming: generally i want two theme: dark and light, and for colors if you want to use a color instead of directly using it like bg-red-200 or text-blue-200 and if that color doesn't exist in below color values, define color variables. first give me the color var names and its values like this:
card-color: white
background: #1201ef

and then use them like this in classes.
bg-background or text-card-color and other like this (JUST LIKE THIS NO OTHER WAY, YOU DO NOT USE LIKE text-var(--color-card-color) OR ANY OTHER WAY, JUST THE WAY I TOLD).

these are the existing colors i am using. you can use them like that or if you want to add new color variables just follow the above rules, and don't worry about how it works.

@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] \*));

/_ ===============================
Animations
================================ _/

@keyframes fade-in {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

.animate-fade-in {
animation: fade-in 0.8s ease-out;
}

/_ ===============================
THEME — LIGHT MODE (AGRICULTURE)
================================ _/

@theme {
/_ Brand _/
--color-primary: #0B7A4B;
--color-primary-dark: #064E3B;
--color-secondary: #66BB4A;
--color-accent: #F4CC0B;

/_ Layout _/
--color-background: #FFFFFF;
--color-surface: #F6FBF8;
--color-card: #FFFFFF;

/_ Text _/
--color-text-primary: #064E3B;
--color-text-secondary: #4B6B5F;

/_ Borders _/
--color-border: #D1E7DD;

/_ Muted / disabled _/
--color-muted: #9DB5AA;

/_ Hover / active surfaces _/
--color-surface-hover: #ECF5F0;

/_ Focus / ring _/
--color-focus: #66BB4A;

/_ Status _/
--color-success: #66BB4A;
--color-warning: #F4CC0B;
--color-error: #DC2626;
--color-info: #0B7A4B;

/_ Soft status backgrounds _/
--color-info-soft: #E6F4EF;
--color-success-soft: #EDF8E9;
--color-warning-soft: #FFF7CC;
--color-error-soft: #FEE2E2;

/_ Destructive actions _/
--color-danger: #DC2626;
}

/_ ===============================
THEME — DARK MODE
================================ _/

[data-theme="dark"] {
/_ Brand _/
--color-primary: #66BB4A;
--color-primary-dark: #4CAF50;
--color-secondary: #81C784;
--color-accent: #F4CC0B;

/_ Layout _/
--color-background: #0F1F17;
--color-surface: #132B21;
--color-card: #18382C;

/_ Text _/
--color-text-primary: #E6F4EF;
--color-text-secondary: #B7D3C6;

/_ Borders _/
--color-border: #2F5E4A;

/_ Muted / disabled _/
--color-muted: #7FA596;

/_ Hover / active surfaces _/
--color-surface-hover: #1F4A3A;

/_ Focus / ring _/
--color-focus: #66BB4A;

/_ Status _/
--color-success: #66BB4A;
--color-warning: #F4CC0B;
--color-error: #F87171;
--color-info: #4ADE80;

/_ Soft status backgrounds _/
--color-info-soft: #123D2C;
--color-success-soft: #14532D;
--color-warning-soft: #4A3F12;
--color-error-soft: #7F1D1D;

/_ Destructive actions _/
--color-danger: #F87171;
}

/_ ===============================
BASE STYLES
================================ _/

body {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
"Helvetica Neue", sans-serif;

background-color: var(--color-background);
color: var(--color-text-primary);

-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

transition: background-color 0.3s ease, color 0.3s ease;
}

/_ ===============================
SCROLLBAR
================================ _/

::-webkit-scrollbar {
width: 8px;
height: 8px;
}

::-webkit-scrollbar-track {
background: var(--color-primary);
}

::-webkit-scrollbar-thumb {
background: var(--color-border);
border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
background: var(--color-text-secondary);
}

.scrollbar-hide {
-ms-overflow-style: none;
scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
display: none;
}

/_ ===============================
UTILITIES
================================ _/

@layer utilities {
.animate-slide-up {
animation: slideUp 0.5s ease-out;
}

.animate-slide-down {
animation: slideDown 0.5s ease-out;
}

.animate-scale-in {
animation: scaleIn 0.3s ease-out;
}

@keyframes slideUp {
from {
transform: translateY(20px);
opacity: 0;
}
to {
transform: translateY(0);
opacity: 1;
}
}

@keyframes slideDown {
from {
transform: translateY(-20px);
opacity: 0;
}
to {
transform: translateY(0);
opacity: 1;
}
}

@keyframes scaleIn {
from {
transform: scale(0.9);
opacity: 0;
}
to {
transform: scale(1);
opacity: 1;
}
}
}

/_ ===============================
COMPONENTS
================================ _/

@layer components {
/_ Card _/
.card {
background-color: var(--color-card);
border: 1px solid var(--color-border);
border-radius: 0.75rem;
padding: 1.5rem;
transition: box-shadow 0.3s ease;
}

.card:hover {
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/_ Buttons _/
.btn-primary {
background-color: var(--color-primary);
color: white;
padding: 0.75rem 1.5rem;
border-radius: 0.75rem;
font-weight: 500;
transition: background-color 0.2s ease;
}

.btn-primary:hover {
background-color: var(--color-primary-dark);
}

.btn-secondary {
background-color: var(--color-secondary);
color: white;
padding: 0.75rem 1.5rem;
border-radius: 0.75rem;
font-weight: 500;
}

.btn-accent {
background-color: var(--color-accent);
color: var(--color-text-primary);
padding: 0.75rem 1.5rem;
border-radius: 0.75rem;
font-weight: 600;
}

/_ Inputs _/
.input-field {
background-color: var(--color-background);
border: 1px solid var(--color-border);
color: var(--color-text-primary);
padding: 0.75rem 1rem;
border-radius: 0.75rem;
width: 100%;
}

.input-field:focus {
outline: none;
border-color: var(--color-primary);
box-shadow: 0 0 0 3px rgba(11, 122, 75, 0.2);
}

/_ Badges _/
.badge {
display: inline-flex;
align-items: center;
padding: 0.25rem 0.75rem;
border-radius: 9999px;
font-size: 0.875rem;
font-weight: 500;
}

.badge-primary {
background-color: var(--color-primary);
color: white;
}

.badge-secondary {
background-color: var(--color-secondary);
color: white;
}

.badge-accent {
background-color: var(--color-accent);
color: var(--color-text-primary);
}
}

---

this is a very brief requirements of the project, you can add other details if you feel suitable.

Recommended Sections for the School Website (Sultan Zoy High School)

1. Home Page

- Welcome message and a brief introduction of the school.
- Attractive photos and videos of the school environment, classrooms, and learning activities.

2. About Us

- Information about the school’s history, mission, values, and goals.
- Introductions of school management, teachers, and staff with short descriptions and photos.
- Display of awards, certificates, and recognition received by the school.

3. Academic Programs

- Information on courses and educational materials offered at the school.
- Class schedules and exam timetables.

4. News and Events

- Updates on recent school news and activities.
- School event calendar.

5. Contact Us

- Phone number, email address, and physical school address.
- School location map for parents and visitors.

6. Parents Section

- Guidance and support information for parents.
- Discussion space for parents to share questions and feedback.

7. Students Section

- Student profiles and personal academic information.
- Discussion forum for students to communicate and collaborate.

8. Security and Privacy Page

- Explanation of privacy policies and how student and user information is protected.

9. Gallery

- Photos and videos of school activities, ceremonies, and important events.
- Display of student artwork and projects.

10. Teacher Profiles

- Information about teachers’ qualifications and experience.
- Educational content and shared learning resources from teachers.

11. Feedback and Surveys

- Online surveys to collect feedback from parents, students, and staff.
- Feedback and suggestion forms.

12. Awards and Achievements

- Display of school awards and student achievements.
- Information about students’ personal academic and extracurricular achievements.

13. Online Library- Access to digital books, articles, and educational resources.

- Library catalog of available books.

14. Career Opportunities

- Listing available job opportunities in the school.
- Online job application form.

15. Community Support

- Information about social support programs and community collaborations.
- Introduction to charity organizations and partners working with the school.

16. Student Portal

- Personal student accounts with access to grades, assignments, and learning materials.
- Direct communication channel with teachers.

17. Testimonials

- Reviews and experiences shared by parents and students.

18. Thank You Page

- Appreciation message for supporters, parents, and partner organizations.
- Display of sponsors and donors.

19. Student Projects

- Display of students’ outstanding academic and creative projects.
- Encouragement of teamwork and collaborative projects.

20. School History

- Detailed information on the school’s establishment and development.
- Display of historical photos and important milestones.

21. Sports Teams

- Introduction of school sports teams and training programs.
- Display of match results and sports events.

22. Cultural and Performing Arts

- Information about cultural programs and art activities at the school.
- Photos and videos from performances and student art shows.

23. Competitions and Contests

- Information about academic, cultural, and athletic competitions.
- Encouraging students to participate and guidelines for competitions.

24. Internships and Work Experience

- Introduction to internship opportunities for students.
- Providing exposure to various career fields.

25. Honors and Awards

- Display of achievements and honors received by the school and students.

26. Educational Trips

- Information about educational tours and scientific field trips.27. International Collaborations
- Introduction to international educational partnerships and exchange projects.

28. Library Services

- Explanation of library services including digital resources and book lending.

29. Student Associations

- Introduction to student clubs and extracurricular groups.
- Display of student activities and leadership roles.

30. Parent-Teacher Interactions

- Information about parent-teacher meetings and communication guidelines.
- Feedback forms for parents.

31. Parent Involvement

- Encouraging more parental participation in school activities.
- Introduction of parent-led volunteer groups.

32. Arts and Crafts

- Display of student artwork and handmade crafts.
- Organization of workshops and art training sessions.

33. Parent Portal

- Private messaging system between parents and teachers.
- Access to academic progress reports and student grades.

34. Hall of Fame

- Highlighting distinguished students and teachers of the school.

35. Charity Events

- Information about charity events organized by the school.
- Encouraging parents and students to participate in charitable activities.

36. Recreational Activities

- Introduction to recreational programs and entertainment events for students.
- Online registration for recreational activities.

37. Alumni Relations

- Profiles and updates of alumni and graduates.
- Organizing alumni meetings and events.

right now i have completed the Home, About, Academic Programs, News And Events, Contact Us, Gallery, teacher profile, Awards and achievements and testimonials pages and have these plus other components.
Navbar, Footer, CTASection, PageHeader and others which can be imported from components/ or components/layout/

now i want you to make the Performing Arts & Cultural section good.

if you have any question or do not understand any part, tell me, if no then go.
