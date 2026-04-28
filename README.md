# Courier API

API de gestión de envíos con **Arquitectura Hexagonal** + **DDD** (Domain-Driven Design).

## Stack

- **NestJS** - Framework Node.js progresivo
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Kafka** - Broker de mensajes para Observer
- **class-validator** - Validación declarativa de DTOs
- **Swagger/OpenAPI** - Documentación de API

## Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Docker Desktop (o Docker Engine + Docker Compose)

## Arquitectura Hexagonal + DDD

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION                              │
│                 (Use Cases / Services)                      │
│    - CreateShipmentUseCase                                  │
│    - GetShipmentByIdUseCase                                 │
│    - GetShipmentsByCustomerUseCase                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                        DOMAIN                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  ENTITIES                            │    │
│  │  - Shipment (lógica de negocio + métodos)            │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 VALUE OBJECTS                        │    │
│  │  - Money (encapsula lógica monetaria)                │    │
│  │  - ShipmentType (enum con números: 1,2,3,4)         │    │
│  │  - ShipmentStatus (enum con números: 1,2,3,4)       │    │
│  │  - ShipmentMetadata (interfaz)                       │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    PORTS                             │    │
│  │  - ShipmentPort (interfaz del repositorio)          │    │
│  │  - ShippingStrategyPort (interfaz de estrategias)   │    │
│  │  - EventPublisherPort (interfaz de eventos)         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │        HTTP         │  │         PERSISTENCE          │  │
│  │  (Adapters entrada) │  │      (Adapters salida)       │  │
│  │  - DTOs             │  │  - ORM Entities              │  │
│  │  - Validación       │  │  - Repositories              │  │
│  │  - Swagger          │  │  - Mappers                   │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    EVENTS                            │    │
│  │  - KafkaEventPublisher                               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Módulos

```
src/
├── shipments/                    # Módulo de envíos
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── shipment.entity.ts           # Entidad PURA
│   │   │   ├── shipment-type.value-object.ts    # Enum (números)
│   │   │   ├── shipment-status.value-object.ts  # Enum (números)
│   │   │   ├── shipment-metadata.value-object.ts
│   │   │   └── money.value-object.ts            # Value Object
│   │   ├── ports/
│   │   │   ├── shipment.port.ts           # Interfaz repositorio
│   │   │   └── shipping-strategy.port.ts  # Interfaz estrategias
│   │   └── exceptions/
│   ├── application/
│   │   ├── use-cases/                    # Casos de uso
│   │   └── strategies/                   # Strategy pattern
│   └── infrastructure/
│       ├── http/dtos/                    # DTOs + Swagger
│       ├── persistence/
│       │   ├── shipment.orm-entity.ts    # Entity ORM (TypeORM)
│       │   ├── shipment.mapper.ts        # Mapper
│       │   └── shipment.repository.ts    # Implementación puerto
│       └── filters/
├── customers/                   # Módulo de clientes
├── notifications/               # Consumer de notificaciones
├── audit/                       # Consumer de auditoría
└── shared/                      # Eventos, filtros
```

### Principios Aplicados

1. **Dominio puro**: 0 dependencias externas (sin NestJS, TypeORM, Swagger)
2. **Entidades inmutables**: métodos `withStatus()`, `withShippingCost()`
3. **Value Objects**: `Money`, `ShipmentType`, `ShipmentStatus`
4. **Mappers**: conversión ORM ↔ Domain ↔ Response
5. **Puertos**: interfaces que definen el contrato

## Patrones Aplicados

### Strategy
4 estrategias de envío implementadas:
- `StandardShippingStrategy` - Costo: 0.1% valor declarado (mín $5,000)
- `ExpressShippingStrategy` - Costo: $15,000 fijo
- `InternationalShippingStrategy` - Costo: $50,000 + 2% valor
- `ThirdPartyCarrierShippingStrategy` - Costo: 5% valor

### Observer
- Event publisher (Kafka) publica eventos al crear envíos
- NotificationsConsumer: recibe eventos de notificaciones
- AuditConsumer: recibe eventos de auditoría

### Mapper
- Conversión entre entidades ORM y modelos de dominio
- Conversión a DTOs de respuesta

## Value Objects con Números

Los enums se almacenan como números en la BD pero se muestran como strings en la API:

```typescript
// Dominio (números)
enum ShipmentType { STANDARD = 1, EXPRESS = 2, INTERNATIONAL = 3, THIRD_PARTY_CARRIER = 4 }
enum ShipmentStatus { PENDING = 1, DELIVERED = 2, IN_CUSTOMS = 3, FAILED = 4 }

// HTTP/DTO (strings para el cliente)
enum ShipmentTypeEnum { STANDARD = 'STANDARD', EXPRESS = 'EXPRESS', ... }

// BD (int)
type: number  // 1, 2, 3, 4
```

## Levantar el Proyecto

### 1. Iniciar servicios (Docker)

```bash
docker-compose up -d
```

Esto levantará:
- PostgreSQL en `localhost:5432`
- Kafka en `localhost:9092`
- Kafka UI en `localhost:8080`

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
npm run start:dev
```

### 4. Acceder a Swagger

```
http://localhost:3000/api/docs
```

## Endpoints

### Customers
- `POST /api/customers` - Crear cliente
- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Obtener cliente por ID
- `PATCH /api/customers/:id` - Actualizar cliente
- `DELETE /api/customers/:id` - Desactivar cliente

### Shipments
- `POST /api/shipments` - Crear envío
- `GET /api/shipments/:id` - Obtener envío por ID
- `GET /api/shipments/customer/:id` - Envíos por cliente

## Ejemplos de Requests

### Crear cliente
```bash
POST /api/customers
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "SENDER"
}
```

### Crear envío STANDARD
```bash
POST /api/shipments
{
  "senderId": "<uuid>",
  "recipientId": "<uuid>",
  "declaredValue": 1000000,
  "type": "STANDARD",
  "metadata": {
    "weightKg": 5
  }
}
```

### Crear envío EXPRESS (error)
```bash
POST /api/shipments
{
  "senderId": "<uuid>",
  "recipientId": "<uuid>",
  "declaredValue": 100000,
  "type": "EXPRESS",
  "metadata": {
    "weightKg": 10  # > 5 → 400 error
  }
}
```

## Códigos de Respuesta

- `201` - Creado correctamente
- `200` - Operación exitosa
- `204` - Eliminado correctamente
- `400` - Validación fallida
- `404` - No encontrado
- `409` - Conflicto (email duplicado)

## Variables de Entorno

```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=courier
DB_PASSWORD=courier123
DB_NAME=courier_db

KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=courier-api
```