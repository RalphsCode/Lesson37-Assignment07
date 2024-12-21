import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';

function DrawACard() {

    const InitialState = {val: "", suit: "", img: "https://deckofcardsapi.com/static/img/back.png"};

    const [currentCard, setCurrentCard] = useState(InitialState);
    const [deckId, setDeckId] = useState("");
    const [deckTrigger, setDeckTrigger] = useState(false);
    const [remaining, setRemaining] = useState(52);

    // Function to get a new shuffled deck of cards
    useEffect(function initGame() {
        /** Should run once, when this Component mounts,
         * and when deckTrigger changes - which occurs when
         * Reset Game button is clicked.
         * */ 
        async function getDeck() {
            const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            setDeckId(res.data.deck_id);
            }
        getDeck();
        console.log("New Deck Retrieved");
}, [deckTrigger]);   // deckTrigger is a dependancy

    // Function to draw a card
    async function drawCard() {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const cardData = res.data.cards[0];
        // save the new card in the state
        setCurrentCard({val: cardData.value, suit: cardData.suit, img: cardData.image});
        setRemaining(res.data.remaining)
    };

    // Function to reset game
    function reset() {
        setCurrentCard(InitialState);
        setRemaining(52);
        setDeckTrigger(!deckTrigger);
        console.log("Game Reset with a new deck.");
    };

    // Function to shuffle the existing deck
    async function shuffleDeck() {
    const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?deck_count=1`);
    setCurrentCard(InitialState);
    setRemaining(52);
    console.log("Current deck reshuffled.");
    }

    return (
        <div>
        <h1>Drawing a Card</h1>
        <p><button onClick={shuffleDeck}>Shuffle Deck</button> </p>
        {remaining !== 0 ? (
        <p><button onClick={drawCard}>Draw a card</button></p>) : (
            <p>No cards remaining!</p>
        ) }

        <img src={currentCard.img} />
        {currentCard.val !== "" ? (
            <h3>{currentCard.val} of {currentCard.suit} </h3> 
        ) : (<p>Click 'Draw a card' button above to start</p>)
            }
        
        <p>Remaining: {remaining}  / {52 - remaining}  : Drawn</p>
        <p><button onClick={reset}>Reset Game</button></p>
        </div>
) }

export default DrawACard;