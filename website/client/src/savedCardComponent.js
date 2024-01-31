import React from 'react';

const CardComponent = ({ foodInfo, newPrice, oldPrice, discountFactor, pricePerUnit, image, category, store, dates, rowid }) => {
// const CardComponent = (x) => {
    console.log({foodInfo});
    return (
        <div className='savedCardText'>{foodInfo}</div>
        // <div className="card">
        //     <div className="card-header">
        //         <div className="card-store">{store}</div>
        //     </div>
            
        //     <div className="foodImageWrapper">
        //         <img className="foodImage" src={image} alt={foodInfo} />
        //     </div>
        //     <div className="card-info">
        //         <div className='foodName'>{foodInfo}</div>
        //         <div className='category'>{category}</div>
        //         {/* <div className='store'>Store: {store}</div> */}
        //         {/* <p>Dates: {dates}</p> */}
        //         <div className="price-info">
        //             <div className="old-price">{oldPrice}</div>
        //             <div className="current-price">
        //                 <div className="discount-factor">{discountFactor}</div>
        //                 <div className="new-price">{newPrice}</div>
        //                 <div className="price-per-unit">{pricePerUnit}</div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='availability'>
        //         {
        //             // split dates by ; and use the first and last date to display from when to when the food is available
        //             dates.split(';').length > 1 ? 
        //                 <div className='date'>{new Date(dates.split(';')[0]).toLocaleDateString('de-DE', { month: 'long', day: '2-digit', weekday: 'short' })} - {new Date(dates.split(';')[dates.split(';').length - 1]).toLocaleDateString('de-DE', { month: 'long', day: '2-digit', weekday: 'short' })}</div>
        //                 :
        //                 <div className='date'>{new Date(dates.split(';')[0]).toLocaleDateString('de-DE', { month: 'long', day: '2-digit', weekday: 'short' })}</div>
        //         }
        //     </div>
        // </div>
    );
};

export default CardComponent;
