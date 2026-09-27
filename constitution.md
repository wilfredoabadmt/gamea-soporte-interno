# GAMEA Internal Operations Platform — Constitution

## Core Principles

### I. Internal-Only Institutional Scope
The platform MUST operate strictly and exclusively as an internal operational, management, coordination, support, and tracking environment for the Gobierno Autónomo Municipal de El Alto (GAMEA). All platform actors MUST be authenticated municipal officials, authorized public servants, supervisors, unit heads, direction heads, functional administrators, technical administrators, authorized institutional authorities, or authorized auditors. Under NO circumstances shall public-facing citizen access, citizen accounts, taxpayer self-service, citizen claim intake, public chatbots, or anonymous external entries be provisioned within the core domain of this platform. The term "solicitante" (requester) strictly denotes an authenticated municipal official or administrative dependency generating an internal request towards another internal dependency.

### II. Internal Case Management
The primary atomic entity across all workflows MUST be the "Caso Interno" (Internal Case). An Internal Case represents any formal request, internal ticket, incident, inquiry, inter-office coordination, technical or administrative requirement, or reported institutional occurrence. Every Internal Case MUST maintain an immutable institutional lifecycle, tracking: unique identifier, requesting official, requesting office/unit/direction/subalcaldía, target dependency, category, subcategory, priority, comprehensive description, creation timestamp, assigned responsible official, current lifecycle state, full chronological history, institutional novedades, attached evidentiary files, inter-office derivations, contextual comments, execution actions, SLA milestones, resolution record, formal closure, and audit footprint.

### III. Organizational Structure
The platform MUST represent the multidimensional, hierarchical, and decentralized organizational structure of GAMEA (Oficinas Centrales, Secretarías, Direcciones, Unidades, Departamentos, Programas/Equipos, and Subalcaldías). Hardcoded organizational hierarchies are strictly PROHIBITED. All structural entities, reporting lines, dependencies, assigned officials, queues, cataloged internal services, operational hours, procedures, and derivation matrices MUST be dynamic, versioned, and managed via system configuration without requiring code modifications or deployments.

### IV. Internal Omnichannel
Omnichannel capabilities MUST be interpreted and deployed exclusively for internal municipal communication. Inbound and outbound institutional channels—including the internal web platform, role-based inboxes, institutional email gateways, secure internal chat, institutional messaging, telephony logs, and authorized internal micro-applications—MUST converge into a single unified case history. An official MUST NEVER be required to duplicate information when transitioning between authorized internal channels. Public, external citizen communication channels are strictly excluded from the architecture.

### V. Traceability
Every transaction, state transition, data modification, assignment, derivation, and viewing of sensitive records MUST produce an indelible, tamper-evident audit record. The system MUST be capable of reconstructing the complete operational lifecycle of any Internal Case: who performed the action, their institutional role and unit, the precise timestamp, the affected attribute, the previous value, the new value, the operational justification, and the system outcome.

### VI. Institutional Novedades
The concept of "Novedad Institucional" MUST serve as the core chronological ledger of operational milestones, observations, and relevant occurrences within an Internal Case. A Novedad is a first-class citizen representing internal observations, factual progress, technical incidences, formal commitments, administrative instructions, official responses, state changes, derivation milestones, operational blockades, resolution results, or follow-ups. Every Novedad MUST preserve its author, creation timestamp, case link, typification, detailed narrative, associated evidentiary files, and resulting state.

### VII. Internal Derivations
Inter-office derivations between units, directions, secretarías, and subalcaldías MUST constitute a primary operational flow of the municipal platform. Every derivation MUST capture: originating dependency, target dependency, initiating official, justification/reason, priority, timestamp, transition state, operational observations, formal receipt/acknowledgment, and ultimate outcome. A derivation MUST NEVER truncate, overwrite, or hide the prior operational history of the case; full chronological continuity is strictly preserved across organizational boundaries.

