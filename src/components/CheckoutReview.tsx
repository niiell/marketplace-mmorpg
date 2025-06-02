import { motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";
import Image from "next/image";

interface CheckoutReviewProps {
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  shippingInfo?: {
    address: string;
    city: string;
    postalCode: string;
  };
  onConfirm: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

export default function CheckoutReview({
  items,
  shippingInfo,
  onConfirm,
  onEdit,
  isLoading = false,
}: CheckoutReviewProps) {
  const { format: formatCurrency } = useCurrency();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Review Order</h2>

      {/* Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quantity: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Info */}
      {shippingInfo && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping To:</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">{shippingInfo.address}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {shippingInfo.city}, {shippingInfo.postalCode}
            </p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-6">
        <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 
            hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Edit Order
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            "Confirm & Pay"
          )}
        </button>
      </div>
    </motion.div>
  );
}