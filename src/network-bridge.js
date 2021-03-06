import {
  reject
} from './helpers/array-helpers';

/*
* The network bridge is a way for the mock websocket object to 'communicate' with
* all avalible servers. This is a singleton object so it is important that you
* clean up urlMap whenever you are finished.
*/
class NetworkBridge {
  constructor() {
    this.urlMap = {};
  }

  /*
  * Attaches a websocket object to the urlMap hash so that it can find the server
  * it is connected to and the server in turn can find it.
  *
  * @param {object} websocket - websocket object to add to the urlMap hash
  * @param {string} url
  */
  attachWebSocket(websocket, url) {
    var connectionLookup = this.urlMap[url];

    if (connectionLookup &&
        connectionLookup.server &&
        connectionLookup.websockets.indexOf(websocket) === -1) {

      connectionLookup.websockets.push(websocket);
      return connectionLookup.server;
    }
  }

  /*
  * Attaches a websocket to a room
  */
  addMembershipToRoom(websocket, room) {
    var connectionLookup = this.urlMap[websocket.url];

    if (connectionLookup &&
        connectionLookup.server &&
        connectionLookup.websockets.indexOf(websocket) !== -1) {

      if (connectionLookup.roomMemberships[room] == null) {
        connectionLookup.roomMemberships[room] = [];
      }

      connectionLookup.roomMemberships[room].push(websocket);
    }
  }

  /*
  * Attaches a server object to the urlMap hash so that it can find a websockets
  * which are connected to it and so that websockets can in turn can find it.
  *
  * @param {object} server - server object to add to the urlMap hash
  * @param {string} url
  */
  attachServer(server, url) {
    var connectionLookup = this.urlMap[url];

    if (!connectionLookup) {

      this.urlMap[url] = {
        server,
        websockets: [],
        roomMemberships: {},
      };

      return server;
    }
  }

  /*
  * Finds the server which is 'running' on the given url.
  *
  * @param {string} url - the url to use to find which server is running on it
  */
  serverLookup(url) {
    var connectionLookup = this.urlMap[url];

    if (connectionLookup) {
      return connectionLookup.server;
    }
  }

  /*
  * Finds all websockets which is 'listening' on the given url.
  *
  * @param {string} url - the url to use to find all websockets which are associated with it
  * @param {string} room - if a room is provided, will only return sockets in this room
  */
  websocketsLookup(url, room) {
    var connectionLookup = this.urlMap[url];

    if (!connectionLookup) {
      return [];
    }

    if (room) {
      var members = connectionLookup.roomMemberships[room];
      return members ? members : [];
    } else {
      return connectionLookup.websockets;
    }
  }

  /*
  * Removes the entry associated with the url.
  *
  * @param {string} url
  */
  removeServer(url) {
    delete this.urlMap[url];
  }

  /*
  * Removes the individual websocket from the map of associated websockets.
  *
  * @param {object} websocket - websocket object to remove from the url map
  * @param {string} url
  */
  removeWebSocket(websocket, url) {
    var connectionLookup = this.urlMap[url];

    if (connectionLookup) {
      connectionLookup.websockets = reject(connectionLookup.websockets, socket => socket === websocket);
    }
  }

  /*
  * Removes a websocket from a room
  */
  removeMembershipFromRoom(websocket, room) {
    var connectionLookup = this.urlMap[websocket.url];
    var memberships = connectionLookup.roomMemberships[room];

    if (connectionLookup && memberships != null) {
      connectionLookup.roomMemberships[room] = reject(memberships, socket => {
        return socket === websocket;
      });
    }
  }
}

export default new NetworkBridge(); // Note: this is a singleton
