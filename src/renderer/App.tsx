import { useEffect, useState } from 'react';
import Layout from './components/layout';
import { api } from './endpoints';
import './styles/globals.scss';
import type { IVideo } from 'types';
import VideoThumbnail from './components/video-thumbnail';

export default function App() {
  const [metadata, setMetadata] = useState<IVideo[]>([]);
  const [episodesSelected, setEpisodesSelected] = useState<IVideo[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${api}/v2/metadata/all`).then((res) =>
        res.json()
      );

      let episodes = [];

      for (let i = 0; i < res[0].length; i++) {
        episodes.push(res[0][i]);
      }

      for (let i = 0; i < res[1].length; i++) {
        episodes.push(res[1][i]);
      }

      setMetadata(episodes);
    })();
  }, []);

  const episodeIsSelected = (episode: IVideo) => {
    let selected = false;

    for (let i = 0; i < episodesSelected.length; i++) {
      if (
        episodesSelected[i].season === episode.season &&
        episodesSelected[i].episode === episode.episode
      ) {
        selected = true;
        break;
      }
    }

    return selected;
  };

  return (
    <Layout
      metadata={metadata}
      episodesSelected={episodesSelected}
      setEpisodesSelected={setEpisodesSelected}
    >
      <div className="row">
        {metadata ? (
          metadata.map((episode, i) => {
            return (
              <div key={i} className="col-12 col-md-4 p-2">
                <div className="h-100">
                  <VideoThumbnail
                    video={episode}
                    selected={episodeIsSelected(episode)}
                    metadata={metadata}
                    episodesSelected={episodesSelected}
                    setEpisodesSelected={setEpisodesSelected}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <h1>loading</h1>
        )}
      </div>
    </Layout>
  );
}
