import { Logger } from './Logger';

export class PlaylistRefresher {
  private refreshToken: string = '';
  private accessToken: string = '';
  private clientID: string = '';
  private clientSecret: string = '';
  private playlistURI: string = '';
  private logger = Logger.getLoggerInstance();

  constructor(firstRefreshToken: string) {
    this.refreshToken = firstRefreshToken;
    this.accessToken = '';
    this.clientID = process.env.CLIENT_ID!;
    this.clientSecret = process.env.CLIENT_SECRET!;
    this.playlistURI = process.env.PLAYLIST_URI!;
  }

  async setNewAccessToken() {
    this.logger.info('Setting new Access Token using Refresh Token');
    const url = 'https://accounts.spotify.com/api/token';

    const headers = {
      contentType: 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${this.clientID}:${this.clientSecret}`),
    };

    const requestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: requestBody,
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();

        this.accessToken = data.access_token;

        this.logger.info('New access token set!');
      } else {
        throw new Error(
          `Failed fetching top 10 songs : ${response.status} : ${JSON.stringify(response)} `,
        );
      }
    } catch (err) {
      this.logger.error(`Failed to set new access Token: ${err}`);
    }
  }

  uriCSVgenerator(URIs: string[]): string {
    return URIs.join(',');
  }

  async getTopTenSongsURIs(accessToken: string) {
    const songURIs: string[] = [];

    this.logger.info("Retrieving Top Ten Songs' URIs");

    const url =
      'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10';

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(url, {
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        const items = data.items;

        items.forEach((song: { uri: string }) => songURIs.push(song.uri));

        this.logger.info('Retrieval Success!');
      } else {
        throw new Error(
          `Failed fetching top 10 songs : ${response.status} : ${JSON.stringify(response)} `,
        );
      }
    } catch (err) {
      this.logger.error(`Error fetching top 10 songs: ${err}`);
    }

    return songURIs;
  }

  async updatePlaylistDescription() {
    const description = `This is my top 10 frequently listened songs for the past week. Updated on ${new Date()}`;
    const accessToken = this.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const body = {
      description: description,
      public: false,
    };

    const url = 'https://api.spotify.com/v1/playlists/' + this.playlistURI;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        this.logger.info('Updated Playlist Description!');
      } else {
        throw new Error(
          `Failed updating description : ${response.status} : ${response.statusText} `,
        );
      }
    } catch (err) {
      this.logger.error(`Failed to update playlist description ${err}`);
    }
  }

  async refreshPlaylist() {
    await this.setNewAccessToken();

    const accessToken = this.accessToken;

    const topSongsURIs: string[] = await this.getTopTenSongsURIs(accessToken);
    const uriStrings: string = this.uriCSVgenerator(topSongsURIs);

    const url =
      `https://api.spotify.com/v1/playlists/${this.playlistURI}/tracks?uris=` +
      encodeURIComponent(uriStrings);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    this.logger.info('Refreshing Playlist!');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
      });

      if (response.ok) {
        this.updatePlaylistDescription();
      } else {
        throw new Error(
          `Failed updating your playlist : ${response.status} : ${response.statusText} `,
        );
      }
    } catch (err) {
      this.logger.error(`Failed to update playlist ${err}`);
    }
  }
}
