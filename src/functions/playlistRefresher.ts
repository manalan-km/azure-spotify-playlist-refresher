import { app, InvocationContext, Timer } from '@azure/functions';
import { PlaylistRefresher } from '../utils/PlaylistRefresh';
import { Logger } from '../utils/Logger';
export async function playlistRefresher(
  myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  const logger = Logger.initialiseLogger(context);

  if (myTimer.isPastDue) {
    logger.error('Function executed way too late bro');
  } else {
    const playlistRefresher = new PlaylistRefresher(process.env.REFRESH_TOKEN!);

    logger.info('Refresh start!');
    await playlistRefresher.refreshPlaylist();
  }
}

app.timer('playlistRefresher', {
  schedule: '0 */1 * * * *',
  handler: playlistRefresher,
});
