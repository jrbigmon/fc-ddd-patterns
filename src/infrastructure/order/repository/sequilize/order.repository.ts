import { Transaction } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order, transaction?: Transaction): Promise<void> {
    const itemsSaved = await OrderItemModel.findAll({
      where: {
        order_id: entity.id,
      },
    });

    const itemsSavedMap = new Map<string, OrderItem>();
    const itemsToUpdateMap = new Map<string, OrderItem>();
    const itemsToRemoveMap = new Map<string, OrderItem>();
    const itemsToCreateMap = new Map<string, OrderItem>();

    itemsSaved.forEach((item) => {
      const orderItem = new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );

      itemsSavedMap.set(orderItem.id, orderItem);
    });

    entity.items.forEach((item) => {
      const hasItem = itemsSavedMap.has(item.id);

      if (!hasItem) itemsToCreateMap.set(item.id, item);
    });

    itemsSavedMap.forEach((itemSaved) => {
      const itemAlreadySaved = entity.items.find(
        (item) => item.id === itemSaved.id
      );

      if (itemAlreadySaved)
        itemsToUpdateMap.set(itemAlreadySaved.id, itemAlreadySaved);
      else itemsToRemoveMap.set(itemSaved.id, itemSaved);
    });

    const removeOldItems = Array.from(itemsToRemoveMap.values()).map((item) =>
      OrderItemModel.destroy({
        where: {
          id: item.id,
        },
        transaction,
      })
    );

    const updateOldItems = Array.from(itemsToUpdateMap.values()).map((item) =>
      OrderItemModel.update(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: { id: item.id },
          transaction,
        }
      )
    );

    const createNewItems = Array.from(itemsToCreateMap.values()).map((item) =>
      OrderItemModel.create(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        },
        { transaction }
      )
    );

    await Promise.all([removeOldItems, updateOldItems, createNewItems]);

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
        transaction,
      }
    );
  }

  async find(id: string): Promise<Order> {
    if (!id) return null;

    const order = await OrderModel.findByPk(id, {
      include: ["items"],
    });

    if (!order) return null;

    const orderItems = order.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
    );

    return new Order(order.id, order.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: ["items"],
    });

    return orders?.map((order) => {
      const orderItems = order.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      );

      return new Order(order.id, order.customer_id, orderItems);
    });
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
