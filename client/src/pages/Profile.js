import { useState, useEffect } from "react";
import { getCurrentUserProfile , getCurrentUserPlaylists, getCurrentUserTopArtists } from "../spotify";
import { StyledHeader } from "../styles";
import { SectionWrapper, ArtistsGrid } from '../components';


const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [topArtists, setTopArtists] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const userProfile = await getCurrentUserProfile();
              setProfile(userProfile.data);
              const userPlaylists = await getCurrentUserPlaylists();
              setPlaylists(userPlaylists.data);
              const userArtists = await getCurrentUserTopArtists();
              setTopArtists(userArtists.data);
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

                {topArtists && (
                    <main>
                        <SectionWrapper title="Top Artists This Month" seeAllLink="/top-artists">
                            <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                        </SectionWrapper>
                    </main>
                )}
            </>
            )}
        </>
    )
};

export default Profile;