### VIII. Supervision
Supervisory actors MUST be equipped with dedicated operational consoles enabling real-time monitoring, caseload rebalancing, queue oversight, case reassignment, supervisory intervention, administrative closures, operational audit reviews, and SLA breach interception. Supervisory capabilities MUST strictly adhere to the supervisor's jurisdictional authority within the GAMEA hierarchy.

### IX. Responsible AI
Artificial Intelligence (AI) components MUST operate strictly as assistive, augmentative, and advisory agents for municipal officials. AI agents MUST NEVER possess autonomous administrative authority. AI MUST be utilized exclusively for: intent identification, automatic classification of internal requests, probable unit routing suggestions, derivation recommendations, case narrative summarization, operational history synthesis, knowledge extraction, drafting proposed responses, identifying duplicate or related internal requests, detecting low-confidence submissions, and assisting supervisors with workload analytics.

### X. RAG and Institutional Knowledge
Retrieval-Augmented Generation (RAG) and semantic knowledge searches MUST rely exclusively on authorized, validated institutional documentation: administrative manuals, internal regulations, operational procedures, circulars, municipal decrees, resolutions, standardized forms, and technical guides. The RAG subsystem MUST explicitly record and cite the exact source document, document version, approving department, publication date, and operational validity/status for every generated recommendation.

### XI. Human-in-the-Loop
All administrative, legal, budgetary, disciplinary, and final operational decisions MUST remain under the exclusive control of qualified human officials. AI agents are strictly PROHIBITED from approving administrative requisitions, authorizing expenditures, issuing binding administrative directives, applying sanctions, assigning institutional fault, modifying critical master records, or executing automated case resolutions without explicit human sign-off. When an AI prediction falls below the defined institutional confidence threshold, the system MUST enforce fallback protocols, requesting official clarification or routing the case directly to a human specialist.

### XII. Security
The platform MUST implement a Zero Trust security posture tailored to internal government operations. Security MUST encompass multi-factor authentication, granular role-based and attribute-based access control (RBAC/ABAC), least-privilege enforcement, short-lived session management, immutable operational auditing, encryption in transit and at rest, and structural boundary isolation. An official belonging to one municipal unit MUST NOT have implicit or default read/write access to cases, files, or queues belonging to distinct units, directions, or subalcaldías.

### XIII. Auditability
All critical events—including case creation, field mutations, derivations, reassignments, document downloads, status changes, permission changes, and soft deletions—MUST be recorded in an append-only audit trail. The audit architecture MUST ensure forensic reconstructibility, non-repudiation, and exportability for internal comptroller and audit dependencies of GAMEA.

### XIV. SLA
Every internal service category and case type MUST support configurable Service Level Agreements (SLAs). The platform MUST compute and record: time of creation, time of assignment, initial attention timestamp, inter-office derivation durations, idle waiting times, operational resolution timestamp, and formal closure. The system MUST generate proactive visual and notification alerts for imminent breach, breached SLAs, unassigned cases, overdue derivations, and stalled workflows.

### XV. Internal Collaboration
The platform MUST enforce strict multi-tier visibility for internal communication to preserve operational boundaries and confidentiality:
1. **Comunicación con Solicitante (Requester-Facing):** Messages and updates explicitly visible to the official who submitted the request.
2. **Comunicación Interna (Internal Team):** Operational coordination, dialogues, and notes exchanged strictly among handling officials, supervisors, and involved units.
3. **Nota Privada (Restricted Private Note):** High-sensitivity commentary and internal supervisory remarks accessible only to designated roles with explicit security clearances.
Cross-contamination or accidental exposure across these communication tiers is strictly prohibited.

### XVI. Documents
Digital assets, forms, scanned resolutions, evidentiary photographs, technical reports, and PDFs attached to cases MUST be managed with strict versioning, cryptographic checksums, author attribution, upload timestamps, file classifications, and dependency-scoped access controls. Arbitrary or unauthenticated file downloads are prohibited.

### XVII. Notifications
The notification engine MUST deliver real-time operational alerts exclusively to authenticated municipal officials, supervisors, and administrative authorities via internal system toasts, inbox badges, and official internal email/messaging integrations. Notification triggers MUST include new case receipts, assignments, derivations, novedades, supervisor escalations, mentions, SLA milestones, and case closures. Citizen-targeted notifications are entirely out of scope.

