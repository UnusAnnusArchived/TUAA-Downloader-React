import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { cdn } from 'renderer/endpoints';
import { IVideo } from 'types';

interface IProps {
  video: IVideo;
  selected: boolean;
}

const ThumbnailImage: React.FC<IProps> = ({ video, selected }) => {
  const [src, setSrc] = useState(
    `${cdn}/thumbnails/${video.season.toString().padStart(2, '0')}.avif.svg`
  );

  const handleCheckboxClick: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition:
          video.season === 0
            ? `calc(7.6922% * ${video.episode - 1})`
            : `calc(0.2724681% * ${video.episode - 1}) 0`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      }}
    >
      <Checkbox checked={selected} onClick={handleCheckboxClick} />
    </div>
  );
};

export default ThumbnailImage;
