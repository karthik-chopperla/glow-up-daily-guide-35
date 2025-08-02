
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Search, ShoppingCart, Star, MapPin, RotateCw, Image } from "lucide-react";
import FabSOS from "@/components/ui/FabSOS";

type Location = { lat: number; lng: number };
type Cuisine = "Indian" | "South Indian" | "North Indian" | "Chinese" | "Italian" | "Healthy" | "Desserts";
type Dish = {
  id: string;
  name: string;
  veg: boolean;
  cuisine: Cuisine[];
  price: number;
  image: string;
  rating: number;
  prepTime: number; // mins
};
type Restaurant = {
  id: string;
  name: string;
  address: string;
  isCloud: boolean;
  distance: number; // km
  rating: number;
  cuisine: Cuisine[];
  deliveryTime: number; // mins
  dishes: Dish[];
};

type CartItem = {
  dish: Dish;
  restaurant: Restaurant;
  qty: number;
};

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r1", name: "Green Leaf Bistro", address: "Koramangala", isCloud: false,
    distance: 1.2, rating: 4.4, cuisine: ["Healthy", "Indian"], deliveryTime: 22,
    dishes: [
      { id: "d1", name: "Upma", veg: true, cuisine: ["South Indian"], price: 55, image: "/upma.jpg", rating: 4.3, prepTime: 15 },
      { id: "d2", name: "Veg Poha", veg: true, cuisine: ["Healthy", "Indian"], price: 70, image: "/poha.jpg", rating: 4.0, prepTime: 17 },
    ]
  },
  {
    id: "r2", name: "FitKitchen Cloud", address: "HSR", isCloud: true,
    distance: 2.7, rating: 4.6, cuisine: ["Healthy"], deliveryTime: 31,
    dishes: [
      { id: "d3", name: "Grilled Paneer Wrap", veg: true, cuisine: ["Healthy", "Indian"], price: 120, image: "/wrap.jpg", rating: 4.7, prepTime: 22 },
      { id: "d4", name: "Chicken Salad Bowl", veg: false, cuisine: ["Healthy"], price: 140, image: "/chickensalad.jpg", rating: 4.2, prepTime: 25 },
    ]
  },
  // ...add more outlets as needed for mock data
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  // Returns km, rough haversine
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const fallbackLatLng = { lat: 19.07, lng: 72.88 };

type CheckoutState = "listing" | "cart" | "form" | "success" | "past";