### XVIII. Subalcaldías
The decentralized Subalcaldías of El Alto MUST be treated as first-class institutional citizens within the platform architecture. Each Subalcaldía MUST possess its own configurable operational domain: dedicated official directories, supervisory hierarchies, workload queues, specific internal services, derivation protocols, and performance metrics, while retaining full capability for unified municipal consolidation and inter-dependency derivations.

### XIX. Analytics
Operational analytics and performance dashboards MUST be decoupled across institutional governance layers:
- **Funcionario Dashboard:** Individual active cases, assigned queues, pending tasks, upcoming SLA deadlines, and direct novedades.
- **Supervisor Dashboard:** Team workload distribution, operational bottlenecks, active derivations, SLA performance, and intervention tools.
- **Responsable de Unidad Dashboard:** Departmental intake vs. output, resolution times, recurrent bottlenecks, and internal service health.
- **Responsable de Dirección Dashboard:** Consolidated directional metrics, inter-unit derivations, and strategic throughput.
- **Autoridad Institucional Dashboard:** Global cross-municipal operations, Subalcaldía comparisons, and macro SLA compliance.
- **Auditor Dashboard:** Traceability matrices, privileged operation logs, anomaly detections, and compliance reports.

### XX. Active Learning
Operational fallbacks, misclassifications corrected by handling officials, supervisory overrides of AI suggestions, low-confidence routings, and unmapped internal queries MUST be systematically channeled into an internal Active Learning repository. This telemetry MUST serve to continuously calibrate routing taxonomies, prompt definitions, classification models, and internal RAG embeddings under supervised human administrative review.

### XXI. Interoperability
The platform MUST adhere to the principle of "Integrar antes que duplicar" (Integrate before duplicating). The system architecture MUST be prepared for standardized, secure, decoupled interoperability with existing GAMEA back-office databases, human resource registries, municipal document management systems, asset management systems, and financial backends via documented internal APIs, event streams, or secure middleware connectors.

### XXII. Data Governance
All operational, administrative, and institutional data generated within the platform is the sovereign property of the Gobierno Autónomo Municipal de El Alto. Data management practices MUST guarantee full institutional data sovereignty, vendor neutrality, scheduled automated backups, exportability in open formats, verifiable data retention schedules, and continuous disaster recovery readiness within GAMEA's designated operational infrastructure.

### XXIII. Technology Independence
Core business rules, workflow specifications, domain models, and permission matrices MUST remain completely decoupled from underlying commercial platforms, proprietary software vendors, and transient infrastructure providers. The platform MUST be implementable on open, modern, vendor-agnostic enterprise frameworks, avoiding proprietary lock-in at the data, logic, or user-interface layers.

### XXIV. Configuration
All operational metadata—including institutional organizational charts, offices, secretarías, direcciones, subalcaldías, internal service catalogs, taxonomy categories, custom lifecycle states, priority matrices, SLA thresholds, routing heuristics, notification rules, and role permissions—MUST be manageable through a secure administrative user interface without requiring codebase refactoring or system re-compilation.

### XXV. Administrative Continuity
Internal Cases and their full operational provenance belong to the institution and its procedural continuity, not to individual employees. When a public official transitions to another office, concludes their shift, changes roles, or separates from GAMEA, all assigned cases, institutional novedades, attached evidence, and historical logs MUST remain fully preserved, intact, and instantly reassignable by supervisors without procedural deadlock or knowledge loss.

---

