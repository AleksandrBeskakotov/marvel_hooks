import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelServise from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [data, setData] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false); 
    

    const {loading, error, getAllComics} = useMarvelServise();

    useEffect(() => {
        onRequest(offset, newItemLoading);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onCharLoaded);
    }

    const onCharLoaded = (newData) => {
        let ended = false;
        if (newData.length < 8) {
            ended = true;
        } 
            setData(data => [...data, ...newData]);
            setNewItemLoading(false);
            setOffset(offset => offset + 8);
            setCharEnded(ended);
    }


    const comics = (arr) => {
        const comics = arr.map((comic, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (comic.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
        return (
            <li className="comics__item"
                key={comic.id}>
                    <Link to={`../comics/${comic.id}`}>
                        <img src={comic.thumbnail} alt={comic.title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{comic.title}</div>
                        <div className="comics__item-price">{comic.price}</div>
                    </Link>
                </li>
                )
            })
        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        )
    }

    const list = comics(data);
    const errorMessage = error && <ErrorMessage/>;
    const spinner = loading  && <Spinner/>;

    return (
        <div className="comics__list">
            {list}
            {errorMessage}
            {spinner}
            <button className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? "none" : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;