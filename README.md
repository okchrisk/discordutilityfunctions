# Discord Utility Functions
A collection of utility functions using <a href=https://discord.js.org/#/>Discord.js</a> for your discord server.
The discord developer portal can be found <a href="https://discord.com/developers/">here</a> along with the bot token for config.json

Functions include
<ul>
  <li>getVoiceChannels: grab all the voice channel IDs from the discord server</li>
  <li>getConnectedUsers: grab all the users currently connected in a voice channel</li>
  <li>rename: allows users to change their nickname in the discord server</li>
  <li>deleteMessage: allows users to delete messages</li>
  <li>channelSendPictures: sends a random picture saved in the image directory to the discord server. This is scalable to any directory size and allows customizable command naming (with the petNames.json file) For example, "-dog" will post a random picture from the dog directory</li>
  </ul>
