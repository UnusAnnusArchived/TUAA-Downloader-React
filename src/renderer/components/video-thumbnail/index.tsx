import { Paper, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { IVideo } from 'types';
import ThumbnailImage from '../thumbnail-image';

interface IProps {
  video: IVideo;
  selected: boolean;
  episodesSelected: IVideo[];
  setEpisodesSelected: React.Dispatch<React.SetStateAction<IVideo[]>>;
}

const VideoThumbnail: React.FC<IProps> = ({
  video,
  selected,
  episodesSelected,
  setEpisodesSelected,
}) => {
  const date = new Date(video.date);

  const select = () => {
    let exists = false;
    let existsIndex = 0;

    for (let i = 0; i < episodesSelected.length; i++) {
      if (
        video.season === episodesSelected[i].season &&
        video.episode === episodesSelected[i].episode
      ) {
        exists = true;
        existsIndex = i;
        break;
      }
    }

    if (exists === true) {
      const alreadySelected: IVideo[] = JSON.parse(
        JSON.stringify(episodesSelected)
      );

      alreadySelected.splice(existsIndex, 1);

      setEpisodesSelected(alreadySelected);
    } else {
      const alreadySelected: IVideo[] = JSON.parse(
        JSON.stringify(episodesSelected)
      ); // clone

      alreadySelected.push(video);

      setEpisodesSelected(alreadySelected);
    }
  };

  return (
    <a onClick={select}>
      <Paper className="p-2 h-100">
        <div className="ratio ratio-16x9">
          <ThumbnailImage video={video} selected={selected} />
        </div>
        <div className="text-center mt-2">
          <Typography variant="body1">{video.title}</Typography>
        </div>
        <div className="text-center mt-2">
          <Typography variant="body2">
            Season {video.season.toString()} Episode {video.episode.toString()}{' '}
            - {moment.utc(date).format('DD. MMM YYYY')}
          </Typography>
          <Typography variant="body2">
            s{video.season.toString().padStart(2, '0')}.e
            {video.episode.toString().padStart(3, '0')}
          </Typography>
        </div>
      </Paper>
    </a>
  );
};

export default VideoThumbnail;
