import React, { useState, useEffect, useRef } from 'react';
import useMarvelServise from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [data, setData] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(300);
    const [charEnded, setCharEnded] = useState(false); 

    const {loading, error, getAllCharacters} = useMarvelServise();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded);
    }

    const onCharLoaded = (newData) => {
        let ended = false;
        if (newData.length < 9) {
            ended = true;
        }
        setData(data => [...data, ...newData]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }
  
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const characters = (arr) => {
        const characters = arr.map((char, i) => {
        return (
            <li className="char__item"
                key = {char.id}
                ref={el => itemRefs.current[i] = el}
                onClick={() => {
                    props.onCharSelected(char.id);
                    focusOnItem(i);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(char.id);
                        focusOnItem(i);
                    }
                }}>
                <img src={char.thumbnail} alt="abyss"/>
                <div className="char__name">{char.name}</div>
            </li>
                )
            })
        return (
            <ul className="char__grid">
                {characters}
            </ul>
        )
    }

    const list = characters(data);
    const errorMessage = error && <ErrorMessage/>;
    const spinner = loading && !newItemLoading && <Spinner/>;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {list}
            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? "none" : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
    


export default CharList;