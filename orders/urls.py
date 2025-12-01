from django.urls import path
from .views import CreateOrderAPIView, VerifyPaymentAPIView, UserOrdersAPIView, AdminllOrderAPIView

urlpatterns = [
    path('create/', CreateOrderAPIView.as_view(), name='create-order'),
    path('verify/', VerifyPaymentAPIView.as_view(), name='verify-payment'),
    path('my-orders/', UserOrdersAPIView.as_view(), name='user-orders'),

    # ADMIN ROUTES
    path('create/', CreateOrderAPIView.as_view(), name='create-order'),
    path('verify/', VerifyPaymentAPIView.as_view(), name='verify-payment'),
    path('my-orders/', UserOrdersAPIView.as_view(), name='user-orders'),
    path('admin/orders/', AdminllOrderAPIView.as_view(), name='admin-orders'),  
    
]
