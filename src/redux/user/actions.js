export const updateUser = user => ({
  type: 'USER_UPDATE_USER',
  data: user,
});

export const updateFavouriteGames = favouriteGames => ({
  type: 'USER_UPDATE_FAVOURITE_GAMES',
  data: favouriteGames,
});

export const updateRecentGames = recentGames => ({
  type: 'USER_UPDATE_RECENT_GAMES',
  data: recentGames,
});
