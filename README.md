# Courier API

API de gestión de envíos con arquitectura hexagonal, patrón Strategy y Observer.

## Stack

- **NestJS** - Framework Node.js progresivo
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Kafka** - Broker de mensajes para Observer
- **class-validator** - Validación declarativa de DTOs
- **Swagger/OpenAPI** - Documentación de API

## Arquitectura Hexagonal

```
src/
├── customers/           # Módulo de clientes
│   ├── domain/        # Entidades, puertos, excepciones
│   ├── application/   # Use cases
│   └── infrastructure/# Repositorios, filtros
├── shipments/        # Módulo de envíos
│   ├── domain/
│   ├── application/   # Strategies
│   └── infrastructure/
├── notifications/     # Consumer de notificaciones
├── audit/             # Consumer de auditoría
└── shared/           # Eventos, filtros
```

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

### Crear envío EXPRESS (error示例)
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