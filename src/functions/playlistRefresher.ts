import { app, InvocationContext, Timer } from '@azure/functions';
import { PlaylistRefresher } from '../utils/PlaylistRefresh';
export async function playlistRefresher(
  myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  // context.log('Timer function processed request.');
  if (myTimer.isPastDue) {
    context.log('Function executed way too late bro');
  } else {
    const playlistRefresher = new PlaylistRefresher(process.env.REFRESH_TOKEN!);

    context.log('Refresh start!');
    playlistRefresher.refreshPlaylist();
  }
}

app.timer('playlistRefresher', {
  schedule: '0 */1 * * * *',
  handler: playlistRefresher,
});
