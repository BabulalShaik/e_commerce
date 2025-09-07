import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchQuery, setIsSearching, addToSearchHistory } from '../../store/slices/searchSlice';
import { logoutUser } from '../../store/slices/authSlice';

export const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const cartItems = useSelector((state) => state.cart.totalQuantity);
    const favoritesCount = useSelector((state) => state.favorites.items.length);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [searchInput, setSearchInput] = useState('');

    // Check current page for highlighting
    const isHomePage = location.pathname === '/';
    const isCartPage = location.pathname === '/cart';
    const isFavoritesPage = location.pathname === '/favorites';
    const isProfilePage = location.pathname === '/profile' || location.pathname === '/login';

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleFavoritesClick = () => {
        navigate('/favorites');
    };

    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const handleUserClick = () => {
        if (isAuthenticated) {
            setShowUserDropdown(!showUserDropdown);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        setShowUserDropdown(false);
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
        setShowUserDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedInput = searchInput.trim();
        if (trimmedInput) {
            dispatch(setSearchQuery(trimmedInput));
            dispatch(setIsSearching(true));
            dispatch(addToSearchHistory(trimmedInput));
            navigate('/');
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value === '') {
            dispatch(setSearchQuery(''));
            dispatch(setIsSearching(false));
        }
    };

    return (
        <>
            <header className="flex flex-row justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-4 py-4 text-white shadow-lg">
                <div className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                    Shopify
                </div>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            placeholder="Search products..."
                            className="w-full px-4 py-2 pl-10 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">
                            search
                        </span>
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-1 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">search</span>
                        </button>
                    </div>
                </form>

                <nav className="flex flex-row gap-6 items-center">
                    <div 
                        className={`relative cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                            isHomePage 
                                ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                                : 'hover:bg-white hover:bg-opacity-20 hover:text-white'
                        }`}
                        onClick={() => navigate('/')}
                        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
                        role="button"
                        tabIndex={0}
                        aria-label="Home"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            home
                        </span>
                    </div>
                    <div 
                        className={`relative cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                            isCartPage 
                                ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                                : 'hover:bg-white hover:bg-opacity-20 hover:text-white'
                        }`}
                        onClick={handleCartClick}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            shopping_cart
                        </span>
                        {cartItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems}
                            </span>
                        )}
                    </div>
                    <div 
                        className={`relative cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                            isFavoritesPage 
                                ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                                : 'hover:bg-white hover:bg-opacity-20 hover:text-white'
                        }`}
                        onClick={handleFavoritesClick}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            favorite
                        </span>
                        {favoritesCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {favoritesCount}
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <div 
                            className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                                isProfilePage 
                                    ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                                    : 'hover:bg-white hover:bg-opacity-20 hover:text-white'
                            }`}
                            onClick={handleUserClick}
                        >
                            <span className="material-symbols-outlined text-2xl">
                                account_circle
                            </span>
                        </div>
                        
                        {/* User Dropdown Menu */}
                        {isAuthenticated && showUserDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                    <div className="font-medium">{user?.displayName || 'User'}</div>
                                    <div className="text-gray-500">{user?.email}</div>
                                </div>
                                <button
                                    onClick={handleProfile}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">person</span>
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">logout</span>
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
        </>
    )
}