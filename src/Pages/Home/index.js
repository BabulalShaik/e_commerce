import { Navbar } from "../../Components/Navbar";
import { ProductCard } from "../../Components/ProductCard";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/slices/productsSlice";
import { setFilteredProducts, setSearchQuery, setIsSearching } from "../../store/slices/searchSlice";
import { smartFilterProducts } from "../../utils/smartFilter";

export const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);
    const { query: searchQuery, isSearching } = useSelector((state) => state.search);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // Filter products based on search query using smart filtering
    const filteredProducts = useMemo(() => {
        if (!isSearching || !searchQuery) {
            return products;
        }

        const filtered = smartFilterProducts(products, searchQuery);

        dispatch(setFilteredProducts(filtered));
        return filtered;
    }, [products, searchQuery, isSearching, dispatch]);

    const displayProducts = filteredProducts;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Loading products...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl text-red-500">Error: {error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    {isSearching ? (
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                            <p className="text-gray-600">
                                {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''} found for "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <h1 className="text-3xl font-bold">Our Products</h1>
                    )}
                </div>

                {displayProducts.length === 0 && isSearching ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try searching with different keywords</p>
                        <button
                            onClick={() => dispatch(setSearchQuery(''))}
                            className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}