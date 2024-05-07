import { useState, useEffect } from "react";
import { getCurrentUserProfile , getCurrentUserPlaylists, getCurrentUserTopArtists , getCurrentUserTopTracks } from "../spotify";
import { StyledHeader } from "../styles";
import { SectionWrapper, ArtistsGrid, TrackList, PlaylistGrid } from '../components';


const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
              const userProfile = await getCurrentUserProfile();
              setProfile(userProfile.data);
              const userPlaylists = await getCurrentUserPlaylists();
              setPlaylists(userPlaylists.data);
              const userArtists = await getCurrentUserTopArtists();
              setTopArtists(userArtists.data);
              const userTracks = await getCurrentUserTopTracks();
              setTopTracks(userTracks.data);
            } catch(e) {
              console.error(e);
            }
          };
      
        fetchData();
    }, []);

    return (
        <>
            {profile && (
            <>
                <StyledHeader type="user">
                    <div className="header__inner">
                        {profile.images.length && profile.images[0].url && (
                        <img className="header__img" src={profile.images[0].url} alt="Avatar"/>
                        )}
                        <div>
                            <div className="header__overline">Profile</div>
                            <h1 className="header__name">{profile.display_name}</h1>
                            <p className="header__meta">
                                {profile && (
                                <span>
                                    {profile.followers.total} Follower{profile.followers.total !==1 ? 's' :''}
                                </span>
                                )}
                                {playlists && (
                                <span>
                                    {playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}
                                </span>
                                )}
                            </p>
                        </div>
                    </div>
                </StyledHeader>

                {topArtists && topTracks && playlists && (
                    <main>
                        <SectionWrapper title="Related Artists Game - Click Here" seeAllLink={"/related-artists-game"}>
                        </SectionWrapper>
                        <SectionWrapper title="Top Artists This Month" seeAllLink="/top-artists">
                            <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                        </SectionWrapper>
                        <SectionWrapper title="Top Tracks This Month" seeAllLink="/top-tracks">
                            <TrackList tracks={topTracks.items.slice(0, 10)} />
                        </SectionWrapper>
                        <SectionWrapper title="Public Playlists" seeAllLink="/playlists">
                            <PlaylistGrid playlists={playlists.items.slice(0, 5)} />
                        </SectionWrapper>
                    </main>
                )}

                

                
            </>
            )}
        </>
    )
};

export default Profile;