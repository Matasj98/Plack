export const setChannel = (channel, isPrivate = false) => ({
  type: "SET_CHANNEL",
  channel,
  isPrivate
});
