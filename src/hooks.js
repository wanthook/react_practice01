import { useEffect, useState, useRef } from "react";
import axios from "axios";

export const useSearch = (query) => {

    const [state, setState] = useState({
        articles: [],
        status: 'IDLE',
        error: ''
    });

    const cancelToken = useRef(null);

    useEffect(() => {


        if(cancelToken.current){
            cancelToken.current.cancel()
        }

        cancelToken.current = axios.CancelToken.source();

    axios.get(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${query}`, {
        cancelToken: cancelToken.current.token
    })
      .then(function (response) {
        
        const parseReponse = [];
        
        for(let i=0 ; i<response.data[1].length; i++){
          parseReponse.push({
            id: response.data[3][i].toString(),
            label: response.data[1][i].toString()
          })
        }
        // debugger
        setState({
            articles: parseReponse,
            status: 'SUCCESS',
            error: ''
        });
        // debugger
      })
      .catch(function (error) {
        // handle error
        
        if(axios.isCancel(error)){
            return
        }
        setState({
            articles: [],
            status: 'ERROR',
            error: error
        })

        

      })
      },[query]);

      return state;
}