╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                        ARQUITECTURA HEXAGONAL - COURIER API                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO PRINCIPAL                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│   CLIENTE ─────► HTTP REQUEST ─────► CONTROLLER ─────► USE CASE ─────► REPOSITORY ─────► DB     │
│                                                                                                  │
│   POST /api/shipments ───► ShipmentsController ──► CreateShipmentUseCase ──► Repository ──► PostgreSQL│
│                                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════════════════════
                                    ESTRUCTURA DE CARPAS (CAPAS)
════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  📁 CUSTOMERS (Módulo Cliente)                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ 💼 DOMAIN (Núcleo del negocio - NO tiene dependencias externas)                   │    │
│  │ ├── entities/customer.entity.ts      → Modelo del cliente (name, email, role)   │    │
│  │ ├── ports/customer.port.ts           → Interfaz del repositorio                  │    │
│  │ ├── exceptions/                      → Excepciones personalizadas                │    │
│  │ └── mappers/                         → Conversión ORM ↔ Domain                │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                                             │
│                                    ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ 📋 APPLICATION (Casos de uso)                                                     │    │
│  │ ├── CreateCustomerUseCase         → Crear cliente                               │    │
│  │ ├── GetAllCustomersUseCase        → Listar clientes                            │    │
│  │ ├── GetCustomerByIdUseCase         → Obtener por ID                             │    │
│  │ ├── UpdateCustomerUseCase          → Actualizar                                │    │
│  │ └── DeleteCustomerUseCase         → Desactivar (soft delete)                   │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                                             │
│                                    ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ 🏗️ INFRASTRUCTURE (Adaptadores externos)                                         │    │
│  │ ├── persistence/customer.orm-entity.ts → Entity de TypeORM para PostgreSQL       │    │
│  │ ├── persistence/customer.repository.ts → Implementación del port              │    │
│  │ └── filters/                     → Manejo de errores HTTP                    │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────���───────────────────────────────────────────────────────────────────────────┐
│  📁 SHIPMENTS (Módulo Envíos) + STRATEGY PATTERN                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ 💼 DOMAIN                                                                       │    │
│  │ ├── entities/shipment.entity.ts   → Modelo del envío                          │    │
│  │ ├── ports/shipment.port.ts        → Interfaz del repositorio                 │    │
│  │ ├── ports/shipping-strategy.port.ts → Interfaz de estrategia                  │    │
│  │ └── exceptions/                   → Excepciones                               │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                                             │
│                                    ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ 📋 APPLICATION + STRATEGY (Patrón Estrategia)                                  │    │
│  │                                                                              │    │
│  │  ┌────────────────────────────────────────────────────────────────┐         │    │
│  │  │ ShippingStrategyPort (Interfaz común para todas)              │         │    │
│  │  │  ├── validate()    → Validar reglas de negocio                │         │    │
│  │  │  ├── calculateCost() → Calcular costo del envío              │         │    │
│  │  │  └── getFinalStatus() → Estado final (DELIVERED/IN_CUSTOMS) │         │    │
│  │  └────────────────────────────────────────────────────────────────┘         │    │
│  │                              ▲                                                 │    │
│  │                              │ (Map de estrategias)                           │    │
│  │   ┌──────────────────────────┼──────────────────────────┐                      │    │
│  │   │                          │                          │                      │    │
│  │   ▼                          ▼                          ▼                      │    │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │ │ STANDARD     │  │ EXPRESS      │  │ INTERNACIONAL│ │ THIRD_PARTY │     │    │
│  │ │              │  │              │  │              │  │              │     │    │
│  │ │ Costo:       │  │ Costo:       │  │ Costo:       │  │ Costo:       │     │    │
│  │ │ 0.1% valor  │  │ $15,000 fijo │  │ $50k + 2%   │  │ 5% valor    │     │    │
│  │ │ (mín $5k)   │  │              │  │             │  │              │     │    │
│  │ └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  │                                                                              │    │
│  │ CreateShipmentUseCase (USA LAS ESTRATEGIAS)                                 │    │
│  │   1. Selecciona estrategia del Map                                          │    │
│  │   2. strategy.validate()    → ¿Es válido?                                   │    │
│  │   3. strategy.calculateCost() → Calcula costo                                │    │
│  │   4. repository.create()    → Guarda en BD                                  │    │
│  │   5. eventPublisher.publish() → Publica evento a Kafka                     │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                                             │
│                                    ▼                                                             │
│  ┌───────────────────────────���─────────────────────────────────────────────────────┐    │
│  │ 🏗️ INFRASTRUCTURE                                                           │    │
│  │ ├── persistence/shipment.orm-entity.ts                                     │    │
│  │ └── persistence/shipment.repository.ts                                     │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  📁 SHARED/EVENTS (PATRÓN OBSERVER - KAFKA)                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  Event Publisher (Kafka) ────────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────────────────────────────────┐    │
│  │ Cuando se crea un envío, publica eventos a Kafka:                              │    │
│  │                                                                                │    │
│  │  topics:                                                                       │    │
│  │  • shipment.dispatched   → Estado: DELIVERED                                 │    │
│  │  • shipment.in_customs   → Estado: IN_CUSTOMS                                 │    │
│  │  • shipment.failed       → Estado: FAILED                                     │    │
│  │                                                                                │    │
│  │  Payload del evento:                                                          │    │
│  │  { shipmentId, senderId, recipientId, declaredValue, shippingCost,           │    │
│  │    type, status, timestamp }                                                  │    │
│  └────────────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                                             │
│                                    ▼                                                             │
│  ┌──────────────────────────────┐ ┌──────────────��─��─────────────────────┐          │
│  │ 📭 NOTIFICATIONS CONSUMER      │ │ 📭 AUDIT CONSUMER                    │          │
│  │ (Consume eventos)             │ │ (Consume eventos)                    │          │
│  │                               │ │                                      │          │
│  │ console.log:                  │ │ Registra traza:                      │          │
│  │ "Notificación enviada:       │ │ "Topic: X, Offset: Y,                  │          │
│  │  Envío {id} - Estado: {status}"│ │  ShipmentId: {id}, Timestamp"        │          │
│  └──────────────────────────────┘ └──────────────────────────────────────┘          │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════════════════════
                                    FLUJO DE DATOS (EJEMPLO)
