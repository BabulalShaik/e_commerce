import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addToCart } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

export const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);
    const cartItems = useSelector((state) => state.cart.items);
    const isFavorite = favorites.some(item => item.id === product.id);
    const isInCart = cartItems.some(item => item.id === product.id);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!isInCart) {
            dispatch(addToCart(product));
            setIsAdded(true);
            setTimeout(() => {
                setIsAdded(false);
            }, 2000);
        }
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(product.id));
        } else {
            dispatch(addToFavorites(product));
        }
    };

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=No+Image';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
                src={product.images?.[0] || 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=No+Image'} 
                alt={product.title}
                className="w-full h-48 object-cover"
                onError={handleImageError}
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-purple-600">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.category?.name}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                            isInCart 
                                ? 'bg-green-600 text-white cursor-not-allowed' 
                                : isAdded 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                        }`}
                        disabled={isInCart || isAdded}
                    >
                        <span className="material-symbols-outlined text-sm">
                            {isInCart ? 'check_circle' : isAdded ? 'check' : 'shopping_cart'}
                        </span>
                        {isInCart ? 'Added to Cart' : isAdded ? 'Added to Cart!' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-md transition-colors ${
                            isFavorite 
                                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">
                            {isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
