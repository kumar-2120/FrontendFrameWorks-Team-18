import React, { useState, useEffect } from 'react';
import './styles.css';

const AgriValueMarketplace = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [reviews, setReviews] = useState({}); 
  const [likedReviews, setLikedReviews] = useState([]); 
  const [ratingDrafts, setRatingDrafts] = useState({}); 
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [valueRequests, setValueRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [_toasts, setToasts] = useState([]);
  const [activeTrainingTab, setActiveTrainingTab] = useState('agricultural');
  // Delivery dashboard filter: 'all' | 'active' | 'past'
  const [deliveryFilter, setDeliveryFilter] = useState('active');
  const [farmerFormErrors, setFarmerFormErrors] = useState({});
  const [farmerMode, setFarmerMode] = useState('login'); // 'login' or 'register'
  const [farmerForm, setFarmerForm] = useState({ username: '', password: '', confirmPassword: '', fullname: '', location: '', contact: '' });

  useEffect(() => {
    initializeSampleData();

    try {
      const persistedProducts = JSON.parse(localStorage.getItem('agri_products') || 'null');
      if (persistedProducts && Array.isArray(persistedProducts)) {
        if (persistedProducts.length > 0) {
          setProducts(persistedProducts);
        } else {
          // persistedProducts is an empty array -> restore defaults automatically
          restoreDefaultProducts(true);
        }
      } else if (persistedProducts) {
        setProducts(persistedProducts);
      }
      // If persistedProducts is an empty array, restore defaults after render (restoreDefaultProducts defined later)
      if (persistedProducts && Array.isArray(persistedProducts) && persistedProducts.length === 0) {
        setTimeout(() => restoreDefaultProducts(true), 0);
      }
    } catch (err) {
      console.warn('Failed to load persisted data', err);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('agri_notifications', JSON.stringify(notifications)); } catch { void 0; }
  }, [notifications]);

  const addNotification = (farmerId, message, type = 'info') => {
    if (!farmerId) return;
    const n = { id: Date.now() + Math.floor(Math.random() * 1000), farmerId, message, type, createdAt: new Date().toISOString(), read: false };
    setNotifications(prev => [n, ...prev]);
  };

  const randomizeLocalFarmers = () => {
    const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju','Anita Sharma','Venkatesh','Uma Rao'];
    setProducts(prev => {
      const next = prev.map(p => {
        // treat products with id >= 1000 as local products (skip fallback samples with small ids)
        if (!p || typeof p.id !== 'number') return p;
        if (p.id === 1024) return { ...p, farmer: 'ashish verma' };
        if (p.id >= 1000) {
          const name = sampleFarmers[Math.floor(Math.random() * sampleFarmers.length)];
          return { ...p, farmer: name };
        }
        return p;
      });
      try { localStorage.setItem('agri_products', JSON.stringify(next)); } catch { void 0; }
      pushToast('Local farmer names randomized for demo.', 'success');
      return next;
    });
  };

  const pushToast = (message, type = 'info', timeout = 3500) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    // update state (keeps linter happy and can be used for advanced rendering)
    setToasts(prev => [{ id, message, type }, ...prev]);

    // fallback DOM toast for visibility across different pages
    try {
      const containerId = 'agri-toasts-root';
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.right = '18px';
        container.style.bottom = '18px';
        container.style.zIndex = '99999';
        document.body.appendChild(container);
      }
      const toastEl = document.createElement('div');
      toastEl.textContent = message;
      toastEl.style.background = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#333';
      toastEl.style.color = '#fff';
      toastEl.style.padding = '10px 12px';
      toastEl.style.borderRadius = '8px';
      toastEl.style.marginTop = '8px';
      toastEl.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      container.prepend(toastEl);
      setTimeout(() => {
        try { container.removeChild(toastEl); } catch { void 0; }
      }, timeout);
    } catch { void 0; }

    // keep state cleaned up
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, timeout);
  };

  const initializeSampleData = () => {
    const localImageFiles = [
      'download (34).jpeg','download (35).jpeg','download (36).jpeg','download (37).jpeg','download (38).jpeg','download (39).jpeg','download (40).jpeg','download (41).jpeg','download (42).jpeg','download (43).jpeg','download (44).jpeg','download (46).jpeg','download (47).jpeg','download (48).jpeg','download (49).jpeg','download (50).jpeg','download (51).jpeg','download (52).jpeg','download (53).jpeg','download (54).jpeg','download (55).jpeg','download (56).jpeg','download (58).jpeg','download (59).jpeg','download (60).jpeg','download (61).jpeg','download (62).jpeg','download (63).jpeg','download (64).jpeg','download (65).jpeg','download (66).jpeg','download (67).jpeg','download (68).jpeg'
    ];

    const customNames = {
      1: 'Bay Leaves',
      2: 'Carom Seeds',
      3: 'Charoli',
      4: 'Soya Chunks',
      5: 'Soya Granules',
      6: 'Cumin Seeds',
      7: 'Mace',
      8: 'Coriander Powder',
      9: 'Coriander Seeds',
      10: 'Fenugreek Seeds',
      11: 'Star Anise',
      12: 'Wheat Grains',
      13: 'Corn Flour',
      14: 'Jowar Seeds',
      15: 'Cereal Grains',
      16: 'White Sorghum',
      17: 'Jowar Flour',
      18: 'Finger Millet',
      19: 'Finger Millet Flour',
      20: 'Cinnamon Flour',
      21: 'Chips',
      22: 'Coconut Dumplings',
      23: 'Rice Flour Crackers',
      24: 'Khaja',
      25: 'Shells',
      26: 'Savory Snacks',
      27: 'Sweet Shells',
      28: 'Chickpea Flour Droplets',
      29: 'Butter',
      30: 'Cow Ghee',
      31: 'Coffee Powder',
      32: 'Mango Pickles',
      33: 'Ginger Pickles'
    };

    const localProducts = localImageFiles.map((fname, idx) => {
      const displayIndex = idx + 1;
      const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju'];
      const sampleLocations = ['Guntur, Andhra Pradesh','Vijayawada, Andhra Pradesh','Nellore, Andhra Pradesh','Kurnool, Andhra Pradesh','Vizag, Andhra Pradesh','Tirupati, Andhra Pradesh','Guntur Rural','Kadapa, Andhra Pradesh','Anantapur, Andhra Pradesh','Ongole, Andhra Pradesh'];
      const computedFarmer = (1000 + idx) === 1024 ? 'ashish verma' : sampleFarmers[idx % sampleFarmers.length];
      const computedLocation = sampleLocations[idx % sampleLocations.length];
      return {
        id: 1000 + idx,
        name: customNames[displayIndex] || `Product ${displayIndex}`,
        quantity: 100 + (idx % 50),
        price: 50 + (idx % 200),
        image: `/images/${encodeURIComponent(fname)}`,
        location: computedLocation,
        contact: '',
        farmer: computedFarmer,
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 7 + (idx % 4) * 0.5,
        inMarketplace: true
      };
    });

    
    const fallbackSamples = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        quantity: 500,
        price: 80,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        location: 'Guntur, Andhra Pradesh',
        contact: '9876543210',
        farmer: 'Ravi Kumar',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 8.5,
        inMarketplace: true
      },
      {
        id: 2,
        name: 'All Mix Spices',
        quantity: 200,
        price: 120,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
        location: 'Nellore, Andhra Pradesh',
        contact: '9876543211',
        farmer: 'Lakshmi Devi',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 9.2,
        inMarketplace: true
      }
      
    ];

    let allProducts = [...localProducts, ...fallbackSamples];

    
    const outOfStockCount = Math.min(5, allProducts.length);
    const chosen = new Set();
    while (chosen.size < outOfStockCount) {
      const r = Math.floor(Math.random() * allProducts.length);
      chosen.add(r);
    }
    allProducts = allProducts.map((p, idx) => ({ ...p, quantity: chosen.has(idx) ? 0 : p.quantity }));

    setProducts(allProducts);
    const reviewsMap = {};
    allProducts.forEach((prod) => {
      reviewsMap[prod.id] = [
        { id: `${prod.id}-r1`, author: 'Ravi Kumar', text: 'Good quality and fair price.', likes: Math.floor(Math.random() * 8) },
        { id: `${prod.id}-r2`, author: 'Anita Sharma', text: 'Quick delivery and well packaged.', likes: Math.floor(Math.random() * 5) }
      ];
    });
    setReviews(reviewsMap);
    setOrders([
      {
        id: 1001,
        productId: 1,
        quantity: 10,
        total: 800,
        buyerName: 'Suresh Reddy',
        address: 'Plot 45, Banjara Hills, Hyderabad',
        contact: '9988776655',
        status: 'shipped',
        deliveryPersonId: 'del-1',
        deliveryPersonName: 'Raju (del-1)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1002,
        productId: 2,
        quantity: 30,
        total: 1200,
        buyerName: 'jayanth Reddy',
        address: 'Plot 34, Kannur, Vijaywada',
        contact: '9088454355',
        status: 'processing',
        deliveryPersonId: 'del-2',
        deliveryPersonName: 'Lakshmi (del-2)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1003,
        productId: 3,
        quantity: 2,
        total: 500,
        buyerName: 'RAJU',
        address: 'Plot 2, Poranki, Vijaywada',
        contact: '9088485355',
        status: 'shipping',
        deliveryPersonId: 'del-1',
        deliveryPersonName: 'Raju (del-1)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
      id: 1008,
        productId: 90,
        quantity: 3,
        total: 120,
        buyerName: 'Tauheed',
        address: '1-65, Railway colony, Guntakal',
        contact: '8936845355',
        status: 'Delivered',
        deliveryPersonId: 'del-2',
        deliveryPersonName: 'Lakshmi (del-2)',
        deliveredAt: new Date().toISOString(),
        deliveryResult: 'success'
      }
    ]);
  };

  const restoreDefaultProducts = (silent = false) => {
    if (!silent && !confirm('Restore default marketplace products? This will replace current product list in the UI.')) return;

    const localImageFiles = [
      'download (34).jpeg','download (35).jpeg','download (36).jpeg','download (37).jpeg','download (38).jpeg','download (39).jpeg','download (40).jpeg','download (41).jpeg','download (42).jpeg','download (43).jpeg','download (44).jpeg','download (46).jpeg','download (47).jpeg','download (48).jpeg','download (49).jpeg','download (50).jpeg','download (51).jpeg','download (52).jpeg','download (53).jpeg','download (54).jpeg','download (55).jpeg','download (56).jpeg','download (58).jpeg','download (59).jpeg','download (60).jpeg','download (61).jpeg','download (62).jpeg','download (63).jpeg','download (64).jpeg','download (65).jpeg','download (66).jpeg','download (67).jpeg','download (68).jpeg'
    ];
    const customNames = {
      1: 'Bay Leaves',
      2: 'Carom Seeds',
      3: 'Charoli',
      4: 'Soya Chunks',
      5: 'Soya Granules',
      6: 'Cumin Seeds',
      7: 'Mace',
      8: 'Coriander Powder',
      9: 'Coriander Seeds',
      10: 'Fenugreek Seeds',
      11: 'Star Anise',
      12: 'Wheat Grains',
      13: 'Corn Flour',
      14: 'Jowar Seeds',
      15: 'Cereal Grains',
      16: 'White Sorghum',
      17: 'Jowar Flour',
      18: 'Finger Millet',
      19: 'Finger Millet Flour',
      20: 'Cinnamon Flour',
      21: 'Chips',
      22: 'Coconut Dumplings',
      23: 'Rice Flour Crackers',
      24: 'Khaja',
      25: 'Shells',
      26: 'Savory Snacks',
      27: 'Sweet Shells',
      28: 'Chickpea Flour Droplets',
      29: 'Butter',
      30: 'Cow Ghee',
      31: 'Coffee Powder',
      32: 'Mango Pickles',
      33: 'Ginger Pickles'
    };

    const localProducts = localImageFiles.map((fname, idx) => {
      const displayIndex = idx + 1;
      const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju'];
      const sampleLocations = ['Guntur, Andhra Pradesh','Vijayawada, Andhra Pradesh','Nellore, Andhra Pradesh','Kurnool, Andhra Pradesh','Vizag, Andhra Pradesh','Tirupati, Andhra Pradesh','Guntur Rural','Kadapa, Andhra Pradesh','Anantapur, Andhra Pradesh','Ongole, Andhra Pradesh'];
      const computedFarmer = (1000 + idx) === 1024 ? 'ashish verma' : sampleFarmers[idx % sampleFarmers.length];
      const computedLocation = sampleLocations[idx % sampleLocations.length];
      return {
        id: 1000 + idx,
        name: customNames[displayIndex] || `Product ${displayIndex}`,
        quantity: 100 + (idx % 50),
        price: 50 + (idx % 200),
        image: `/images/${encodeURIComponent(fname)}`,
        location: computedLocation,
        contact: '',
        farmer: computedFarmer,
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 7 + (idx % 4) * 0.5,
        inMarketplace: true
      };
    });

    const fallbackSamples = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        quantity: 500,
        price: 80,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        location: 'Guntur, Andhra Pradesh',
        contact: '9876543210',
        farmer: 'Ravi Kumar',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 8.5,
        inMarketplace: true
      },
      {
        id: 2,
        name: 'All Mix Spices',
        quantity: 200,
        price: 120,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
        location: 'Nellore, Andhra Pradesh',
        contact: '9876543211',
        farmer: 'Lakshmi Devi',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 9.2,
        inMarketplace: true
      }
    ];

    let allProducts = [...localProducts, ...fallbackSamples];

    const outOfStockCount = Math.min(5, allProducts.length);
    const chosen = new Set();
    while (chosen.size < outOfStockCount) {
      const r = Math.floor(Math.random() * allProducts.length);
      chosen.add(r);
    }
    allProducts = allProducts.map((p, idx) => ({ ...p, quantity: chosen.has(idx) ? 0 : p.quantity }));

    const reviewsMap = {};
    allProducts.forEach((prod) => {
      reviewsMap[prod.id] = [
        { id: `${prod.id}-r1`, author: 'Ravi Kumar', text: 'Good quality and fair price.', likes: Math.floor(Math.random() * 8) },
        { id: `${prod.id}-r2`, author: 'Anita Sharma', text: 'Quick delivery and well packaged.', likes: Math.floor(Math.random() * 5) }
      ];
    });

    setProducts(allProducts);
    setReviews(reviewsMap);
  try { localStorage.removeItem('agri_products'); } catch { void 0; }
  try { localStorage.setItem('agri_reviews', JSON.stringify(reviewsMap)); } catch { void 0; }
  };

  const getQualityLabel = (rating) => {
    if (rating <= 2) return '⭐ Poor';
    if (rating <= 4) return '⭐⭐ Average';
    if (rating <= 7) return '⭐⭐⭐ Good';
    if (rating <= 9) return '⭐⭐⭐⭐ Excellent';
    return '⭐⭐⭐⭐⭐ Outstanding';
  };

  
  const generateETA = () => {
    const r = Math.random();
    if (r < 0.4) {
      const hours = [2, 4, 6, 8];
      const h = hours[Math.floor(Math.random() * hours.length)];
      return `Within ${h} hours`;
    } else if (r < 0.85) {
      const days = [1, 2];
      const d = days[Math.floor(Math.random() * days.length)];
      return `${d} day${d > 1 ? 's' : ''}`;
    }
    return 'Within 12 hours';
  };

  const handleImgError = (e, small = false) => {
    const placeholder = small ? 'https://via.placeholder.com/80' : 'https://via.placeholder.com/300x200';
    try {
      if (e.currentTarget.dataset.fallbackTried) {
        e.currentTarget.src = placeholder;
        return;
      }

      const seed = e.currentTarget.dataset.seed || e.currentTarget.dataset.id || '0';

      const src = e.currentTarget.getAttribute('src') || '';
      if (src.startsWith('/images/') || src.includes('/public/images/') || src.includes('/images%20')) {
        e.currentTarget.dataset.fallbackTried = '1';
        e.currentTarget.src = `https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800&sig=${encodeURIComponent(seed)}`;
      } else {
        e.currentTarget.src = placeholder;
      }
    } catch {
      e.currentTarget.src = placeholder;
    }
  };

  const handleFarmerInput = (field, value) => {
    setFarmerForm(prev => ({ ...prev, [field]: value }));

    setFarmerFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFarmerLogin = () => {
    const username = (farmerForm.username || '').trim();
    const password = (farmerForm.password || '').trim();
    const errors = {};
    if (!username) errors.username = 'Please enter your username (mobile number).';
    if (!password) errors.password = 'Please enter your password.';
    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let farmers = [];
  try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    const found = farmers.find(f => f.username === username);
    if (!found) {
      setFarmerFormErrors({ username: 'No account found for this username. Please register.' });
      return;
    }
    if (found.password !== password) {
      setFarmerFormErrors({ password: 'Incorrect password.' });
      return;
    }
    
    setCurrentUser(found);
    setCurrentPage('farmer-dashboard');
    pushToast(`Welcome back, ${found.fullname || found.username}!`, 'success');
  };

  const handleFarmerRegister = () => {
    const fullname = (farmerForm.fullname || '').trim();
    const password = (farmerForm.password || '').trim();
    const confirmPassword = (farmerForm.confirmPassword || '').trim();
    const location = (farmerForm.location || '').trim();
    const contact = (farmerForm.contact || '').trim();

    const errors = {};
    if (!fullname || fullname.length < 3) errors.fullname = 'Please enter your full name (at least 3 characters).';
    if (!/^[0-9]{10}$/.test(contact)) errors.contact = 'Please enter a valid 10-digit mobile number.';
    if (!location) errors.location = 'Please enter your village / district / state.';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const username = contact;

    let farmers = [];
  try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    if (farmers.find(f => f.username === username)) {
      setFarmerFormErrors({ contact: 'An account with this mobile number already exists. Please login.' });
      return;
    }

    const newFarmer = {
      id: Date.now(),
      username,
      password,
      fullname,
      location,
      contact,
      role: 'farmer',
      createdAt: new Date().toISOString()
    };
    farmers.push(newFarmer);
  try { localStorage.setItem('agri_farmers', JSON.stringify(farmers)); } catch { void 0; }
    setCurrentUser(newFarmer);
    setCurrentPage('farmer-dashboard');
    pushToast(`Registration successful — welcome, ${fullname}!`, 'success');
  };

    useEffect(() => {
  try { localStorage.setItem('agri_orders', JSON.stringify(orders)); } catch { void 0; }
    }, [orders]);

    useEffect(() => {
  try { localStorage.setItem('agri_currentUser', JSON.stringify(currentUser)); } catch { void 0; }
    }, [currentUser]);

    useEffect(() => {
  try { localStorage.setItem('agri_cart', JSON.stringify(cart)); } catch { void 0; }
    }, [cart]);

    useEffect(() => {
  try { localStorage.setItem('agri_reviews', JSON.stringify(reviews)); } catch { void 0; }
    }, [reviews]);

    useEffect(() => {
  try { localStorage.setItem('agri_valueRequests', JSON.stringify(valueRequests)); } catch { void 0; }
    }, [valueRequests]);

    useEffect(() => {
  try { localStorage.setItem('agri_products', JSON.stringify(products)); } catch { void 0; }
    }, [products]);

    useEffect(() => {
  try { localStorage.setItem('agri_liked', JSON.stringify(likedReviews)); } catch { void 0; }
    }, [likedReviews]);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if ((product.quantity || 0) <= 0) {
      pushToast('This product is out of stock and cannot be added to cart.', 'error');
      return;
    }
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const priceToUse = (product.discountedPrice !== undefined && product.discountedPrice !== null) ? product.discountedPrice : product.price;
      setCart([...cart, { productId, quantity: 1, price: priceToUse }]);
    }
    pushToast(product.name + ' added to cart!', 'success');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, change) => {
    const item = cart.find(i => i.productId === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart(cart.map(i => 
          i.productId === productId ? { ...i, quantity: newQuantity } : i
        ));
      }
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.quantity * (item.price || 0));
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (currentPage === 'landing') {
    return (
      <div className="body landing">
        <div className="landingBlobs" aria-hidden="true">
          <span className="blob blob1" />
          <span className="blob blob2" />
          <span className="blob blob3" />
        </div>
        <h1 className="animatedTitle">🌾 AgriValue 🌾</h1>
        <p className="tagline">Empowering Farmers, Enriching Rural Communities</p>
        <div className="roleButtons">
          {[
            { title: '👨‍🌾 Farmer', desc: 'Register and sell your agricultural products', page: 'farmer-auth' },
            { title: '🔍 Verification Employee', desc: 'Verify farmer registrations and products', page: 'employee-auth' },
            { title: '⭐ Quality Team', desc: 'Assess product quality standards', page: 'quality-auth' },
            { title: '⚙️ Admin', desc: 'Manage export/import operations', page: 'admin-auth' },
            { title: '🚚 Delivery Personel', desc: 'Manage product deliveries', page: 'delivery-auth' },
            { title: '🛒 Buyer', desc: 'Browse and purchase quality products', page: 'marketplace' },
            { title: '📚 Training Center', desc: 'Learn new skills and best practices', page: 'training' }
          ].map((role, i) => (
            <button 
              key={i} 
              className="roleBtn"
              onClick={() => setCurrentPage(role.page)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{color: '#667eea', marginBottom: '10px'}}>{role.title}</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>{role.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }


  if (currentPage === 'farmer-auth') {
    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container compact" style={{maxWidth: '720px'}}>
          <div className="header">
            <h1 style={{color: '#667eea'}}>Farmer Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>

          <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
            <button className={`btn ${farmerMode === 'login' ? 'btnPrimary' : ''}`} onClick={() => setFarmerMode('login')}>Login</button>
            <button className={`btn ${farmerMode === 'register' ? 'btnPrimary' : ''}`} onClick={() => setFarmerMode('register')}>Register</button>
          </div>

          {farmerMode === 'login' ? (
            <div>
              <div className="formGroup">
                <label className="formLabel">Username (mobile number)</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.username}
                  onChange={(e) => handleFarmerInput('username', e.target.value)}
                  placeholder="e.g. 9876543210"
                />
                {farmerFormErrors.username && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.username}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.password}
                  onChange={(e) => handleFarmerInput('password', e.target.value)}
                  placeholder="Enter your password"
                />
                {farmerFormErrors.password && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.password}</div>}
              </div>
              <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                <button className="btn btnSuccess" onClick={handleFarmerLogin}>Login</button>
                <button className="btn" onClick={() => { setFarmerMode('register'); setFarmerFormErrors({}); }}>Go to Register</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="formGroup">
                <label className="formLabel">Full Name</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.fullname}
                  onChange={(e) => handleFarmerInput('fullname', e.target.value)}
                  placeholder="Your full name"
                />
                {farmerFormErrors.fullname && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.fullname}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.password}
                  onChange={(e) => handleFarmerInput('password', e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                />
                {farmerFormErrors.password && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.password}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Confirm Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.confirmPassword}
                  onChange={(e) => handleFarmerInput('confirmPassword', e.target.value)}
                  placeholder="Repeat your password"
                />
                {farmerFormErrors.confirmPassword && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.confirmPassword}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Location</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.location}
                  onChange={(e) => handleFarmerInput('location', e.target.value)}
                  placeholder="Village, District, State"
                />
                {farmerFormErrors.location && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.location}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Mobile Number</label>
                <input
                  type="tel"
                  className="formInput"
                  value={farmerForm.contact}
                  onChange={(e) => handleFarmerInput('contact', e.target.value)}
                  placeholder="10-digit mobile number"
                />
                {farmerFormErrors.contact && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.contact}</div>}
              </div>
              <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                <button className="btn btnSuccess" onClick={handleFarmerRegister}>Register</button>
                <button className="btn" onClick={() => { setFarmerMode('login'); setFarmerFormErrors({}); }}>Back to Login</button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  
  if (currentPage === 'farmer-dashboard') {
    const currentFarmerId = (currentUser?.fullname || currentUser?.name || currentUser?.username);
    const farmerProducts = products.filter(p => p.farmer === currentFarmerId);
    const farmerOrders = orders.filter(o => 
      products.some(p => p.id === o.productId && p.farmer === currentFarmerId)
    );

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Farmer Dashboard - {currentUser?.fullname || currentUser?.name || currentUser?.username}</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>

          {/* Notifications for the logged-in farmer */}
          <div style={{marginTop: '12px', marginBottom: '12px'}}>
            {(() => {
              const myNotifs = notifications.filter(n => n.farmerId === currentFarmerId);
              const unread = myNotifs.filter(n => !n.read).length;
              return (
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={{fontSize: '0.95rem'}}>{unread > 0 ? `🔔 ${unread} new notification${unread > 1 ? 's' : ''}` : 'No new notifications'}</div>
                    {myNotifs.length > 0 && (
                      <div>
                        <button className="btn" onClick={() => {
                          setNotifications(prev => prev.map(n => n.farmerId === currentFarmerId ? { ...n, read: true } : n));
                          pushToast('Marked notifications as read', 'info');
                        }}>Mark all read</button>
                      </div>
                    )}
                  </div>
                  <div>
                    {myNotifs.slice(0,6).map(n => (
                      <div key={n.id} style={{background: n.read ? '#f8f9fa' : '#fff7e6', padding: '8px', borderRadius: '6px', marginBottom: '6px'}}>
                        <div style={{fontSize: '0.95rem'}}>{n.message}</div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                    {myNotifs.length === 0 && (
                      <div style={{color: '#666'}}>You have no notifications.</div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="tabContainer">
            {['products', 'orders', 'value-addition', 'financial'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'tabActive' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'products' && (
            <div>
              <button 
                className="btn btnSecondary"
                style={{marginBottom: '20px'}}
                onClick={() => setActiveModal('add-product')}
              >
                + Add New Product
              </button>
              <div className="dashboardGrid">
                {farmerProducts.length === 0 ? (
                  <p>No products listed yet. Click "Add New Product" to get started!</p>
                ) : (
                  farmerProducts.map((p) => (
                    <div key={p.id} className="card">
                      <img
                        src={p.image || 'https://via.placeholder.com/300x200'}
                        alt={p.name}
                        className="productImage"
                        data-seed={p.id}
                        onError={(e) => handleImgError(e)}
                      />
                        <h3>{p.name}</h3>
                      <p><strong>Quantity:</strong> {p.quantity} kg</p>
                      <p><strong>Price:</strong> ₹{p.price}/kg</p>
                      <p><strong>Status:</strong> <span className={`statusBadge ${p.status === 'approved' ? 'statusApproved' : 'statusPending'}`}>{p.status.toUpperCase()}</span></p>
                      {p.quality && <p><strong>Quality:</strong> {getQualityLabel(p.quality)} ({p.quality}/10)</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Your Orders</h2>
              {farmerOrders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                farmerOrders.map(o => {
                  const product = products.find(p => p.id === o.productId);
                  return (
                    <div key={o.id} className="productCard">
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Buyer:</strong> {o.buyerName}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'value-addition' && (
            <div>
              <h2>🎯 Value Addition Services</h2>
              <p style={{marginBottom: '20px'}}>Transform your raw materials into high-value products!</p>
              <div className="dashboardGrid">
                {[
                  { name: 'Rice to Rice Flour', input: 'Rice', output: 'Rice Flour', increase: '40%', time: '2 days' },
                  { name: 'Turmeric to Powder', input: 'Fresh Turmeric', output: 'Turmeric Powder', increase: '60%', time: '5 days' }
                ].map((s, i) => (
                  <div key={i} className="card">
                    <h3>{s.name}</h3>
                    <p><strong>Input:</strong> {s.input}</p>
                    <p><strong>Output:</strong> {s.output}</p>
                    <p style={{color: '#28a745', fontWeight: 'bold'}}>📈 Value Increase: {s.increase}</p>
                    <p><strong>Processing Time:</strong> {s.time}</p>
                    <button
                      className="btn btnSecondary"
                      onClick={() => {
                        const farmerId = currentUser?.username || currentUser?.fullname || currentUser?.name || 'unknown';
                        const newReq = {
                          id: Date.now() + Math.floor(Math.random() * 1000),
                          serviceName: s.name,
                          input: s.input,
                          output: s.output,
                          increase: s.increase,
                          time: s.time,
                          farmerId,
                          farmerName: currentUser?.fullname || currentUser?.name || farmerId,
                          status: 'pending',
                          createdAt: new Date().toISOString()
                        };
                        setValueRequests(prev => [newReq, ...prev]);
                        pushToast('Request submitted — an admin will review and approve it shortly.', 'success');
                      }}
                    >
                      Request Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div>
              <h2>💰 Financial Support Options</h2>
              <div className="card">
                <h3>Instant Cash Option</h3>
                <p>Need immediate funds? Sell your products at current market rates for instant payment.</p>
                <ul style={{margin: '15px 0', paddingLeft: '20px'}}>
                  <li>Get 100% market value immediately</li>
                  <li>No waiting period</li>
                  <li>Quick transaction process</li>
                </ul>
              </div>
              <div className="card">
                <h3>Profit Sharing Model</h3>
                <p>List your products and earn market value + profit share after processing.</p>
                <ul style={{margin: '15px 0', paddingLeft: '20px'}}>
                  <li>Receive full market value</li>
                  <li>Additional 15-25% profit share</li>
                  <li>Payment after quality check and sale</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {activeModal === 'add-product' && (
          <div className="modal" onClick={() => setActiveModal(null)}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Add New Product</h2>
              <div className="formGroup">
                <label className="formLabel">Product Name</label>
                <input type="text" id="new-product-name" placeholder="e.g., Organic Rice" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Quantity (kg)</label>
                <input type="number" id="new-product-quantity" placeholder="Available quantity" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Price (₹/kg)</label>
                <input type="number" id="new-product-price" placeholder="Desired selling price" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Image URL</label>
                <input type="text" id="new-product-image" placeholder="https://example.com/image.jpg" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Location</label>
                <input type="text" id="new-product-location" placeholder="Farm address" className="formInput" />
              </div>
              <button 
                className="btn"
                onClick={() => {
                  const rawImage = document.getElementById('new-product-image').value || '';
                  const newProduct = {
                    id: Date.now(),
                    name: document.getElementById('new-product-name').value,
                    quantity: parseInt(document.getElementById('new-product-quantity').value),
                    price: parseInt(document.getElementById('new-product-price').value),
                    image: rawImage.trim() || 'https://via.placeholder.com/300x200',
                    location: document.getElementById('new-product-location').value,
                    farmer: (currentUser?.fullname || currentUser?.name || currentUser?.username),
                    status: 'pending',
                    verified: false,
                    quality: null
                  };
                  setProducts([...products, newProduct]);
                  setActiveModal(null);
                  pushToast('Product added successfully!', 'success');
                }}
              >
                Submit Product
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'marketplace') {
    const marketProducts = products.filter(p => p.inMarketplace);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container market-compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>🛒 Marketplace</h1>
            <div>
              <button
                className="btn"
                style={{marginRight: '10px'}}
                onClick={() => setCurrentPage('buyer-orders')}
              >
                📦 My Orders
              </button>
              
              <button 
                className="btn btnSecondary"
                style={{marginRight: '10px'}}
                onClick={() => setActiveModal('cart')}
              >
                🛒 Cart ({cartCount})
              </button>
              <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
            </div>
          </div>
          <div className="marketplaceGrid">
              {marketProducts.length === 0 ? (
              <p style={{textAlign: 'center', padding: '40px'}}>No products available yet. Check back soon!</p>
            ) : (
              marketProducts.map((p) => (
                <div key={p.id} className="productCard" style={{overflow: 'hidden'}}>
                    <img
                      src={p.image || 'https://via.placeholder.com/300x200'}
                      alt={p.name}
                      className="productImage"
                      data-seed={p.id}
                      onError={(e) => handleImgError(e)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setActiveModal('image-view');
                      }}
                      style={{cursor: 'pointer'}}
                    />
                  <div style={{padding: '15px'}}>
                    <h3>{p.name}</h3>
                    <p style={{color: '#666', margin: '10px 0'}}>By {p.farmer}</p>
                    <div style={{color: '#ffa500', fontSize: '1.2rem'}}>{getQualityLabel(p.quality)}</div>
                    { (p.quantity || 0) > 0 ? (
                      <p style={{margin: '10px 0'}}><strong>Available:</strong> {p.quantity} kg</p>
                    ) : (
                      <p style={{margin: '10px 0', color: '#dc3545', fontWeight: '700'}}>Out of stock</p>
                    )}
                    <div style={{fontSize: '1.1rem', marginTop: '8px'}}>
                      {p.discountedPrice ? (
                        <div>
                          <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>₹{p.price}/kg</span>
                          <span style={{fontSize: '1.4rem', color: '#dc3545', fontWeight: '700'}}>₹{p.discountedPrice}/kg</span>
                        </div>
                      ) : (
                        <span style={{fontSize: '1.5rem', color: '#667eea', fontWeight: 'bold'}}>₹{p.price}/kg</span>
                      )}
                    </div>
                    <p style={{fontSize: '0.9rem', color: '#666'}}><strong>Location:</strong> {p.location}</p>
                    <button 
                      className="btn"
                      style={{width: '100%', marginTop: '10px'}}
                      onClick={() => addToCart(p.id)}
                      disabled={(p.quantity || 0) <= 0}
                    >
                      {(p.quantity || 0) <= 0 ? 'Out of stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {activeModal === 'cart' && (
          <div className="modal" onClick={() => setActiveModal(null)}>
            <div className="modalContent cartModal" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} style={{display: 'flex', gap: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px', alignItems: 'center'}}>
                        <img
                          src={product.image || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
                          onError={(e) => handleImgError(e, true)}
                        />
                        <div style={{flex: 1}}>
                          <h3>{product.name}</h3>
                          <p>₹{item.price}/kg</p>
                          <div style={{marginTop: '10px'}}>
                            <button className="btn" style={{padding: '5px 10px', fontSize: '0.85rem'}} onClick={() => updateCartQuantity(item.productId, -1)}>-</button>
                            <span style={{margin: '0 10px'}}>{item.quantity} kg</span>
                            <button className="btn" style={{padding: '5px 10px', fontSize: '0.85rem'}} onClick={() => updateCartQuantity(item.productId, 1)}>+</button>
                          </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>₹{(item.quantity * (item.price || 0)).toFixed(2)}</p>
                          <button 
                            className="btn btnDanger"
                            style={{padding: '5px 10px', fontSize: '0.85rem', marginTop: '10px'}}
                            onClick={() => removeFromCart(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{background: '#667eea', color: 'white', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
                    <h3>Total: ₹{cartTotal}</h3>
                    <button 
                      className="btn btnSuccess"
                      style={{width: '100%', marginTop: '10px'}}
                      onClick={() => {
                        if (cart.length === 0) {
                          pushToast('Your cart is empty', 'error');
                          return;
                        }
                        setActiveModal('checkout');
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeModal === 'checkout' && (
          <div className="modal" onClick={() => setActiveModal(null)}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Checkout</h2>
              <p>Enter delivery details and payment method.</p>
              <div className="formGroup">
                <label className="formLabel">Full Name</label>
                <input type="text" id="checkout-name" className="formInput" defaultValue={currentUser?.fullname || currentUser?.name || currentUser?.username || ''} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Delivery Address</label>
                <textarea id="checkout-address" className="formInput" rows={3} defaultValue={currentUser?.location || ''} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Mobile Number</label>
                <input type="tel" id="checkout-mobile" className="formInput" defaultValue={currentUser?.contact || ''} placeholder="10 digit mobile number" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Payment Method</label>
                <select id="checkout-payment" className="formInput" defaultValue="cod">
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
              <button
                className="btn btnSuccess"
                onClick={() => {
                  const name = (document.getElementById('checkout-name').value || '').trim();
                  const address = (document.getElementById('checkout-address').value || '').trim();
                  const mobile = (document.getElementById('checkout-mobile').value || '').trim();
                  const payment = (document.getElementById('checkout-payment').value || 'cod');

                  if (!name || !address || !mobile) {
                    pushToast('Please fill name, address and mobile number', 'error');
                    return;
                  }
                  if (!/^[0-9]{10}$/.test(mobile)) {
                    pushToast('Please enter a valid 10-digit mobile number', 'error');
                    return;
                  }
                  const newOrders = cart.map(item => {

                    const price = item.price || 0;
                    const baseOrder = {
                      id: Date.now() + Math.floor(Math.random() * 1000) + item.productId,
                      productId: item.productId,
                      quantity: item.quantity,
                      total: (item.quantity || 0) * price,
                      buyerName: name,
                      address,
                      contact: mobile,
                      paymentMethod: payment,
                      // mark delivery assignment explicitly so it's not empty
                      deliveryPersonId: 'unassigned',
                      deliveryPersonName: 'Unassigned',
                      status: 'processing',
                      estimatedDelivery: generateETA(),
                      orderDate: new Date().toISOString(),
                      rating: null,
                      review: null
                    };
                    if (payment === 'upi') {
                      return { ...baseOrder, paymentStatus: 'paid', paymentAt: new Date().toISOString() };
                    }
                    return { ...baseOrder, paymentStatus: 'pending' };
                  });

                  setOrders([...orders, ...newOrders]);
                  setCart([]);
                  setActiveModal(null);
                  // set the current user as the buyer so "My Orders" shows the newly placed orders
                  setCurrentUser(prev => ({ ...(prev || {}), name, contact: mobile, role: 'buyer' }));
                  // navigate to buyer orders automatically
                  setCurrentPage('buyer-orders');
                                pushToast('Order placed successfully! We will process your delivery shortly.', 'success');
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}

        {activeModal === 'image-view' && selectedProduct && (
          <div className="modal" onClick={() => { setActiveModal(null); setSelectedProduct(null); }}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{maxWidth: '900px'}}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => { setActiveModal(null); setSelectedProduct(null); }}
              >
                &times;
              </span>
              <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                <div style={{flex: '1 1 480px'}}>
                  <img
                    src={selectedProduct.image || 'https://via.placeholder.com/800x600'}
                    alt={selectedProduct.name}
                    style={{width: '100%', height: 'auto', borderRadius: '8px'}}
                    onError={(e) => handleImgError(e)}
                  />
                </div>
                <div style={{flex: '1 1 300px'}}>
                  <h2>{selectedProduct.name}</h2>
                  <p style={{color: '#666'}}><strong>Farmer:</strong> {selectedProduct.farmer}</p>
                  <p style={{color: '#666'}}><strong>Price:</strong> ₹{selectedProduct.price}/kg</p>
                  <p style={{color: '#666'}}><strong>Location:</strong> {selectedProduct.location}</p>
                </div>
              </div>

              <hr style={{margin: '20px 0'}} />
              <h3>Reviews</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {(reviews[selectedProduct.id] || []).map(r => (
                  <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '8px'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 700}}>{r.author}</div>
                      <div style={{color: '#333'}}>{r.text}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{fontSize: '0.9rem'}}>{r.likes}</div>
                      <button
                        className="btn"
                        style={{padding: '6px 10px', fontSize: '0.9rem'}}
                        onClick={() => {
                          // toggle like
                          const liked = likedReviews.includes(r.id);
                          setReviews(prev => {
                            const copy = { ...prev };
                            copy[selectedProduct.id] = copy[selectedProduct.id].map(rv => rv.id === r.id ? { ...rv, likes: rv.likes + (liked ? -1 : 1) } : rv);
                            return copy;
                          });
                          setLikedReviews(prev => {
                            if (liked) return prev.filter(id => id !== r.id);
                            return [...prev, r.id];
                          });
                        }}
                      >
                        {likedReviews.includes(r.id) ? '♥ Liked' : '♡ Like'}
                      </button>
                    </div>
                  </div>
                ))}
                {(reviews[selectedProduct.id] || []).length === 0 && (
                  <p>No reviews yet for this product.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Training Page
  if (currentPage === 'training') {
    const courses = {
      agricultural: [
        { title: 'Organic Farming Basics', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=organic+farming+basics' },
        { title: 'Soil Health Management', duration: '60 min', level: 'Intermediate', videoUrl: 'https://www.youtube.com/results?search_query=soil+health+management' }
      ],
      financial: [
        { title: 'Basic Accounting for Farmers', duration: '55 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=basic+accounting+for+farmers' },
        { title: 'Loan Application Process', duration: '35 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=loan+application+process+for+farmers' }
      ],
      'value-addition': [
        { title: 'Rice Processing Techniques', duration: '60 min', level: 'Intermediate', videoUrl: 'https://www.youtube.com/results?search_query=rice+processing+techniques' },
        { title: 'Making Spice Powders', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=making+spice+powders' }
      ],
      digital: [
        { title: 'Online Marketing Basics', duration: '50 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=online+marketing+for+farmers' },
        { title: 'Social Media for Farmers', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=social+media+for+farmers' }
      ]
    };

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container buyerOrders">
          <div className="header">
            <h1 style={{color: '#667eea'}}>📚 Training & Development Center</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>

          <div className="tabContainer">
            {['agricultural', 'financial', 'value-addition', 'digital'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTrainingTab === tab ? 'tabActive' : ''}`}
                onClick={() => setActiveTrainingTab(tab)}
              >
                {tab.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="dashboardGrid">
            {courses[activeTrainingTab]?.map((c, i) => (
              <div 
                key={i} 
                className="trainingCard"
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => {
                  if (c.videoUrl) {
                    window.open(c.videoUrl, '_blank', 'noopener');
                  } else {
                    pushToast('No video available for this course', 'info');
                  }
                }}
                style={{cursor: c.videoUrl ? 'pointer' : 'default'}}
              >
                <h3>{c.title}</h3>
                <p>⏱️ Duration: {c.duration}</p>
                <p>📊 Level: {c.level}</p>
                <p style={{marginTop: '10px', color: c.videoUrl ? '#fff' : '#ddd'}}>Click to watch →</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Buyer Orders
  if (currentPage === 'buyer-orders') {
    const currentBuyerName = (currentUser?.fullname || currentUser?.name || currentUser?.username || 'Guest');
    const myOrders = orders.filter(o => o.buyerName === currentBuyerName);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>📦 My Orders</h1>
            <div>
              <button className="btn" onClick={() => setCurrentPage('marketplace')}>← Back to Marketplace</button>
            </div>
          </div>

          {myOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="ordersList">
              <h3>Active Orders</h3>
              {(myOrders.filter(o => o.status !== 'completed')).length === 0 ? (
                <p>No active orders.</p>
              ) : (
                myOrders.filter(o => o.status !== 'completed').map(o => {
                  const product = products.find(p => p.id === o.productId) || {};
                  return (
                    <div key={o.id} className="productCard">
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="productImage"
                        data-seed={product.id}
                        onError={(e) => handleImgError(e)}
                      />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Status:</strong> <span className={`statusBadge ${o.status === 'processing' ? 'statusPending' : o.status === 'shipped' ? 'statusApproved' : ''}`}>{o.status.toUpperCase()}</span></p>
                          {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                          <p><strong>Payment:</strong> <span className={`statusBadge ${o.paymentStatus === 'paid' ? 'statusPaid' : 'statusPending'}`}>{(o.paymentStatus || 'pending').toUpperCase()}</span></p>
                          {o.paymentStatus !== 'paid' && (
                            <div style={{marginTop: '8px'}}>
                              <button className="btn btnPrimary" onClick={() => {
                                setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, paymentStatus: 'paid', paymentAt: new Date().toISOString() } : ord));
                                pushToast('Payment marked as paid (simulated).', 'success');
                              }}>
                                Pay Now
                              </button>
                            </div>
                          )}
                    </div>
                  );
                })
              )}

              <h3 style={{marginTop: '20px'}}>Past Orders</h3>
              {(myOrders.filter(o => o.status === 'completed')).length === 0 ? (
                <p>No past orders.</p>
              ) : (
                myOrders.filter(o => o.status === 'completed').map(o => {
                  const product = products.find(p => p.id === o.productId) || {};
                  return (
                    <div key={o.id} className="productCard">
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="productImage"
                        data-seed={product.id}
                        onError={(e) => handleImgError(e)}
                      />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Delivered:</strong> {o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : 'N/A'}</p>
                      <p><strong>Payment:</strong> <span className={`statusBadge ${o.paymentStatus === 'paid' ? 'statusPaid' : 'statusPending'}`}>{(o.paymentStatus || 'pending').toUpperCase()}</span></p>
                      <p><strong>Result:</strong> {o.deliveryResult ? o.deliveryResult.toUpperCase() : 'N/A'}</p>
                      {o.rating ? (
                        <p><strong>Your Rating:</strong> {o.rating} / 5</p>
                      ) : (
                        (o.deliveryResult === 'success' || o.status === 'delivered' || o.status === 'completed') && (
                          <div style={{marginTop: '10px'}}>
                            <label className="formLabel">Rate your delivery</label>
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px'}}>
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  className={`btn ${ratingDrafts[o.id] >= star ? 'btnPrimary' : ''}`}
                                  style={{padding: '6px 8px'}}
                                  onClick={() => setRatingDrafts(prev => ({ ...prev, [o.id]: star }))}
                                >
                                  {ratingDrafts[o.id] >= star ? '★' : '☆'}
                                </button>
                              ))}
                              <span style={{marginLeft: '8px'}}>{ratingDrafts[o.id] ? `${ratingDrafts[o.id]} / 5` : ''}</span>
                            </div>
                            <div style={{marginTop: '8px'}}>
                              <label className="formLabel">Write a short review (optional)</label>
                              <textarea
                                className="formInput"
                                rows={3}
                                value={reviewDrafts[o.id] || ''}
                                onChange={(e) => setReviewDrafts(prev => ({ ...prev, [o.id]: e.target.value }))}
                                placeholder="Share your experience..."
                              />
                            </div>
                            <div style={{marginTop: '8px'}}>
                              <button className="btn btnSuccess" onClick={() => {
                                const rating = ratingDrafts[o.id] || 0;
                                const reviewText = (reviewDrafts[o.id] || '').trim();
                                if (!rating || rating < 1 || rating > 5) { pushToast('Please select 1-5 stars', 'error'); return; }

                                setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, rating, review: reviewText } : ord));
                                setReviews(prev => {
                                  const copy = { ...prev };
                                  const list = copy[o.productId] ? [...copy[o.productId]] : [];
                                  const newRev = { id: `${o.productId}-u-${Date.now()}`, author: (currentUser?.fullname || currentUser?.name || currentUser?.username || 'Buyer'), text: reviewText, likes: 0 };
                                  copy[o.productId] = [newRev, ...list];
                                  return copy;
                                });
                                // clear drafts
                                setRatingDrafts(prev => { const c = { ...prev }; delete c[o.id]; return c; });
                                setReviewDrafts(prev => { const c = { ...prev }; delete c[o.id]; return c; });
                                pushToast('Thanks for your feedback!', 'success');
                              }}>Submit Review & Rating</button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'employee-auth') {
    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Employee Verification Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Employee ID</label>
            <input type="text" id="employee-id" placeholder="Enter your employee ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="employee-password" placeholder="Enter your password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('employee-id').value;
              if (id) {
                setCurrentUser({ id, role: 'employee' });
                setCurrentPage('employee-dashboard');
              } else {
                pushToast('Please enter employee ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'employee-dashboard') {
    const pendingProducts = products.filter(p => !p.verified);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Verification Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <h2>Pending Verifications</h2>
          {pendingProducts.length === 0 ? (
            <p>No products pending verification.</p>
          ) : (
            pendingProducts.map((p) => (
              <div key={p.id} className="productCard">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.name}
                  className="productImage"
                  data-seed={p.id}
                  onError={(e) => handleImgError(e)}
                />
                <h3>{p.name}</h3>
                <p><strong>Farmer:</strong> {p.farmer}</p>
                <p><strong>Quantity:</strong> {p.quantity} kg</p>
                <p><strong>Location:</strong> {p.location}</p>
                <button 
                  className="btn"
                  style={{marginRight: '10px'}}
                  onClick={() => {
                    setProducts(products.map(prod => 
                      prod.id === p.id ? { ...prod, verified: true, verificationStatus: true, status: 'verified' } : prod
                    ));
                    pushToast('Product verified successfully!', 'success');
                  }}
                >
                  ✓ Verify
                </button>
                <button 
                  className="btn btnDanger"
                  onClick={() => {
                    setProducts(products.map(prod => 
                      prod.id === p.id ? { ...prod, verified: true, verificationStatus: false, status: 'rejected' } : prod
                    ));
                    pushToast('Product rejected!', 'info');
                  }}
                >
                  ✗ Reject
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'quality-auth') {
    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Quality Assurance Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Team Member ID</label>
            <input type="text" id="quality-id" placeholder="Enter your team ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="quality-password" placeholder="Enter your password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('quality-id').value;
              if (id) {
                setCurrentUser({ id, role: 'quality' });
                setCurrentPage('quality-dashboard');
              } else {
                        pushToast('Please enter team member ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'quality-dashboard') {
    const verifiedProducts = products.filter(p => p.verified && p.verificationStatus && !p.quality);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Quality Assessment Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <div style={{background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
            <strong>Rating Scale:</strong> 0-2 (Poor) | 2.1-4 (Average) | 4.1-7 (Good) | 7.1-9 (Excellent) | 9.1-10 (Outstanding)
          </div>
          <h2>Products for Quality Rating</h2>
          {verifiedProducts.length === 0 ? (
            <p>No products pending quality assessment.</p>
          ) : (
            verifiedProducts.map((p) => (
              <div key={p.id} className="productCard">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.name}
                  className="productImage"
                  data-seed={p.id}
                  onError={(e) => handleImgError(e)}
                />
                <h3>{p.name}</h3>
                <p><strong>Farmer:</strong> {p.farmer}</p>
                <p><strong>Quantity:</strong> {p.quantity} kg</p>
                <div className="formGroup">
                  <label className="formLabel">Quality Rating (0-10)</label>
                  <input 
                    type="number" 
                    id={`rating-${p.id}`}
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="Enter rating"
                    className="formInput"
                  />
                </div>
                <button 
                  className="btn"
                  onClick={() => {
                    const rating = parseFloat(document.getElementById(`rating-${p.id}`).value);
                    if (rating >= 0 && rating <= 10) {
                      setProducts(products.map(prod => 
                        prod.id === p.id ? { ...prod, quality: rating, status: 'approved' } : prod
                      ));
                      pushToast('Quality rating submitted successfully!', 'success');
                    } else {
                      pushToast('Please enter a valid rating between 0 and 10', 'error');
                    }
                  }}
                >
                  Submit Rating
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Admin Auth
  if (currentPage === 'admin-auth') {
    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Admin Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Admin Username</label>
            <input type="text" id="admin-username" placeholder="Enter admin username" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="admin-password" placeholder="Enter password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const username = document.getElementById('admin-username').value;
              if (username) {
                setCurrentUser({ username, role: 'admin' });
                setCurrentPage('admin-dashboard');
              } else {
                pushToast('Please enter admin credentials', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentPage === 'admin-dashboard') {
    const pendingApproval = products.filter(p => p.status === 'approved' && !p.inMarketplace);
    const uniqueFarmers = new Set(products.map(p => p.farmer)).size;
    const pendingValueRequests = valueRequests.filter(r => r.status === 'pending');

    // compute sales summary (last 7 days)
    const paidOrders = orders.filter(o => (o.paymentStatus || '') === 'paid');
    const groupByDate = {};
    paidOrders.forEach(o => {
      const when = (o.paymentAt || o.orderDate || new Date().toISOString()).slice(0,10);
      groupByDate[when] = groupByDate[when] || { revenue: 0, orders: 0 };
      groupByDate[when].revenue += (o.total || 0);
      groupByDate[when].orders += 1;
    });
    const costRate = 0.7; // assume cost is 70% of revenue for a simple profit estimate
    const salesByDate = Object.keys(groupByDate).sort((a,b) => b.localeCompare(a)).slice(0,7).map(date => ({
      date,
      revenue: groupByDate[date].revenue,
      cost: +(groupByDate[date].revenue * costRate).toFixed(2),
      profit: +(groupByDate[date].revenue * (1 - costRate)).toFixed(2),
      orders: groupByDate[date].orders
    }));

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Admin Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <div className="dashboardGrid">
            <div className="card">
              <h3>Total Products</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#667eea'}}>{products.length}</p>
            </div>
            <div className="card">
              <h3>Pending Approval</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffa500'}}>{pendingApproval.length}</p>
            </div>
            <div className="card">
              <h3>Active Farmers</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#28a745'}}>{uniqueFarmers}</p>
            </div>
            <div className="card">
              <h3>Total Orders</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#764ba2'}}>{orders.length}</p>
            </div>
          </div>
          <div style={{marginTop: '20px'}}>
            <h3>Sales & Finance (recent days)</h3>
            {salesByDate.length === 0 ? (
              <p>No paid sales yet.</p>
            ) : (
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                {salesByDate.map(s => (
                  <div key={s.date} className="card" style={{minWidth: '180px'}}>
                    <h4>{s.date}</h4>
                    <p style={{margin: '6px 0'}}><strong>Revenue:</strong> ₹{s.revenue}</p>
                    <p style={{margin: '6px 0'}}><strong>Est. Cost:</strong> ₹{s.cost}</p>
                    <p style={{margin: '6px 0'}}><strong>Profit:</strong> ₹{s.profit}</p>
                    <p style={{margin: '6px 0', color: '#666'}}><small>{s.orders} orders</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h2 style={{marginTop: '30px'}}>Product Management</h2>
          <div style={{marginTop: 8, marginBottom: 12}}>
            <button className="btn" onClick={() => {
              if (!confirm('Randomize farmer names for local products? This will update product entries shown in the UI (keeps product 25 unchanged).')) return;
              randomizeLocalFarmers();
            }}>Randomize Local Farmers</button>
            <small style={{marginLeft: 12, color: '#666'}}>Use to generate demo farmer names for local products.</small>
          </div>
          {products.length === 0 ? (
            <p>No products in the system yet.</p>
          ) : (
            <div>
              <h3 style={{marginTop: '12px'}}>Pending Value-Addition Requests</h3>
              {pendingValueRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                pendingValueRequests.map(r => (
                  <div key={r.id} style={{background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <strong>{r.serviceName}</strong> — {r.input} → {r.output} ({r.increase})
                        <div style={{fontSize: '0.9rem', color: '#666'}}>Requested by: {r.farmerName} • {new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <button className="btn btnSuccess" onClick={() => {
                            setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status: 'approved', approvedAt: new Date().toISOString() } : v));
                            addNotification(r.farmerId, `Your request "${r.serviceName}" was approved.`, 'success');
                            pushToast('Request approved.', 'success');
                        }}>Approve</button>
                        <button className="btn btnDanger" onClick={() => {
                          setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status: 'rejected', rejectedAt: new Date().toISOString() } : v));
                          addNotification(r.farmerId, `Your request "${r.serviceName}" was rejected.`, 'info');
                          pushToast('Request rejected.', 'info');
                        }}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
          
              <h3 style={{marginTop: '18px'}}>Products</h3>
              <div className="adminGrid">
                {products.map((p) => (
                  <div key={p.id} className="productCard">
                    <img
                      src={p.image || 'https://via.placeholder.com/300x200'}
                      alt={p.name}
                      className="productImage"
                      data-seed={p.id}
                      onError={(e) => handleImgError(e)}
                    />
                    <h3>{p.name}</h3>
                    <p><strong>Farmer:</strong> {p.farmer}</p>
                    <p><strong>Quantity:</strong> {p.quantity} kg</p>
                    <p>
                      <strong>Price:</strong> ₹{p.price}/kg
                      {p.discountPercent ? (<span style={{color: '#dc3545', marginLeft: '8px'}}>({p.discountPercent}% off → ₹{(p.price * (1 - (p.discountPercent/100))).toFixed(2)}/kg)</span>) : null}
                    </p>
                    <p><strong>Status:</strong> <span className={`statusBadge ${p.status === 'approved' ? 'statusApproved' : p.status === 'verified' ? 'statusVerified' : 'statusPending'}`}>{p.status.toUpperCase()}</span></p>
                    <p><strong>Verified:</strong> {p.verified ? '✓ Yes' : '✗ No'}</p>
                    {p.quality ? (
                      <p><strong>Quality:</strong> {getQualityLabel(p.quality)} ({p.quality}/10)</p>
                    ) : (
                      <p><strong>Quality:</strong> Not rated yet</p>
                    )}
                    <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                      {p.status === 'approved' && !p.inMarketplace && (
                        <button 
                          className="btn btnSuccess"
                          style={{padding: '5px 10px', fontSize: '0.85rem'}}
                          onClick={() => {
                            setProducts(products.map(prod => prod.id === p.id ? { ...prod, inMarketplace: true } : prod));
                            pushToast('Product approved for marketplace!', 'success');
                          }}
                        >
                          ✓ Publish
                        </button>
                      )}
                      <button className="btn btnDanger" onClick={() => {
                        if (!confirm('Delete this product? This action cannot be undone.')) return;
                        setProducts(products.filter(prod => prod.id !== p.id));
                        pushToast('Product deleted.', 'info');
                      }}>Delete</button>
                      <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                        <input type="number" min={0} max={90} placeholder="% discount" defaultValue={p.discountPercent || ''} id={`disc-${p.id}`} className="formInput" style={{width: '80px'}} />
                        <button className="btn" onClick={() => {
                          const v = parseFloat(document.getElementById(`disc-${p.id}`).value || '0');
                          if (isNaN(v) || v < 0 || v > 90) { pushToast('Enter a valid discount percent (0-90)', 'error'); return; }
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, discountPercent: v, discountedPrice: +(prod.price * (1 - v/100)).toFixed(2) } : prod));
                          pushToast('Discount applied.', 'success');
                        }}>Apply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Delivery Auth
  if (currentPage === 'delivery-auth') {
    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Personnel Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Delivery Personnel ID</label>
            <input type="text" id="delivery-id" placeholder="Enter your ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="delivery-password" placeholder="Enter password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('delivery-id').value;
              if (id) {
                setCurrentUser({ id, role: 'delivery' });
                setCurrentPage('delivery-dashboard');
              } else {
                pushToast('Please enter delivery personnel ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Delivery Dashboard
  if (currentPage === 'delivery-dashboard') {
    // Normalize and compute active/past deliveries. When a delivery user is logged in, filter to their assignments.
    const normalize = (s) => (s || '').toLowerCase();
    const isActiveStatus = (s) => ['processing', 'shipped', 'shipping'].includes(normalize(s));
    const isPastStatus = (s) => ['delivered', 'completed'].includes(normalize(s));

    const isDeliveryPerson = currentUser && currentUser.role === 'delivery';
    const activeDeliveries = orders.filter(o => isActiveStatus(o.status) && (!isDeliveryPerson || o.deliveryPersonId === currentUser.id));
    const pastDeliveries = orders.filter(o => ((isPastStatus(o.status) || (o.deliveryResult && o.deliveryResult.toLowerCase() === 'success')) && (!isDeliveryPerson || o.deliveryPersonId === currentUser.id)));

    const activeCount = activeDeliveries.length;
    const pastCount = pastDeliveries.length;

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>

          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 6}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <strong>Deliveries</strong>
              <div style={{display: 'flex', gap: 8}}>
                <button className={`btn ${deliveryFilter === 'all' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('all')}>All ({activeCount + pastCount})</button>
                <button className={`btn ${deliveryFilter === 'active' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('active')}>Active ({activeCount})</button>
                <button className={`btn ${deliveryFilter === 'past' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('past')}>Past ({pastCount})</button>
              </div>
            </div>
            <div style={{color: '#666'}}>{isDeliveryPerson ? `Showing deliveries for ${currentUser.id}` : ''}</div>
          </div>

          {(deliveryFilter === 'all' || deliveryFilter === 'active') && (
            <>
              <h2 style={{marginTop: 16}}>Today's Deliveries</h2>
              {activeDeliveries.length === 0 ? (
                <p>No deliveries scheduled for today.</p>
              ) : (
                activeDeliveries.map(o => {
                  const product = products.find(p => p.id === o.productId) || { name: 'Unknown', location: 'N/A' };
                  return (
                    <div key={o.id} className="card" style={{borderLeft: '4px solid #28a745'}}>
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name} ({o.quantity} kg)</p>
                      <p><strong>Pickup:</strong> {product.location}</p>
                      <p><strong>Delivery:</strong> {o.address}</p>
                      <p><strong>Customer:</strong> {o.buyerName} ({o.contact})</p>
                      <p><strong>Status:</strong> <span className="statusBadge" style={{background: '#fff3cd', color: '#856404'}}>{(o.status || '').toUpperCase()}</span></p>
                      {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                      {o.status && o.status.toLowerCase() === 'shipped' && (
                        <button
                          className="btn btnSuccess"
                          style={{padding: '5px 10px', fontSize: '0.85rem', marginTop: '10px'}}
                          onClick={() => {
                            setOrders(prev => prev.map(order => order.id === o.id ? { ...order, status: 'delivered', deliveredAt: new Date().toISOString(), deliveryResult: 'success' } : order));
                            pushToast('Order marked as delivered!', 'success');
                          }}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {(deliveryFilter === 'all' || deliveryFilter === 'past') && (
            <>
              <h2 style={{marginTop: 20}}>Past Deliveries</h2>
              {pastDeliveries.length === 0 ? (
                <p>No past deliveries.</p>
              ) : (
                pastDeliveries.map(o => {
                  const product = products.find(p => p.id === o.productId) || { name: 'Unknown', location: 'N/A' };
                  return (
                    <div key={o.id} className="card" style={{borderLeft: '4px solid #6c757d'}}>
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name} ({o.quantity} kg)</p>
                      <p><strong>Pickup:</strong> {product.location}</p>
                      <p><strong>Delivery:</strong> {o.address}</p>
                      <p><strong>Customer:</strong> {o.buyerName} ({o.contact})</p>
                      <p><strong>Status:</strong> <span className="statusBadge" style={{background: '#e9ecef', color: '#495057'}}>{(o.status || '').toUpperCase()}</span></p>
                      {o.deliveredAt && <p><strong>Delivered At:</strong> {new Date(o.deliveredAt).toLocaleString()}</p>}
                      <p><strong>Result:</strong> {o.deliveryResult ? o.deliveryResult.toUpperCase() : 'N/A'}</p>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default AgriValueMarketplace;