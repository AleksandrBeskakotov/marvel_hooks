import { useHttp } from '../hooks/http.hook';
import question from '../resources/img/question.png'

const useMarvelServise = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=eed59b29c3f2963eeeaa694b54bf377e";
    const _baseOffset = 300;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        const strPath = character.thumbnail.path;
        const nameImg = strPath.substr(strPath.lastIndexOf('/')+1);
        if (nameImg === 'image_not_available') {
            character.thumbnail.path = null ;
        }
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: character.thumbnail.path ?  `${character.thumbnail.path}.${character.thumbnail.extension}` : question,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        console.log(res);
        return res.data.results.map(_transformComics);
 
    }

    const _transformComics = (comics) => {
        console.log(comics.prices[0].price);
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'No information about the number of pages',
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'Not Available',
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            language: comics.textObjects.language || 'en-us'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
}

export default useMarvelServise;