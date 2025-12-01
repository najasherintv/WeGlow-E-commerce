from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import WishlistItem
from .serializers import WishlistItemSerializer

# Create your views here.

class WishlistAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get("product")
        if WishlistItem.objects.filter(user=request.user, product_id=product_id).exists():
            return Response({"detail": "Already in wishlist."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = WishlistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = WishlistItem.objects.get(pk=pk, user=request.user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except WishlistItem.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)