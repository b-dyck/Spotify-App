import { useState, useEffect } from "react";
import { getCurrentUserTopTracks } from "../spotify";
import { SectionWrapper, TrackList, TimeRangeButtons } from "../components";

const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getCurrentUserTopTracks(10, `${activeRange}_term`);
                setTopTracks(data);
            } catch(e) {
                console.error(e);
            }
        }
        fetchData();
    }, [activeRange]);

    return (
        <main>
            <SectionWrapper title="Top Tracks" breadcrumb={true} >
                <TimeRangeButtons 
                activeRange={activeRange}
                setActiveRange={setActiveRange}
                />

                {topTracks && topTracks.items && (
                    <TrackList tracks={topTracks.items} />
                )}
            </SectionWrapper>
        </main>
    );
};

export default TopTracks;