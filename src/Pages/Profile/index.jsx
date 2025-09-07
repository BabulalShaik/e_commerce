import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../Components/Navbar';
import { logoutUser, updateUserProfile, fetchUserOrders } from '../../store/slices/authSlice';

export const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, loading, error, orders, ordersLoading, ordersError } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.totalQuantity);
    const favoritesCount = useSelector((state) => state.favorites.items.length);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
    };

    // Mock user data for demonstration
    const mockUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345",
        joinDate: "January 2024"
    };

    // Format user data for display
    const currentUser = user ? {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        name: user.displayName || `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "Not provided",
        address: user.address || "Not provided",
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"
    } : mockUser;

    // Initialize editedUser when user data is available
    useEffect(() => {
        if (user) {
            setEditedUser({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    // Fetch user orders when component mounts
    useEffect(() => {
        if (isAuthenticated && user) {
            dispatch(fetchUserOrders());
        }
    }, [dispatch, isAuthenticated, user]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (updateSuccess) {
            const timer = setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess]);

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                // Validate required fields
                if (!editedUser.firstName || !editedUser.lastName || !editedUser.email) {
                    alert('Please fill in all required fields (First Name, Last Name, Email)');
                    return;
                }

                // Save changes to database
                await dispatch(updateUserProfile(editedUser));
                setIsEditing(false);
                setUpdateSuccess(true);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedUser(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 mb-6 border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-600">person</span>
                                        Personal Information
                                    </h2>
                                    <button 
                                        onClick={handleEditToggle}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                            loading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                        } text-white`}
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <span className="material-symbols-outlined text-sm">
                                                {isEditing ? 'save' : 'edit'}
                                            </span>
                                        )}
                                        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
                                    </button>
                                </div>

                                {/* Success Message */}
                                {updateSuccess && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                                            <span className="font-medium">Profile updated successfully!</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <span className="material-symbols-outlined text-red-600">error</span>
                                            <span className="font-medium">Error: {error}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedUser.firstName || ''}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter your first name"
                                            />
                                        ) : (
                                            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.firstName || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedUser.lastName || ''}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter your last name"
                                            />
                                        ) : (
                                            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.lastName || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedUser.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter your email"
                                            />
                                        ) : (
                                            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedUser.phone || ''}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter your phone number"
                                            />
                                        ) : (
                                            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.joinDate}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                        {isEditing ? (
                                            <textarea
                                                value={editedUser.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                rows="3"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter your address"
                                            />
                                        ) : (
                                            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{currentUser.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order History */}
                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                                        Order History
                                    </h2>
                                    <button
                                        onClick={() => dispatch(fetchUserOrders())}
                                        disabled={ordersLoading}
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                        Refresh
                                    </button>
                                </div>

                                {ordersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading orders...</p>
                                    </div>
                                ) : ordersError ? (
                                    <div className="text-center py-12">
                                        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-4xl text-red-600">error</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading orders</h3>
                                        <p className="text-gray-500 mb-4">{ordersError}</p>
                                        <button
                                            onClick={() => dispatch(fetchUserOrders())}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-4xl text-blue-600">shopping_cart_checkout</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                                        <p className="text-gray-500 mb-8">Start shopping to see your order history here</p>
                                        <button 
                                            onClick={() => navigate('/')}
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                                        >
                                            <span className="material-symbols-outlined">storefront</span>
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">Order #{order.orderId}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-green-600">${order.totalAmount.toFixed(2)}</p>
                                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="border-t pt-3">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {order.totalQuantity} item{order.totalQuantity > 1 ? 's' : ''}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {order.items.slice(0, 3).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                                                                <img
                                                                    src={item.image || 'https://via.placeholder.com/40x40/e5e7eb/6b7280?text=No+Image'}
                                                                    alt={item.title}
                                                                    className="w-8 h-8 object-cover rounded"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://via.placeholder.com/40x40/e5e7eb/6b7280?text=No+Image';
                                                                    }}
                                                                />
                                                                <div>
                                                                    <p className="text-xs font-medium text-gray-800 truncate max-w-20">
                                                                        {item.title}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 min-w-16">
                                                                <span className="text-xs text-gray-600">
                                                                    +{order.items.length - 3} more
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Account Summary */}
                            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-600">analytics</span>
                                    Account Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
                                            <span className="text-gray-700 font-medium">Cart Items</span>
                                        </div>
                                        <span className="font-bold text-blue-600 text-lg">{cartItems}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-pink-600">favorite</span>
                                            <span className="text-gray-700 font-medium">Favorites</span>
                                        </div>
                                        <span className="font-bold text-pink-600 text-lg">{favoritesCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-green-600">receipt_long</span>
                                            <span className="text-gray-700 font-medium">Total Orders</span>
                                        </div>
                                        <span className="font-bold text-green-600 text-lg">0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Navigation */}
                            <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-6 border border-orange-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">explore</span>
                                    Quick Navigation
                                </h2>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">storefront</span>
                                        Browse Products
                                    </button>
                                    <button 
                                        onClick={() => navigate('/cart')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                        View Cart ({cartItems})
                                    </button>
                                    <button 
                                        onClick={() => navigate('/favorites')}
                                        className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">favorite</span>
                                        View Favorites ({favoritesCount})
                                    </button>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg p-6 border border-red-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-600">settings</span>
                                    Account Actions
                                </h2>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
