import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoList = () => {
    const [coins, setCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 250, // Fetch more to allow filtering for top 3
                        page: 1,
                        sparkline: false
                    }
                });
                setCoins(response.data); // Get all fetched cryptocurrencies
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch cryptocurrency data.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchCoins();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCoinClick = (coinName) => {
        alert(`You clicked on ${coinName}!`);
        // In a real application, you would navigate to a detail page here
        // For example: history.push(`/crypto/${coinId}`);
    };

const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
);

    if (loading) {
        return <div>Loading cryptocurrencies...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="crypto-list-container">
            <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="global-search-input"
            />
            <div className="crypto-cards-wrapper">
                {searchTerm ? (
                    filteredCoins.length > 0 ? (
                        filteredCoins.map(coin => (
                            <div key={coin.id} className="crypto-card" onClick={() => handleCoinClick(coin.name)}>
                                <img src={coin.image} alt={coin.name} className="crypto-icon" />
                                <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>
                                <p>Current Price: ${coin.current_price.toLocaleString()}</p>
                                <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No cryptocurrencies found matching your search.</p>
                    )
                ) : (
                    <p>Please enter a search term to find cryptocurrencies.</p>
                )}
            </div>
        </div>
    );
};

export default CryptoList;