
from django.urls import path
from .views import WishlistAPIView

urlpatterns = [
    path("", WishlistAPIView.as_view()),           # GET list, POST add
    path("<int:pk>/", WishlistAPIView.as_view()),  # DELETE remove
]
