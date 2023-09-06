import z from 'zod';

const quantityValidation = z.number({ message: 'Must be a number.' }).positive({ message: 'The number must be a positive' });
const stockValidation = z.number({ message: 'Must be a number.' }).nonnegative({ message: 'The number must be a positive' });

const isStock =  z.object({
  stock: stockValidation,
  quantity: quantityValidation
})
.refine(({ stock, quantity }) => stock >= quantity, {
  message: 'The product does not have the amount of stock you requested. Please remove the product from the cart or lower your order quantity.'
});

export { quantityValidation, isStock };
