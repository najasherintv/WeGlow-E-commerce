from django.urls import path
from .views import RegisterView, LoginView, GoogleLoginView, AdminLoginView, AdminUserListView, AdminUserDetailView, AdminUserUpdateView, AdminUserDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name ='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-login/', GoogleLoginView.as_view(), name ='google-login'),
  
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
  
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:id>/update/', AdminUserUpdateView.as_view(), name='admin-user-update'),
    path('admin/users/<int:id>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
]
