import React, { createContext, useState } from "react";
import Proptype from 'prop-types';
import YouTube from 'react-youtube';
import Modal from 'react-modal';
const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
const MovieContext = createContext();

const MovieProvider = ({children}) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [trailerKey, setTrailerkey] = useState("");

    const handleTrailer = async (id) => {
        setTrailerkey('')
        try{
            const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
                }
              };

              const movieKey = await fetch(url, options);
              const data = await movieKey.json();
              setTrailerkey(data.results[0].key)
              setModalIsOpen(true)
        }catch (error){
            setModalIsOpen(false)
            console.log(error)

        }
    }
    return(
        <MovieContext.Provider value={{ handleTrailer }}>
            {children}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    overlay: {
                        position: "fixed",
                        zIndex: 9999,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                    },
                }}
                contentLabel="Example Modal"
                >
                    <YouTube videoId={trailerKey} opts={opts} />;
                </Modal>
        </MovieContext.Provider>

    )
}
MovieProvider.propTypes = {
    children: Proptype.node,
}
export {MovieProvider, MovieContext}