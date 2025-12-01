from django.urls import path
from .views import ProductListView, ProductDetailView, AdminProductCreateView, AdminProductUpdateView, AdminProductDeleteView, ProductDetailView, ProductsByCategoryView

urlpatterns = [
    path("", ProductListView.as_view()),
    path("<int:id>/", ProductDetailView.as_view()),

    path('admin/create/', AdminProductCreateView.as_view(), name='admin-product-create'),
    path('admin/<int:id>/update/', AdminProductUpdateView.as_view(), name='admin-product-update'),
    path('admin/<int:id>/delete/', AdminProductDeleteView.as_view(), name='admin-product-delete'),

   
    path('by-category/', ProductsByCategoryView.as_view(), name='products-by-category'),  # ?category=<category>
    path('<int:id>/', ProductDetailView.as_view(), name='product-detail'),
]