const FindFood = () => {
  // state
  const [loc, setLoc] = useState<Location | null>(null);
  const [needPin, setNeedPin] = useState(false);
  const [pincode, setPincode] = useState("");
  const [search, setSearch] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    rating: "",
    veg: "",
    cuisine: "",
    price: "",
  });
  const [sort, setSort] = useState("match");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("hm_ff_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [screen, setScreen] = useState<CheckoutState>("listing");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null as null | { total: number; items: CartItem[] });
  const [pastOrders, setPastOrders] = useState<CartItem[][]>(() => {
    const o = localStorage.getItem("hm_ff_orders");
    return o ? JSON.parse(o) : [];
  });
  // get GPS
  useEffect(() => {
    if (!loc) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setNeedPin(true)
        );
      } else {
        setNeedPin(true);
      }
    }
  }, [loc]);
  useEffect(() => {
    localStorage.setItem("hm_ff_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("hm_ff_orders", JSON.stringify(pastOrders));
  }, [pastOrders]);

  // filter/search logic
  let visibleOutlets = MOCK_RESTAURANTS.map(r => ({
    ...r,
    distance: loc
      ? getDistance(loc.lat, loc.lng, fallbackLatLng.lat, fallbackLatLng.lng) + (Math.random() * 2)
      : 1 + Math.random() * 6,
  }));
  // rating/cuisine/veg filter
  if (filters.rating) visibleOutlets = visibleOutlets.filter(r => r.rating >= parseFloat(filters.rating));
  if (filters.cuisine) visibleOutlets = visibleOutlets.filter(r => r.cuisine.includes(filters.cuisine as Cuisine));
  if (filters.veg) visibleOutlets = visibleOutlets.filter(r => r.dishes.some(d => d.veg === (filters.veg === "veg")));
  if (filters.price) visibleOutlets = visibleOutlets.filter(r => r.dishes.some(d => d.price <= parseInt(filters.price)));
  // search by dish text or AI photo mock (photo: search "upma" if photo uploaded, etc.)
  let keyword = search.trim().toLowerCase();
  if (photo) keyword = "upma"; // (pretend image is detected as 'upma')
  let showDishResults: { restaurant: Restaurant; dish: Dish }[] = [];
  visibleOutlets.forEach(r =>
    r.dishes.forEach(d =>
      (!keyword || d.name.toLowerCase().includes(keyword)) &&
      (!filters.veg || d.veg === (filters.veg === "veg")) &&
      showDishResults.push({ restaurant: r, dish: d })
    )
  );
  // sorting
  showDishResults = showDishResults.sort((a, b) => {
    if (sort === "price") return a.dish.price - b.dish.price;
    if (sort === "time") return a.restaurant.deliveryTime - b.restaurant.deliveryTime;
    if (sort === "rating") return b.dish.rating - a.dish.rating;
    return a.restaurant.distance - b.restaurant.distance;
  });

  // cart ops
  const addToCart = (item: { restaurant: Restaurant; dish: Dish }) => {
    setCart(prev => {
      const idx = prev.findIndex(
        ci => ci.dish.id === item.dish.id && ci.restaurant.id === item.restaurant.id
      );
      if (idx > -1) {
        const cpy = [...prev];
        cpy[idx].qty += 1;
        return cpy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeFromCart = (item: CartItem) => {
    setCart(prev => prev.filter(ci => !(ci.dish.id === item.dish.id && ci.restaurant.id === item.restaurant.id)));
  };

  const total = cart.reduce((sum, ci) => sum + ci.dish.price * ci.qty, 0);

  // checkout flow
  const handleOrder = () => {
    setOrderSuccess({ total, items: cart });
    setPastOrders(p => [cart, ...p]);
    setCart([]);
    setScreen("success");
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 pb-24 relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white pb-2 pt-4 px-4 flex items-center justify-between shadow-sm border-b mb-3">
        <div className="flex items-center gap-2"><MapPin className="text-green-700" /><span className="font-semibold text-green-700">Find Food</span></div>
        <div>
          <button onClick={() => setScreen("cart")} className="relative">
            <ShoppingCart className="text-emerald-600" />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">{cart.length}</span>}
          </button>
        </div>
      </div>

      {/* GPS/pincode */}
      {needPin && (
        <div className="px-4 pb-2">
          <div className="mb-2 text-sm font-medium text-red-700 flex items-center gap-2">
            <MapPin className="mr-1" size={17} /> Location permission denied. Enter your pincode:
          </div>
          <Input placeholder="Enter pincode" value={pincode} onChange={e => setPincode(e.target.value)} className="mb-2" />
          <Button onClick={() => setLoc(fallbackLatLng)} size="sm">Set Location</Button>
        </div>
      )}

      {/* Search bar + upload */}
      {screen === "listing" && (
        <div className="flex flex-row items-center px-4 gap-2 mb-2">
          <div className="flex-1 flex items-center bg-white rounded-xl shadow px-2">
            <Search className="text-gray-400 mr-1" size={20} />
            <Input
              placeholder="Search dish (e.g. Upma)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 shadow-none outline-none"
              style={{ boxShadow: "none" }}
            />
            <input type="file" accept="image/*" className="hidden" id="foodpic" onChange={e => setPhoto(e.target.files?.[0] || null)} />
            <label htmlFor="foodpic" className="cursor-pointer flex items-center px-1 py-1 rounded hover:bg-gray-100 ml-2">
              <Image size={21} className="text-orange-400" />
            </label>
          </div>
        </div>
      )}

      {/* Filters + Sort */}
      {screen === "listing" && (
        <div className="flex items-center gap-2 px-4 mb-3 flex-wrap">
          <select className="rounded px-2 py-1 border text-sm" value={filters.cuisine} onChange={e => setFilters(f => ({ ...f, cuisine: e.target.value }))}>
            <option value="">All Cuisine</option>
            <option>Indian</option><option>South Indian</option><option>North Indian</option>
            <option>Healthy</option><option>Chinese</option><option>Italian</option><option>Desserts</option>
          </select>
          <select className="rounded px-2 py-1 border text-sm" value={filters.rating} onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}><option value="">Any Rating</option>
            {[5,4.5,4,3.5,3].map(v => <option key={v} value={v}>{v}★+</option>)}</select>
          <select className="rounded px-2 py-1 border text-sm" value={filters.veg} onChange={e => setFilters(f => ({ ...f, veg: e.target.value }))}><option value="">Veg/Non-Veg</option>
            <option value="veg">Veg</option><option value="nonveg">Non-Veg</option></select>
          <select className="rounded px-2 py-1 border text-sm" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="match">Best Match</option>
            <option value="price">Low Price</option>
            <option value="time">Delivery Time</option>
            <option value="rating">Top Rated</option>
          </select>
          <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setScreen("past")}>
            <RotateCw size={16} className="mr-1" />Past Orders
          </Button>
        </div>
      )}

      {/* Main: Dish Cards */}
      {screen === "listing" && (
        <div className="px-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
          {showDishResults.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">No dishes found nearby.</div>}
          {showDishResults.map(({ restaurant, dish }, i) => (
            <div key={dish.id + restaurant.id} className="relative bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 items-start border-l-4" style={{ borderColor: dish.veg ? "#2ecc40" : "#ed3e54" }}>
              <div className="flex items-center gap-2 mb-1">
                <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-lg object-cover bg-gray-50 border" />
                <div>
                  <div className="font-semibold text-base text-gray-700">{dish.name}</div>
                  <div className="text-xs text-gray-400">{restaurant.name} • {restaurant.distance.toFixed(1)} km</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-yellow-600 text-base font-semibold">
                  <Star size={15} className="inline-block" />{dish.rating}
                </div>
                <span className="text-gray-600 font-semibold text-lg">₹{dish.price}</span>
                <span className="text-sm text-gray-400"><MapPin size={13} className="inline-block" /> {restaurant.deliveryTime} min</span>
                <Button size="sm" className="ml-auto" onClick={() => addToCart({ dish, restaurant })}>Order Now</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {screen === "cart" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setScreen("listing")}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
            >✕</button>
            <h2 className="text-lg font-bold mb-3">Your Cart</h2>
            {cart.length === 0 && <div className="text-gray-400 py-5">Cart is empty.</div>}
            {cart.map(item => (
              <div key={item.dish.id + item.restaurant.id} className="flex gap-3 items-center mb-2">
                <img className="w-10 h-10 rounded object-cover" src={item.dish.image} />
                <div>
                  <div className="font-semibold">{item.dish.name}</div>
                  <div className="text-xs text-gray-400">{item.restaurant.name}</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-sm text-gray-600 font-bold">x{item.qty}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item)}><span className="text-xl text-red-600">–</span></Button>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <>
                <div className="text-right font-semibold mt-3 mb-2">Total: <span className="text-green-700">₹{total}</span></div>
                <Button onClick={() => setScreen("form")} className="w-full">Checkout</Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Form */}
      {screen === "form" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <form
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
            onSubmit={e => { e.preventDefault(); handleOrder(); }}
          >
            <button onClick={() => setScreen("cart")} className="absolute top-2 right-3 text-gray-500 hover:text-red-600">✕</button>
            <h2 className="text-lg font-bold mb-4">Delivery Address</h2>
            <Input
              placeholder="Enter address"
              required
              value={selectedAddress}
              onChange={e => setSelectedAddress(e.target.value)}
              className="mb-3"
            />
            <div className="mb-2 text-sm">Payment: <span className="font-semibold text-green-700">Online</span></div>
            <div className="mb-3 text-right text-gray-700 font-bold">Total: ₹{total}</div>
            <Button type="submit" className="w-full">Place Order</Button>
          </form>
        </div>
      )}

      {/* Order Success */}
      {screen === "success" && orderSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-7 flex flex-col items-center gap-3">
            <div className="text-green-600 text-4xl">✅</div>
            <div className="text-lg font-bold mb-2">Order Placed!</div>
            <div className="text-base text-gray-600 mb-1">Your food is on the way.</div>
            <div className="w-full mt-2">
              <Button className="w-full" onClick={() => setScreen("listing")}>Back to Search</Button>
            </div>
          </div>
        </div>
      )}

      {/* Past Orders */}
      {screen === "past" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button onClick={() => setScreen("listing")} className="absolute top-2 right-3 text-gray-500 hover:text-red-600">✕</button>
            <h2 className="text-lg font-bold mb-3">Past Orders</h2>
            {pastOrders.length === 0 && <div className="text-gray-400 py-5">No past orders found.</div>}
            {pastOrders.map((ord, idx) => (
              <div key={idx} className="mb-3 border-b pb-2">
                <div className="font-semibold mb-1">Order #{pastOrders.length - idx}</div>
                {ord.map(ci => (
                  <div key={ci.dish.id + ci.restaurant.id} className="flex gap-2 items-center text-sm mb-1">
                    <img src={ci.dish.image} className="w-7 h-7 rounded" />
                    <span>{ci.dish.name}</span>
                    <span className="text-gray-400">x{ci.qty}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => { setCart(ci ? [ci] : []); setScreen("cart") }}>Re-order</Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating SOS */}
      <FabSOS />

    </div>
  );
};

export default FindFood;
