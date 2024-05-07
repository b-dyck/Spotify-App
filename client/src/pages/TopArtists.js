import { useState, useEffect } from 'react';
import { getCurrentUserTopArtists } from '../spotify';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons } from '../components';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const { data } = await getCurrentUserTopArtists(10, `${activeRange}_term`);
            setTopArtists(data);
        } catch(e) {
            console.error(e);
        }
    };

    fetchData();
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists.items && (
          <ArtistsGrid artists={topArtists.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtists;