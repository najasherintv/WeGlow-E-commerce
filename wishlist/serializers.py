from rest_framework import serializers
from .models import WishlistItem

class WishlistItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ReadOnlyField(source='product.image')
    
    class Meta:
        model = WishlistItem
        fields = ["id", "product", "product_name", "product_price", "product_image", "added_at"]
