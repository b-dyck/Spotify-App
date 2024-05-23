import { useState, useEffect } from "react";
import { getCurrentUserTopArtists , getRelatedArtists, getArtist } from "../spotify";
import { StyledHeader } from "../styles";
import { SectionWrapper, ArtistsGrid, ScorePanel } from '../components';
import { chooseTwoArtists } from "../utils";


const RelatedArtists = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [startingArtists, setStartingArtists] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [score, setScore] = useState(0);


    const fetchTopArtists = async () => {
      try {
        const userArtists = await getCurrentUserTopArtists(25);
        setTopArtists(userArtists.data);
        setScore(0);
      } catch(e) {
        console.error(e);
      }
    };

    useEffect(() => {      
        fetchTopArtists();
    }, []);

    useEffect(() => {
        if (topArtists && topArtists.items && topArtists.items.length > 1) {
            const selectedArtists = chooseTwoArtists(topArtists);
            console.log("Selected starting artists:", selectedArtists);
            setStartingArtists(selectedArtists);
            setCurrentArtist(selectedArtists[0]);
        }
    }, [topArtists]);
    

    useEffect(() => {
        if (currentArtist) {
          const fetchRelatedArtists = async () => {
            const {data} = await getRelatedArtists(currentArtist.id); 
            console.log("Related Artists: ", data);
            setRelatedArtists(data);
          };
      
          fetchRelatedArtists();
        }
    }, [currentArtist]); 

    const handleArtistSelection = (artistId) => {
        console.log(artistId);
        if (artistId === startingArtists[1].id) {
            alert(`Correct! You won with a score of ${score + 1}`);
            setScore(0);
            restartGame();
            return;
        }
        const fetchArtist = async () => {
            const { data } = await getArtist(artistId);
            console.log(data);
            setCurrentArtist(data);
        }
        fetchArtist();
        setScore(score + 1);
        
    };

    const restartGame = () => {
      if (topArtists && topArtists.items && topArtists.items.length > 1) {
            const selectedArtists = chooseTwoArtists(topArtists);
            console.log("Selected starting artists:", selectedArtists);
            setStartingArtists(selectedArtists);
            setCurrentArtist(selectedArtists[0]);
        }
      setScore(0);
    }

    return (
    <>
    <SectionWrapper title="Six Degrees of Spotify" breadcrumb={true} >
      
      {currentArtist && (
        <StyledHeader>
          <div className="header__inner" >
            <img className="header__img" src={currentArtist.images[0].url} alt={currentArtist.name} />
            <div className="header__content">
              <h1 className="header__name">{currentArtist.name}</h1>
              <p className="header__meta">
                Navigate from: {startingArtists[0]?.name} to {startingArtists[1]?.name}
              </p>
            </div>
            <ScorePanel score={score} restartGame={restartGame} />
          </div>
        </StyledHeader>
      )}

      {relatedArtists && relatedArtists.artists.length > 0 && (
        <SectionWrapper title="Select Related Artist" seeAllLink="#">
          <ArtistsGrid artists={relatedArtists.artists} onSelect={handleArtistSelection} />
        </SectionWrapper>
      )}

      {!relatedArtists && currentArtist && (
        <p className="empty-notice">No related artists available for {currentArtist.name}</p>
      )}
      </SectionWrapper>
    </>
    );
};


export default RelatedArtists;