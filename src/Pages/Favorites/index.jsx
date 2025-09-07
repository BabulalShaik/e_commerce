import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../Components/Navbar';
import { removeFromFavorites, clearFavorites } from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';

export const Favorites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const favorites = useSelector((state) => state.favorites.items);
    const cartItems = useSelector((state) => state.cart.items);
    const [addedItems, setAddedItems] = useState({});

    const handleRemoveFromFavorites = (id) => {
        dispatch(removeFromFavorites(id));
    };

    const handleAddToCart = (product) => {
        const isInCart = cartItems.some(item => item.id === product.id);
        if (!isInCart) {
            dispatch(addToCart(product));
            setAddedItems(prev => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setAddedItems(prev => ({ ...prev, [product.id]: false }));
            }, 2000);
        }
    };

    const handleClearFavorites = () => {
        dispatch(clearFavorites());
    };

    if (favorites.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
                        <p className="text-gray-600 mb-8">You haven't added any favorites yet</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <span className="material-symbols-outlined">home</span>
                            Go to Home
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Favorites ({favorites.length} items)</h1>
                    <button
                        onClick={handleClearFavorites}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Clear All
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <img
                                src={product.image || product.images?.[0] || 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=No+Image'}
                                alt={product.title}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=No+Image';
                                }}
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xl font-bold text-purple-600">${product.price}</span>
                                    <span className="text-sm text-gray-500">{product.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                                            cartItems.some(item => item.id === product.id)
                                                ? 'bg-green-600 text-white cursor-not-allowed'
                                                : addedItems[product.id]
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                                        }`}
                                        disabled={cartItems.some(item => item.id === product.id) || addedItems[product.id]}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {cartItems.some(item => item.id === product.id) 
                                                ? 'check_circle' 
                                                : addedItems[product.id] 
                                                    ? 'check' 
                                                    : 'shopping_cart'
                                            }
                                        </span>
                                        {cartItems.some(item => item.id === product.id) 
                                            ? 'Added to Cart' 
                                            : addedItems[product.id] 
                                                ? 'Added to Cart!' 
                                                : 'Add to Cart'
                                        }
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromFavorites(product.id)}
                                        className="p-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md hover:from-pink-600 hover:to-red-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
