// Smart filtering utility that analyzes product content for better categorization
export const smartCategorizeProduct = (product) => {
  const title = product.title.toLowerCase();
  const description = product.description.toLowerCase();
  const content = `${title} ${description}`;

  // Define category keywords
  const categories = {
    shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'loafer', 'cleat', 'pump', 'espadrille', 'footwear'],
    clothing: ['shirt', 't-shirt', 'tshirt', 'tee', 'jogger', 'pant', 'short', 'cap', 'hat', 'drawstring', 'crew neck', 'chino'],
    electronics: ['headphone', 'laptop', 'mouse', 'toaster', 'smartwatch', 'phone case', 'earbud', 'computer', 'tech'],
    furniture: ['chair', 'table', 'sofa', 'desk', 'workstation', 'dining', 'armchair', 'office chair'],
    cars: ['tesla', 'car', 'vehicle', 'automobile', 'bike', 'bicycle', 'go-kart'],
    accessories: ['bag', 'handbag', 'luggage', 'sunglasses', 'perfume', 'fragrance', 'tumbler', 'glass'],
    sports: ['sport', 'athletic', 'fitness', 'gym', 'workout']
  };

  // Check each category
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }

  // Fallback to original category if no match found
  return product.category?.name?.toLowerCase() || 'miscellaneous';
};

export const smartFilterProducts = (products, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return products.filter(product => {
    const title = product.title.toLowerCase();
    const description = product.description.toLowerCase();
    const smartCategory = smartCategorizeProduct(product);
    const originalCategory = product.category?.name?.toLowerCase() || '';

    // Check if query matches title, description, or smart category
    return title.includes(query) || 
           description.includes(query) || 
           smartCategory.includes(query) ||
           originalCategory.includes(query);
  });
};

export const getProductsByCategory = (products, category) => {
  if (!category || category === 'all') {
    return products;
  }

  const categoryLower = category.toLowerCase();
  
  return products.filter(product => {
    const smartCategory = smartCategorizeProduct(product);
    const originalCategory = product.category?.name?.toLowerCase() || '';
    
    return smartCategory === categoryLower || originalCategory === categoryLower;
  });
};

export const getAvailableCategories = (products) => {
  const categories = new Set();
  
  products.forEach(product => {
    const smartCategory = smartCategorizeProduct(product);
    categories.add(smartCategory);
  });
  
  return Array.from(categories).sort();
};
