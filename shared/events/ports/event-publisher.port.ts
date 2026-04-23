export interface ShipmentEvent {
  shipmentId: string;
  senderId: string;
  recipientId: string;
  declaredValue: number;
  shippingCost: number;
  type: string;
  status: string;
  timestamp: Date;
}

export interface EventPublisherPort {
  publish(topic: string, event: ShipmentEvent): Promise<void>;
}