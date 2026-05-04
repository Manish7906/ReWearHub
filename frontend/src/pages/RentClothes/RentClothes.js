import React, { useState, useMemo } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { mockProducts } from '../../utils/mockData';
import './RentClothes.css';

const CATEGORIES = ['Ethnic', 'Formal', 'Semi-formal', 'Casual'];
const OCCASIONS  = ['Wedding', 'Festival', 'Party', 'Casual', 'Office'];
const SIZES      = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENDERS    = ['Men', 'Women'];
const PRICE_RANGES = [
  { label: 'Under ₹200/day', value: 'low' },
  { label: '₹200–₹500/day', value: 'mid' },
  { label: 'Above ₹500/day', value: 'high' },
];

const RentClothes = () => {
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({ category:[], occasion:[], size:[], gender:[], price:'' });
  const [sort, setSort]       = useState('newest');
  const [showFilters, setShowFilters] = useState(true);

  const toggle = (type, val) =>
    setFilters(f => ({
      ...f,
      [type]: f[type].includes(val) ? f[type].filter(v=>v!==val) : [...f[type], val],
    }));

  const filtered = useMemo(() => {
    let res = [...mockProducts];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.color?.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q) ||
        p.occasion?.toLowerCase().includes(q)
      );
    }
    if (filters.category.length) res = res.filter(p => filters.category.some(c => p.category?.toLowerCase() === c.toLowerCase()));
    if (filters.occasion.length) res = res.filter(p => filters.occasion.some(o => p.occasion?.toLowerCase() === o.toLowerCase()));
    if (filters.size.length)     res = res.filter(p => filters.size.some(s => p.size?.includes(s)));
    if (filters.gender.length)   res = res.filter(p => filters.gender.some(g => p.gender?.toLowerCase() === g.toLowerCase()));
    if (filters.price === 'low') res = res.filter(p => p.pricePerDay < 200);
    if (filters.price === 'mid') res = res.filter(p => p.pricePerDay >= 200 && p.pricePerDay <= 500);
    if (filters.price === 'high')res = res.filter(p => p.pricePerDay > 500);
    if (sort === 'price-low')    res.sort((a,b) => a.pricePerDay - b.pricePerDay);
    if (sort === 'price-high')   res.sort((a,b) => b.pricePerDay - a.pricePerDay);
    if (sort === 'rating')       res.sort((a,b) => b.rating - a.rating);
    if (sort === 'popular')      res.sort((a,b) => (b.totalRentals||0) - (a.totalRentals||0));
    return res;
  }, [search, filters, sort]);

  const activeCount = filters.category.length + filters.occasion.length +
    filters.size.length + filters.gender.length + (filters.price?1:0);

  const clearAll = () => {
    setFilters({ category:[], occasion:[], size:[], gender:[], price:'' });
    setSearch('');
  };

  return (
    <div className="rent-page">

      {/* Hero Strip */}
      <div className="rent-hero">
        <div className="container">
          <h1>👗 Rent Clothes</h1>
          <p>50+ premium outfits · ₹149/day onwards · Free delivery</p>
        </div>
      </div>

      {/* Search + Sort Bar */}
      <div className="rent-topbar">
        <div className="container rent-topbar__inner">
          <div className="rent-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by name, brand, fabric, color, occasion..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="rent-search__clear" onClick={()=>setSearch('')}>✕</button>}
          </div>
          <div className="rent-controls">
            <button className={`rent-filter-btn ${showFilters?'active':''}`} onClick={()=>setShowFilters(f=>!f)}>
              ⚙️ Filters {activeCount>0 && <span className="filter-count">{activeCount}</span>}
            </button>
            <select className="rent-sort" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container rent-layout">

        {/* ── Filter Sidebar ── */}
        {showFilters && (
          <aside className="filter-sidebar">
            <div className="filter-sidebar__header">
              <strong>Filters</strong>
              {activeCount>0 && (
                <button className="filter-clear" onClick={clearAll}>Clear All ({activeCount})</button>
              )}
            </div>

            {/* Gender */}
            <div className="filter-group">
              <h4 className="filter-group__title">Gender</h4>
              <div className="filter-chips">
                {GENDERS.map(g=>(
                  <button key={g} className={`filter-chip ${filters.gender.includes(g)?'active':''}`}
                    onClick={()=>toggle('gender',g)}>
                    {g==='Men'?'👔':'👗'} {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="filter-group">
              <h4 className="filter-group__title">Category</h4>
              <div className="filter-chips">
                {CATEGORIES.map(c=>(
                  <button key={c} className={`filter-chip ${filters.category.includes(c)?'active':''}`}
                    onClick={()=>toggle('category',c)}>{c}</button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="filter-group">
              <h4 className="filter-group__title">Occasion</h4>
              <div className="filter-chips">
                {OCCASIONS.map(o=>(
                  <button key={o} className={`filter-chip ${filters.occasion.includes(o)?'active':''}`}
                    onClick={()=>toggle('occasion',o)}>{o}</button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="filter-group">
              <h4 className="filter-group__title">Price Range</h4>
              {PRICE_RANGES.map(opt=>(
                <label key={opt.value} className="filter-radio">
                  <input type="radio" name="price" checked={filters.price===opt.value}
                    onChange={()=>setFilters(f=>({...f, price: f.price===opt.value?'':opt.value}))} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Size */}
            <div className="filter-group">
              <h4 className="filter-group__title">Size</h4>
              <div className="filter-chips">
                {SIZES.map(s=>(
                  <button key={s} className={`filter-chip ${filters.size.includes(s)?'active':''}`}
                    onClick={()=>toggle('size',s)}>{s}</button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ── Products ── */}
        <main className="rent-products">
          {/* Results bar */}
          <div className="rent-results-bar">
            <span><strong>{filtered.length}</strong> outfits found</span>
            {activeCount>0 && (
              <div className="active-filters">
                {filters.gender.map(g=>(
                  <span key={g} className="active-filter">{g} <button onClick={()=>toggle('gender',g)}>✕</button></span>
                ))}
                {filters.category.map(c=>(
                  <span key={c} className="active-filter">{c} <button onClick={()=>toggle('category',c)}>✕</button></span>
                ))}
                {filters.occasion.map(o=>(
                  <span key={o} className="active-filter">{o} <button onClick={()=>toggle('occasion',o)}>✕</button></span>
                ))}
                {filters.size.map(s=>(
                  <span key={s} className="active-filter">Size {s} <button onClick={()=>toggle('size',s)}>✕</button></span>
                ))}
                {filters.price && (
                  <span className="active-filter">
                    {PRICE_RANGES.find(p=>p.value===filters.price)?.label}
                    <button onClick={()=>setFilters(f=>({...f,price:''}))}>✕</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {filtered.length>0 ? (
            <div className="product-grid">
              {filtered.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          ) : (
            <div className="rent-empty">
              <div style={{fontSize:'4rem'}}>👗</div>
              <h3>No outfits found</h3>
              <p>Try a different search term or adjust your filters</p>
              <button className="btn btn-primary" onClick={clearAll}>Clear All Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RentClothes;
