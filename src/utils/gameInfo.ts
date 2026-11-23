import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

export type GameInfo = {
  title: string;
  version: string;
};

export const DEFAULT_GAME_INFO: GameInfo = {
  title: 'The Lost Realm',
  version: '1.0.0',
};

function parseGameInfo(content: string): GameInfo {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim());

  const [title, version, ...extraLines] = lines;

  if (
    !title ||
    !version ||
    extraLines.some((line) => line.length > 0) ||
    title.length > 80 ||
    !/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(version)
  ) {
    throw new Error('Invalid game information format');
  }

  return { title, version };
}

export async function loadGameInfo(): Promise<GameInfo> {
  try {
    const asset = Asset.fromModule(
      require('../../assets/data/game-info.txt')
    );

    await asset.downloadAsync();

    const uri = asset.localUri ?? asset.uri;

    const content = await FileSystem.readAsStringAsync(uri);

    return parseGameInfo(content);
  } catch (error) {
    console.warn(
      'Game information unavailable. Using defaults.',
      error
    );

    try {
      const fallbackAsset = Asset.fromModule(
        require('../../assets/data/default-game-info.txt')
      );

      await fallbackAsset.downloadAsync();

      const fallbackUri =
        fallbackAsset.localUri ?? fallbackAsset.uri;

      const fallbackContent =
        await FileSystem.readAsStringAsync(fallbackUri);

      return parseGameInfo(fallbackContent);
    } catch (fallbackError) {
      console.warn(
        'Fallback file unavailable:',
        fallbackError
      );

      return DEFAULT_GAME_INFO;
    }
  }
}
