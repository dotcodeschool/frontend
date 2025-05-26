/**
 *
 * @param ide - The IDE to use.
 * @param platform - The platform where the gitorial is hosted.
 * @param creator - The creator of the gitorial.
 * @param repo - The repository of the gitorial.
 * @param commitHash - The commit hash of the gitorial.
 * @returns
 *
 * Example:
 * "cursor://AndrzejSulkowski.gitorial/sync?platform=github&creator=shawntabrizi&repo=rust-state-machine&commitHash=b74e58d9b3165a2e18f11f0fead411a754386c75"
 */
export function createSyncUri(
  ide: string,
  platform: string,
  creator: string,
  repo: string,
  commitHash: string,
): string {
  return `${ide}://AndrzejSulkowski.gitorial/sync?platform=${platform}&creator=${creator}&repo=${repo}&commitHash=${commitHash}`;
}
