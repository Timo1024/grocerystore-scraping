import React, { useState, useEffect } from 'react';

const SearchComponent = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // const handleSearch = () => {
    //     onSearch(query);
    // };

    // return (
    //     <div className='search-component'>

            

    //         <input type="text" value={query} onChange={(e) => {
    //             setQuery(e.target.value);
    //             onSearch(e.target.value);
    //             console.log(e.target.value);
    //         }} />

    //         <input type="date" placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
    //         <input type="date" placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            
    //         <button onClick={handleSearch}>Search</button>
            
    //         {/* <button onClick={handleSearch}>Search</button> */}
    //     </div>
    // );

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setFromDate(currentDate);
        setToDate(currentDate);
    }, []);

    return (
        <div className='search-component'>
            <form className='search-form'>
                <input type="text" placeholder='Suche Artikel' value={query} onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value, fromDate, toDate);
                    // console.log(e.target.value);
                }} />

                <div className='date-wrapper'>

                    <input className="from-date" type="date" 
                        min={new Date(Date.now()).toISOString().split('T')[0]}  
                        max={toDate ? toDate : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                        value={fromDate} 
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            onSearch(query, e.target.value, toDate);
                            // console.log(e.target.value);
                        }} />

                    {/* <input className="to-date" type="date" value={toDate} onChange={(e) => {
                        setToDate(e.target.value);
                        onSearch(query, fromDate, e.target.value);
                        console.log(e.target.value);
                    }} /> */}

                    <input className="to-date" type="date" 
                        min={fromDate ? fromDate : new Date(Date.now()).toISOString().split('T')[0]}
                        max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        value={toDate} 
                        onChange={(e) => {
                            setToDate(e.target.value);
                            onSearch(query, fromDate, e.target.value);
                            // console.log(e.target.value);
                        }} />

                </div>
            </form>
        </div>
    );
};        

export default SearchComponent;