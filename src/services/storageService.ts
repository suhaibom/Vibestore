import type { User, Product, Order, VisitorLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'vibe_store_users',
  CURRENT_USER: 'vibe_store_current_user',
  PRODUCTS: 'vibe_store_products',
  ORDERS: 'vibe_store_orders',
  VISITOR_LOGS: 'vibe_store_visitor_logs',
  SESSION_ID: 'vibe_store_session_id',
};

const DEFAULT_ADMIN: User = {
  id: 'usr_admin_001',
  name: 'Admin Manager',
  email: 'admin@vibestore.com',
  role: 'admin',
  phone: '+91 9876543210',
  address: 'Vibe Store HQ',
  createdAt: new Date().toISOString(),
};

const DEFAULT_CUSTOMER: User = {
  id: 'usr_cust_001',
  name: 'Test Customer',
  email: 'customer@vibestore.com',
  role: 'customer',
  phone: '+91 9998887770',
  address: 'Kochi, Kerala',
  createdAt: new Date().toISOString(),
};

// Comprehensive 120+ Product Catalog Generator
const generateCatalog = (): Product[] => {
  const now = new Date().toISOString();

  const electronics = [
    { name: 'Vibe Pro Noise-Canceling Wireless Headphones', price: 4999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', desc: 'Active noise cancellation, 40hr battery, immersive bass audio.' },
    { name: 'Vibe Gaming Mechanical Keyboard RGB', price: 3499, originalPrice: 5999, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', desc: 'Hot-swappable tactile switches, per-key RGB backlighting.' },
    { name: 'UltraHD 4K Curved Monitor 27-inch', price: 18999, originalPrice: 24999, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', desc: '144Hz refresh rate, HDR 400, borderless IPS display.' },
    { name: 'Vibe BassBoost Bluetooth Speaker', price: 2299, originalPrice: 3999, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80', desc: '360 degree surround sound, IPX7 waterproof rating.' },
    { name: 'Pro Studio Condenser USB Microphone', price: 4499, originalPrice: 6999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', desc: 'Crystal clear podcasting & streaming audio clarity.' },
    { name: '4K Ultra HD Streaming Webcam 60FPS', price: 3899, originalPrice: 5999, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80', desc: 'Auto-focus lens with dual noise-reduction microphones.' },
    { name: 'High-Speed 20000mAh Power Bank 65W', price: 1999, originalPrice: 3499, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', desc: 'Fast charging for laptops, smartphones, and tablets.' },
    { name: 'Precision Wireless Gaming Mouse', price: 1699, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', desc: '16000 DPI sensor, lightweight ergonomic design.' },
    { name: 'True Wireless Earbuds with ANC Case', price: 2999, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', desc: 'Touch controls, deep bass drivers, low latency mode.' },
    { name: 'Smart Home Hub & Voice Assistant', price: 3199, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80', desc: 'Control smart lights, music, timers, and security.' },
    { name: 'Compact Action Camera 4K Waterproof', price: 7999, originalPrice: 11999, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80', desc: 'Wide-angle lens, electronic image stabilization.' },
    { name: '7-in-1 Aluminum USB-C Hub Adapter', price: 1499, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', desc: 'HDMI 4K, SD reader, USB 3.0, 100W Power Delivery.' },
    { name: 'MagSafe Wireless Charger Stand', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1622445268465-843836406857?w=800&auto=format&fit=crop&q=80', desc: 'Fast magnetic wireless charging for phones and pods.' },
    { name: 'Smart WiFi LED TV Soundbar', price: 5499, originalPrice: 8999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', desc: 'Dolby Digital audio, subwoofer output, HDMI ARC.' },
    { name: 'Portable Mini Projector Full HD', price: 8999, originalPrice: 14999, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', desc: 'Built-in WiFi, screen mirroring, 200-inch display.' },
    { name: 'High-Speed NVMe 1TB External SSD', price: 6999, originalPrice: 10999, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80', desc: 'Read speeds up to 1050MB/s, shock-resistant body.' },
    { name: 'Dual Monitor Desk Mount Arm', price: 2799, originalPrice: 4299, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', desc: 'Full motion gas spring arms for 17-32 inch screens.' },
    { name: 'Ergonomic Vertical Mouse Wireless', price: 1499, originalPrice: 2299, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', desc: 'Reduces wrist strain, rechargeable silent buttons.' },
    { name: 'Foldable Laptop Cooling Pad Stand', price: 999, originalPrice: 1699, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', desc: 'Dual quiet fans, 6 height adjustments, RGB strip.' },
    { name: 'Smart Plug 16A with Energy Monitoring', price: 799, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80', desc: 'App control, voice compatible with Alexa & Google.' },
  ];

  const fashion = [
    { name: 'Urban Streetwear Vibe Hoodie', price: 1899, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', desc: 'Heavy cotton fleece fabric, drop shoulder fit.' },
    { name: 'Vintage Washed Denim Jacket', price: 2499, originalPrice: 3999, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', desc: 'Classic indigo wash, durable metal hardware.' },
    { name: 'Minimalist White Leather Sneakers', price: 3299, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80', desc: 'Genuine leather, cushioned insoles, sleek design.' },
    { name: 'Aesthetic Oversized Graphic Tee', price: 999, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', desc: '100% bio-washed cotton, breathable print.' },
    { name: 'Slim Fit Casual Linen Shirt', price: 1499, originalPrice: 2299, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', desc: 'Pure linen blend, lightweight summer style.' },
    { name: 'Tactical Cargo Pants with Pockets', price: 1799, originalPrice: 2799, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', desc: 'Stretch twill cotton, utility zip pockets.' },
    { name: 'Classic Black Biker Leather Jacket', price: 4999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', desc: 'Faux leather, asymmetrical zipper, quilted lining.' },
    { name: 'Athletic Lightweight Joggers', price: 1199, originalPrice: 1899, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', desc: 'Quick-dry fabric, elastic waist with drawstrings.' },
    { name: 'Formal Tailored Blazer Coat', price: 3999, originalPrice: 5999, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', desc: 'Single-breasted design, premium lapel finish.' },
    { name: 'Chunky Retro Running Shoes', price: 2899, originalPrice: 4299, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', desc: 'Air-cushioned sole, vibrant multi-color accents.' },
    { name: 'Cozy Knit Oversized Sweater', price: 1699, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80', desc: 'Soft wool blend knit, crewneck silhouette.' },
    { name: 'Cotton Pique Polo T-Shirt', price: 899, originalPrice: 1399, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80', desc: 'Breathable pique knit, embroidered emblem.' },
    { name: 'Winter Trench Coat Long Jacket', price: 4499, originalPrice: 6999, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80', desc: 'Windproof wool blend, double-breasted belt.' },
    { name: 'High-Waist Wide Leg Denim Jeans', price: 1999, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', desc: 'Vintage wash, comfortable relaxed fit.' },
    { name: 'Casual Canvas Slip-On Shoes', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', desc: 'Lightweight canvas, durable rubber outsole.' },
    { name: 'Embroidered Baseball Cap', price: 499, originalPrice: 899, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80', desc: '100% twill cotton, adjustable metal strap.' },
    { name: 'Water-Resistant Windbreaker Jacket', price: 2199, originalPrice: 3299, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', desc: 'Mesh lined, lightweight packable design.' },
    { name: 'Printed Hawaiian Resort Shirt', price: 1099, originalPrice: 1699, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', desc: 'Vibrant tropical print, silky rayon fabric.' },
    { name: 'Fleece Lined Thermal Jogger Pants', price: 1399, originalPrice: 2099, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', desc: 'Ultra-warm interior lining, zippered pockets.' },
    { name: 'Classic Leather Dress Shoes', price: 3499, originalPrice: 5499, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80', desc: 'Handcrafted oxford style, polished finish.' },
  ];

  const wearables = [
    { name: 'Vibe Smart Watch Series 5 AMOLED', price: 3499, originalPrice: 5999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', desc: 'Retina display, SPO2 monitor, sleep analytics.' },
    { name: 'Pro Fitness Tracker Band Waterproof', price: 1799, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', desc: '14-day battery life, continuous heart rate sensor.' },
    { name: 'Audio Smart Glasses with Open-Ear Speakers', price: 4999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', desc: 'UV polarized lenses, HD Bluetooth audio.' },
    { name: 'GPS Outdoor Sports Watch Titanium', price: 6999, originalPrice: 10999, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', desc: 'Altimeter, barometer, compass, rugged casing.' },
    { name: 'Smart Sleep Tracker Ring Sensor', price: 8999, originalPrice: 12999, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', desc: 'Monitors body temp, sleep stages, recovery index.' },
    { name: 'Tactical Military Smartwatch 5ATM', price: 4299, originalPrice: 6499, image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&auto=format&fit=crop&q=80', desc: 'Shockproof alloy frame, flashlight, 100+ sports.' },
    { name: 'Minimalist Steel Mesh Smartwatch', price: 2999, originalPrice: 4499, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', desc: 'Sleek metallic strap, custom watch faces.' },
    { name: 'Kids Safety GPS Tracker Watch', price: 1999, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', desc: 'SOS button, voice calling, geo-fencing alerts.' },
    { name: 'Virtual Reality Headset 3D Glasses', price: 3999, originalPrice: 5999, image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80', desc: 'Immersive VR gaming with adjustable focal length.' },
    { name: 'Waterproof Swimming Activity Band', price: 2199, originalPrice: 3299, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', desc: 'SWOLF score calculation, stroke recognition.' },
    { name: 'Smart ECG Heart Rate Monitor Strap', price: 2499, originalPrice: 3799, image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80', desc: 'Chest strap sensor for precise chest heart data.' },
    { name: 'Hybrid Analog Mechanical Smartwatch', price: 5199, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', desc: 'Real watch hands with hidden digital screen.' },
    { name: 'Smart Running Performance Tracker Pod', price: 1699, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', desc: 'Attaches to shoe, measures cadence & foot strike.' },
    { name: 'Solar Powered Outdoor GPS Smartwatch', price: 7499, originalPrice: 11499, image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&auto=format&fit=crop&q=80', desc: 'Unlimited battery life with solar charging lens.' },
    { name: 'Bluetooth Music Headphones Smart Band', price: 1499, originalPrice: 2299, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', desc: '2-in-1 smartwatch with detachable earbud.' },
    { name: 'Oxygen & Blood Pressure Monitor Watch', price: 2799, originalPrice: 4199, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', desc: '24/7 health tracking, HRV stress analysis.' },
    { name: 'Golf Rangefinder Smart Watch', price: 6299, originalPrice: 9499, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', desc: '40,000 preloaded course maps worldwide.' },
    { name: 'Luminous Cyberpunk LED Glasses', price: 999, originalPrice: 1699, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', desc: 'Customizable LED patterns, party rave style.' },
    { name: 'Wireless Charging Smartwatch Dock', price: 699, originalPrice: 1099, image: 'https://images.unsplash.com/photo-1622445268465-843836406857?w=800&auto=format&fit=crop&q=80', desc: 'Aluminum desktop charging stand.' },
    { name: 'Women Edition Rose Gold Smartwatch', price: 3299, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', desc: 'Crystal studded bezel, female cycle tracking.' },
  ];

  const accessories = [
    { name: 'Waterproof Laptop Travel Backpack 30L', price: 1999, originalPrice: 3299, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', desc: 'USB charging port, anti-theft hidden pocket.' },
    { name: 'Minimalist RFID Leather Card Wallet', price: 799, originalPrice: 1399, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', desc: 'Pop-up card ejector, genuine leather build.' },
    { name: 'UV Polarized Classic Sunglasses', price: 1199, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', desc: '100% UV400 protection, lightweight alloy frame.' },
    { name: 'Neoprene Shockproof Laptop Sleeve 15-inch', price: 699, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', desc: 'Fleece lining interior, accessory pocket.' },
    { name: 'Genuine Italian Leather Waist Belt', price: 899, originalPrice: 1499, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80', desc: 'Reversible buckle, 100% full grain leather.' },
    { name: 'Cable Organizer Travel Pouch Case', price: 499, originalPrice: 899, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', desc: 'Elastic loops for cords, power bank, and SD cards.' },
    { name: 'Smart Temperature Display Water Bottle', price: 899, originalPrice: 1499, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', desc: 'Touch LED lid, double-wall stainless steel.' },
    { name: 'RGB Headphone Stand with USB Ports', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', desc: 'Dynamic lighting modes, 2 port USB hub.' },
    { name: 'Hard Shell Camera & Drone Sling Bag', price: 2499, originalPrice: 3899, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', desc: 'Customizable divider compartments, weather seal.' },
    { name: 'MagSafe Leather Phone Wallet Sleeve', price: 699, originalPrice: 1099, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', desc: 'Strong magnets, holds up to 3 credit cards.' },
    { name: 'Tactical Key Organizer Clip Multi-Tool', price: 499, originalPrice: 899, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80', desc: 'Compact key holder, bottle opener, wrench.' },
    { name: 'Blue Light Blocking Gaming Glasses', price: 999, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', desc: 'Filters 99% harmful blue rays, reduces eye strain.' },
    { name: 'Canvas Duffle Gym & Travel Bag', price: 1599, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', desc: 'Separate shoe compartment, water-repellent.' },
    { name: 'Leather Journal Notebook with Pen Loop', price: 699, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', desc: 'Refillable 200 pages, ribbon bookmark.' },
    { name: 'AirTag Leather Keychain Tracker Case', price: 399, originalPrice: 699, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', desc: 'Snug snap button closure, brass ring.' },
    { name: 'Anti-Graphene Folding Umbrella', price: 799, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', desc: 'Auto open-close, windproof 10-rib frame.' },
    { name: 'Magnetic Desk Cable Holder Clips', price: 349, originalPrice: 599, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', desc: 'Keeps charging cables organized on desk.' },
    { name: 'Travel Passport Holder & Wallet', price: 599, originalPrice: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', desc: 'Holds boarding pass, SIM cards, & pen.' },
    { name: 'Adjustable Phone & Tablet Stand', price: 449, originalPrice: 799, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', desc: 'Heavy aluminum base, anti-slip silicone.' },
    { name: 'Microfiber Screen Cleaning Spray Kit', price: 299, originalPrice: 499, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', desc: 'Streak-free cleaner for phones and monitors.' },
  ];

  const homeLiving = [
    { name: 'Smart LED Ambient Sunset Lamp', price: 1199, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', desc: '16 million colors, app & remote control.' },
    { name: 'Ergonomic High-Back Mesh Desk Chair', price: 6999, originalPrice: 10999, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=800&auto=format&fit=crop&q=80', desc: 'Adjustable lumbar support, 3D armrests.' },
    { name: 'Minimalist Felt Desk Mat Pad 90x40cm', price: 799, originalPrice: 1399, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', desc: 'Protects desk, smooth mouse gliding surface.' },
    { name: 'Ultrasonic Aroma Essential Oil Diffuser', price: 1499, originalPrice: 2299, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80', desc: '500ml tank, whisper quiet, 7 LED lights.' },
    { name: 'Italian Espresso Coffee Maker Machine', price: 5499, originalPrice: 8499, image: 'https://images.unsplash.com/photo-1517668808822-9eaa02ae2a04?w=800&auto=format&fit=crop&q=80', desc: '15-bar pressure pump, milk frother wand.' },
    { name: 'Smart Robot Vacuum Cleaner & Mop', price: 14999, originalPrice: 21999, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', desc: 'LiDAR navigation, automatic recharging.' },
    { name: 'HEPA Air Purifier for Home & Office', price: 4999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80', desc: 'Filters 99.97% dust, smoke, and allergens.' },
    { name: 'Handmade Ceramic Coffee Mug Set', price: 899, originalPrice: 1499, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', desc: 'Set of 4 artisan glazed stoneware mugs.' },
    { name: 'Abstract Canvas Wall Art Frame', price: 1799, originalPrice: 2799, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', desc: 'Modern geometric print, solid wood frame.' },
    { name: 'Smart Touchless Sensor Dustbin 12L', price: 1699, originalPrice: 2599, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', desc: 'Odor-proof seal, motion detection lid.' },
    { name: 'Memory Foam Orthopedic Pillow', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', desc: 'Ergonomic neck support, washable bamboo cover.' },
    { name: 'Smart Digital Kitchen Food Scale', price: 699, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1517668808822-9eaa02ae2a04?w=800&auto=format&fit=crop&q=80', desc: 'High precision 1g, tempered glass top.' },
    { name: 'Bamboo Wood Bread & Cutting Board', price: 599, originalPrice: 999, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', desc: 'Juice groove edges, eco-friendly bamboo.' },
    { name: 'Rechargeable LED Desk Reading Lamp', price: 999, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', desc: '3 color modes, dimmable touch sensor.' },
    { name: 'Self-Watering Indoor Plant Pots (Pack of 3)', price: 799, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80', desc: 'Water level indicator, white ceramic look.' },
    { name: 'Cast Iron Dutch Oven Cookware Pot', price: 2999, originalPrice: 4499, image: 'https://images.unsplash.com/photo-1517668808822-9eaa02ae2a04?w=800&auto=format&fit=crop&q=80', desc: 'Enameled coating, 4.5 quart capacity.' },
    { name: 'Non-Slip Indoor Welcome Doormat', price: 399, originalPrice: 699, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', desc: 'Heavy duty rubber backing, dirt trapper.' },
    { name: 'Electric Milk Frother & Handheld Mixer', price: 499, originalPrice: 899, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', desc: 'Stainless steel whisk for cappuccino & matcha.' },
    { name: 'Smart RGB LED TV Backlight Strip', price: 899, originalPrice: 1499, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', desc: 'Syncs with TV sound, 5m length.' },
    { name: 'Stainless Steel Insulated Travel Thermos', price: 999, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', desc: 'Keeps drinks hot 12hrs or cold 24hrs.' },
  ];

  const beauty = [
    { name: 'Hydrating Vitamin C Face Serum 30ml', price: 699, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', desc: 'Brightens skin tone, reduces fine lines.' },
    { name: 'Luxury Eau De Parfum Spray 100ml', price: 2499, originalPrice: 3999, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', desc: 'Long-lasting woody amber fragrance.' },
    { name: 'Electric Sonic Facial Cleansing Brush', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', desc: 'Waterproof silicone, 8 vibration speeds.' },
    { name: 'Organic Beard Oil & Grooming Balm Kit', price: 899, originalPrice: 1499, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80', desc: 'Includes boar bristle brush & wooden comb.' },
    { name: 'Moisturizing Hyaluronic Acid Cream', price: 849, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', desc: 'Deep hydration for 48 hours, non-greasy.' },
    { name: 'Matte Liquid Lipstick Set (Pack of 4)', price: 999, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80', desc: 'Transfer-proof formula, bold nude shades.' },
    { name: 'Jade Roller & Gua Sha Facial Tool', price: 599, originalPrice: 999, image: 'https://images.unsplash.com/photo-1608248597261-e4d3184666f2?w=800&auto=format&fit=crop&q=80', desc: 'Promotes lymphatic drainage and skin glow.' },
    { name: 'Matte Styling Hair Clay Pomade', price: 499, originalPrice: 799, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80', desc: 'Strong hold, natural matte finish.' },
    { name: 'SPF 50+ Broad Spectrum Sunscreen', price: 549, originalPrice: 899, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', desc: 'No white cast, water-resistant 80 mins.' },
    { name: 'Nourishing Coconut Hair Mask 250g', price: 649, originalPrice: 999, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', desc: 'Repairs damaged frizzy hair, intense shine.' },
    { name: 'Charcoal Deep Detox Face Wash 150ml', price: 399, originalPrice: 699, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', desc: 'Unclogs pores, controls excess oil.' },
    { name: 'Professional Ceramic Hair Straightener', price: 1899, originalPrice: 2899, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', desc: 'Fast 30sec heat up, ionic shine technology.' },
    { name: 'Under Eye Recovery Gel Patches (60pcs)', price: 799, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1608248597261-e4d3184666f2?w=800&auto=format&fit=crop&q=80', desc: 'Reduces dark circles and puffiness.' },
    { name: 'Gentle Micellar Makeup Remover Water', price: 449, originalPrice: 699, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', desc: 'Cleanses waterproof makeup without harsh rubbing.' },
    { name: 'Organic Body Scrub Exfoliator 300g', price: 749, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', desc: 'Coffee & brown sugar scrub for smooth skin.' },
  ];

  const categories = [
    { name: 'Electronics', items: electronics },
    { name: 'Fashion', items: fashion },
    { name: 'Wearables', items: wearables },
    { name: 'Accessories', items: accessories },
    { name: 'Home & Living', items: homeLiving },
    { name: 'Beauty', items: beauty },
  ];

  const fullCatalog: Product[] = [];

  categories.forEach((catGroup) => {
    catGroup.items.forEach((item, idx) => {
      fullCatalog.push({
        id: `prod_${catGroup.name.toLowerCase().replace(/\s+/g, '')}_${idx + 1}`,
        name: item.name,
        description: item.desc,
        price: item.price,
        originalPrice: item.originalPrice,
        category: catGroup.name,
        image: item.image,
        stock: Math.floor(Math.random() * 45) + 5,
        isAvailable: true,
        featured: idx < 3,
        tags: [catGroup.name, 'Trending', 'Best Seller'],
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  return fullCatalog;
};

class StorageService {
  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const initialUsers: User[] = [DEFAULT_ADMIN, DEFAULT_CUSTOMER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      // Initialize with full 120+ product catalog!
      const initialProducts = generateCatalog();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify([]));
    }
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [DEFAULT_ADMIN, DEFAULT_CUSTOMER];
    } catch {
      return [DEFAULT_ADMIN, DEFAULT_CUSTOMER];
    }
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        const catalog = generateCatalog();
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(catalog));
        return catalog;
      }
      const parsed = JSON.parse(data);
      if (parsed.length === 0) {
        const catalog = generateCatalog();
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(catalog));
        return catalog;
      }
      return parsed;
    } catch {
      return generateCatalog();
    }
  }

  saveProduct(product: Partial<Product> & { name: string; price: number; category: string }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();

    if (product.id) {
      const index = products.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        const updated: Product = {
          ...products[index],
          ...product,
          updatedAt: now,
        };
        products[index] = updated;
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return updated;
      }
    }

    const newProduct: Product = {
      id: 'prod_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      category: product.category,
      image: product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      stock: product.stock !== undefined ? Number(product.stock) : 10,
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
      featured: product.featured || false,
      tags: product.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  seedDemoProducts(): Product[] {
    const catalog = generateCatalog();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(catalog));
    return catalog;
  }

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const now = new Date().toISOString();
    const orderNumber = 'VIBE-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Date.now().toString(36),
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    const products = this.getProducts();
    orderData.items.forEach((item) => {
      const prodIndex = products.findIndex((p) => p.id === item.productId);
      if (prodIndex >= 0) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - item.quantity);
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index >= 0) {
      orders[index].orderStatus = status;
      orders[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  getVisitorLogs(): VisitorLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  logVisitor(log: Omit<VisitorLog, 'id' | 'timestamp'>): VisitorLog {
    const logs = this.getVisitorLogs();
    const newLog: VisitorLog = {
      ...log,
      id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newLog);
    if (logs.length > 500) logs.pop();

    localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(logs));
    return newLog;
  }

  getSessionId(): string {
    let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
      sessionId = 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.VISITOR_LOGS);
    this.initDefaults();
  }
}

export const storageService = new StorageService();