## AI Governance
1. **Assistive Authority Boundary:** AI agents function purely in an advisory, indexing, and synthesis capacity. Under no legal or technical circumstance shall an AI model issue binding administrative resolutions, execute disciplinary actions, modify institutional budgets, or determine administrative culpability.
2. **Deterministic Source Attribution:** Any factual or procedural guidance generated via RAG MUST link directly to a verified institutional document, including version, approving municipal authority, and active validity. If verified source backing is absent, the AI MUST explicitly acknowledge absence of authority and invoke human fallback.
3. **Confidence Scoring & Fallback:** All machine learning and generative classifications (intent, category, unit derivation) MUST yield a confidence score. An initial reference threshold of 0.60 is established; any inference below the active institutional threshold MUST automatically route to official human clarification or manual supervisory triage.
4. **Security & Context Isolation:** AI pipelines, embeddings, and context-retrieval routines MUST inherit the querying official's strict RBAC/ABAC access boundaries. An AI assistant MUST NEVER inspect, summarize, or retrieve documents, cases, or novedades that the operating official is not explicitly authorized to view.
5. **Human Override & Telemetry:** Every recommendation, pre-filled response, or automated routing generated by AI MUST be editable, overridable, or rejectable by the handling official. All overrides MUST be tracked to fuel the Active Learning pipeline.

---

## Data Governance
1. **Institutional Sovereignty:** All data, schemas, indexes, attachments, and logs generated by or ingested into the platform reside exclusively within the institutional jurisdiction of GAMEA.
2. **Information Classification:** The platform MUST support data tiering and enforce differentiated handling policies across:
   - *Operativa:* General day-to-day workflow logs and internal service tickets.
   - *Administrativa:* Standard internal administrative communications and memos.
   - *Personal:* Employee records, contact data, and credential references protected under privacy best practices.
   - *Confidencial / Sensible:* High-impact institutional reports, internal legal proceedings, or sensitive audits.
   - *Auditoría:* Immutable operational journals and forensic traces.
3. **Retention & Archival:** Closed cases, evidentiary documents, and audit logs MUST be retained according to institutional retention standards, ensuring long-term retrieval and legal compliance without degrading active transactional performance.
4. **Backup & Disaster Recovery:** Data stores MUST provide verifiable point-in-time recovery, continuous transaction logging, and automated, encrypted snapshots capable of restoration into sovereign environments.

---

## Security Governance
1. **Authentication & Identity:** All access MUST require robust authentication via internal enterprise identity providers, supporting secure session management and multi-factor authentication (MFA) for administrative and supervisory tiers.
2. **Granular Access Control:** Access policies MUST strictly model the GAMEA organizational tree (Institución → Secretaría → Dirección → Unidad → Departamento / Equipo → Subalcaldía → Usuario). Access to case dossiers, queues, documents, and analytics MUST be restricted by organizational scope and functional role.
3. **Separation of Concerns:** Cross-office inspection is forbidden by default. Officials may only view cases where they are the authenticated requester, the assigned handler, a member of the handling unit queue, a supervisor with hierarchical jurisdiction, or an authorized institutional auditor.
4. **Audit Immutability:** System audit tables and event streams MUST be append-only, cryptographically protected against tampering, and isolated from administrative deletion.

---

## Institutional Governance
1. **Clear Typification of Case Actions:**
   - **Transferencia (Transfer):** The reassignment of an Internal Case to another official within the *same* organizational unit.
   - **Derivación (Derivation):** The formal dispatch and transfer of responsibility of an Internal Case to a *different* organizational unit, direction, secretaría, or subalcaldía.
   - **Escalamiento (Escalation):** The formal elevation of an Internal Case to a higher hierarchical tier (supervisor, director, or secretary) due to SLA breach, jurisdictional impasse, or high institutional priority.
2. **Operational Ownership:** Every active case MUST have exactly one primary handling dependency and assigned official at any single point in time to prevent ambiguity of responsibility.
3. **Decentralized Administration:** Subalcaldías and Secretarías MUST possess administrative sovereignty over their specific internal service catalogs and team assignments while adhering to the uniform municipal constitution and audit standards.

---

## Constraints
1. **Exclusively Internal Operation:** The platform MUST NOT expose public endpoints, self-registration portals, citizen-facing APIs, or external interfaces.
2. **No Autonomous Administrative Authority:** The platform MUST NOT automate binding administrative rulings, contractual approvals, or personnel sanctions.
3. **Zero Information Mixing:** Requester-facing communication, internal team coordination, and restricted private notes MUST remain strictly separated across database, API, and UI layers.
4. **No Direct Hardcoding:** Organizational units, service categories, routing workflows, SLAs, and approval ladders MUST be maintained via data configurations, never in application source code.
5. **Audit Non-Bypassability:** No backend script, administrative utility, or API routine shall modify case data without generating a corresponding audit log entry.

