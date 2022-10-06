import React, { PropsWithChildren } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import theme from './theme';
import AppToolbar from '../toolbar';
import { IVideo } from 'types';

const useStyles = makeStyles((newTheme: Theme) =>
  createStyles({
    main: {
      backgroundColor: newTheme.palette?.background.default,
    },
  })
);

interface IProps {
  metadata: IVideo[];
  episodesSelected: IVideo[];
  setEpisodesSelected: React.Dispatch<React.SetStateAction<IVideo[]>>;
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({
  metadata,
  episodesSelected,
  setEpisodesSelected,
  children,
}) => {
  const classes = useStyles(theme);

  return (
    <>
      <noscript>
        <style>
          {`body { all: unset; } #main { display: none!important; }`}
        </style>
        <h1>
          Please enable JavaScript, or go to our{' '}
          <a href="/legacy/01">Legacy browser page</a>.
        </h1>
      </noscript>

      <div id="main" className={classes.main}>
        <AppToolbar
          metadata={metadata}
          episodesSelected={episodesSelected}
          setEpisodesSelected={setEpisodesSelected}
        />
        <main
          id="main"
          className="container pb-5 text-white"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
