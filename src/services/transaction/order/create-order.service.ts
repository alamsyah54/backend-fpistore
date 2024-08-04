import { MidtransClient } from "midtrans-node-client";
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
  NEXT_BASE_URL,
} from "../../../config";
import prisma from "../../../prisma";
import { IOrderArgs } from "../../../types/order.type";

const snap = new MidtransClient.Snap({
  isProduction: false,
  clientKey: MIDTRANS_CLIENT_KEY,
  serverKey: MIDTRANS_SERVER_KEY,
});

export const createOrderService = async (body: IOrderArgs) => {
  try {
    const { paymentMethod, phoneNumber, products } = body;

    const orderNumber = `ORDER-${new Date().toISOString()}-${
      Math.random() * 1000
    }`;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          phoneNumber,
          totalAmount: 0,
          status: "WAITING_FOR_PAYMENT",
        },
        include: {
          OrderItem: true,
        },
      });

      let totalAmount = 0;

      for (const product of products) {
        const { id, qty } = product;

        const productDetails = await tx.product.findUnique({
          where: { id },
        });

        if (!productDetails) {
          throw new Error(`Product with ID ${id} not found`);
        }

        const productTotal = productDetails.price * qty;
        totalAmount += productTotal;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: product.id,
            qty: qty,
            price: productDetails.price,
            total: productTotal,
          },
        });
      }

      const updatedOrder = await tx.order.update({
        where: { id: newOrder.id },
        data: { totalAmount: totalAmount },
        include: { OrderItem: true },
      });

      return updatedOrder;
    });

    const transactionPayload = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount,
        payment_method: paymentMethod,
      },
      customer_details: {
        phone: String(phoneNumber),
      },
      item_details: await Promise.all(
        products.map(async (product) => {
          const productDetails = await prisma.product.findUnique({
            where: { id: product.id },
          });
          return {
            id: product.id,
            price: productDetails?.price || 0,
            quantity: product.qty,
            name: `Product ${product.id}`,
          };
        })
      ),
      callbacks: {
        finish: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
        error: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
        pending: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
      },
    };

    const transaction = await snap.createTransaction(transactionPayload);
    const transactionToken = transaction.token;

    return {
      order,
      transactionToken,
    };
  } catch (error) {
    throw error;
  }
};