---

## Out of Scope
The following domains and features are explicitly, strictly, and definitively excluded from this platform:
1. Public citizen attention, citizen ticket submission portals, and external helpdesks.
2. Citizen-facing mobile applications or public web self-service consoles.
3. Public chatbots or conversational AI interfaces on commercial social networks (WhatsApp, Facebook, Telegram) for citizen queries.
4. Municipal tax calculation, municipal revenue collection, and citizen tariff payment gateways.
5. Citizen complaint (denuncia ciudadana) intake and public oversight systems.
6. Public municipal transparency portals and open-data publishing for external audiences.
7. Tourism, cultural outreach, or external marketing platforms for the municipality.

---

## Decision Boundaries
To ensure strict Spec-Driven Development (SDD) separation of concerns, the following decisions are explicitly deferred from this Constitution and MUST be addressed during the subsequent `specify`, `plan`, and `implement` phases:
- **Infrastructure Architecture:** Specific cloud, on-premise, or hybrid hosting topologies, virtualization layers, and container orchestration (e.g., Docker, Kubernetes).
- **Technology Stack:** Selection of specific programming languages, application frameworks, UI component libraries, and ORM tools.
- **Persistence Technologies:** Selection of specific relational database engines, document stores, vector databases, or caching mechanisms.
- **AI/LLM Providers:** Selection of specific open-source or commercial model endpoints, vector embedding models, or inference runtimes.
- **Integration Protocols:** Concrete REST/gRPC/GraphQL schemas, message brokers, and enterprise service bus implementations for legacy GAMEA systems.
- **UI/UX Visual Design:** Concrete design mockups, wireframes, color schemes, and typographical layouts.

---

## Open Decisions
The following architectural and institutional parameters MUST be systematically resolved in collaboration with GAMEA stakeholders during specification and planning:
1. **Organizational Master Data:** Formal institutional catalog of current Secretarías, Direcciones, Unidades, Departamentos, and the 14 Subalcaldías of El Alto.
2. **Internal Service Taxonomy:** Standardized classification of internal incident types, administrative support requests, and inter-unit service catalogs.
3. **Initial SLA Matrix:** Baseline response and resolution time targets categorized by priority, unit capacity, and case typification.
4. **Authentication Provider Mapping:** Identification of the active institutional directory service (e.g., Active Directory, LDAP, OAuth2/OIDC, Keycloak) currently utilized within GAMEA.
5. **Legacy Systems Audit:** Formal inventory of existing municipal departmental systems (e.g., document tracking, HR, payroll) targeted for eventual phase-two integration.
6. **Hardware & Deployment Environment:** Assessment of GAMEA's sovereign municipal datacenter capacity versus institutional hybrid cloud policies.
7. **Document Storage Policy:** Sizing, archival thresholds, and retention periods for case attachments and evidentiary media.

---

## Governance
1. **Constitutional Primacy:** This Constitution represents the supreme specification standard for the platform. All downstream artifacts—including functional specifications (`specify`), architecture blueprints (`plan`), task breakdowns (`tasks`), and code implementations (`implement`)—MUST strictly conform to the principles, constraints, and boundaries defined herein.
2. **Amendment Protocol:** Any proposed alteration to this Constitution MUST undergo a formal review and approval process involving technical architects, functional leads, and authorized GAMEA municipal sponsors.
3. **Non-Regression Verification:** Any change, feature addition, or refactoring that violates a MUST or MUST NOT requirement stated in this document shall be considered a critical defect and rejected prior to integration.

---

## Versioning
- **Constitution Version:** 1.0.0
- **Status:** Approved Baseline
- **Date:** 2026-09-27
- **Target Organization:** Gobierno Autónomo Municipal de El Alto (GAMEA), Estado Plurinacional de Bolivia
