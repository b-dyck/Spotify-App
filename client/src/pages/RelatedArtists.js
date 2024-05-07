import { useState, useEffect } from "react";
import { getCurrentUserTopArtists , getRelatedArtists, getArtist } from "../spotify";
import { StyledHeader } from "../styles";
import { SectionWrapper, ArtistsGrid } from '../components';
import { chooseTwoArtists } from "../utils";


const RelatedArtists = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [startingArtists, setStartingArtists] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
              const userArtists = await getCurrentUserTopArtists();
              setTopArtists(userArtists.data);
            } catch(e) {
              console.error(e);
            }
          };
      
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
            const {data} = await getRelatedArtists(currentArtist.id); // Assumes you have an ID field
            console.log("Related Artists: ", data);
            setRelatedArtists(data);
          };
      
          fetchRelatedArtists();
        }
    }, [currentArtist]); 

    const handleArtistSelection = (artistId) => {
        console.log(artistId);
        const fetchArtist = async () => {
            const { data } = await getArtist(artistId);
            console.log(data);
            setCurrentArtist(data);
        }
        fetchArtist();
        
    };

    

    return (
    <>
    <SectionWrapper title="Six Degrees of Spotify" breadcrumb={true} >
      {currentArtist && (
        <StyledHeader>
          <div className="header__inner">
            <img className="header__img" src={currentArtist.images[0].url} alt={currentArtist.name} />
            <div>
              <h1 className="header__name">{currentArtist.name}</h1>
              <p className="header__meta">
                Navigate from: {startingArtists[0]?.name} to {startingArtists[1]?.name}
              </p>
            </div>
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