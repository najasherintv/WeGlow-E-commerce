
from django.urls import path
from .views import CartItemAPIView

urlpatterns = [
    path('', CartItemAPIView.as_view()),              
    path('<int:pk>/', CartItemAPIView.as_view()),      
]

