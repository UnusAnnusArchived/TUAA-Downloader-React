import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { download } from '../../../endpoints';
import type { IThumbnail, IVideo } from '../../../types';

type OmittedProps = 'src' | 'onError';

interface IProps extends Omit<JSX.IntrinsicElements['img'], OmittedProps> {
  video: IVideo;
  selected: boolean;
}

const ThumbnailImage: React.FC<IProps> = (props) => {
  const { video, selected } = props;

  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    let thumbnails = [
      video.thumbnails.avif,
      video.thumbnails.webp,
      video.thumbnails.jpg,
    ];

    thumbnails.sort((a, b) => {
      if (a && b) {
        if (a.size < b.size) {
          return -1;
        } else if (a.size > b.size) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 1;
      }
    });

    setSrc(`${download}${thumbnails[0].src}`);
  });

  const handleCheckboxClick: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
