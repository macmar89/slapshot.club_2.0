# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.3](https://github.com/macmar89/slapshot.club_2.0/compare/v0.1.2...v0.1.3) (2026-04-09)


### Features

* add announcements and assets tables to database schema ([fbf3acb](https://github.com/macmar89/slapshot.club_2.0/commit/fbf3acbc9fdc792349af82bbedfb4a726527fb7d))
* add announcements link with unread count to mobile menu and update announcement service to support custom sorting ([b479ad1](https://github.com/macmar89/slapshot.club_2.0/commit/b479ad109c3632522447b6183eca727c65d19370))
* add pinning functionality to announcements and remove onboarding modal ([b19cfff](https://github.com/macmar89/slapshot.club_2.0/commit/b19cffffcad80c1adb385f35769e62c8473b7ba6))
* add registration toggle, refactor Turnstile to support refs, and standardize authentication view layouts ([b158cce](https://github.com/macmar89/slapshot.club_2.0/commit/b158cceb686730695254c944fe7875f08c334101))
* add welcome announcement schema and increase SWR deduping interval to 30s ([f7b347c](https://github.com/macmar89/slapshot.club_2.0/commit/f7b347c5c31b0868c8d90612c07b2d0093fab141))
* enhance user manual groups view with membership tiers and localized content ([33bb5dc](https://github.com/macmar89/slapshot.club_2.0/commit/33bb5dc1f88e5b7da746b969b4630db1add5ab97))
* implement admin feedback management system with CRUD operations and filtering support ([784186b](https://github.com/macmar89/slapshot.club_2.0/commit/784186b4c821991fbcc431b4f37d1ba95a770995))
* implement admin feedback management system with listing, filtering, and detail views ([2321d10](https://github.com/macmar89/slapshot.club_2.0/commit/2321d10f19f3fefb6777302bbb6f2ab2dec03826))
* implement public announcements system with detail views and notification integration ([16f5c6f](https://github.com/macmar89/slapshot.club_2.0/commit/16f5c6f804a41c4da9e16426a6eeb444eb6af96f))
* implement security hardening with helmet, hpp, and rate limiting middleware ([f38f26f](https://github.com/macmar89/slapshot.club_2.0/commit/f38f26fe4717eff37b13209bbf3c891b9b4009d9))
* implement unread announcement tracking with sidebar badge and automatic read status updates ([bc46aa8](https://github.com/macmar89/slapshot.club_2.0/commit/bc46aa888452ece36200cbc2e5c40ec947ce8673))


### Bug Fixes

* rename isActive property to isVerified and update default value to false in auth service ([3ed6b73](https://github.com/macmar89/slapshot.club_2.0/commit/3ed6b7396e88f05539457ba6122fd6316711606f))


### Refactors

* move welcome notification outside registration transaction and include localized titles in payload ([2b9ff22](https://github.com/macmar89/slapshot.club_2.0/commit/2b9ff223b96386d62c408a7aa2b142ace4ad903d))
* remove global entrance animations across all feature views and components ([5aa1668](https://github.com/macmar89/slapshot.club_2.0/commit/5aa16684dd8dc0fb7330dfe993a043dcecd6c266))

### [0.1.2](https://github.com/macmar89/slapshot.club_2.0/compare/v0.1.1...v0.1.2) (2026-04-08)


### Features

* add announcements schema and integrate into database models ([7cf213a](https://github.com/macmar89/slapshot.club_2.0/commit/7cf213a77d4b28fb11f84f4893d8be173c8c7669))
* implement admin announcement management system with CRUD capabilities and localization support ([c499102](https://github.com/macmar89/slapshot.club_2.0/commit/c4991021331de65831d5043b0ea03a43dd1028a2))
* implement full CRUD functionality for admin announcements including publishing, deletion, and filtering. ([a142814](https://github.com/macmar89/slapshot.club_2.0/commit/a1428149eb761498a97e20ff1b33ed35c140177e))


### Refactors

* remove PWA tabs from onboarding modal and clean up turbopack config ([f31a6df](https://github.com/macmar89/slapshot.club_2.0/commit/f31a6dfa534596295f9663be3824bceb00e1acdf))
* simplify UserProfileDrawer props and update version display from package.json with turbopack configuration ([9a6d8c8](https://github.com/macmar89/slapshot.club_2.0/commit/9a6d8c88bab55a30bfeaa4802435e4002c2171d1))

### [0.1.1](https://github.com/macmar89/slapshot.club_2.0/compare/v0.1.0...v0.1.1) (2026-04-07)


### Chores

* initialize standard-version for automated release management and versioning ([025edbb](https://github.com/macmar89/slapshot.club_2.0/commit/025edbbbff42cdbe8d7dd6469724528524904942))

## 0.1.0 (2026-04-07)


### Features

* Add 'Missing Tips' feature with dedicated pages, navigation, and backend endpoints to track unpredicted matches. ([e3a3f66](https://github.com/macmar89/slapshot.club_2.0/commit/e3a3f66f75e54f9ce8a76ff274a61475689451d9))
* Add `isAuth` and `isAdmin` middleware to public match routes and remove development environment conditional access. ([293d377](https://github.com/macmar89/slapshot.club_2.0/commit/293d37792c7ff8dd7f13f6fa4e0cb28fe2995b88))
* Add a new `/health` endpoint for application status checks. ([525e44e](https://github.com/macmar89/slapshot.club_2.0/commit/525e44e07844274af49412534f3409aa67e03b7b))
* Add audit logging for competition joins and prediction updates, fetching competition slug for context. ([7e17edf](https://github.com/macmar89/slapshot.club_2.0/commit/7e17edf0debbd75620c7de4e14cb0509c322609c))
* Add competition team endpoint and implement team search filtering for player predictions. ([c41b96c](https://github.com/macmar89/slapshot.club_2.0/commit/c41b96c68e5008829596c83a92a73b3cf9196508))
* Add configurable cookie domain to cookie options via environment variable. ([761e9d2](https://github.com/macmar89/slapshot.club_2.0/commit/761e9d2bcaf74c14807eed5e22c98d63d68745ed))
* add Czech Extraliga database seed and automation script for team data and assets ([f5dc819](https://github.com/macmar89/slapshot.club_2.0/commit/f5dc819c6c093716e28eb27cdab442944be45c9a))
* add disabled state to sidebar items and extend admin navigation with new menu entries ([adf7e19](https://github.com/macmar89/slapshot.club_2.0/commit/adf7e1921de65afe5c8b3a3ea63dea9d3f17f05b))
* Add missing tips counter to mobile menu, refactor missing tips summary and view, update backend date formatting, and remove dedicated layout files. ([27ea252](https://github.com/macmar89/slapshot.club_2.0/commit/27ea252a6ae0828512130b2e3b4468792e9dc355))
* Add old database data in CSV format and a migration script, along with updated package dependencies. ([88202bc](https://github.com/macmar89/slapshot.club_2.0/commit/88202bcc328419737a247cb549cbd1a0ce56a9dc))
* add playoff series schema and match verification tracking functionality ([976a0b3](https://github.com/macmar89/slapshot.club_2.0/commit/976a0b31fef586968950626e23cad6f76a2fa4ff))
* Add service to sync future matches from external API, including new matches and teams, and expose a public route for testing. ([97ace07](https://github.com/macmar89/slapshot.club_2.0/commit/97ace07f744af3b580975f55ede2e68dc8170898))
* Add support for specific features and knockout phases including advancer predictions and scoring. ([b1cbfd2](https://github.com/macmar89/slapshot.club_2.0/commit/b1cbfd21ecb3f1e322a2e824d801b5d14cf8d5e6))
* Add unread notification badges to navigation components with conditional fetching and updated sidebar configuration. ([b86a394](https://github.com/macmar89/slapshot.club_2.0/commit/b86a39448465b34a3d98f179d8aa16bd4cebd4e0))
* Adjust match queue schedule and enhance live match updates with API status change detection. ([3b0e0bc](https://github.com/macmar89/slapshot.club_2.0/commit/3b0e0bc6f5d643573f4d51d837a75262923a50a2))
* Exclude scheduled matches from predictions repository queries. ([84b37f4](https://github.com/macmar89/slapshot.club_2.0/commit/84b37f4769c3e861b09a6f1e832f0bd393a50d94))
* Exclude scheduled matches from predictions repository queries. ([6d80f37](https://github.com/macmar89/slapshot.club_2.0/commit/6d80f374bc1399c9afdb8a9db0a75d24520db60f))
* Extend Express Request with an optional `org` property and add username search functionality to group member retrieval. ([700778f](https://github.com/macmar89/slapshot.club_2.0/commit/700778fd69654c4ada5ad359a61d65ec61912797))
* Filter predictions by scheduled matches and adjust date range to start from today, and fix notification badge hydration issues. ([486b51c](https://github.com/macmar89/slapshot.club_2.0/commit/486b51c606ae56f6ffd5d9d6298230e3779568c3))
* Implement a competition ranking recalculation system using a dedicated queue and worker, and enhance user prediction statistics. ([04045b1](https://github.com/macmar89/slapshot.club_2.0/commit/04045b15c4756dbc1e6ccf89c3500645b943f2ab))
* Implement a comprehensive notification system with dedicated routes, services, and integration into group membership workflows. ([a080626](https://github.com/macmar89/slapshot.club_2.0/commit/a080626440d85021618e212434e3ada5548d256c))
* implement admin dashboard with user and match statistics tracking ([9f8b752](https://github.com/macmar89/slapshot.club_2.0/commit/9f8b7527bf127db26f2cd972a1c01da718920901))
* implement admin match detail view with score and status management capabilities ([22be67f](https://github.com/macmar89/slapshot.club_2.0/commit/22be67f7ca4d0ccfc30b5f43a7deb13000a8527e))
* implement admin match filtering, lookup endpoints, and responsive match card component ([ca6a35e](https://github.com/macmar89/slapshot.club_2.0/commit/ca6a35eef7c1b41f0e6654a5c1f5040d21ac692b))
* implement admin match management, evaluation, and audit logging functionality ([024b322](https://github.com/macmar89/slapshot.club_2.0/commit/024b3226765144455ae5923edf6b85d7457b6eca))
* implement admin match scoring interface with score editor, audit tracking, and backend detail retrieval. ([8de80a5](https://github.com/macmar89/slapshot.club_2.0/commit/8de80a53983d8634623931bb15bbadbed3797b61))
* implement admin matches management view with filtering and paginated table support ([0895fbc](https://github.com/macmar89/slapshot.club_2.0/commit/0895fbc33cca0f6d2805e5ba053578c512fce9de))
* implement AdminGuard for route protection and add AccessDenied and 404 error pages ([323da77](https://github.com/macmar89/slapshot.club_2.0/commit/323da7779af890b0310ded105f2b886a5efa0dba))
* Implement an admin panel with a dedicated layout, navigation, and initial dashboard and matches pages. ([cef3002](https://github.com/macmar89/slapshot.club_2.0/commit/cef3002c4eebb79007621c6e9949175c472d27b1))
* Implement Arena feature, refactor UI components, update authentication flows, and introduce new color palette. ([8e909b5](https://github.com/macmar89/slapshot.club_2.0/commit/8e909b5d15979f1353219b961d41e55d33169359))
* Implement arena navigation items and refactor mobile menu and tab navigation components. ([1caa8e6](https://github.com/macmar89/slapshot.club_2.0/commit/1caa8e6089872c69aa48ae9884e52a89c9e814b2))
* implement automated daily standings synchronization for NHL and other leagues with multi-group support and unit tests ([96bd1f9](https://github.com/macmar89/slapshot.club_2.0/commit/96bd1f9c214fb4f48a4a40e22d48b735721f7cd0))
* implement automated grouped match tip reminders for users in active competitions ([e6c3584](https://github.com/macmar89/slapshot.club_2.0/commit/e6c3584207f58c45beff0e6753d449cc1b75b169))
* Implement BullMQ-based email queue and worker for asynchronous user verification emails via Brevo. ([b6b9aad](https://github.com/macmar89/slapshot.club_2.0/commit/b6b9aadf509161e76d8ccdacddadfc5a11201223))
* Implement collapsible sections for group member lists and add member role indicators. ([ebf3cec](https://github.com/macmar89/slapshot.club_2.0/commit/ebf3cec4609a293d49b60ad0b4f4dd84cb47a331))
* implement competition dashboard with user stats, upcoming matches, and supporting backend APIs ([cc7d9ec](https://github.com/macmar89/slapshot.club_2.0/commit/cc7d9ec0057d6245d2d0d2e21fc8268723a16cf9))
* implement competition leaderboard with dedicated backend services, routes, and frontend components. ([10cb7af](https://github.com/macmar89/slapshot.club_2.0/commit/10cb7afa48d0feda695c059545ca45fa9f31790a))
* implement competition standings schema, storage, and admin sync functionality ([279823f](https://github.com/macmar89/slapshot.club_2.0/commit/279823fae2c3c435631aa1a45fe8e87d4888595f))
* Implement competition-specific pages with dynamic routing and refactor server-side competition data fetching. ([359b790](https://github.com/macmar89/slapshot.club_2.0/commit/359b79041de8780b8089e26bd15be0cac9af384f))
* Implement comprehensive authentication flows and foundational UI/layout components. ([339600b](https://github.com/macmar89/slapshot.club_2.0/commit/339600b485a8c0207c93ea2e1b8aae7abb30275e))
* Implement cursor-based pagination and provide detailed match information for player predictions, along with new validation and player-specific error messages. ([d2cc581](https://github.com/macmar89/slapshot.club_2.0/commit/d2cc58156ad334c8777bb95c9d401176c6cbabf0))
* implement daily automated notification service for missing match tips ([68c7d94](https://github.com/macmar89/slapshot.club_2.0/commit/68c7d9465b52214b6d41a427c76813819dd65bf0))
* Implement dedicated competition matches view with daily summaries, calendar integration, and improved prediction flow. ([1059a68](https://github.com/macmar89/slapshot.club_2.0/commit/1059a682ea2668bd814812ef7ee0b07e3315d025))
* Implement detailed group view with member management, dedicated API endpoints, and supporting frontend components. ([c322563](https://github.com/macmar89/slapshot.club_2.0/commit/c3225635a824ea1b2ff04ed3a9b29816b33c37c1))
* Implement feedback functionality, add competition management, and introduce new UI components. ([4f22783](https://github.com/macmar89/slapshot.club_2.0/commit/4f2278376e8a83bea3e4de71b06d2a5310efaf27))
* Implement full authentication flow including registration, login, password reset, and email verification with new email templates and localization. ([c779026](https://github.com/macmar89/slapshot.club_2.0/commit/c779026d54364b1b45641949a01a9a3a62829afa))
* Implement granular group setting updates via a new API endpoint and dedicated service. ([a968355](https://github.com/macmar89/slapshot.club_2.0/commit/a9683557b94ed9ef1bb96f17f302b0be49ee10cf))
* Implement group capacity calculation based on member subscription plans and refactor service imports. ([0bf757d](https://github.com/macmar89/slapshot.club_2.0/commit/0bf757d835674051ef075868fe8ef62b5b656829))
* Implement group creation and listing features with updated subscription plan limits. ([b54fc83](https://github.com/macmar89/slapshot.club_2.0/commit/b54fc83ac689d2c78c7658cefd993686b43151a6))
* Implement group creation with subscription-based member limits and add a group joining endpoint. ([223f291](https://github.com/macmar89/slapshot.club_2.0/commit/223f29126eafe5e7760cec33757d1016ee6488b7))
* Implement group deletion functionality with a new frontend confirmation dialog and corresponding backend service. ([d1b9455](https://github.com/macmar89/slapshot.club_2.0/commit/d1b94555c67ac1cc8f8ebf432c3c8a589fe92d13))
* Implement group detail page with tabs, skeleton, and backend integration. ([884ec22](https://github.com/macmar89/slapshot.club_2.0/commit/884ec228c2f2bb9ffad1ed8e48a1282609c71a66))
* Implement group joining functionality with new UI components, API routes, and schema updates. ([b9ece62](https://github.com/macmar89/slapshot.club_2.0/commit/b9ece624292b372fab9484994e01ef0658cd7bfd))
* Implement group joining functionality with validation, membership limits, and dedicated repositories. ([ac5ea3b](https://github.com/macmar89/slapshot.club_2.0/commit/ac5ea3bdeb4e95cc55cb88ac87a4f34346b261a6))
* Implement group leaderboard API endpoint and associated data retrieval logic. ([0e98720](https://github.com/macmar89/slapshot.club_2.0/commit/0e9872098bd7ce0e7013fb03f1707d6e20a7f880))
* Implement group member removal and refactor group services into dedicated modules. ([059e051](https://github.com/macmar89/slapshot.club_2.0/commit/059e05181562dbd7beab90ec3377fad797f9991f))
* Implement group member role management, including ownership transfer, and conditionally render group detail tabs based on user roles. ([0ce67a9](https://github.com/macmar89/slapshot.club_2.0/commit/0ce67a90456ccc86401ce1de233da9681fcc7e14))
* implement group member status and role management, group ownership transfer, and introduce subscription configuration ([ab35dcc](https://github.com/macmar89/slapshot.club_2.0/commit/ab35dcc1b33610f2a6d83f6c8f3a33b3f7d362f1))
* Implement group settings management and enhance group roster display with member status filtering and loading skeletons. ([f18a27f](https://github.com/macmar89/slapshot.club_2.0/commit/f18a27f3659cb2975a609193e0cbd6afd87b4d4c))
* Implement infinite scrolling for notifications and integrate into sidebar navigation with unread badge. ([e28d611](https://github.com/macmar89/slapshot.club_2.0/commit/e28d611221df916f35789f7525cf184860957a90))
* Implement live match updates, including data fetching, status/score processing, and triggering prediction evaluations. ([ff5b652](https://github.com/macmar89/slapshot.club_2.0/commit/ff5b652d69fde357f9247e8a521e2cd4a5bf4b06))
* Implement match prediction functionality with new backend services, API, and frontend components, including a refactored upcoming matches display. ([ee8b873](https://github.com/macmar89/slapshot.club_2.0/commit/ee8b873e405703ea0daddb3e44ebeac65c548142))
* implement match verification card and update match detail UI with ranking status ([19600f9](https://github.com/macmar89/slapshot.club_2.0/commit/19600f9716efda443d7f85f4c98a4186c3890fa0))
* Implement paginated and searchable match predictions with access control and new UI components. ([b06bc52](https://github.com/macmar89/slapshot.club_2.0/commit/b06bc528e66efa363beeea7547d0fcd5b80c343d))
* implement paginated match retrieval with filtering and sorting for admin dashboard ([4b154e0](https://github.com/macmar89/slapshot.club_2.0/commit/4b154e0ea091ee310315de1c33009e70ed2627c9))
* Implement player detail view with stats and prediction history for competition participants. ([05c85bf](https://github.com/macmar89/slapshot.club_2.0/commit/05c85bf261ba04f20e8bff2fda84c46aeec73b07))
* Implement prediction scoring and evaluation logic, including new point configuration, scoring types, and schema updates for evaluated predictions. ([0208823](https://github.com/macmar89/slapshot.club_2.0/commit/0208823242f497240286f77c6e19b06c1199d072))
* Implement real-time notification system with Server-Sent Events (SSE), new API endpoints, and frontend UI components for display and interaction. ([66ed4a5](https://github.com/macmar89/slapshot.club_2.0/commit/66ed4a59f65ecc3b3a8f64337fc17718132a38d4))
* implement scheduled daily synchronization for NHL and other league standings ([e13d671](https://github.com/macmar89/slapshot.club_2.0/commit/e13d6717727df9bd1bfbb72f7f0e4689b69c7658))
* Implement scheduled match synchronization using BullMQ queues and workers. ([c4d0650](https://github.com/macmar89/slapshot.club_2.0/commit/c4d0650a45d0221ebc3237eaa93df727e0d242fb))
* Implement transactional group member removal with dynamic capacity updates. ([4b5c40a](https://github.com/macmar89/slapshot.club_2.0/commit/4b5c40a9644e2e3ffdae6fca9aac5faeeb0dea65))
* Implement user email verification flow and refactor the login form component. ([2f1ca24](https://github.com/macmar89/slapshot.club_2.0/commit/2f1ca24e11ed70d00e11ec5c52cf0f5ab2c46ad3))
* implement user onboarding modal with completion tracking and PWA installation instructions ([830f906](https://github.com/macmar89/slapshot.club_2.0/commit/830f906bbc92584ec9e5e66f18ed3c2c51bf0328))
* Implement user preferred language update functionality and standardize Czech locale to 'cs' across the application. ([21e9bab](https://github.com/macmar89/slapshot.club_2.0/commit/21e9bab063b8ed9dca460d5f2029a8dbc86d9c8a))
* Implement user registration with availability checks and case-insensitive backend validation. ([eca9f98](https://github.com/macmar89/slapshot.club_2.0/commit/eca9f9826338d6f875fc60698300d859a9901790))
* Improve match card responsiveness and button sizing, add 'Rules' translation key, and adjust main content padding. ([404ee96](https://github.com/macmar89/slapshot.club_2.0/commit/404ee961b68af0fef5bddb43442c43f57e8a2021))
* Include user's subscription active until and referral code in backend auth responses and service queries, and update frontend referral link styling and header import path. ([aa5e75b](https://github.com/macmar89/slapshot.club_2.0/commit/aa5e75bf1d7c02eb1e8dc94862f5d5b4aa89359b))
* Initialize monorepo structure, re-generate Drizzle ORM schema, and add database migration and seeding scripts. ([9a8ed4e](https://github.com/macmar89/slapshot.club_2.0/commit/9a8ed4e9e7d5013a90971d12752336c7f9117a5c))
* Integrate BetterStack for production logging by adding its pino transport and environment variable. ([72fd4d1](https://github.com/macmar89/slapshot.club_2.0/commit/72fd4d173cd60cf76fa7d85fcef6261a309e51f1))
* Integrate Cloudflare Turnstile for bot protection across authentication and feedback flows, adding new backend middleware, service, schema updates, and frontend UI. ([c93f167](https://github.com/macmar89/slapshot.club_2.0/commit/c93f167fda1830b468a682d84837c801850c9dbb))
* Introduce centralized error handling, loading skeletons, and role-based access for group features. ([54fbbfa](https://github.com/macmar89/slapshot.club_2.0/commit/54fbbfaff2829913150080087c16efef45ebb0fa))
* introduce dedicated account management section with profile updates, email/username change, and password management. ([b572d3e](https://github.com/macmar89/slapshot.club_2.0/commit/b572d3e97d987ebde71c897c5545ead43bdd3126))
* introduce feedback submission functionality with dedicated API, validation, and UI integration. ([2664a4a](https://github.com/macmar89/slapshot.club_2.0/commit/2664a4acfacdba1c95bb800f21b7072a5716e66b))
* Introduce group management functionality, replacing the previous league system with new routes, services, schemas, and UI components. ([63dd8cd](https://github.com/macmar89/slapshot.club_2.0/commit/63dd8cd08f93e759f2d0e1fcd5b6bbeef40a0a8f))
* introduce match detail view with prediction components and refactor match data handling. ([5780177](https://github.com/macmar89/slapshot.club_2.0/commit/57801773f398c8fcbf06a2c3fa6def7f0ec38522))
* Introduce notification system, add project setup documentation, Docker Compose, and backend Vitest testing. ([16f18be](https://github.com/macmar89/slapshot.club_2.0/commit/16f18be372bf68f2420732343bdaa2162e2a9bf5))
* introduce structured match rounds with i18n support and enhanced backend processing. ([b8ee729](https://github.com/macmar89/slapshot.club_2.0/commit/b8ee7296004ed2ac5d76d6781e78ae7496e86217))
* Persist user consent settings during registration, redirect to arena on success, set user in auth store, and standardize schema error keys. ([36b036c](https://github.com/macmar89/slapshot.club_2.0/commit/36b036cce5771d2222108364bb0c33296ae12929))
* Refactor player detail page to use `useAppParams` and a new `PlayerStats` type, simplifying data fetching and removing prediction history, alongside backend adjustments for player stats retrieval and a new `PlayerFormDots` component. ([af6024b](https://github.com/macmar89/slapshot.club_2.0/commit/af6024b563aa16eea2270d8f8931b86821449c62))
* Refactor user authentication data and competition joining, introduce Zod validation, and enhance dialog styling. ([2ec9a7d](https://github.com/macmar89/slapshot.club_2.0/commit/2ec9a7db19310de7b9669d24877cca7ce83202ff))
* rename "Leagues" to "Groups" and enhance group management with new schema fields, roles, aliases, and audit logging. ([04e8434](https://github.com/macmar89/slapshot.club_2.0/commit/04e84348e02bf86b4e7d3a27271b5a8edb80a593))
* Rename `totalMatches` to `totalPredictions` across the application and implement group-specific leaderboards. ([6a4eb68](https://github.com/macmar89/slapshot.club_2.0/commit/6a4eb68797b0279bbdfc508d6d20b4c070dc68e2))
* Standardize error message handling and add new localized messages for group management. ([c12e0d0](https://github.com/macmar89/slapshot.club_2.0/commit/c12e0d0dbf9cf4f37fab31c03ec532a1479bbf52))
* track and store user prediction form history in leaderboard entries ([e184783](https://github.com/macmar89/slapshot.club_2.0/commit/e184783a1e58aa1a8d1482d22a30bae9f26125e3))
* update match `rankedAt` timestamp when evaluating and reverting matches. ([117153f](https://github.com/macmar89/slapshot.club_2.0/commit/117153fe94eaf1a4716c73c41a26970dcd202375))


### Documentation

* Update READMEs to clarify `.env` setup and backend database migration commands. ([f914861](https://github.com/macmar89/slapshot.club_2.0/commit/f914861108e9d832cff2b526d00218dae2163a3e))


### Performance

* Add API preconnect, optimize package imports, and reduce image quality for improved performance. ([d0d2a58](https://github.com/macmar89/slapshot.club_2.0/commit/d0d2a585274f0879b5133fde7bae30f0d80d167e))


### Refactors

* append .js extensions to internal module imports for ESM compatibility ([d37b704](https://github.com/macmar89/slapshot.club_2.0/commit/d37b7041cfc6eafd00f90628411537757d13f577))
* centralize data loading and error handling using the new DataLoader component. ([48663f2](https://github.com/macmar89/slapshot.club_2.0/commit/48663f27b61e4a7fd9e7651eb276c443b5402359))
* centralize logo display with new `SlapshotLogo` component, simplify loader, and update authentication navigation. ([dac9a0b](https://github.com/macmar89/slapshot.club_2.0/commit/dac9a0ba990e3922fad472d1d8872fb66f1405c7))
* Conditionally define API_URL based on the server environment. ([00a3fe3](https://github.com/macmar89/slapshot.club_2.0/commit/00a3fe3809b87956cd085881e01d697e45e2e637))
* Consolidate `env` import with `IS_PRODUCTION` from `./config/env.js`. ([1f53ced](https://github.com/macmar89/slapshot.club_2.0/commit/1f53ced24683779d5c296719ee22170b7de62e4d))
* enhance logging for authentication services and ensure error stack traces are always included. ([1ac7a28](https://github.com/macmar89/slapshot.club_2.0/commit/1ac7a28a7d84f2981442428cf460e00799b851a7))
* Enhance Turnstile component by conditionally loading Cloudflare challenges script, memoizing the enable check, delaying the mock token, and setting the execution option to 'render'. ([4027788](https://github.com/macmar89/slapshot.club_2.0/commit/40277886fa31294a4509bb1cd3e387e5f0062b65))
* make audit logging non-blocking with error handling and streamline the join group response. ([5d021a7](https://github.com/macmar89/slapshot.club_2.0/commit/5d021a7533b1baf3686a7aa97a2e999eee2e4287))
* make Next.js API rewrite destination configurable via environment variable ([53eab5d](https://github.com/macmar89/slapshot.club_2.0/commit/53eab5d8e6ee70296ea2685a028cf3d0fb7d3bbf))
* migrate image assets from PNG to WebP format, update Next.js image configuration, and adjust Image component props. ([643aeeb](https://github.com/macmar89/slapshot.club_2.0/commit/643aeeb2154dbc8f273b4dfa0e96e76c81d347db))
* Reduce logging verbosity in prediction logic and matches worker, and standardize leaderboard refresh log. ([0754d6d](https://github.com/macmar89/slapshot.club_2.0/commit/0754d6d1d61919a00be04c023f0315adb734e867))
* Reimplement forgot and reset password flows using Next.js App Router and update backend authentication logic. ([a8d758d](https://github.com/macmar89/slapshot.club_2.0/commit/a8d758dee7d22bb267b5a2c71f45e8e4878f6c52))
* remove debug console logs and unnecessary fields from user selection in login. ([940bc3a](https://github.com/macmar89/slapshot.club_2.0/commit/940bc3af459d4d3710e82d1830f15e66b33e7b20))
* remove matches reminder service integration test ([a15ca1b](https://github.com/macmar89/slapshot.club_2.0/commit/a15ca1bcc9ac394caeedfb802bf093b8bc31887a))
* Rename authentication error key from `invalid_username_or_password` to `wrong_credentials` and update `LoginForm` import path. ([1024676](https://github.com/macmar89/slapshot.club_2.0/commit/1024676ecbd71c67bfe8cf9a82a2bb8f130520c9))
* Replace `NEXT_PUBLIC_ENABLE_TURNSTILE` with `DISABLE_TURNSTILE` for Turnstile control. ([c731e47](https://github.com/macmar89/slapshot.club_2.0/commit/c731e479da98920656f67d005e78c8221eb2d79c))
* replace monolithic MobileTabNav with context-specific mobile navigation components and a standalone PWA detection hook. ([3e56543](https://github.com/macmar89/slapshot.club_2.0/commit/3e565434cb37a83076c4e780f0a9d86d8b2c2251))
* Replaced multiple authentication components with a new account view and simplified routing in competition components. ([1a9bd9f](https://github.com/macmar89/slapshot.club_2.0/commit/1a9bd9fe7b59dd8067e4406ce8ccca133c67b025))
* simplify match filter schema, update status translation keys, and cleanup controller logging ([5832368](https://github.com/macmar89/slapshot.club_2.0/commit/58323682f50cd8ad73abb45e99dc66cbbe882cbf))
* simplify match status sidebar save button styling and increase top margin ([53ef3b3](https://github.com/macmar89/slapshot.club_2.0/commit/53ef3b3fe39f8317d91dac797015a06b37378ac3))
* Standardize APP_CONFIG property names to SCREAMING_SNAKE_CASE across backend and frontend. ([c06ca8b](https://github.com/macmar89/slapshot.club_2.0/commit/c06ca8b37728fb5e3f22be56073fc9fbf412dc31))
* update all import paths to include `.js` extension for ES module compatibility ([1d8b4b9](https://github.com/macmar89/slapshot.club_2.0/commit/1d8b4b9ac7b8760fdf8b3839fff61a5525c6b5a8))
* Update cookie `sameSite` policy to `lax` and enhance CORS origin handling for multiple domains. ([dd2edc9](https://github.com/macmar89/slapshot.club_2.0/commit/dd2edc9e9f5bdc4933971fadbfb32c753035dede))
* update db import path and remove unused Drizzle ORM imports. ([a751f64](https://github.com/macmar89/slapshot.club_2.0/commit/a751f64f507a2cd9eebf03c85c7b43673df1b2a1))
* Update Turnstile verification to use axios, correct related typos, and externalize the frontend API base URL. ([4ebe7c5](https://github.com/macmar89/slapshot.club_2.0/commit/4ebe7c5d9577cc9588c8343747c605a23c6a887d))


### Chores

* **release:** 1.0.0 ([1b28d9a](https://github.com/macmar89/slapshot.club_2.0/commit/1b28d9a46c2377d7867f165249a5c12837b89720))
* Remove `seed-users.ts` script and its documentation from the README. ([118bd72](https://github.com/macmar89/slapshot.club_2.0/commit/118bd72c9d81dac431e8be280a69065d0cc5864c))
* update missing tips reminder interval from 2 to 10 minutes ([907c2d9](https://github.com/macmar89/slapshot.club_2.0/commit/907c2d9ace302242d1981daa0814f6e096d20e20))