════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. CLIENTE ENVÍA: POST /api/shipments                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│   {                                                                                          │
│     "senderId": "uuid-1",                                                                    │
│     "recipientId": "uuid-2",                                                               │
│     "declaredValue": 1000000,                                                               │
│     "type": "EXPRESS",                                                                       │
│     "metadata": { "weightKg": 3 }                                                            │
│   }                                                                                          │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. SHIPMENTS CONTROLLER recibe el DTO                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. CREATE SHIPMENT USE CASE                                                                  │
│                                                                                              │
│    a) Busca estrategia: strategy = SHIPMENT_STRATEGIES["EXPRESS"]                          │
│                                                                                              │
│    b) Valida (ExpressShippingStrategy.validate):                                          │
│       ✓ weightKg <= 5      ✓ OK                                                             │
│       ✓ declaredValue <= 3,000,000    ✓ OK                                                 │
│       ✓ senderId != recipientId    ✓ OK                                                   │
│                                                                                              │
│    c) Calcula costo: shippingCost = strategy.calculateCost() → $15,000                     │
│                                                                                              │
│    d) Obtiene estado final: status = strategy.getFinalStatus() → "DELIVERED"               │
│                                                                                              │
│    e) Guarda en BD: repository.create(dto, $15000, "DELIVERED")                          │
│                                                                                              │
│    f) Publica evento: eventPublisher.publish("shipment.dispatched", {event})              │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. KAFKA RECIBE EL EVENTO                                                                   │
│                                                                                              │
│    Topic: shipment.dispatched                                                               │
│    Payload: {                                                                               │
│      shipmentId: "uuid-nuevo",                                                              │
│      senderId: "uuid-1",                                                                   │
│      recipientId: "uuid-2",                                                               │
│      declaredValue: 1000000,                                                               │
│      shippingCost: 15000,                                                                   │
│      type: "EXPRESS",                                                                       │
│      status: "DELIVERED",                                                                   │
│      timestamp: "2026-04-23T17:05:00Z"                                                      │
│    }                                                                                        │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                          ┌───────────────────┴───────────────────┐
                          ▼                                       ▼
┌─────────────────────────────────┐                 ┌─────────────────────────────────────┐
│ NOTIFICATIONS CONSUMER          │                 │ AUDIT CONSUMER                      │
│                                 │                 │                                     │
│ [NOTIFICATIONS]                 │                 │ [AUDIT]                             │
│ Notificación enviada:          │                 │ Topic: shipment.dispatched            │
│ Envío uuid-nuevo - Estado:      │                 │ Offset: 0                           │
│ DELIVERED - Valor: $1000000      │                 │ ShipmentId: uuid-nuevo              │
│                                 │                 │ Timestamp: 2026-04-23T17:05:00Z     │
└─────────────────────────────────┘                 └─────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════════════════════
                                  CÓDIGOS HTTP DE RESPUESTA
════════════════════════════════════════════════════════════════════════════════════════════════════

  201 CREATED    → Cliente/Envío creado exitosamente
  200 OK        → Operación exitosa (listar, obtener, actualizar)
  204 NO CONTENT → Delete exitoso
  400 BAD REQUEST → Validación fallida (peso excede, valor excede, etc.)
  404 NOT FOUND → Cliente o envío no encontrado
  409 CONFLICT  → Email duplicado