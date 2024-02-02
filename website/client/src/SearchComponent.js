import React, { useState, useEffect } from 'react';

let debounceTimer;

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

    // useEffect(() => {
    //     const currentDate = new Date().toISOString().split('T')[0];
    //     setFromDate(currentDate);
    //     setToDate(currentDate);
    // }, []);

    return (
        <div className='search-component'>
            <form className='search-form'>
                <div className='searchInput'>
                    <input className="inputText" type="text" required value={query} onChange={(e) => {
                    // <input className="inputText" type="text" value={query} onChange={(e) => {
                        clearTimeout(debounceTimer);
                        setQuery(e.target.value);
                        debounceTimer = setTimeout(() => {
                            onSearch(e.target.value, fromDate, toDate);
                        }, 100);
                        // console.log(e.target.value);
                    }} />
                    <span className="floatingLabel">Suche</span>
                    <div className="searchIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="33" viewBox="0 0 30 33" fill="none">
                            <path d="M8.80662 28.7579C9.39969 27.9505 9.75 26.9536 9.75 25.875C9.75 23.1826 7.56739 21 4.875 21C2.18261 21 0 23.1826 0 25.875C0 28.5674 2.18261 30.75 4.875 30.75C5.95394 30.75 6.95101 30.3995 7.75856 29.8061C7.78068 29.8361 7.80467 29.8653 7.83182 29.8925L10.7197 32.7803C11.0126 33.0732 11.4874 33.0732 11.7803 32.7803C12.0732 32.4874 12.0732 32.0126 11.7803 31.7197L8.89248 28.8318C8.86533 28.8047 8.83661 28.78 8.80662 28.7579ZM8.7035 25.875C8.7035 28.1532 7.15317 29.7207 4.875 29.7207C2.59683 29.7207 1 28.1532 1 25.875C1 23.5968 2.59683 22 4.875 22C7.15317 22 8.7035 23.5968 8.7035 25.875Z" fill="#1E1E1E"/>
                        </svg>
                    </div>
                </div>

                {/* <div className='date-wrapper'> */}

                    {/* <input className="from-date" type="date" 
                        min={new Date(Date.now()).toISOString().split('T')[0]}  
                        max={toDate ? toDate : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                        value={fromDate} 
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            onSearch(query, e.target.value, toDate);
                            // console.log(e.target.value);
                        }} /> */}

                    {/* <input className="to-date" type="date" value={toDate} onChange={(e) => {
                        setToDate(e.target.value);
                        onSearch(query, fromDate, e.target.value);
                        console.log(e.target.value);
                    }} /> */}

                    {/* <input className="to-date" type="date" 
                        min={fromDate ? fromDate : new Date(Date.now()).toISOString().split('T')[0]}
                        max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        value={toDate} 
                        onChange={(e) => {
                            setToDate(e.target.value);
                            onSearch(query, fromDate, e.target.value);
                            // console.log(e.target.value);
                        }} /> */}

                {/* </div> */}
            </form>
        </div>
    );
};        

export default SearchComponent;