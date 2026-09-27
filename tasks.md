# GAMEA Internal Operations Platform — Task Breakdown (`tasks`)

**Document Version:** 1.0.0  
**Status:** Approved Work Breakdown Structure  
**Governing Standard:** [constitution.md](file:///f:/Documentos/GitHub/sistemas%20soporte/constitution.md)  
**Functional Specification:** [spec.md](file:///f:/Documentos/GitHub/sistemas%20soporte/spec.md)  
**Architectural Blueprint:** [plan.md](file:///f:/Documentos/GitHub/sistemas%20soporte/plan.md)  
**Target Organization:** Gobierno Autónomo Municipal de El Alto (GAMEA)  

---

## Task Management Legend
- `[ ]` Pendiente de ejecución
- `[/]` En progreso
- `[x]` Completado y validado
- **Criterio de Aceptación:** Cada tarea cuenta con su definición de terminado (DoD) verificable.

---

## Epic 1: Estructura Base, Dominio Puro y Entidades Nucleares

- [x] **TASK-1.1: Inicialización del Proyecto y Configuración de TypeScript/Node**
  - **Descripción:** Crear `package.json`, `tsconfig.json` con tipado estricto, estructura de carpetas según `plan.md` y configuración de scripts de build/test.
  - **Archivos:** `package.json`, `tsconfig.json`, `.gitignore`, `README.md`.
  - **Criterio de Éxito:** `npm run build` compila sin errores y respeta la estructura modular.

- [x] **TASK-1.2: Definición de Value Objects e Invariantes de Dominio**
  - **Descripción:** Implementar tipos inmutables y validadores para: `EstadoCaso`, `PrioridadCaso`, `TipoNovedad`, `EstadoDerivacion`, `NivelVisibilidad`, `RolInstitucional` y `NivelSensibilidad`.
  - **Archivos:** `src/core/value-objects/*.ts`.
  - **Criterio de Éxito:** Validaciones estrictas de formatos, prohibición de transiciones de estado ilegales.

- [x] **TASK-1.3: Entidades de Dominio Centrales**
  - **Descripción:** Codificar las entidades de dominio: `CasoInterno`, `NovedadInstitucional`, `DerivacionInterna`, `DependenciaOrganizacional`, `UsuarioFuncionario`, `ComentarioColaborativo` y `ControlSLA`.
  - **Archivos:** `src/core/entities/*.ts`.
  - **Criterio de Éxito:** Cobertura de métodos de negocio puros (ej. `caso.registrarNovedad()`, `caso.iniciarDerivacion()`, `caso.marcarResuelto()`) sin dependencias de base de datos o HTTP.

- [x] **TASK-1.4: Máquina de Estados de Casos y Reglas de Transición**
  - **Descripción:** Implementar la lógica formal de transición de estados (`REGISTRADO` $\rightarrow$ `ASIGNADO` $\rightarrow$ `EN_PROCESO` $\rightarrow$ `EN_DERIVACION` $\rightarrow$ `ESCALADO` $\rightarrow$ `RESUELTO` $\rightarrow$ `CERRADO_CONFORME`).
  - **Archivos:** `src/core/use-cases/TransitionCaseState.ts`, `src/core/domain-services/CaseStateMachine.ts`.
  - **Criterio de Éxito:** Pruebas unitarias que confirmen que solo transiciones válidas son admitidas y emitan eventos correspondientes.

- [x] **TASK-1.5: Pruebas Unitarias de Dominio (TDD)**
  - **Descripción:** Suite de pruebas unitarias que verifique las invariantes de negocio del núcleo.
  - **Archivos:** `tests/unit/CaseEntity.test.ts`, `tests/unit/StateMachine.test.ts`.
  - **Criterio de Éxito:** 100% de aserciones pasando sobre las reglas de negocio de la Constitución.

---

## Epic 2: Trazabilidad, Auditoría Inmutable y Separación Tri-Tier

- [x] **TASK-2.1: Puerto y Servicio de Auditoría Forense Append-Only**
  - **Descripción:** Implementar el puerto de persistencia y el servicio de auditoría forense que intercepta todas las operaciones críticas (actor, IP, timestamp, entidad, valor anterior, valor nuevo, motivo).
  - **Archivos:** `src/core/ports/IAuditRepository.ts`, `src/core/domain-services/AuditService.ts`.
  - **Criterio de Éxito:** Ningún estado de caso o derivación puede alterarse sin generar un registro estructurado inmutable.

- [x] **TASK-2.2: Aislamiento Estricto de Canales de Comunicación (Tri-Tier Engine)**
  - **Descripción:** Implementar el filtrador de contenido colaborativo: 1. *Comunicación con Solicitante*, 2. *Comunicación Interna*, 3. *Nota Privada*.
  - **Archivos:** `src/core/use-cases/FilterCaseCommentsByRole.ts`, `src/core/domain-services/VisibilityPolicy.ts`.
  - **Criterio de Éxito:** Un solicitante nunca recibe en el payload comentarios de visibilidad interna o notas privadas.

- [x] **TASK-2.3: Esquema Relacional de Base de Datos y Migraciones SQL**
  - **Descripción:** Diseñar el DDL en PostgreSQL con tablas: `dependencias`, `usuarios`, `casos`, `novedades`, `derivaciones`, `comentarios`, `archivos`, `control_sla` y `auditoria_logs` (con trigger que prohíbe `UPDATE` y `DELETE` en auditoría).
  - **Archivos:** `src/infrastructure/persistence/migrations/001_initial_schema.sql`.
  - **Criterio de Éxito:** Integridad referencial ACID, índices de búsqueda por código de caso y distrito de Subalcaldía.

---

## Epic 3: Derivaciones Inter-Oficinas y Subalcaldías

- [x] **TASK-3.1: Motor de Derivaciones y Traspaso Formal de Custodia**
  - **Descripción:** Implementar el caso de uso `DeriveCaseUseCase` que traslada la custodia operativa de una unidad/dirección a otra o a una Subalcaldía, registrando la Novedad correspondiente y preservando todo el historial anterior.
  - **Archivos:** `src/core/use-cases/DeriveCaseUseCase.ts`, `src/core/ports/IDerivationRepository.ts`.
  - **Criterio de Éxito:** El historial previo permanece intacto; se actualiza la dependencia actual y se registra el motivo formal.

- [x] **TASK-3.2: Protocolo de Aceptación y Rechazo Fundamentado de Derivación**
  - **Descripción:** Implementar casos de uso `AcceptDerivationUseCase` y `RejectDerivationUseCase` con retorno justificado a la unidad remitente.
  - **Archivos:** `src/core/use-cases/AcknowledgeDerivationUseCase.ts`.
  - **Criterio de Éxito:** Si se rechaza, el caso vuelve con Novedad explícita a la bandeja remitente para reevaluación o escalamiento.

- [x] **TASK-3.3: Soporte y Catálogo de las 14 Subalcaldías de El Alto**
  - **Descripción:** Semilla de datos y lógica de filtrado territorial para los 14 Distritos Municipales (D-1 al D-14), con colas distritales independientes.
  - **Archivos:** `src/infrastructure/persistence/seeds/subalcaldias_gamea.sql`, `src/core/domain-services/TerritorialFilterService.ts`.
  - **Criterio de Éxito:** Capacidad de aislar o consolidar casos por Subalcaldía respetando la jurisdicción distrital.

---

## Epic 4: SLAs Institucionales, Supervisión y Dashboards

- [x] **TASK-4.1: Watchdog y Cálculo de Tiempos SLA**
  - **Descripción:** Implementar el cálculo de TPA (Tiempo de Primera Atención), TD (Tiempo de Derivación) y TTR (Tiempo Total de Resolución), incluyendo la pausa automática en estado `EN_ESPERA_SOLICITANTE`.
  - **Archivos:** `src/core/domain-services/SLACalculatorService.ts`, `src/core/use-cases/EvaluateCaseSLAs.ts`.
  - **Criterio de Éxito:** Determinación precisa del semáforo (Verde 50%, Amarillo 75%, Naranja 90%, Rojo 100%).

- [x] **TASK-4.2: Consola de Supervisión y Reasignación de Cargas**
  - **Descripción:** Implementar capacidades de intervención para supervisores: reasignación entre técnicos, escalamiento jerárquico y cierre administrativo con fundamento.
  - **Archivos:** `src/core/use-cases/SupervisorInterventionUseCase.ts`.
  - **Criterio de Éxito:** Registro de auditoría con la justificación del supervisor y cambio inmediato de responsable.

- [x] **TASK-4.3: Servicio de Agregación de Métricas y Dashboards Multicapa**
  - **Descripción:** Endpoints y consultas analíticas para: Funcionario, Supervisor, Jefe de Unidad, Director, Subalcalde y Auditor.
  - **Archivos:** `src/core/use-cases/GetDashboardMetricsUseCase.ts`.
  - **Criterio de Éxito:** Tiempos promedio de resolución, tasa de cumplimiento de SLA, casos por distrito y ranking de derivaciones.

---

## Epic 5: Copiloto IA Asistivo, RAG Oficial y Active Learning

- [x] **TASK-5.1: Servicio de Clasificación IA con Umbral de Confianza (Threshold = 0.60)**
  - **Descripción:** Adaptador de IA que analiza el asunto y descripción de la solicitud interna para predecir categoría y unidad sugerida. Si la confianza es menor a 0.60, emite alerta de baja confianza y envía a triaje humano.
  - **Archivos:** `src/infrastructure/ai/AIClassificationService.ts`, `src/core/ports/IAIAssistantPort.ts`.
  - **Criterio de Éxito:** Cumplimiento del Principio XVI de la Constitución: nunca auto-deriva si el score es menor a 0.60.

- [x] **TASK-5.2: Motor RAG sobre Normativa Oficial de El Alto**
  - **Descripción:** Búsqueda semántica con citas obligatorias de número de resolución, fecha de vigencia y órgano emisor. Si no hay fuente verificada, declara incompetencia.
  - **Archivos:** `src/infrastructure/ai/RAGKnowledgeRetriever.ts`, `src/infrastructure/ai/PromptTemplates.ts`.
  - **Criterio de Éxito:** Todas las respuestas de procedimiento institucional incluyen su referencia documental validada.

- [x] **TASK-5.3: Pipeline de Active Learning y Registro de Telemetría**
  - **Descripción:** Capturar correcciones realizadas por funcionarios o supervisores ante clasificaciones incorrectas o fallbacks de IA para alimentar la recalibración.
  - **Archivos:** `src/infrastructure/ai/ActiveLearningRepository.ts`.
  - **Criterio de Éxito:** Trazabilidad de predicciones vs. selecciones finales humanas.

---

## Epic 6: Consola Web Institucional (Modern Tailored Vanilla UI) y Pruebas E2E

- [x] **TASK-6.1: Diseño del Sistema Visual y Tokens Institucionales (CSS)**
  - **Descripción:** Crear `index.css` con estética institucional premium: paleta de colores armónica (azul institucional GAMEA, acentos sobrios), tipografía moderna (Inter/Outfit), modo oscuro/claro y micro-animaciones en estados y badges.
  - **Archivos:** `src/web/css/tokens.css`, `src/web/css/layout.css`, `src/web/css/components.css`.
  - **Criterio de Éxito:** Interfaz de alto impacto visual, fluida y responsive, sin Tailwind ni frameworks externos pesados.

- [x] **TASK-6.2: Interfaz del Inbox Institucional (Bandejas Diferenciadas)**
  - **Descripción:** Implementar las vistas de bandejas: *Bandeja Personal*, *Bandeja de Equipo/Unidad*, *Bandeja de Subalcaldía* y *Bandeja de Supervisión*.
  - **Archivos:** `src/web/index.html`, `src/web/js/inboxView.js`.
  - **Criterio de Éxito:** Navegación instantánea entre bandejas, filtros por estado, prioridad y distrito municipal.

- [x] **TASK-6.3: Visor del Expediente del Caso y Línea de Tiempo de Novedades**
  - **Descripción:** Componente interactivo que muestra el detalle del caso, la cronología visual de Novedades Institucionales, panel de derivaciones y pestañas de comunicación tri-tier.
  - **Archivos:** `src/web/js/caseDetailView.js`, `src/web/js/novedadesTimeline.js`.
  - **Criterio de Éxito:** Renderizado claro del historial inmutable, con modales para nueva novedad, derivación y respuesta asistida por IA.

- [x] **TASK-6.4: Servidor de Aplicación y Pruebas E2E de Aceptación (Gherkin)**
  - **Descripción:** Servidor HTTP ligero para servir la API y la consola web, junto con la ejecución de los escenarios Gherkin definidos en `spec.md`.
  - **Archivos:** `src/presentation/server.ts`, `tests/e2e/CaseDerivationWorkflow.test.ts`.
  - **Criterio de Éxito:** Pruebas E2E automatizadas pasando al 100%, validando derivación sin pérdida de historial y aislamiento de notas privadas.
