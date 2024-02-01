// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import SearchComponent from './SearchComponent';
import CardComponent from './cardComponent';
import SavedCardComponent from './savedCardComponent';

function App() {
    const [results, setResults] = useState([]);
    const [deleted, setDeleted] = useState([]);
    const [added, setAdded] = useState([]);

    const searchFood = (query, fromDate, toDate) => {
        fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}&fromdate=${encodeURIComponent(fromDate)}&todate=${encodeURIComponent(toDate)}`, {
          cache: 'no-store', // Bypass the cache
        })
        .then(response => {
            // console.log('Full response:', response);

            // Access the raw response body (if needed)
            return response.text();
        })
        .then(rawBody => {
            // Handle the raw response body
            // console.log('Raw response body:', rawBody);

            // Now attempt to parse the response body as JSON
            const data = JSON.parse(rawBody);

            // Handle the parsed JSON data
            // console.log('Search results:', data);
            setResults(data);
            saveCard();
        })
        .catch(error => console.error('Error:', error));
    };

    const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

    const handleEvent = () => {
        console.log('event');
    }
    
    deleteCard();

    // const onDelete = () => {
    //     saveCard();
    //     deleteCard();
    // }
    
    return (
        
        <div className='main-div'>
            <div className='sidebar'>
                <div className='searchWrapper'>
                    <SearchComponent onSearch={searchFood} />
                </div>
                {/* <div className='savedCards'> */}
                <div className='savedCardsItems'>
                    <div className='savedCardHeader'>Gemerkte Artikel</div>
                    <div className='savedCardWrapper'>
                        {savedCards.map((savedCard, index) => (
                            // <div className='savedCardText'>Saved Cards</div>
                            <SavedCardComponent key={index} {...savedCard} onDelete={() => {
                                setDeleted(deleted.concat(savedCard.foodInfo));
                                console.log('deleted');
                            }} onClick={handleEvent}/>
                        ))}
                    </div>
                </div>
                {/* </div> */}
            </div>
            <div className='searchResults'>
                <div className="card_wrapper">
                    {results.map((result, index) => (
                        <CardComponent key={index} {...result} onAdd={() => {
                            setAdded(added.concat(result.foodInfo));
                            console.log('added');
                        }} onEvent={handleEvent}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

// make function which gets all card divs and makes a event listener for each one to listen for click. If one is clicked then it should save all the info of the card in the local storage. Then make a new page which shows all the saved cards.
function saveCard() {

    // create savedCards array in local storage if it doesn't exist
    if(!localStorage.getItem('savedCards')) {
        localStorage.setItem('savedCards', JSON.stringify([]));
    }

    // get all card divs
    const cardDivs = document.querySelectorAll('.card');
    // console.log(cardDivs);
    // add event listener for each card div
    cardDivs.forEach((cardDiv) => {
        cardDiv.addEventListener('click', () => {
          cardDiv.classList.add('flash-green');
            // save card info in local storage
            const cardInfo = {
                foodInfo: cardDiv.querySelector('.foodName').textContent,
                newPrice: cardDiv.querySelector('.new-price').textContent,
                oldPrice: cardDiv.querySelector('.old-price').textContent,
                discountFactor: cardDiv.querySelector('.discount-factor').textContent,
                pricePerUnit: cardDiv.querySelector('.price-per-unit').textContent,
                image: cardDiv.querySelector('.foodImage').src,
                category: cardDiv.querySelector('.category').textContent,
                store: cardDiv.querySelector('.card-store').textContent,
                dates: cardDiv.querySelector('.date').textContent
            };
            // console.log(cardInfo);
            // push card info to savedCards array in local storage
            if(!localStorage.getItem('savedCards')) {
              localStorage.setItem('savedCards', JSON.stringify([]));
            }

            const savedCards = JSON.parse(localStorage.getItem('savedCards'));
            savedCards.push(cardInfo);
            localStorage.setItem('savedCards', JSON.stringify(savedCards));

            setTimeout(() => {
              cardDiv.classList.remove('flash-green');
            }, 700);
        });
    });
}

function deleteCard() {
  const savedCardDivs = document.querySelectorAll('.cardSaved');
  console.log(savedCardDivs);
  savedCardDivs.forEach((savedCardDiv) => {
    const deleteButton = savedCardDiv.querySelector('.cardSavedOverlayRemove');
    deleteButton.addEventListener('click', () => {
        // delete the entry in the local storage where the foodName is the same as the string in the cardSavedOverlayText div
        const savedCards = JSON.parse(localStorage.getItem('savedCards'));
        const foodName = savedCardDiv.querySelector('.cardSavedOverlayText').textContent;
        console.log({foodName});
        console.log({savedCards});
        const newSavedCards = savedCards.filter((savedCard) => savedCard.foodInfo != foodName);
        console.log({newSavedCards});
        localStorage.setItem('savedCards', JSON.stringify(newSavedCards));
    });
  });
}

export default App;
