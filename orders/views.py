from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product
from cart.models import CartItem
import razorpay
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAdminUser


# Create Razorpay client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        
        total_amount = sum(item.product.price * item.quantity for item in cart_items)
        amount_in_paise = int(total_amount * 100)  

        # Create Razorpay order
        razorpay_order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "payment_capture": 1
        })

       
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            razorpay_order_id=razorpay_order['id']
        )

        
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                product_price=item.product.price
            )

   
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response({"order": serializer.data, "razorpay_order": razorpay_order})

class VerifyPaymentAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        try:
            # Verify payment signature
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            # Update order status
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.status = "paid"
            order.save()

            serializer = OrderSerializer(order)
            return Response({"message": "Payment successful", "order": serializer.data})

        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

class UserOrdersAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('created_at')

class AdminllOrderAPIView(generics.ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class= OrderSerializer
    permission_classes = [IsAdminUser]