import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../Components/Navbar';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { processOrder } from '../../store/slices/authSlice';

export const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
    const { isAuthenticated, orderLoading, orderError } = useSelector((state) => state.auth);

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            dispatch(removeFromCart(id));
        } else {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleBuySingleItem = async (item) => {
        if (!isAuthenticated) {
            alert('Please login to complete your purchase');
            navigate('/login');
            return;
        }

        try {
            const orderData = {
                items: [{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.images?.[0] || item.image,
                    totalPrice: item.price * item.quantity
                }],
                totalAmount: item.price * item.quantity,
                totalQuantity: item.quantity
            };

            await dispatch(processOrder(orderData)).unwrap();
            dispatch(removeFromCart(item.id));
            alert('Order placed successfully! Check your profile for order history.');
            navigate('/profile');
        } catch (error) {
            alert('Failed to process order: ' + error);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            alert('Please login to complete your purchase');
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            const orderData = {
                items: items.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.images?.[0] || item.image,
                    totalPrice: item.price * item.quantity
                })),
                totalAmount,
                totalQuantity
            };

            await dispatch(processOrder(orderData)).unwrap();
            dispatch(clearCart());
            alert('Order placed successfully! Check your profile for order history.');
            navigate('/profile');
        } catch (error) {
            alert('Failed to process order: ' + error);
        }
    };

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
                        <p className="text-gray-600 mb-8">Your cart is empty</p>
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
                    <h1 className="text-3xl font-bold">Your Cart ({totalQuantity} items)</h1>
                    <button
                        onClick={handleClearCart}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Clear Cart
                    </button> 
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.images?.[0] || item.image || 'https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image'}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = 'https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            className="bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-700 w-8 h-8 rounded-md hover:from-purple-300 hover:to-indigo-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="mx-3 font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            className="bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-700 w-8 h-8 rounded-md hover:from-purple-300 hover:to-indigo-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-md hover:from-pink-600 hover:to-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => handleBuySingleItem(item)}
                                            disabled={orderLoading}
                                            className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-md hover:from-green-600 hover:to-emerald-600 transition-colors ${
                                                orderLoading ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {orderLoading ? 'Processing...' : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal ({totalQuantity} items)</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleBuyNow}
                                    disabled={orderLoading}
                                    className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                                        orderLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                    }`}
                                >
                                    {orderLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                            Buy Now - ${totalAmount.toFixed(2)}
                                        </>
                                    )}
                                </button>
                                {orderError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-red-800 text-sm">{orderError}</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleClearCart}
                                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-red-600 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
